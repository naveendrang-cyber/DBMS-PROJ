# OmniMarket Atelier (Digital Assignment 3)

### Full-Stack Multi-Vendor E-Commerce Platform with Direct Java JDBC on CockroachDB Distributed SQL

> **Course:** Database Management Systems (Advanced Database Architecture)  
> **Course Assessment:** Digital Assignment 3 (DA3)  
> **Course Faculty:** Dr. Sobitha Ahila  
> **Git Feature Branch:** `Harsh2`  
> **Project Directory:** `Digital Assignment 3/`  
> **Database Technology (Cloud-Native Distributed SQL):** CockroachDB v24.2  
> **Persistence:** 100% direct Java JDBC (`java.sql.*`) through the PostgreSQL wire-protocol driver; no ORM.  
> **Cloudflare Edge Storefront:** Deployed independently as `omni-atelier-da3` at `https://omni-atelier-da3.harshzz.workers.dev`.

---

## 1. Project Directory Layout

```
Digital Assignment 3/
├── crdb-cli.cmd                            # CockroachDB CLI wrapper (start / init / sql / reset / status / stop)
├── frontend/                               # Luxury e-commerce storefront (Vite, vanilla ES modules)
│   ├── src/
│   │   ├── components/                     # Header, Hero, Catalog, Product modal, Cart, Professor suite ...
│   │   ├── services/
│   │   │   ├── api.js                      # REST client for the Spring Boot API (+ offline demo fallback)
│   │   │   └── catalogData.js              # Photography, variants, offline catalog cache
│   │   ├── styles/main.css
│   │   └── main.js
│   ├── vite.config.js                      # Dev proxy (/api -> localhost:8080, override with API_PROXY_TARGET)
│   └── wrangler.toml                       # Cloudflare static deployment (omni-atelier-da3)
├── backend/                                # Java 17 / Spring Boot 3.3.5 REST API with direct JDBC
│   ├── pom.xml                             # HikariCP + org.postgresql driver; packages database/*.sql
│   └── src/
│       ├── main/java/com/omnimarket/da3/
│       │   ├── config/                     # DatabaseConfig (HikariCP + first-run schema/seed), CORS
│       │   ├── controller/                 # Health, Product, Order, Admin, Advanced, SqlConsole
│       │   ├── dao/                        # Direct JDBC DAOs
│       │   ├── model/ dto/ exception/
│       └── test/java/com/omnimarket/da3/   # 12 JUnit 5 tests run against CockroachDB
├── database/
│   ├── schema.sql                          # CockroachDB DDL: 10 tables, sequences, constraints, indexes
│   ├── seed.sql                            # Idempotent seed: 3 stores, 36 products, sample orders
│   └── README.md
└── docs/                                   # architecture.md, database-design.md, deployment.md
```

---

## 2. Technology Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Database** | **CockroachDB v24.2** (Cloud-Native Distributed SQL) | Vendors, stores, products, inventory, orders, payments, payouts, reviews |
| **Persistence** | **Java JDBC** (`java.sql.*`) | `Connection`, `PreparedStatement`, `ResultSet`, explicit `commit()` / `rollback()` |
| **Driver** | `org.postgresql.Driver` 42.7.4 | CockroachDB speaks the PostgreSQL v3 wire protocol |
| **Connection Pool** | HikariCP | Pooled, thread-safe connections |
| **Backend** | Spring Boot 3.3.5 (Java 17) | REST controllers, validation, error handling, CORS |
| **Frontend** | Vite + ES modules | Static build deployed to Cloudflare |
| **Hosting** | Cloudflare Workers static assets (frontend) + any JVM host (backend) + CockroachDB Cloud (database) | See section 7 |

---

## 3. Why CockroachDB for a Multi-Vendor Marketplace

A marketplace's core data (vendors, inventory, orders, payments, payouts) needs ACID transactions, foreign
keys and joins. A checkout must deduct stock, create the order, its line items and the payment **atomically**.
CockroachDB keeps full SQL semantics while adding the properties a growing multi-vendor platform needs:

