# OmniMarket Atelier (DA3) — Frontend Application

This directory contains the redesigned storefront and evaluation interfaces for **Digital Assignment 3**, styled with the luxury *White × Midnight Green × Champagne Gold* aesthetic and connected directly to the Java Spring Boot JDBC backend.

## Design Palette Specifications

- **White:** `#FFFFFF` (Primary canvas background)
- **Midnight Green:** `#0B1F1A` (Dominant headers and brand typography)
- **Deep Emerald:** `#174A3A` (Accents, key action buttons, and active indicators)
- **Champagne Gold:** `#C6A66B` (Badges, accents, and action highlights)
- **Soft Ivory:** `#F4F5F0` (Card and panel backgrounds)
- **Primary Text:** `#17211D`
- **Secondary Text:** `#66716B`
- **Borders:** `#E4E8E4`

## Features

1. **Luxury Storefront:**
   - Real-time catalog populated from relational database via JDBC.
   - Category filtering (All, TechZone Electronics, StyleHub Apparel).
   - Live client-side and server-backed search.
   - Stock status indicators ("In Stock", "Only X Left", "Sold Out").
   - Interactive Quick View modal.
   - Slide-out Cart Drawer with real-time price calculation.
   - Multi-step Checkout Modal triggering an explicit ACID transaction in Java.

2. **Dedicated Professor Database Management Section:**
   - Strictly implements the **Three Primary Action Buttons** in order:
     1. **Insert:** Dynamic schema form generation, input validation, parameterized JDBC INSERT, displays generated primary key and new record.
     2. **Delete:** Selectable record dropdown with preview, confirmation dialog, parameterized JDBC DELETE, referential integrity error handling.
     3. **Update:** Selectable record dropdown, loads current values, permits editing non-PK fields, parameterized JDBC UPDATE, displays updated record.
   - Live Table Record Inspector showing real data from the selected table with pagination and column metadata.

3. **Advanced Database Course Demonstration Section:**
   - **ACID Transactions:** Interactive "Test Transaction Commit" vs "Test Transaction Rollback" buttons with real-time timeline visualization.
   - **Multi-Table Joins:** Demonstrates 5-table joined query (Orders, Users, Items, Products, Payments).
   - **Aggregates:** Computes store metrics with `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `GROUP BY`.
   - **EXPLAIN Plan:** Real-time query execution plan generator.
   - **CockroachDB Architecture:** Analysis of Multi-Raft consensus, MVCC, and Serializable isolation.

4. **Educational SQL Console:**
   - Interactive SQL sandbox with pre-loaded queries.

## Local Development Commands (PowerShell)

```powershell
cd "Digital Assignment 3\frontend"
npm install
npm run dev
```

Runs local dev server at `http://localhost:5173`. Proxies `/api` requests to `http://localhost:8080`.

## Production Build

```powershell
npm run build
```

Generates optimized production bundle in `dist/`.
