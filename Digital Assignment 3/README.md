# OmniMarket Atelier (Digital Assignment 3)

### Multi-Vendor E-Commerce Platform on CockroachDB Distributed SQL, served from Cloudflare

> **Course:** Database Management Systems (Advanced Database Architecture)  
> **Course Assessment:** Digital Assignment 3 (DA3)  
> **Course Faculty:** Dr. Sobitha Ahila  
> **Git Feature Branch:** `Harsh2`  
> **Database Technology (Cloud-Native Distributed SQL):** CockroachDB (Cloud cluster `omnimarket-da3`, v26.2)  
> **Live site:** https://omni-atelier-da3.harshzz.workers.dev

---

## 1. Architecture

```
Browser ──► Cloudflare Worker "omni-atelier-da3"
              ├── static storefront (Vite build in frontend/dist)
              └── /api/*  (frontend/worker/index.js, postgres.js driver)
                      │
                      ▼
            Cloudflare Hyperdrive (connection pooling, caching disabled)
                      │  TLS, port 26257
                      ▼
            CockroachDB Cloud: cluster omnimarket-da3, database omnimarket
            (GCP asia-southeast1, SERIALIZABLE, Raft-replicated)
```

Everything runs on Cloudflare except the database itself. There is no separate application server.

## 2. Project Layout

```
Digital Assignment 3/
├── crdb-cli.cmd               # CockroachDB CLI wrapper (start / init / sql / reset / status / stop)
├── database/
│   ├── schema.sql             # 10 tables, sequences, CHECK / FK constraints, indexes
│   ├── seed.sql               # Idempotent seed: 3 stores, 36 products, sample orders
│   └── README.md
├── frontend/
│   ├── worker/index.js        # Cloudflare Worker API (all /api/* endpoints)
│   ├── src/                   # Storefront, Professor suite, ACID demos, SQL console
│   ├── wrangler.toml          # Worker + assets + Hyperdrive binding
│   └── vite.config.js
└── docs/                      # architecture.md, database-design.md, deployment.md
```

## 3. Why CockroachDB for a Multi-Vendor Marketplace

A marketplace's core data (vendors, inventory, orders, payments, payouts) needs ACID transactions, foreign
keys and joins: a checkout must deduct stock and create the order, its line items and the payment
**atomically**. CockroachDB keeps full SQL semantics and adds:

1. **SERIALIZABLE isolation by default.** Two shoppers cannot both buy the last unit. Conflicting
   transactions are aborted with SQLSTATE `40001`; the Worker retries checkout automatically (up to 3 attempts).
2. **Raft-replicated ranges.** Data survives node failures without application changes.
3. **Horizontal scale and multi-region** as vendors are added in more cities.
4. **PostgreSQL wire compatibility**, so standard drivers and Cloudflare Hyperdrive work unchanged.

## 4. API Endpoints (frontend/worker/index.js)

| Method | Path | Purpose |
| :--- | :--- | :--- |
| GET | `/api/health` | Database connectivity and CockroachDB version |
| GET | `/api/dashboard/stats` | Counts and revenue |
| GET | `/api/products`, `/api/products/{id}`, `/api/products/{id}/related` | Catalog; related = same store first, then nearest price |
| POST / GET | `/api/orders`, `/api/orders/{id}` | Multi-table ACID checkout; order lookup |
| POST | `/api/admin/insert`, `/delete`, `/update` | Professor CRUD; requires `X-Admin-Key` |
| GET | `/api/admin/tables`, `/columns`, `/records` | Table counts, column metadata, record browser |
| GET / POST | `/api/advanced/joins`, `/aggregates`, `/transaction-demo`, `/explain` | Course demonstrations |
| POST | `/api/sql` | Read-only SQL console |

**Safety measures**
- Every value is a bound query parameter. Table names are whitelisted, and column names are checked against
  `information_schema` before they appear in SQL.
- The public SQL console and EXPLAIN run in a transaction set to `READ ONLY` and verified with
  `SHOW transaction_read_only` before any user SQL executes, so CockroachDB rejects writes and DDL.