1. **SERIALIZABLE isolation by default.** Two shoppers buying the last unit cannot both succeed. Conflicting
   transactions are aborted with SQLSTATE `40001`; `OrderJdbcDao` retries them automatically (up to 3 attempts).
2. **Raft-replicated ranges.** Every range is replicated (3x by default on multi-node clusters), so the store
   keeps taking orders if a node fails.
3. **Horizontal scale and multi-region.** Vendors in Bangalore, Mumbai and Delhi can be served from nearby
   replicas as the platform grows, without changing application SQL.
4. **PostgreSQL wire compatibility.** The backend uses the standard PostgreSQL JDBC driver, so every query is
   ordinary, inspectable JDBC.
5. **Managed cloud option.** CockroachDB Cloud has a free tier reachable from any backend host, which matters
   because Cloudflare cannot run a JVM (see section 7).

---

## 4. CockroachDB CLI Guide

`crdb-cli.cmd` wraps the official `cockroach` binary. It looks for `cockroach.exe` on `PATH`, then in
`%USERPROFILE%\.tools\cockroach\`, or uses `COCKROACH_BIN` if set.
Download: https://www.cockroachlabs.com/docs/releases/

```powershell
cd "Digital Assignment 3"

# 1. Start a local single-node cluster (SQL :26257, DB Console http://localhost:8090)
.\crdb-cli.cmd start

# 2. Create the 'omnimarket' database and apply database\schema.sql + database\seed.sql
.\crdb-cli.cmd init

# 3. Open an interactive SQL shell, or run one statement
.\crdb-cli.cmd sql
.\crdb-cli.cmd sql -e "SELECT s.name, count(p.id) FROM stores s JOIN products p ON p.store_id = s.id GROUP BY s.name"

# 4. Inspect the cluster
.\crdb-cli.cmd status

# 5. Drop and rebuild the database from the SQL files
.\crdb-cli.cmd reset

# 6. Shut the node down
.\crdb-cli.cmd stop
```

To run `init` / `sql` / `status` against **CockroachDB Cloud**, set the connection string first:

```powershell
$env:CRDB_URL = "postgresql://<user>:<password>@<host>:26257/defaultdb?sslmode=verify-full"
.\crdb-cli.cmd init
```

---

## 5. Running Locally

```powershell
# Terminal 1: database
cd "Digital Assignment 3"
.\crdb-cli.cmd start
.\crdb-cli.cmd init

# Terminal 2: backend (http://localhost:8080)
cd "Digital Assignment 3\backend"
mvn spring-boot:run

# Terminal 3: frontend (http://localhost:5173, /api proxied to :8080)
cd "Digital Assignment 3\frontend"
npm install
npm run dev
```

If `init` is skipped, the backend creates the database and applies the same schema and seed files on its
first start against an empty database.

---

## 6. Persistence Architecture: Direct JDBC on CockroachDB

### 6.1 Zero-ORM policy
No Hibernate, JPA, MyBatis or Spring Data repositories. Every query goes through `Connection`,
`PreparedStatement` and `ResultSet`, so each SQL statement sent to CockroachDB is explicit and inspectable.

### 6.2 Parameterized statements
All values are bound with JDBC setters. Table and column names cannot be bound as parameters, so the
Professor interface checks table names against a whitelist and column names against the table's real columns
(`DatabaseMetaData.getColumns`) before building SQL.

### 6.3 Explicit multi-table ACID checkout (`OrderJdbcDao`)

```java
public Order createOrderWithTransaction(CheckoutRequest req) {
    for (int attempt = 1; ; attempt++) {
        try {
            return runCheckoutTransaction(req);
        } catch (SQLException e) {
            // CockroachDB SERIALIZABLE conflict: safe to retry the whole transaction
            if ("40001".equals(e.getSQLState()) && attempt < MAX_TRANSACTION_ATTEMPTS) continue;
            throw new DatabaseOperationException("Checkout transaction failed: " + e.getMessage(), e);
        }
    }
}

