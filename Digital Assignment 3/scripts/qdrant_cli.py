#!/usr/bin/env python3
"""
OmniMarket Atelier (Digital Assignment 3) - Qdrant CLI Tool
Comprehensive command-line interface for Qdrant vector database operations,
collection management, connectivity verification, embedding generation, and vector search.
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.error
from typing import Optional, Dict, Any, List

# Load environment variables if python-dotenv available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

DEFAULT_QDRANT_URL = os.environ.get("QDRANT_URL", "http://localhost:6333")
DEFAULT_API_KEY = os.environ.get("QDRANT_API_KEY", "")
DEFAULT_COLLECTION = os.environ.get("QDRANT_COLLECTION", "omnimarket_products")
DEFAULT_DIM = int(os.environ.get("QDRANT_DIM", "384"))
DEFAULT_DISTANCE = os.environ.get("QDRANT_DISTANCE", "Cosine")

def get_embedder():
    """Lazy load real embedding model (BAAI/bge-small-en-v1.5, 384 dims)"""
    try:
        from fastembed import TextEmbedding
        return TextEmbedding("BAAI/bge-small-en-v1.5")
    except Exception as e:
        print(f"[ERROR] Could not load FastEmbed model: {e}", file=sys.stderr)
        sys.exit(1)

def http_request(url: str, method: str = "GET", data: Optional[Dict[str, Any]] = None, api_key: str = "") -> Dict[str, Any]:
    """Perform HTTP request against Qdrant REST API"""
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["api-key"] = api_key

    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode("utf-8")
            return json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return json.loads(err_body)
        except Exception:
            return {"status": "error", "code": e.code, "message": err_body}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def cmd_ping(args):
    """Test connectivity to Qdrant cluster"""
    url = f"{args.url.rstrip('/')}/healthz"
    print(f"Connecting to Qdrant endpoint: {args.url} ...")
    res = http_request(url, api_key=args.api_key)
    if res.get("status") == "error":
        # Try /readyz or root
        res_ready = http_request(f"{args.url.rstrip('/')}/readyz", api_key=args.api_key)
        if res_ready.get("status") == "error":
            print(f"[FAIL] Could not connect to Qdrant at {args.url}")
            print(f"Details: {res.get('message', 'No response')}")
            sys.exit(1)
        else:
            print(f"[OK] Qdrant instance is READY at {args.url}")
    else:
        print(f"[OK] Qdrant cluster is HEALTHY and reachable at {args.url}")
        print(json.dumps(res, indent=2))

def cmd_collections_list(args):
    """List all collections in Qdrant"""
    url = f"{args.url.rstrip('/')}/collections"
    res = http_request(url, api_key=args.api_key)
    if "result" in res:
        collections = res["result"].get("collections", [])
        print(f"Found {len(collections)} collection(s):")
        for c in collections:
            print(f" - Name: {c.get('name')}")
    else:
        print(f"[ERROR] Failed to list collections: {json.dumps(res, indent=2)}")

def cmd_collections_info(args):
    """Get metadata for a specific collection"""
    url = f"{args.url.rstrip('/')}/collections/{args.collection}"
    res = http_request(url, api_key=args.api_key)
    if "result" in res:
        info = res["result"]
        print(f"Collection: {args.collection}")
        print(f"Status: {info.get('status')}")
        print(f"Points count: {info.get('points_count', 0)}")
        print(f"Vectors count: {info.get('vectors_count', 0)}")
        config = info.get("config", {}).get("params", {}).get("vectors", {})
        print(f"Vectors config: {json.dumps(config, indent=2)}")
    else:
        print(f"[ERROR] Collection '{args.collection}' not found or unreachable: {json.dumps(res)}")

def cmd_collections_create(args):
    """Create a new collection idempotently with specified vector dimensions and distance metric"""
    url = f"{args.url.rstrip('/')}/collections/{args.collection}"
    payload = {
        "vectors": {
            "size": args.dim,
            "distance": args.distance
        }
    }
    print(f"Creating collection '{args.collection}' (dim={args.dim}, distance={args.distance})...")
    res = http_request(url, method="PUT", data=payload, api_key=args.api_key)
    if res.get("result") is True or res.get("status") == "ok":
        print(f"[OK] Collection '{args.collection}' created successfully.")
    else:
        print(f"Response: {json.dumps(res, indent=2)}")

def cmd_collections_delete(args):
    """Delete a collection"""
    url = f"{args.url.rstrip('/')}/collections/{args.collection}"
    print(f"Deleting collection '{args.collection}'...")
    res = http_request(url, method="DELETE", api_key=args.api_key)
    print(json.dumps(res, indent=2))

def cmd_points_search(args):
    """Search nearest vector points using natural language semantic query"""
    print(f"Generating embedding for query: '{args.query}' ...")
    embedder = get_embedder()
    embedding = list(embedder.embed([args.query]))[0].tolist()

    url = f"{args.url.rstrip('/')}/collections/{args.collection}/points/search"
    payload = {
        "vector": embedding,
        "limit": args.limit,
        "with_payload": True
    }
    res = http_request(url, method="POST", data=payload, api_key=args.api_key)
    if "result" in res:
        hits = res["result"]
        print(f"\nTop {len(hits)} Semantic Search Result(s) for '{args.query}':")
        print("=" * 70)
        for i, hit in enumerate(hits, 1):
            score = hit.get("score", 0.0)
            pid = hit.get("id")
            payload = hit.get("payload", {})
            name = payload.get("name", "Unknown")
            price = payload.get("price", 0.0)
            store = payload.get("store_name", "Flagship")
            desc = payload.get("description", "")
            print(f"#{i} [Score: {score:.4f}] Product #{pid}: {name} - Rs. {price:,.2f} ({store})")
            if desc:
                print(f"   Description: {desc[:100]}...")
            print("-" * 70)
    else:
        print(f"[ERROR] Search failed: {json.dumps(res, indent=2)}")

def cmd_points_upsert(args):
    """Upsert a single point into collection with real embedding"""
    embedder = get_embedder()
    text_to_embed = f"{args.name} {args.desc}"
    print(f"Embedding text: '{text_to_embed}' ...")
    vector = list(embedder.embed([text_to_embed]))[0].tolist()

    payload_dict = {
        "product_id": args.id,
        "name": args.name,
        "price": args.price,
        "description": args.desc,
        "store_name": args.store
    }

    url = f"{args.url.rstrip('/')}/collections/{args.collection}/points"
    body = {
        "points": [
            {
                "id": args.id,
                "vector": vector,
                "payload": payload_dict
            }
        ]
    }
    res = http_request(url, method="PUT", data=body, api_key=args.api_key)
    print(f"Upsert result: {json.dumps(res, indent=2)}")

def cmd_points_delete(args):
    """Delete a point from collection"""
    url = f"{args.url.rstrip('/')}/collections/{args.collection}/points/delete"
    body = {"points": [args.id]}
    res = http_request(url, method="POST", data=body, api_key=args.api_key)
    print(f"Delete result: {json.dumps(res, indent=2)}")

def main():
    parser = argparse.ArgumentParser(description="OmniMarket Qdrant Vector DB CLI")
    parser.add_argument("--url", default=DEFAULT_QDRANT_URL, help=f"Qdrant endpoint URL (default: {DEFAULT_QDRANT_URL})")
    parser.add_argument("--api-key", default=DEFAULT_API_KEY, help="Qdrant API Key (if authenticated)")
    parser.add_argument("--collection", default=DEFAULT_COLLECTION, help=f"Target collection (default: {DEFAULT_COLLECTION})")

    subparsers = parser.add_subparsers(dest="command", required=True)

    # ping / test
    sub_ping = subparsers.add_parser("ping", help="Test connectivity to Qdrant cluster")
    sub_ping.set_defaults(func=cmd_ping)
    sub_test = subparsers.add_parser("test", help="Test connectivity to Qdrant cluster")
    sub_test.set_defaults(func=cmd_ping)

    # collections list
    sub_col_list = subparsers.add_parser("collections-list", help="List all collections")
    sub_col_list.set_defaults(func=cmd_collections_list)

    # collections info
    sub_col_info = subparsers.add_parser("collections-info", help="Get collection metadata")
    sub_col_info.set_defaults(func=cmd_collections_info)

    # collections create
    sub_col_create = subparsers.add_parser("collections-create", help="Create collection")
    sub_col_create.add_argument("--dim", type=int, default=DEFAULT_DIM, help=f"Vector dimensions (default: {DEFAULT_DIM})")
    sub_col_create.add_argument("--distance", default=DEFAULT_DISTANCE, help=f"Distance metric (default: {DEFAULT_DISTANCE})")
    sub_col_create.set_defaults(func=cmd_collections_create)

    # collections delete
    sub_col_del = subparsers.add_parser("collections-delete", help="Delete collection")
    sub_col_del.set_defaults(func=cmd_collections_delete)

    # search
    sub_search = subparsers.add_parser("search", help="Semantic vector search")
    sub_search.add_argument("--query", required=True, help="Natural language search query")
    sub_search.add_argument("--limit", type=int, default=5, help="Number of results")
    sub_search.set_defaults(func=cmd_points_search)

    # upsert
    sub_upsert = subparsers.add_parser("upsert", help="Upsert point with embedding")
    sub_upsert.add_argument("--id", type=int, required=True, help="Product primary key ID")
    sub_upsert.add_argument("--name", required=True, help="Product name")
    sub_upsert.add_argument("--desc", default="", help="Product description")
    sub_upsert.add_argument("--price", type=float, default=0.0, help="Product price")
    sub_upsert.add_argument("--store", default="OmniMarket Atelier", help="Store name")
    sub_upsert.set_defaults(func=cmd_points_upsert)

    # delete point
    sub_del_pt = subparsers.add_parser("delete-point", help="Delete point by ID")
    sub_del_pt.add_argument("--id", type=int, required=True, help="Product primary key ID")
    sub_del_pt.set_defaults(func=cmd_points_delete)

    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
