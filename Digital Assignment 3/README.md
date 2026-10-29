# OmniMarket Atelier (Digital Assignment 3)

### Full-Stack Multi-Vendor E-Commerce Platform with Direct Java JDBC, CockroachDB / PostgreSQL, and Qdrant Vector Search Engine

> **Course:** Database Management Systems (Advanced Database Architecture)  
> **Course Assessment:** Digital Assignment 3 (DA3)  
> **Course Faculty:** Dr. Sobitha Ahila  
> **Git Feature Branch:** `Harsh2`  
> **Project Directory:** `Digital Assignment 3/`  
> **Relational Database Engine:** CockroachDB / PostgreSQL 14+ (Distributed SQL) with Zero-Config Offline SQLite Fallback  
> **Vector Database:** Qdrant Vector Search Engine (Official REST API v1, 384-dimensional dense vectors, Cosine similarity metric)  
> **Persistence Compliance Guarantee:** **100% Direct Java JDBC (`java.sql.*`)** for all Relational CRUD and ACID operations without ORM; dedicated HTTP/REST client for Qdrant Vector operations.  
> **Cloudflare Edge Storefront:** Deployed independently as `omni-atelier-da3` at `https://omni-atelier-da3.harshzz.workers.dev`.

---

## 1. Project Directory Layout

```
Digital Assignment 3/
├── frontend/                               # Redesigned Luxury E-Commerce Storefront (ThreeUI-Inspired)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js                   # Navigation, DB health pulse badge, Cart trigger, Search shortcut
│   │   │   ├── Hero.js                     # Luxury atelier branding, metrics, and interactive spotlight card
│   │   │   ├── CategoryDiscovery.js        # Curated editorial category tiles (Audio, Computing, Apparel, Leather)
│   │   │   ├── EditorialStory.js           # Brand Manifesto linking craft with JDBC persistence & ACID rigor
│   │   │   ├── ProductCatalog.js           # 36-Product catalog, multi-column switcher, sorting, Qdrant AI search
│   │   │   ├── ProductModal.js             # Luxury quick view, gallery, variants, Qdrant Nearest Neighbors
│   │   │   ├── CartDrawer.js               # Slide-out bag & ACID checkout transaction modal
│   │   │   ├── AcademicSections.js         # Unified Tabbed Suite for Course Evaluation & Professor Tools
│   │   │   ├── ProfessorDbManager.js       # Professor Interface (1. Insert, 2. Delete, 3. Update)
│   │   │   ├── AdvancedDbDemo.js           # ACID rollback proof, 5-table joins, aggregates, EXPLAIN
│   │   │   ├── SqlSandbox.js               # Educational SQL Query Console
│   │   │   └── Footer.js                   # Academic details & credits (Dr. Sobitha Ahila)
│   │   ├── services/
│   │   │   ├── api.js                      # Centralized typed REST client (Products, Orders, Admin, Qdrant)
│   │   │   └── catalogData.js              # High-res photography, secondary hover angles, variants, fallback cache
│   │   ├── styles/
│   │   │   └── main.css                    # Midnight Green Luxury design system tokens & microinteractions
│   │   └── main.js                         # Application entrypoint & state orchestrator
│   ├── public/                             # Favicons and SVG logos
│   ├── package.json                        # Frontend dependencies (Vite)
│   ├── vite.config.js                      # Dev proxy (/api -> localhost:8080) & build config
│   ├── wrangler.toml                       # Cloudflare independent deployment (omni-atelier-da3)
│   └── README.md
├── backend/                                # Java Spring Boot REST API with Direct JDBC & Qdrant REST
│   ├── pom.xml                             # Spring Boot 3.3.5, Java 17, HikariCP, PostgreSQL & SQLite drivers
│   ├── mvnw & mvnw.cmd                     # Maven Wrapper for zero-setup execution
│   ├── src/main/java/com/omnimarket/da3/
│   │   ├── OmniMarketApplication.java      # Application runner
│   │   ├── config/                         # DatabaseConfig (HikariDataSource), WebCorsConfig
│   │   ├── controller/                     # Health, Product, Order, Admin, Advanced, SqlConsole, QdrantController
│   │   ├── dao/                            # Direct JDBC DAOs (AdminJdbcDao, OrderJdbcDao, ProductJdbcDao, etc.)
│   │   ├── service/                        # QdrantVectorService, EmbeddingService
│   │   ├── model/                          # Domain entities (Product, Store, User, Order, etc.)
│   │   ├── dto/                            # DTOs (VectorSearchRequest, VectorSearchHit, MutationResponse, etc.)
│   │   └── exception/                      # GlobalExceptionHandler & custom exceptions
│   ├── src/main/resources/                 # application.properties & SQL schemas/seeds
│   ├── src/test/java/com/omnimarket/da3/   # 10 Comprehensive JUnit 5 automated test cases
│   └── README.md
├── database/                               # SQL DDL Schemas, Migrations & Seed Data
│   ├── migrations/                         # Version-controlled migrations (V1, V2, V3)
│   ├── schema.sql                          # CockroachDB / PostgreSQL distributed schema
│   ├── schema-sqlite.sql                   # Local offline fallback schema
│   ├── seed.sql                            # Idempotent seed data statements
│   ├── migration-guide.md                  # Step-by-step SQLite to CockroachDB migration & mapping
│   ├── qdrant_storage/                     # Persistent local Qdrant vector storage
│   └── README.md
├── scripts/                                # Automation, CLI & Local Daemons
│   ├── qdrant_cli.py                       # Full-featured Qdrant Command Line Interface
│   └── qdrant_server.py                    # Standalone Local Qdrant REST Engine daemon
├── docs/                                   # In-Depth Engineering Documentation
│   ├── architecture.md                     # System architecture, Mermaid diagrams, JDBC flow
│   ├── database-design.md                  # EER diagrams, 10-table schema, check constraints, indexes
│   └── deployment.md                       # Local running, Cloudflare deployment, JVM hosting
├── qdrant-cli.cmd                          # Direct Windows CLI launcher for Qdrant operations
└── README.md                               # Project documentation (this file)
```

