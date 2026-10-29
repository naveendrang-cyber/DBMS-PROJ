# Database Schema & Seed Data (Digital Assignment 3)

This directory holds the **CockroachDB** DDL and seed data. These two files are the single source of truth:
`crdb-cli.cmd init` applies them with the CockroachDB CLI, and the Spring Boot backend packages the same
files onto its classpath and applies them on first start against an empty database.

## Directory Layout

```
database/
├── schema.sql     # 10 tables, explicit sequences, CHECK / FK constraints, secondary indexes
├── seed.sql       # Idempotent seed data (ON CONFLICT DO NOTHING): 3 stores, 36 products, sample orders
└── README.md      # This documentation
```

## Applying with the CockroachDB CLI

```powershell
cd "Digital Assignment 3"
.\crdb-cli.cmd start     # local single-node cluster: SQL on :26257, DB Console on http://localhost:8090
.\crdb-cli.cmd init      # CREATE DATABASE omnimarket + schema.sql + seed.sql
.\crdb-cli.cmd sql       # interactive SQL shell on the omnimarket database
.\crdb-cli.cmd sql -e "SELECT name, price FROM products ORDER BY price DESC LIMIT 5"
.\crdb-cli.cmd reset     # DROP and re-create from scratch
```

To target CockroachDB Cloud instead of the local node, set `CRDB_URL` to the cluster's connection string first.

## CockroachDB Design Notes

- **Sequences instead of SERIAL:** in CockroachDB `SERIAL` defaults to `unique_rowid()`, which produces large
  non-sequential 64-bit IDs. Explicit sequences keep order numbers readable (1, 2, 3 ...). CockroachDB prints a
  NOTICE that sequential keys can create write hotspots; at this catalog size that trade-off is deliberate.
- **SERIALIZABLE isolation:** CockroachDB's default. Conflicting checkouts receive SQLSTATE `40001` and are
  retried by `OrderJdbcDao`.
- **`SELECT ... FOR UPDATE`:** stock rows are locked during checkout so concurrent orders queue instead of
  over-selling.
- **`STORING` index:** `idx_products_store_id` stores `name, price, stock` so per-store catalog reads are
  served from the index alone.
