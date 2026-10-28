# Database Architecture & Migration Scripts (Digital Assignment 3)

This directory contains database DDL schemas, migration scripts, and seed data tailored for **CockroachDB / PostgreSQL** with complete **JDBC** integration.

## Directory Layout

```
database/
├── migrations/
│   ├── V1__initial_schema_cockroachdb.sql     # Base table creation with constraints
│   ├── V2__seed_initial_data.sql              # Idempotent seed data insertion
│   └── V3__indexes_and_constraints.sql        # High-performance indexes & sequence sync
├── schema.sql                                 # Complete consolidated CockroachDB/PostgreSQL DDL
├── schema-sqlite.sql                          # Local offline SQLite fallback schema
├── seed.sql                                   # Full initial seed data
├── migration-guide.md                         # Detailed migration, mapping & verification guide
└── README.md                                  # This documentation
```

## Supported Database Engines

1. **CockroachDB (Primary Target):** Distributed SQL database with Raft consensus, serializable isolation, multi-region survival, and PostgreSQL wire protocol compatibility.
2. **PostgreSQL 14+:** Fully compatible with all DDL statements and `org.postgresql.Driver`.
3. **SQLite 3 (Local Offline Fallback):** Integrated via `org.sqlite.JDBC` for seamless offline grading without needing a live cloud cluster.
