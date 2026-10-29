# Deployment Guide (Digital Assignment 3)

The whole application is one Cloudflare Worker, `omni-atelier-da3`, plus a CockroachDB Cloud cluster.

- Live site: https://omni-atelier-da3.harshzz.workers.dev
- API health: https://omni-atelier-da3.harshzz.workers.dev/api/health

## 1. Database (CockroachDB Cloud)

Managed with the `ccloud` CLI (`ccloud auth login` first):

```powershell
ccloud cluster create omnimarket-da3 --edition STANDARD --cloud GCP --region asia-southeast1 --provisioned-vcpus 2 --wait
ccloud cluster user create omnimarket-da3 omnimarket_app -p <password>
ccloud cluster database create omnimarket-da3 omnimarket
ccloud cluster connection-string omnimarket-da3 --database omnimarket
```

The cluster bills against the organization's credits while it exists. Delete it when it is no longer needed:
`ccloud cluster delete omnimarket-da3`.

## 2. Hyperdrive (one-time)

```powershell
cd "Digital Assignment 3\frontend"
npx wrangler hyperdrive create omnimarket-crdb --connection-string="postgresql://omnimarket_app:<password>@<host>:26257/omnimarket" --caching-disabled
```

Put the returned ID in `wrangler.toml` under `[[hyperdrive]]` (binding `HYPERDRIVE`).

## 3. Admin key (one-time)

```powershell
npx wrangler secret put ADMIN_API_KEY
```

Share this key with evaluators; they enter it in the Professor Database Manager panel.

## 4. Build and deploy

```powershell
npm install
npm run deploy      # vite build && wrangler deploy
```

On the first request against an empty database, the Worker applies `database/schema.sql` and
`database/seed.sql`.

## 5. Verify

```powershell
curl https://omni-atelier-da3.harshzz.workers.dev/api/health
```

Expected response:

```json
{
  "status": "ok",
  "database": "connected",
  "engine": "CockroachDB",
  "version": "CockroachDB CCL v26.2.9 (...)",
  "driver": "postgres.js via Cloudflare Hyperdrive",
  "framework": "Cloudflare Workers"
}
```

## Notes

- The DA2 deployment (`omni-atelier`, Cloudflare D1) is a separate Worker and is not affected.
- Outbound port 26257 is blocked on some networks (e.g. campus Wi-Fi). This only affects direct CLI access
  from that machine; Cloudflare connects to the cluster independently.
