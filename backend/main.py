import os
import sqlite3
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

try:
    import database
except ImportError:
    from backend import database


app = FastAPI(title="OmniMarket DBMS API", version="1.0.0")

# Enable CORS for local frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on application startup
@app.on_event("startup")
def startup_event():
    database.init_db()

# --- Pydantic Models ---
class SQLQueryRequest(BaseModel):
    query: str

# Table primary key mapping
PK_MAP = {
    "roles": "id",
    "users": "user_id",
    "sellers": "id",
    "stores": "id",
    "products": "id",
    "orders": "id",
    "ordered_items": "id",
    "payments": "pay_id",
    "withdrawals": "id",
    "reviews": "id"
}

# --- System API Endpoints ---
@app.get("/api/health")
def health_check():
    """Health check endpoint confirming backend server and database connection status."""
    try:
        conn = database.get_db_connection()
        conn.execute("SELECT 1;")
        conn.close()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

@app.post("/api/sql")
def execute_sql(payload: SQLQueryRequest):
    """Execute raw SQL query string for the educational SQL Console."""
    result = database.execute_sql_console(payload.query)
    return result

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    """Fetch live calculated dashboard stats from relational database."""
    return database.get_dashboard_stats()

@app.get("/api/verification")
def get_verification():
    """Fetch live SQLite integrity, table row counts, PKs, and FK metadata."""
    return database.get_verification_data()

# --- Generic REST CRUD Helpers ---
def fetch_all(table_name: str):
    conn = database.get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {table_name};")
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
    except sqlite3.Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

def create_one(table_name: str, data: Dict[str, Any]):
    conn = database.get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Remove primary key if null or empty string so SQLite auto-increments
        pk_col = PK_MAP.get(table_name, "id")
        if pk_col in data and (data[pk_col] is None or data[pk_col] == "" or data[pk_col] == 0):
            del data[pk_col]
            
        columns = list(data.keys())
        placeholders = [":" + col for col in columns]
        
        sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(placeholders)});"
        cursor.execute(sql, data)
        conn.commit()
        
        new_id = cursor.lastrowid
        if pk_col in data:
            new_id = data[pk_col]

        return {"success": True, "message": f"Inserted record into {table_name}", "id": new_id}
    except sqlite3.IntegrityError as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Integrity Error: {str(e)}")
    except sqlite3.Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database Error: {str(e)}")
    finally:
        conn.close()

def update_one(table_name: str, record_id: Any, data: Dict[str, Any]):
    conn = database.get_db_connection()
    try:
        pk_col = PK_MAP.get(table_name, "id")
        cursor = conn.cursor()
        
        # Exclude primary key from SET assignments
        set_cols = [f"{k} = :{k}" for k in data.keys() if k != pk_col]
        if not set_cols:
            return {"success": True, "message": "No fields to update"}
            
        data[pk_col] = record_id
        sql = f"UPDATE {table_name} SET {', '.join(set_cols)} WHERE {pk_col} = :{pk_col};"
        cursor.execute(sql, data)
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail=f"Record {record_id} not found in {table_name}")

        return {"success": True, "message": f"Updated record {record_id} in {table_name}", "affected": cursor.rowcount}
    except sqlite3.IntegrityError as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Integrity Error: {str(e)}")
    except sqlite3.Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database Error: {str(e)}")
    finally:
        conn.close()

def delete_one(table_name: str, record_id: Any):
    conn = database.get_db_connection()
    try:
        pk_col = PK_MAP.get(table_name, "id")
        cursor = conn.cursor()
        cursor.execute(f"DELETE FROM {table_name} WHERE {pk_col} = ?;", (record_id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail=f"Record {record_id} not found in {table_name}")

        return {"success": True, "message": f"Deleted record {record_id} from {table_name}"}
    except sqlite3.IntegrityError as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Cannot delete: Foreign key constraint failed. Related child records exist in another table.")
    except sqlite3.Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database Error: {str(e)}")
    finally:
        conn.close()

# --- Dynamic REST Endpoints for 10 Tables ---
TABLES = ["roles", "users", "sellers", "stores", "products", "orders", "ordered_items", "payments", "withdrawals", "reviews"]

for tbl in TABLES:
    def make_get(t=tbl):
        @app.get(f"/api/{t}", name=f"Get all {t}")
        def get_all_records():
            return fetch_all(t)
        return get_all_records

    def make_post(t=tbl):
        @app.post(f"/api/{t}", name=f"Create {t}")
        def create_record(data: Dict[str, Any]):
            return create_one(t, data)
        return create_record

    def make_put(t=tbl):
        @app.put(f"/api/{t}/{{record_id}}", name=f"Update {t}")
        def update_record(record_id: str, data: Dict[str, Any]):
            return update_one(t, record_id, data)
        return update_record

    def make_delete(t=tbl):
        @app.delete(f"/api/{t}/{{record_id}}", name=f"Delete {t}")
        def delete_record(record_id: str):
            return delete_one(t, record_id)
        return delete_record

    make_get()
    make_post()
    make_put()
    make_delete()

# --- Serve Frontend Static Site ---
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

if os.path.exists(FRONTEND_DIR):
    @app.get("/")
    def read_root():
        index_file = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "OmniMarket Backend API is running."}

    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")