- Admin mutations require the `ADMIN_API_KEY` Worker secret; missing key returns 401, wrong key 403.
- Any failure inside checkout rolls back the whole transaction, so no partial order is ever stored.

## 5. Checkout Transaction

```js
for (let attempt = 1; ; attempt++) {
  try {
    return await sql.begin(async (tx) => {          // BEGIN
      const [order] = await tx`INSERT INTO orders ... RETURNING id`;
      for (const item of items) {
        await tx`INSERT INTO ordered_items ...`;
        await tx`SELECT stock FROM products WHERE id = ${item.productId} FOR UPDATE`;
        const ok = await tx`UPDATE products SET stock = stock - ${item.qty}
                            WHERE id = ${item.productId} AND stock >= ${item.qty} RETURNING id`;
        if (!ok.length) throw new ApiError(400, 'Insufficient stock');   // ROLLBACK
      }
      await tx`INSERT INTO payments ...`;
      return order;                                   // COMMIT
    });
  } catch (err) {
    if (err.code === '40001' && attempt < 3) continue; // serialization conflict: retry
    throw err;
  }
}
```

## 6. CockroachDB CLI

`crdb-cli.cmd` wraps the official `cockroach` binary (found on `PATH`, in `%USERPROFILE%\.tools\cockroach\`,
or via `COCKROACH_BIN`).

```powershell
cd "Digital Assignment 3"
.\crdb-cli.cmd start     # local single-node cluster (SQL :26257, DB Console http://localhost:8090)
.\crdb-cli.cmd init      # create 'omnimarket', apply schema.sql + seed.sql
.\crdb-cli.cmd sql       # interactive SQL shell
.\crdb-cli.cmd reset     # drop and rebuild from the SQL files
.\crdb-cli.cmd stop
```

Set `CRDB_URL` to a CockroachDB Cloud connection string to run `init` / `sql` / `status` against the cloud
cluster. Some networks (including the VIT campus Wi-Fi) block outbound port 26257; use another network for
direct CLI access. The live site is unaffected because Cloudflare connects to the cluster, not your machine.

The cloud cluster itself is managed with the `ccloud` CLI, e.g.
`ccloud cluster get omnimarket-da3` or `ccloud cluster database list omnimarket-da3`.

## 7. Deploying

```powershell
cd "Digital Assignment 3\frontend"
npm install
npm run deploy            # vite build + wrangler deploy
```

One-time setup (already done for `omni-atelier-da3`):

```powershell
npx wrangler hyperdrive create omnimarket-crdb --connection-string="postgresql://<user>:<password>@<host>:26257/omnimarket" --caching-disabled
npx wrangler secret put ADMIN_API_KEY
```

The Hyperdrive ID goes in `wrangler.toml`. On the first request against an empty database the Worker applies
`database/schema.sql` and `database/seed.sql` (bundled at build time); each step is idempotent.

The DA2 deployment (`omni-atelier`, Cloudflare D1) is separate and unaffected.

## 8. Local Development

```powershell
cd "Digital Assignment 3"
.\crdb-cli.cmd start; .\crdb-cli.cmd init

cd frontend
$env:CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE = "postgresql://root@localhost:26257/omnimarket?sslmode=disable"
npm run dev:api           # Worker API on http://localhost:8787
npm run dev               # storefront on http://localhost:5173 (proxies /api to :8787)
```

## 9. Configuration

| Setting | Where | Purpose |
| :--- | :--- | :--- |
| `HYPERDRIVE` binding | `wrangler.toml` | CockroachDB Cloud connection (credentials stored in Hyperdrive) |
| `ADMIN_API_KEY` | Worker secret | Required `X-Admin-Key` for Professor INSERT / UPDATE / DELETE |
| `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` | env var | Local database for `wrangler dev` |
| `API_PROXY_TARGET` | env var | Vite dev proxy target (default `http://localhost:8787`) |
| `CRDB_URL` | env var | Cluster used by `crdb-cli.cmd` |