---

## 2. Technology Stack & Architectural Compliance

| Layer | Technology | Architectural Role | Compliance Guarantee |
| :--- | :--- | :--- | :--- |
| **Relational Persistence** | **Java JDBC (`java.sql.*`)** | `Connection`, `PreparedStatement`, `ResultSet`, `SQLException` | **100% Direct JDBC.** No ORM (Hibernate / JPA) bypassing JDBC. |
| **Relational Connection Pool** | **HikariCP** (`HikariDataSource`) | High-concurrency production connection pooling | Parameterized statements and thread-safe connections. |
| **Vector Database Layer** | **Qdrant Vector Engine** | REST API v1 (`/collections`, `/points/search`, `/points`) | **No JDBC used for Vector operations.** Clean separation of concerns. |
| **Embedding Generation** | **FastEmbed (ONNX)** | `BAAI/bge-small-en-v1.5` (384 dimensions, Cosine metric) | Real dense embeddings, repeatable and idempotent indexing. |
| **Backend Framework** | **Spring Boot 3.3.5 (Java 17)** | RESTful API controllers, exception handling, CORS | Standard JVM web service. |
| **Database Engine** | **CockroachDB / PostgreSQL** | Multi-region distributed SQL, Raft consensus, MVCC | Includes automatic offline **SQLite** fallback for zero-setup local evaluation. |
| **Frontend Framework** | **Modern ES6+ / Vite** | Sub-millisecond rendering, responsive cards, microinteractions | Independent static build ready for Cloudflare. |
| **Cloudflare Hosting** | **Cloudflare Workers / Pages** | Independent edge deployment (`omni-atelier-da3`) | Preserves existing DA2 production deployment without modification. |

---

## 3. Dedicated Qdrant CLI Guide

OmniMarket provides a dedicated Windows CLI wrapper `.\qdrant-cli.cmd` inside `Digital Assignment 3/`:

```powershell
cd "Digital Assignment 3"

# 1. Test connectivity to Qdrant cluster
.\qdrant-cli.cmd ping

# 2. Inspect existing collections
.\qdrant-cli.cmd collections-list

# 3. Create or configure collection idempotently (384 dimensions, Cosine distance)
.\qdrant-cli.cmd collections-create --dim 384 --distance Cosine

# 4. Inspect collection metadata and vector configuration
.\qdrant-cli.cmd collections-info

# 5. Insert / Upsert a product vector with real embedding
.\qdrant-cli.cmd upsert --id 1 --name "Apex Pro Wireless Mechanical Keyboard" --desc "Precision mechanical switches and aluminum chassis" --price 12999 --store "TechZone Flagship"

# 6. Perform natural language semantic vector search
.\qdrant-cli.cmd search --query "tactile typing tool for software engineers" --limit 3

# 7. Delete a vector point
.\qdrant-cli.cmd delete-point --id 1
```

