import os
import sqlite3
import time

DB_PATH = os.path.join(os.path.dirname(__file__), "omnimarket.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")

def get_db_connection():
    """Create a database connection with PRAGMA foreign_keys = ON; enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    """Initialize database tables and seed initial sample data if empty."""
    conn = get_db_connection()
    try:
        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            schema_sql = f.read()
        conn.executescript(schema_sql)
        conn.commit()

        # Check if roles table is empty
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM roles;")
        role_count = cursor.fetchone()[0]

        if role_count == 0:
            seed_initial_data(conn)
    finally:
        conn.close()

def seed_initial_data(conn):
    """Seed initial realistic e-commerce marketplace sample data."""
    cursor = conn.cursor()

    # 1. Roles
    cursor.executemany(
        "INSERT INTO roles (id, role_name) VALUES (?, ?);",
        [
            (1, "Administrator"),
            (2, "Seller"),
            (3, "Buyer")
        ]
    )

    # 2. Users
    cursor.executemany(
        """INSERT INTO users (user_id, role_id, first_name, last_name, email, password, phone, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?);""",
        [
            (1, 1, "Alice", "Vance", "admin@omnimarket.com", "adminpass123", "+91 98765 00001", "active"),
            (2, 2, "Rahul", "Sharma", "rahul.techzone@gmail.com", "sellerpass123", "+91 98765 11111", "active"),
            (3, 2, "Priya", "Patel", "priya.stylehub@gmail.com", "sellerpass456", "+91 98765 22222", "active"),
            (4, 3, "Vikram", "Singh", "vikram.singh@yahoo.com", "buyerpass123", "+91 98765 33333", "active"),
            (5, 3, "Ananya", "Roy", "ananya.roy@outlook.com", "buyerpass456", "+91 98765 44444", "active"),
            (6, 3, "Rohit", "Verma", "rohit.verma@gmail.com", "buyerpass789", "+91 98765 55555", "active")
        ]
    )

    # 3. Sellers
    cursor.executemany(
        """INSERT INTO sellers (id, user_id, store_name, description, status)
           VALUES (?, ?, ?, ?, ?);""",
        [
            (1, 2, "TechZone Electronics", "Leading supplier of premium computer peripherals and gaming accessories.", "active"),
            (2, 3, "StyleHub Apparel", "Modern clothing, footwear, and travel accessories store.", "active")
        ]
    )

    # 4. Stores
    cursor.executemany(
        """INSERT INTO stores (id, seller_id, name, rating, status, city, address)
           VALUES (?, ?, ?, ?, ?, ?, ?);""",
        [
            (1, 1, "TechZone Flagship Branch", 4.85, "active", "Bangalore", "102 MG Road, Indiranagar"),
            (2, 2, "StyleHub Fashion Studio", 4.70, "active", "Mumbai", "45 Linking Road, Bandra West"),
            (3, 1, "TechZone Express Hub", 4.60, "active", "Delhi", "12 Connaught Place, New Delhi")
        ]
    )

    # 5. Products
    cursor.executemany(
        """INSERT INTO products (id, store_id, name, price, stock, description)
           VALUES (?, ?, ?, ?, ?, ?);""",
        [
            (1, 1, "Wireless Mechanical Keyboard", 3499.00, 45, "RGB Backlit tactile mechanical keyboard with Bluetooth 5.0 and USB-C."),
            (2, 1, "UltraHD 4K Gaming Monitor", 28999.00, 12, "27-inch IPS panel with 144Hz refresh rate, HDR400, and 1ms response time."),
            (3, 1, "Noise Cancelling Headphones", 12499.00, 20, "Active Noise Cancelling over-ear headphones with 30-hour battery life."),
            (4, 2, "Slim Fit Denim Jacket", 2499.00, 60, "Classic indigo denim jacket with durable stitching and modern tailored fit."),
            (5, 2, "Leather Travel Duffle Bag", 3899.00, 18, "Handcrafted full-grain leather weekend travel duffle with shoe compartment."),
            (6, 3, "Portable Bluetooth Speaker", 1799.00, 35, "Waterproof IPX7 outdoor speaker with rich bass and 12-hour playtime.")
        ]
    )

    # 6. Orders
    cursor.executemany(
        """INSERT INTO orders (id, user_id, status, total_price)
           VALUES (?, ?, ?, ?);""",
        [
            (1, 4, "completed", 3499.00),
            (2, 5, "completed", 28999.00),
            (3, 6, "processing", 4298.00)
        ]
    )

    # 7. Ordered Items
    cursor.executemany(
        """INSERT INTO ordered_items (id, order_id, product_id, qty, price)
           VALUES (?, ?, ?, ?, ?);""",
        [
            (1, 1, 1, 1, 3499.00),
            (2, 2, 2, 1, 28999.00),
            (3, 3, 4, 1, 2499.00),
            (4, 3, 6, 1, 1799.00)
        ]
    )

    # 8. Payments
    cursor.executemany(
        """INSERT INTO payments (pay_id, order_id, amount, pay_method, pay_status)
           VALUES (?, ?, ?, ?, ?);""",
        [
            (1, 1, 3499.00, "UPI", "completed"),
            (2, 2, 28999.00, "Credit Card", "completed"),
            (3, 3, 4298.00, "NetBanking", "completed")
        ]
    )

    # 9. Withdrawals
    cursor.executemany(
        """INSERT INTO withdrawals (id, seller_id, amount, status)
           VALUES (?, ?, ?, ?);""",
        [
            (1, 1, 15000.00, "completed"),
            (2, 2, 5000.00, "pending")
        ]
    )

    # 10. Reviews
    cursor.executemany(
        """INSERT INTO reviews (id, user_id, product_id, comment)
           VALUES (?, ?, ?, ?);""",
        [
            (1, 4, 1, "Amazing mechanical tactile feedback! Great build quality and battery life."),
            (2, 5, 2, "Stunning 4K display and smooth 144Hz refresh rate. Excellent for gaming and coding."),
            (3, 6, 4, "High quality denim material and perfect fit. Highly recommended!")
        ]
    )

    conn.commit()

def execute_sql_console(query_str: str):
    """Execute raw SQL query string for the SQL Console and return structured JSON result."""
    start_time = time.perf_counter()
    raw = query_str.strip().rstrip(";")
    if not raw:
        return {"success": False, "error": "Query string cannot be empty."}

    # Block unsafe commands outside educational SQL console scope
    lower_raw = raw.lower()
    forbidden = ["attach", "detach", "load_extension", "import"]
    for f in forbidden:
        if f in lower_raw.split():
            return {"success": False, "error": f"Command '{f}' is restricted."}

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(raw)

        if cursor.description is not None:
            # Query returned rows (SELECT, PRAGMA, EXPLAIN, etc.)
            columns = [desc[0] for desc in cursor.description]
            rows_data = cursor.fetchall()
            rows = [dict(zip(columns, row)) for row in rows_data]
            conn.commit()
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return {
                "success": True,
                "columns": columns,
                "rows": rows,
                "rowCount": len(rows),
                "executionTime": elapsed_ms
            }
        else:
            # DML query (INSERT, UPDATE, DELETE, etc.)
            affected_rows = cursor.rowcount
            conn.commit()
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return {
                "success": True,
                "message": f"Query executed successfully. Affected rows: {affected_rows}",
                "affectedRows": affected_rows,
                "rowCount": affected_rows,
                "columns": ["status", "affected_rows"],
                "rows": [{"status": "SUCCESS", "affected_rows": affected_rows}],
                "executionTime": elapsed_ms
            }
    except sqlite3.Error as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()

def get_dashboard_stats():
    """Calculate dashboard metrics directly from the relational database."""
    conn = get_db_connection()
    try:
        c = conn.cursor()
        
        c.execute("SELECT COUNT(*) FROM users;")
        total_users = c.fetchone()[0]
        
        c.execute("SELECT COUNT(*) FROM sellers;")
        total_sellers = c.fetchone()[0]
        
        c.execute("SELECT COUNT(*) FROM stores;")
        total_stores = c.fetchone()[0]
        
        c.execute("SELECT COUNT(*) FROM products;")
        total_products = c.fetchone()[0]
        
        c.execute("SELECT COUNT(*) FROM orders;")
        total_orders = c.fetchone()[0]
        
        c.execute("SELECT COUNT(*) FROM payments;")
        total_payments = c.fetchone()[0]
        
        c.execute("SELECT COALESCE(SUM(amount), 0) FROM payments WHERE pay_status = 'completed';")
        total_revenue = c.fetchone()[0]
        
        c.execute("SELECT COUNT(*) FROM withdrawals WHERE status IN ('pending', 'under_review');")
        pending_withdrawals = c.fetchone()[0]
        
        c.execute("SELECT COUNT(*) FROM reviews;")
        total_reviews = c.fetchone()[0]

        return {
            "total_users": total_users,
            "total_sellers": total_sellers,
            "total_stores": total_stores,
            "total_products": total_products,
            "total_orders": total_orders,
            "total_payments": total_payments,
            "total_revenue": total_revenue,
            "pending_withdrawals": pending_withdrawals,
            "total_reviews": total_reviews
        }
    finally:
        conn.close()

def get_verification_data():
    """Perform integrity checks and fetch schema metadata for Database Verification page."""
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
        tables = [r[0] for r in c.fetchall()]

        table_stats = []
        for tbl in tables:
            c.execute(f"SELECT COUNT(*) FROM {tbl};")
            count = c.fetchone()[0]

            c.execute(f"PRAGMA table_info({tbl});")
            cols_info = c.fetchall()
            pks = [col[1] for col in cols_info if col[5] > 0]
            columns = [{"name": col[1], "type": col[2], "notnull": bool(col[3]), "pk": col[5] > 0} for col in cols_info]

            c.execute(f"PRAGMA foreign_key_list({tbl});")
            fks_info = c.fetchall()
            fks = [{"from": fk[3], "table": fk[2], "to": fk[4]} for fk in fks_info]

            table_stats.append({
                "table_name": tbl,
                "row_count": count,
                "primary_keys": pks,
                "columns": columns,
                "foreign_keys": fks
            })

        c.execute("PRAGMA foreign_key_check;")
        fk_violations = c.fetchall()

        return {
            "database": "connected",
            "db_file": "omnimarket.db",
            "foreign_keys_enabled": True,
            "integrity_status": "OK" if len(fk_violations) == 0 else f"{len(fk_violations)} violations found",
            "fk_violations_count": len(fk_violations),
            "tables": table_stats
        }
    finally:
        conn.close()