private Order runCheckoutTransaction(CheckoutRequest req) throws SQLException {
    conn.setAutoCommit(false);                       // begin explicit transaction
    // SELECT price, stock ... ; INSERT INTO orders ... ;
    // INSERT INTO ordered_items ... ; SELECT stock ... FOR UPDATE ; UPDATE products SET stock = stock - ? ... ;
    // INSERT INTO payments ...
    conn.commit();                                   // all four tables change together
    ...
    } catch (SQLException | RuntimeException e) {
        conn.rollback();                             // any failure: nothing is persisted
        throw e;
    }
}
```

### 6.4 Read-only SQL console
The public SQL console and EXPLAIN endpoints run inside a `READ ONLY` transaction, so CockroachDB rejects any
write or DDL (including `EXPLAIN ANALYZE` of a write). Data changes go through the key-protected Professor
interface.

### 6.5 Schema design notes
Primary keys use explicit sequences instead of `SERIAL` (which in CockroachDB yields large non-sequential
`unique_rowid()` values), keeping order numbers readable. See `database/README.md` and
`docs/database-design.md`.

---

## 7. Deployment

Cloudflare Workers run JavaScript/WASM and cannot run the Java backend, so the system deploys in three parts:

| Part | Where | Notes |
| :--- | :--- | :--- |
| Frontend | Cloudflare (`omni-atelier-da3`) | `npm run build` then `npx wrangler deploy` from `frontend/` |
| Backend | Any JVM host (Render, Railway, Fly.io, a VM) | `mvn package` then `java -jar target/omnimarket-da3-backend-1.0.0.jar` |
| Database | CockroachDB Cloud | Set `DB_URL` on the backend to the Cloud connection string |

Build the frontend with the backend's public URL so the storefront calls the live API:

```powershell
$env:VITE_API_BASE_URL = "https://<your-backend-host>/api"
npm run build
```

Without `VITE_API_BASE_URL` the deployed storefront cannot reach a backend and runs on its offline demo data.
The DA2 deployment (`omni-atelier`, Cloudflare D1) is separate and unaffected.

---

## 8. Automated Tests

The 12 JUnit tests run against a real CockroachDB database. They create orders and change stock, so point
them at a throwaway database:

```powershell
cd "Digital Assignment 3\backend"
$env:DB_URL = "jdbc:postgresql://localhost:26257/omnimarket_test?sslmode=disable"
mvn test
Remove-Item Env:DB_URL
```

| Test class | Tests | Covers |
| :--- | :--- | :--- |
| `AdminJdbcDaoTest` | 5 | Parameterized INSERT / UPDATE / DELETE, unknown-column rejection, string-to-numeric coercion |
| `TransactionJdbcTest` | 5 | ACID commit and rollback demo, checkout commit, no partial order on mid-transaction failure, read-only console |
| `JdbcConnectionTest` | 1 | DataSource and connection lifecycle |
| `OmniMarketApplicationTests` | 1 | Spring context loads |

---

## 9. Configuration Reference

| Parameter | Environment Variable | Default | Description |
| :--- | :--- | :--- | :--- |
| Server port | `PORT` | `8080` | Spring Boot HTTP port |
| Database URL | `DB_URL` | `jdbc:postgresql://localhost:26257/omnimarket?sslmode=disable` | CockroachDB URL (`postgresql://user:pass@host...` also accepted) |
| Database user | `DB_USER` | `root` | Ignored when the URL contains credentials |
| Database password | `DB_PASSWORD` | `""` | |
| Pool size | `DB_POOL_SIZE` | `10` | HikariCP maximum pool size |
| CORS origins | `CORS_ALLOWED_ORIGINS` | localhost:5173, `*.workers.dev`, `*.pages.dev` | Comma-separated origin patterns |
| Admin key | `ADMIN_API_KEY` | `omni-admin-secret-da3` | Required `X-Admin-Key` for Professor INSERT / UPDATE / DELETE; change it for any shared deployment |
| Frontend API base | `VITE_API_BASE_URL` | `/api` | Set at frontend build time for the Cloudflare deployment |
| Dev proxy target | `API_PROXY_TARGET` | `http://localhost:8080` | Vite dev server only |
| CLI cluster URL | `CRDB_URL` | (local insecure node) | Used by `crdb-cli.cmd` |
