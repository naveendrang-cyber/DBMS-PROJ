# Database Migration Guide: SQLite (DA2) to CockroachDB / PostgreSQL (DA3)

This document provides the official database migration strategy, data type mapping, integrity verification, and rollback procedures for **Digital Assignment 3**.

---

## 1. Source vs. Target Database Comparison

| Dimension | Source Database (DA2) | Target Database (DA3) | Architectural Justification |
| :--- | :--- | :--- | :--- |
| **Engine** | SQLite 3 / Cloudflare D1 | CockroachDB / PostgreSQL 14+ | Distributed SQL, multi-region replication, horizontal scaling, strict serializable ACID transactions |
| **Concurrency** | Single-writer file lock | Multi-Version Concurrency Control (MVCC) with Raft consensus | Enterprise high-concurrency e-commerce workloads |
| **Protocol** | Embedded C-ABI / HTTP D1 Binding | PostgreSQL Wire Protocol (v3) over TLS | Enterprise JDBC connectivity via `org.postgresql.Driver` |
| **Primary Keys** | `INTEGER PRIMARY KEY AUTOINCREMENT` | `SERIAL PRIMARY KEY` / `BIGINT GENERATED ALWAYS AS IDENTITY` | Distributed key generation, sequence isolation |
| **Decimals** | `DECIMAL(10,2)` (stored as REAL/TEXT) | `NUMERIC(10,2)` (arbitrary-precision exact arithmetic) | Financial transaction accuracy without IEEE 754 floating point rounding drift |
| **Timestamps** | `DATETIME DEFAULT CURRENT_TIMESTAMP` | `TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP` | Timezone awareness across distributed multi-region server clusters |

---

## 2. Data Type Mapping Reference

| SQLite Data Type | CockroachDB / PostgreSQL Target | Notes |
| :--- | :--- | :--- |
| `INTEGER PRIMARY KEY AUTOINCREMENT` | `SERIAL PRIMARY KEY` or `BIGSERIAL` | Generates sequence and primary key constraint |
| `INTEGER` | `INT` or `BIGINT` | Standard 32-bit or 64-bit signed integer |
| `VARCHAR(n)` | `VARCHAR(n)` | Character string with maximum length constraint |
| `TEXT` | `TEXT` | Variable-length character string without specific limit |
| `DECIMAL(10,2)` | `NUMERIC(10,2)` | Exact monetary values |
| `DECIMAL(3,2)` | `NUMERIC(3,2)` | Store rating range: 0.00 to 5.00 |
| `DATETIME` | `TIMESTAMPTZ` | Timestamp with timezone |

---

## 3. Data Integrity & Constraint Verification

The target schema enforces both referential and domain integrity constraints:

1. **Foreign Key Constraints with Cascade Actions:**
   - `users.role_id` -> `roles.id` (`ON UPDATE CASCADE ON DELETE RESTRICT`)
   - `sellers.user_id` -> `users.user_id` (`ON UPDATE CASCADE ON DELETE CASCADE`)
   - `stores.seller_id` -> `sellers.id` (`ON UPDATE CASCADE ON DELETE CASCADE`)
   - `products.store_id` -> `stores.id` (`ON UPDATE CASCADE ON DELETE CASCADE`)
   - `orders.user_id` -> `users.user_id` (`ON UPDATE CASCADE ON DELETE CASCADE`)
   - `ordered_items.order_id` -> `orders.id` (`ON UPDATE CASCADE ON DELETE CASCADE`)
   - `ordered_items.product_id` -> `products.id` (`ON UPDATE CASCADE ON DELETE RESTRICT`)
   - `payments.order_id` -> `orders.id` (`ON UPDATE CASCADE ON DELETE CASCADE`)
   - `withdrawals.seller_id` -> `sellers.id` (`ON UPDATE CASCADE ON DELETE CASCADE`)
   - `reviews.user_id` -> `users.user_id` (`ON UPDATE CASCADE ON DELETE CASCADE`)
   - `reviews.product_id` -> `products.id` (`ON UPDATE CASCADE ON DELETE CASCADE`)

2. **Domain Check Constraints:**
   - `users.status IN ('active', 'inactive', 'suspended', 'pending')`
   - `stores.rating >= 0.0 AND stores.rating <= 5.0`
   - `products.price >= 0.0 AND products.stock >= 0`
   - `ordered_items.qty > 0 AND ordered_items.price >= 0.0`
   - `payments.amount > 0.0 AND payments.pay_method IN ('UPI', 'Credit Card', 'Debit Card', 'NetBanking', 'Wallet')`

3. **Performance Secondary Indexes:**
   - Index on `products.store_id` and `products.price` for catalog filtering.
   - Index on `orders.user_id` and `orders.status` for buyer history.
   - Index on `ordered_items.order_id` and `ordered_items.product_id` for order line lookups.

---

## 4. Migration Execution Procedure

### Step 4.1: Export Existing SQLite Data
Run the following script to dump data from the existing `backend/omnimarket.db` into SQL inserts:
```bash
sqlite3 backend/omnimarket.db .dump > database/sqlite_dump.sql
```

### Step 4.2: Apply Target Schema
Connect to CockroachDB or PostgreSQL cluster:
```bash
# CockroachDB Cloud SQL CLI
cockroach sql --url "postgresql://<user>:<password>@<host>:26257/<database>?sslmode=verify-full" -f "Digital Assignment 3/database/schema.sql"

# Standard PostgreSQL
psql -h <host> -U <user> -d <database> -f "Digital Assignment 3/database/schema.sql"
```

### Step 4.3: Populate Seed Data
```bash
cockroach sql --url "..." -f "Digital Assignment 3/database/seed.sql"
# or
psql -h <host> -U <user> -d <database> -f "Digital Assignment 3/database/seed.sql"
```

### Step 4.4: Row Count & Referential Validation
Execute the following verification query on both source and target to confirm row parity:
```sql
SELECT 'roles' AS tbl, COUNT(*) AS cnt FROM roles
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'sellers', COUNT(*) FROM sellers
UNION ALL SELECT 'stores', COUNT(*) FROM stores
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'ordered_items', COUNT(*) FROM ordered_items
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'withdrawals', COUNT(*) FROM withdrawals
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews;
```

---

## 5. Rollback & Failover Strategy

1. **Non-Destructive Principle:** The source SQLite database (`backend/omnimarket.db`) and Cloudflare D1 database are left completely intact and never modified during DA3.
2. **Zero-Downtime Rollback:** If the CockroachDB cluster is unreachable or misconfigured, the Java backend has built-in auto-detection:
   - If `DB_URL` points to a PostgreSQL / CockroachDB cluster, it connects using `org.postgresql.Driver`.
   - If unconfigured, it seamlessly connects to the local SQLite/H2 fallback via JDBC with identical tables, allowing offline grading and evaluation without network dependencies.
