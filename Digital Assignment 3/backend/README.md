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
│   ├── DatabaseConfig.java              # HikariDataSource, dual-driver selector, auto-seed
│   └── WebCorsConfig.java               # Configurable CORS for Cloudflare Pages and local dev
├── controller/
│   ├── HealthController.java            # /api/health and /api/dashboard/stats
│   ├── ProductController.java           # /api/products catalog endpoints
│   ├── OrderController.java             # /api/orders transactional checkout
│   ├── AdminDatabaseController.java     # /api/admin/* (Professor Insert, Delete, Update)
│   ├── AdvancedDbController.java        # /api/advanced/* (Joins, Aggregates, ACID rollback, EXPLAIN)
│   └── SqlConsoleController.java        # /api/sql educational console runner
├── dao/
│   ├── BaseJdbcDao.java                 # Abstract JDBC helper and table dictionaries
│   ├── AdminJdbcDao.java                # Core Parameterized INSERT, DELETE, UPDATE
│   ├── ProductJdbcDao.java              # Catalog retrieval and inventory decrement
│   ├── OrderJdbcDao.java                # Multi-table ACID transaction implementation
│   └── AdvancedDbJdbcDao.java           # ACID demo, joins, aggregates, EXPLAIN plan
├── model/                               # Plain Java domain entities
├── dto/                                 # Safe request / response transfer objects
└── exception/                           # GlobalExceptionHandler and custom exceptions
```

## Supported Target Databases

1. **CockroachDB / PostgreSQL (Primary Target):** Configured via `DB_URL` (e.g. `postgresql://...`). Uses official PostgreSQL driver `org.postgresql.Driver`.
2. **SQLite (Zero-Config Offline Fallback):** When `DB_URL` is unset, automatically defaults to `jdbc:sqlite:omnimarket_da3.db`, creating tables and initial seed data seamlessly for offline evaluation.

## Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8080` | Server HTTP port |
| `DB_URL` | `jdbc:sqlite:omnimarket_da3.db` | Target database JDBC URL (CockroachDB or SQLite) |
| `DB_USER` | `""` | Database username |
| `DB_PASSWORD` | `""` | Database password |
| `CORS_ALLOWED_ORIGINS` | `*` | Allowed CORS origins (e.g. Cloudflare Pages URL) |
| `ADMIN_API_KEY` | `omni-admin-secret-da3` | Key required for administrative mutations |

## Testing & Build Commands (Windows PowerShell)

```powershell
# Set Java environment (if not in system PATH)
$env:JAVA_HOME = "C:\Users\harsh\.tools\jdk-17"
$env:Path = "C:\Users\harsh\.tools\jdk-17\bin;C:\Users\harsh\.tools\maven\bin;" + $env:Path

cd "Digital Assignment 3\backend"

# Run all unit and integration tests
mvn test

# Package executable JAR
mvn package -DskipTests

# Start Spring Boot application locally
mvn spring-boot:run
```
