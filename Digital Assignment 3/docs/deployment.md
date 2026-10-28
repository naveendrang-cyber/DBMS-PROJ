# Deployment & Operation Guide (Digital Assignment 3)

This guide provides the exact commands, configuration parameters, and architectural deployment procedures for **Digital Assignment 3**.

---

## 1. Local Development Execution (Windows PowerShell)

Both frontend and backend can be run simultaneously on your local development machine.

### 1.1 Prerequisites Verification
Ensure Java 17 and Node.js are available in your PowerShell session:
```powershell
# Set Java & Maven in current session (if not permanently in PATH)
$env:JAVA_HOME = "C:\Users\harsh\.tools\jdk-17"
$env:Path = "C:\Users\harsh\.tools\jdk-17\bin;C:\Users\harsh\.tools\maven\bin;" + $env:Path

# Verify tools
java -version
mvn -version
node -v
npm -v
```

### 1.2 Start the Java Spring Boot Backend
Open a PowerShell terminal and navigate to the backend directory:
```powershell
cd "Digital Assignment 3\backend"

# Run automated tests to verify JDBC connectivity
mvn test

# Start the Spring Boot application (Default port: 8080)
mvn spring-boot:run
```
*Note: The backend starts with an auto-initialized SQLite fallback database (`omnimarket_da3.db`) if no cloud database URL is supplied, allowing immediate evaluation.*

### 1.3 Start the Frontend Development Server
Open a second PowerShell terminal:
```powershell
cd "Digital Assignment 3\frontend"

# Install frontend dependencies (if not already installed)
npm install

# Start Vite development server (Default port: 5173)
npm run dev
```
Open your browser at `http://localhost:5173`. The Vite server automatically proxies all `/api/*` calls to the Spring Boot backend on port 8080.

---

## 2. Cloudflare Frontend Deployment

The redesigned frontend is engineered to build into static assets and deploy independently on **Cloudflare Pages** or **Cloudflare Workers**.

### 2.1 Build Production Bundle
```powershell
cd "Digital Assignment 3\frontend"
npm run build
```
This generates the optimized production bundle inside `Digital Assignment 3/frontend/dist/`.

### 2.2 Deploy via Wrangler (Cloudflare)
Ensure Wrangler is authenticated (`npx wrangler login`):
```powershell
# Deploy as a separate Cloudflare project (omni-atelier-da3)
npx wrangler pages deploy dist --project-name omni-atelier-da3
```
*Notice: Using `--project-name omni-atelier-da3` guarantees that your existing DA2 production deployment (`omni-atelier`) is never modified or overwritten.*

### 2.3 Set Backend URL on Cloudflare
If deploying the frontend on Cloudflare Pages and pointing to a hosted Java backend, set the environment variable:
```bash
VITE_API_BASE_URL = "https://your-java-backend-host.com/api"
```

---

## 3. Java Backend Deployment Architecture

### 3.1 Architectural Constraint
Standard Cloudflare Workers execute inside a V8 JavaScript isolates environment and **do not support the Java Virtual Machine (JVM)** or standard C-based network sockets required by JDBC drivers (`org.postgresql.Driver`). Therefore, the Java Spring Boot application must run on a platform that natively supports JVM runtimes.

### 3.2 Recommended JVM Hosting Platforms

#### Option A: Render (Fastest & Free Tier Available)
1. Create a New **Web Service** on [render.com](https://render.com).
2. Point to your repository branch `Harsh2`.
3. Root Directory: `Digital Assignment 3/backend`
4. Runtime: `Java` (or `Docker`)
5. Build Command: `mvn clean package -DskipTests`
6. Start Command: `java -jar target/omnimarket-da3-backend-1.0.0.jar`
7. Set Environment Variables:
   - `PORT`: `8080`
   - `DB_URL`: `jdbc:postgresql://<user>:<password>@<cockroachdb-host>:26257/<database>?sslmode=verify-full`
   - `CORS_ALLOWED_ORIGINS`: `https://omni-atelier-da3.pages.dev`
   - `ADMIN_API_KEY`: `omni-admin-secret-da3`

#### Option B: Railway / Fly.io / AWS Elastic Beanstalk
A standard `Dockerfile` or native Maven buildpack will run the JAR artifact with zero modifications.

---

## 4. Configuration Reference

| Parameter | Environment Variable | Example Value | Description |
| :--- | :--- | :--- | :--- |
| Server Port | `PORT` | `8080` | Port for incoming HTTP requests |
| Database JDBC URL | `DB_URL` | `jdbc:postgresql://...` | Connection URL for CockroachDB or SQLite |
| Database User | `DB_USER` | `harsh` | Database authentication username |
| Database Password | `DB_PASSWORD` | `********` | Database authentication password |
| Allowed CORS | `CORS_ALLOWED_ORIGINS` | `https://*.pages.dev,http://localhost:5173` | Origins allowed to make API calls |
| Admin Security Key | `ADMIN_API_KEY` | `omni-admin-secret-da3` | Required key for Professor Insert/Delete/Update actions |

---

## 5. Diagnostic & Health-Check Endpoints

1. **System Health & JDBC Verification:**
   ```bash
   GET /api/health
   ```
   Returns:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "engine": "PostgreSQL" | "CockroachDB" | "SQLite",
     "driver": "PostgreSQL JDBC Driver (42.7.4)",
     "framework": "Java Spring Boot + Direct JDBC"
   }
   ```

2. **Dashboard Metric Summary:**
   ```bash
   GET /api/dashboard/stats
   ```

3. **ACID Transaction & Rollback Proof:**
   ```bash
   POST /api/advanced/transaction-demo
   Body: { "shouldFail": true }
   ```
