# OmniMarket Backend (DA3) — Java Spring Boot & Direct JDBC

This directory contains the Java backend REST API engineered specifically for **Digital Assignment 3 (DBMS)**.

## Core Architectural Principle: Direct Java JDBC

As required by course guidelines, this service **does not use an ORM** (such as Hibernate or Spring Data JPA) for core data manipulation. All persistence is handled directly via standard Java JDBC primitives:

- `java.sql.Connection`
- `java.sql.PreparedStatement`
- `java.sql.ResultSet`
- `java.sql.SQLException`
- Explicit transaction boundaries (`conn.setAutoCommit(false)`, `conn.commit()`, `conn.rollback()`)
- HikariCP high-performance connection pool (`com.zaxxer.hikari.HikariDataSource`)

## Package Architecture

```
src/main/java/com/omnimarket/da3/
├── OmniMarketApplication.java           # Spring Boot application runner
├── config/
│   ├── DatabaseConfig.java              # HikariDataSource for CockroachDB, first-run schema + seed
│   └── WebCorsConfig.java               # Configurable CORS for Cloudflare Pages and local dev
├── controller/
│   ├── HealthController.java            # /api/health and /api/dashboard/stats
│   ├── ProductController.java           # /api/products catalog + /api/products/{id}/related
│   ├── OrderController.java             # /api/orders transactional checkout
│   ├── AdminDatabaseController.java     # /api/admin/* (Professor Insert, Delete, Update)
│   ├── AdvancedDbController.java        # /api/advanced/* (Joins, Aggregates, ACID rollback, EXPLAIN)
│   └── SqlConsoleController.java        # /api/sql educational console runner
├── dao/
│   ├── BaseJdbcDao.java                 # Abstract JDBC helper and table dictionaries
│   ├── AdminJdbcDao.java                # Core Parameterized INSERT, DELETE, UPDATE
│   ├── ProductJdbcDao.java              # Catalog retrieval and inventory decrement
│   ├── OrderJdbcDao.java                # Multi-table ACID checkout with 40001 retry
│   └── AdvancedDbJdbcDao.java           # ACID demo, joins, aggregates, EXPLAIN plan
├── model/                               # Plain Java domain entities
├── dto/                                 # Safe request / response transfer objects
└── exception/                           # GlobalExceptionHandler and custom exceptions
```

## Database: CockroachDB

The backend connects to **CockroachDB** through the official PostgreSQL JDBC driver (`org.postgresql.Driver`).

- **Local:** a single-node cluster started with `..\crdb-cli.cmd start` (the default `DB_URL`).
- **Cloud:** set `DB_URL` to the CockroachDB Cloud connection string. Both `postgresql://user:pass@host:26257/omnimarket?sslmode=verify-full` and `jdbc:postgresql://...` forms work; credentials inside the URL are extracted automatically.
- On first start against an empty database, `DatabaseConfig` creates the database and applies `database/schema.sql` and `database/seed.sql` (packaged onto the classpath under `db/`). Later starts leave data untouched.

## Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8080` | Server HTTP port |
| `DB_URL` | `jdbc:postgresql://localhost:26257/omnimarket?sslmode=disable` | CockroachDB connection URL |
| `DB_USER` | `root` | Database username |
| `DB_PASSWORD` | `""` | Database password |
| `DB_POOL_SIZE` | `10` | HikariCP maximum pool size |
| `CORS_ALLOWED_ORIGINS` | localhost:5173, `*.workers.dev`, `*.pages.dev` | Allowed CORS origin patterns |
| `ADMIN_API_KEY` | `omni-admin-secret-da3` | Required `X-Admin-Key` for Professor INSERT / UPDATE / DELETE (change it for any shared deployment) |

## Testing & Build Commands (Windows PowerShell)

```powershell
# Set Java environment (if not in system PATH)
$env:JAVA_HOME = "C:\Users\harsh\.tools\jdk-17"
$env:Path = "C:\Users\harsh\.tools\jdk-17\bin;C:\Users\harsh\.tools\maven\bin;" + $env:Path

cd "Digital Assignment 3"
.\crdb-cli.cmd start          # local CockroachDB node (once per session)
.\crdb-cli.cmd init           # create + seed the 'omnimarket' database

cd backend

# Run all tests against a separate throwaway database (tests create orders and change stock)
$env:DB_URL = "jdbc:postgresql://localhost:26257/omnimarket_test?sslmode=disable"
mvn test
Remove-Item Env:DB_URL

# Package executable JAR
mvn package -DskipTests

# Start Spring Boot application locally
mvn spring-boot:run
```