### CLI Options & Flags
- `--url <URL>`: Override endpoint (defaults to `$env:QDRANT_URL` or `http://localhost:6333`)
- `--api-key <KEY>`: Supply Qdrant Cloud API key for authenticated remote clusters
- `--collection <NAME>`: Target collection name (defaults to `omnimarket_products`)

---

## 4. Qdrant Real-World E-Commerce Use Cases

1. **Semantic Natural-Language Product Search (`POST /api/qdrant/search`):**
   - Shoppers can type conversational phrases (e.g. *"noise cancelling sound isolation for office work"*, *"rugged denim jacket"*), and Qdrant retrieves relevant products using dense vector similarity even with zero keyword overlap.
2. **Similar-Product Recommendations (`GET /api/qdrant/similar/{productId}`):**
   - In the Product Quick View modal, the app calculates nearest neighbor vectors in the 384-dimensional space and suggests matching products from other flagships.
3. **Real-Time Product Synchronization (`POST /api/qdrant/sync`):**
   - Automatically synchronizes all products from the SQL database via JDBC into Qdrant.
   - Live synchronization hook in `AdminDatabaseController`: when a product is inserted, updated, or deleted via the Professor Interface, its vector in Qdrant is updated immediately.
4. **Data Privacy in Vector Payloads:**
   - Vector payloads only store public catalog attributes (`product_id`, `name`, `price`, `description`, `store_name`, `city`).
   - No user PII, order histories, or payment credentials are ever stored in vector space.

---

## 5. Architectural Deep-Dive: Why We Have Chosen Qdrant Vector Database

Modern multi-vendor e-commerce platforms struggle with catalog discovery when relying solely on traditional relational keyword matching (`WHERE name LIKE '%query%'` or basic full-text search `tsvector`). While relational indexes excel at structured lookups (e.g. `price BETWEEN 2000 AND 5000` or `store_id = 2`), they fail when shoppers express intent through colloquial, conversational, or conceptual phrases.

