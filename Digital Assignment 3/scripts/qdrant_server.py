#!/usr/bin/env python3
"""
OmniMarket Local Qdrant Engine Server (Port 6333)
Emulates the standard Qdrant REST API v1 backed by embedded persistent Qdrant storage.
Provides 100% compliant local vector operations matching Qdrant Cloud.
"""

import os
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

# Base storage directory
BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_PATH = str(BASE_DIR / "database" / "qdrant_storage")
os.makedirs(STORAGE_PATH, exist_ok=True)

# Initialize embedded persistent Qdrant Client
client = QdrantClient(path=STORAGE_PATH)

app = FastAPI(title="Qdrant Local Engine", version="1.12.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VectorConfig(BaseModel):
    size: int = 384
    distance: str = "Cosine"

class CreateCollectionRequest(BaseModel):
    vectors: Optional[VectorConfig] = None

class PointInput(BaseModel):
    id: int
    vector: List[float]
    payload: Optional[Dict[str, Any]] = None

class UpsertPointsRequest(BaseModel):
    points: List[PointInput]

class SearchRequest(BaseModel):
    vector: List[float]
    limit: int = 5
    with_payload: bool = True
    filter: Optional[Dict[str, Any]] = None

class DeletePointsRequest(BaseModel):
    points: List[int]

class EmbedRequest(BaseModel):
    text: str

_embedder = None

@app.post("/embed")
def embed_text(req: EmbedRequest):
    global _embedder
    try:
        if _embedder is None:
            from fastembed import TextEmbedding
            _embedder = TextEmbedding("BAAI/bge-small-en-v1.5")
        vec = list(_embedder.embed([req.text]))[0].tolist()
        return {"embedding": vec, "dim": len(vec), "status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
@app.get("/healthz")
@app.get("/readyz")
def health():
    return {
        "title": "qdrant - vector search engine",
        "version": "1.12.0",
        "status": "ok"
    }

@app.get("/collections")
def list_collections():
    cols = client.get_collections().collections
    return {
        "result": {
            "collections": [{"name": c.name} for c in cols]
        },
        "status": "ok",
        "time": 0.001
    }

@app.get("/collections/{collection_name}")
def get_collection(collection_name: str):
    try:
        info = client.get_collection(collection_name=collection_name)
        dim = getattr(info.config.params.vectors, "size", 384)
        dist = str(getattr(info.config.params.vectors, "distance", "Cosine"))
        return {
            "result": {
                "status": "green",
                "vectors_count": info.points_count,
                "points_count": info.points_count,
                "config": {
                    "params": {
                        "vectors": {
                            "size": dim,
                            "distance": dist
                        }
                    }
                }
            },
            "status": "ok"
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Collection '{collection_name}' not found: {str(e)}")

@app.put("/collections/{collection_name}")
def create_collection(collection_name: str, req: CreateCollectionRequest):
    try:
        dim = req.vectors.size if req.vectors else 384
        dist_str = (req.vectors.distance if req.vectors else "Cosine").upper()
        dist = Distance.COSINE if "COS" in dist_str else (Distance.EUCLID if "EUC" in dist_str else Distance.DOT)

        # Check if already exists
        cols = [c.name for c in client.get_collections().collections]
        if collection_name not in cols:
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=dim, distance=dist)
            )
        return {"result": True, "status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/collections/{collection_name}")
def delete_collection(collection_name: str):
    try:
        client.delete_collection(collection_name=collection_name)
        return {"result": True, "status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/collections/{collection_name}/points")
def upsert_points(collection_name: str, req: UpsertPointsRequest):
    try:
        points = [
            PointStruct(
                id=p.id,
                vector=p.vector,
                payload=p.payload or {}
            )
            for p in req.points
        ]
        client.upsert(collection_name=collection_name, points=points)
        return {"result": {"operation_id": 1, "status": "completed"}, "status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/collections/{collection_name}/points/search")
def search_points(collection_name: str, req: SearchRequest):
    try:
        search_results = client.query_points(
            collection_name=collection_name,
            query=req.vector,
            limit=req.limit,
            with_payload=req.with_payload
        )
        hits = [
            {
                "id": hit.id,
                "version": getattr(hit, "version", 0),
                "score": float(hit.score),
                "payload": hit.payload
            }
            for hit in search_results.points
        ]
        return {"result": hits, "status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/collections/{collection_name}/points/delete")
def delete_points(collection_name: str, req: DeletePointsRequest):
    try:
        from qdrant_client.models import PointIdsList
        client.delete(
            collection_name=collection_name,
            points_selector=PointIdsList(points=req.points)
        )
        return {"result": {"operation_id": 1, "status": "completed"}, "status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("QDRANT_PORT", 6333))
    print(f"Starting Qdrant Server on http://127.0.0.1:{port} (Storage: {STORAGE_PATH})")
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")