To resolve this architectural bottleneck without compromising relational integrity, **Qdrant Vector Database** was selected as our dedicated high-dimensional search engine:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           OMNI ATELIER SEARCH ARCHITECTURE                             │
├────────────────────────────────────────┬───────────────────────────────────────────────┤
│   TRADITIONAL RELATIONAL KEYWORD (SQL) │       QDRANT SEMANTIC VECTOR SEARCH (ANN)     │
├────────────────────────────────────────┼───────────────────────────────────────────────┤
│ Query: "acoustic sound isolation"      │ Query: "acoustic sound isolation"             │
│ SQL: WHERE name LIKE '%acoustic%'      │ Vector: [0.0382, -0.1944, 0.4912, ...] (384d) │
│ Match: 0 results (Keyword mismatch)    │ Match: ID 3 (Noise Cancelling Headphones)     │
│ Result: Missed commercial conversion   │ Result: 78.4% Cosine Vector Match (Rank #1)   │
└────────────────────────────────────────┴───────────────────────────────────────────────┘
```

### 1. Native Rust Performance & HNSW Indexing
Qdrant is written from scratch in **Rust** with custom memory management, lock-free concurrency, and hardware-accelerated SIMD instructions. It employs **Hierarchical Navigable Small World (HNSW)** graphs for Approximate Nearest Neighbor (ANN) search, delivering **sub-10 millisecond query latencies** even across millions of high-dimensional vectors.

### 2. Architectural Separation of Concerns (Vectors vs. Relational State)
Rather than bolting an un-indexed extension onto a high-traffic transactional database, Qdrant isolates vector mathematics into a specialized layer:
- **SQL Relational Database (CockroachDB / SQLite):** Preserves absolute ACID consistency for inventory counts, prices, customer orders, payment settlements, and foreign keys.
- **Qdrant Vector Engine:** Handles floating-point similarity calculations and high-dimensional clustering.
- This architectural boundary prevents heavy similarity matrix calculations from consuming CPU cycles reserved for transactional database locks and writes.

### 3. 384-Dimensional Dense Vectors with Cosine Metric
Omni Atelier standardizes on the **`BAAI/bge-small-en-v1.5`** embedding model via the FastEmbed ONNX runtime. This model outputs 384-dimensional normalized dense vectors:
$$\text{Cosine Similarity} = \cos(\theta) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|_2 \|\mathbf{v}\|_2}$$
The **Cosine distance metric** is ideal for catalog discovery because it measures the *angular orientation* of intent rather than token length or word frequency, seamlessly matching conceptual synonyms (e.g. *"tactile typing tool for coding"* ➔ *"Wireless Mechanical Keyboard"*).

### 4. Payload Filtering & Strict Privacy Boundaries
Qdrant allows storing JSON payloads alongside each point. Omni Atelier exploits this for hybrid search while enforcing strict data privacy:
- **Public Attributes Stored in Vector Payload:** `product_id`, `name`, `price`, `description`, `store_name`, `city`.
- **Strictly Prohibited from Vector Space:** Zero customer PII (emails, phone numbers, passwords), zero payment credentials, and zero order histories are ever stored in Qdrant. Vector space represents public catalog semantics only.

### 5. Direct Official REST API v1 Compliance
Spring Boot communicates with Qdrant exclusively via official HTTP REST API v1 endpoints (`/collections`, `/points/search`, `/points`). No proprietary ORMs or non-compliant database drivers are introduced.

---

## 6. Persistence Architecture: The Central Role of Java JDBC in the Codebase

While vector search handles discovery, **Java JDBC (`java.sql.*`) is the core persistence backbone of Omni Atelier**, governing 100% of all relational CRUD operations, transactional guarantees, and analytical joins.

### 1. 100% Direct JDBC Compliance (Zero ORM Policy)
In strict compliance with advanced database architecture requirements:
- **No Hibernate, No JPA, No MyBatis, No Spring Data Repositories.**
- Every database interaction is executed directly through:
  - `java.sql.Connection`
  - `java.sql.PreparedStatement`
  - `java.sql.ResultSet`
  - `java.sql.SQLException`
- **Architectural Justification:** Eliminates ORM impedance mismatch, prevents hidden lazy-loading triggers, eradicates the classic N+1 query problem, and guarantees that every SQL query executed against CockroachDB or SQLite is explicit, inspectable, and optimized.

### 2. Parameterized PreparedStatements for Universal SQL Injection Immunity
Across all DAOs (`AdminJdbcDao`, `ProductJdbcDao`, `OrderJdbcDao`, `AdvancedDbJdbcDao`), raw string concatenation in SQL execution is strictly forbidden. All dynamic parameters are bound using typed JDBC setters:

```java
// Direct JDBC Parameterized PreparedStatement in ProductJdbcDao.java
String sql = """
    SELECT p.id, p.store_id, p.name, p.price, p.stock, p.description,
           s.name AS store_name, s.city
    FROM products p
    JOIN stores s ON p.store_id = s.id
    WHERE p.id = ?;
""";

try (Connection conn = dataSource.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setInt(1, id); // Strongly typed parameter binding
    try (ResultSet rs = pstmt.executeQuery()) {
        if (rs.next()) {
            return mapResultSetToProduct(rs);
        }
    }
}
```
This guarantees compile-time type safety and 100% immunity against SQL injection across all 10 normalized tables.

### 3. Explicit Multi-Table ACID Transaction Demarcation
In e-commerce checkout operations, atomicity across inventory deduction, order record creation, line-item insertion, and payment settlement is paramount. Rather than relying on declarative Spring annotations (`@Transactional`), Omni Atelier implements **programmatic JDBC transaction boundaries** directly in [`OrderJdbcDao.java`](backend/src/main/java/com/omnimarket/da3/dao/OrderJdbcDao.java):

```java
// Programmatic Multi-Table ACID Transaction Demarcation in OrderJdbcDao.java
try (Connection conn = dataSource.getConnection()) {
    // 1. Disable Auto-Commit: Begin Explicit Transaction Boundary
    conn.setAutoCommit(false);

    try {
        // 2. Atomically verify and deduct stock with concurrency checks
        for (CartItemDto item : request.getItems()) {
            boolean stockDeducted = productDao.deductStock(conn, item.getProductId(), item.getQty());
            if (!stockDeducted) {
                throw new InsufficientStockException("Insufficient stock for Product ID " + item.getProductId());
            }
        }

        // 3. Insert parent order record
        int orderId = insertOrderRecord(conn, request.getUserId(), totalPrice);

        // 4. Batch insert child ordered_items records with foreign keys
        insertOrderedItems(conn, orderId, request.getItems());

        // 5. Insert payment record (UPI / Credit Card / NetBanking)
        insertPaymentRecord(conn, orderId, totalPrice, request.getPayMethod());

        // 6. ATOMIC COMMIT: Persist all four operations simultaneously
        conn.commit();
        logger.info("JDBC Transaction successfully committed. Order #{} created.", orderId);

    } catch (Exception ex) {
        // 7. ATOMIC ROLLBACK: Revert all changes upon any failure or constraint violation
        conn.rollback();
        logger.warn("Transaction rolled back due to error: {}", ex.getMessage());
        throw new TransactionException("Order checkout transaction aborted: " + ex.getMessage(), ex);
    } finally {
        // 8. Restore connection state for pool return
        conn.setAutoCommit(true);
    }
}
```
This pattern guarantees that phantom orders or negative stock deductions can never occur.

### 4. HikariCP Production Connection Pooling
Database connections are managed by **HikariCP** (`HikariDataSource`), configured in `DatabaseConfig.java`:
- `maximumPoolSize = 10`
- `minimumIdle = 2`
- `connectionTimeout = 15,000ms`
- `idleTimeout = 30,000ms`
- Eliminates the latency of repeatedly opening physical database sockets while providing thread-safe connection distribution under high concurrency.

### 5. Distributed SQL Engine (CockroachDB) with Zero-Config Local SQLite Fallback
The JDBC layer supports transparent dialect switching based on `DB_URL`:
- When deployed to cloud environments, it connects to **CockroachDB / PostgreSQL** via `org.postgresql.Driver` utilizing Raft consensus across distributed multi-region clusters.
- When running locally or during grading, it falls back seamlessly to **SQLite** (`jdbc:sqlite:omnimarket_da3.db`) with `PRAGMA foreign_keys = ON;` providing 100% offline self-contained evaluation with zero external dependencies.

---

## 7. Automated Test Suite Results

All 10 automated unit and integration tests run cleanly with Maven (`mvn test`):

```
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.omnimarket.da3.AdminJdbcDaoTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0 -- in com.omnimarket.da3.AdminJdbcDaoTest
[INFO] Running com.omnimarket.da3.JdbcConnectionTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0 -- in com.omnimarket.da3.JdbcConnectionTest
[INFO] Running com.omnimarket.da3.OmniMarketApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0 -- in com.omnimarket.da3.OmniMarketApplicationTests
[INFO] Running com.omnimarket.da3.QdrantVectorIntegrationTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0 -- in com.omnimarket.da3.QdrantVectorIntegrationTest
[INFO] Running com.omnimarket.da3.TransactionJdbcTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0 -- in com.omnimarket.da3.TransactionJdbcTest
[INFO] 
[INFO] Results:
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 6. Cloudflare Deployment Status

- **Project Name:** `omni-atelier-da3`
- **Deployment Platform:** Cloudflare Workers / Pages Static Asset Architecture
- **Production URL:** [https://omni-atelier-da3.harshzz.workers.dev](https://omni-atelier-da3.harshzz.workers.dev) (Verified HTTP 200 OK)
- **Deployment Method:** Wrangler CLI (`npx wrangler deploy`) executed from `Digital Assignment 3/frontend`
- **Protection Guarantee:** The existing DA2 deployment (`https://omni-atelier.harshzz.workers.dev`) remains completely intact and untouched.

---

## 7. Configuration & Environment Variables Reference

| Parameter | Environment Variable | Default Value | Description |
| :--- | :--- | :--- | :--- |
| Server Port | `PORT` | `8080` | Port for Java Spring Boot backend |
| SQL JDBC Database URL | `DB_URL` | `jdbc:sqlite:omnimarket_da3.db` | CockroachDB / PostgreSQL JDBC connection URL |
| Database User | `DB_USER` | `""` | Database username |
| Database Password | `DB_PASSWORD` | `""` | Database password |
| Qdrant Cluster Endpoint | `QDRANT_URL` | `http://localhost:6333` | Qdrant Cloud or local REST endpoint |
| Qdrant API Key | `QDRANT_API_KEY` | `""` | Server-side API key for Qdrant Cloud |
| Qdrant Collection | `QDRANT_COLLECTION`| `omnimarket_products` | Target vector collection name |
| Vector Dimension | `QDRANT_DIMENSIONS`| `384` | Embedding dimension (384 for BGE-small / MiniLM) |
| Vector Metric | `QDRANT_DISTANCE` | `Cosine` | Vector distance metric |
| Embedding Provider | `EMBEDDING_PROVIDER`| `local` | `local` (FastEmbed ONNX) or `openai` |
| OpenAI API Key | `OPENAI_API_KEY` | `""` | Optional key if using OpenAI embeddings |
| Admin Security Key | `ADMIN_API_KEY` | `omni-admin-secret-da3` | Required key for Professor CRUD actions |
