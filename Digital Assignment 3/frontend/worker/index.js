/**
 * OMNI ATELIER (DA3) — CLOUDFLARE WORKER API
 * Serves /api/* from CockroachDB Cloud through Cloudflare Hyperdrive (postgres.js driver);
 * every other path is a static asset from ./dist.
 *
 * Bindings (wrangler.toml / secrets):
 *   HYPERDRIVE     Hyperdrive config pointing at the CockroachDB Cloud 'omnimarket' database
 *   ASSETS         Static frontend build
 *   ADMIN_API_KEY  Secret required in X-Admin-Key for Professor INSERT / UPDATE / DELETE
 */

import postgres from 'postgres';
import schemaSql from '../../database/schema.sql';
import seedSql from '../../database/seed.sql';

const PK_MAP = {
  roles: 'id',
  users: 'user_id',
  sellers: 'id',
  stores: 'id',
  products: 'id',
  orders: 'id',
  ordered_items: 'id',
  payments: 'pay_id',
  withdrawals: 'id',
  reviews: 'id',
};

const MAX_TRANSACTION_ATTEMPTS = 3;

// CockroachDB returns INT8 and DECIMAL; postgres.js would hand them back as strings.
const NUMBER_TYPES = {
  int8: { to: 20, from: [20], serialize: (x) => String(x), parse: (x) => Number(x) },
  numeric: { to: 1700, from: [1700], serialize: (x) => String(x), parse: (x) => Number(x) },
};

let schemaReady = false;

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }

    const sql = postgres(env.HYPERDRIVE.connectionString, {
      max: 5,
      fetch_types: false,
      types: NUMBER_TYPES,
    });

    try {
      await ensureSchema(sql);
      return await route(request, url, env, sql);
    } catch (err) {
      return errorResponse(err);
    } finally {
      ctx.waitUntil(sql.end());
    }
  },
};

// ---------------------------------------------------------------------------
// Schema bootstrap: applies database/schema.sql + seed.sql once, on an empty database
// ---------------------------------------------------------------------------

// Each step is idempotent (IF NOT EXISTS / ON CONFLICT DO NOTHING), so an interrupted first run
// is completed by the next request instead of leaving tables without data.
async function ensureSchema(sql) {
  if (schemaReady) return;
  const tables = Object.keys(PK_MAP);
  const [{ n }] = await sql`
    SELECT count(*) AS n FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name IN ${sql(tables)}`;
  if (n < tables.length) {
    for (const stmt of splitStatements(schemaSql)) await sql.unsafe(stmt);
  }
  const [{ seeded }] = await sql`SELECT EXISTS (SELECT 1 FROM roles) AS seeded`;
  if (!seeded) {
    for (const stmt of splitStatements(seedSql)) await sql.unsafe(stmt);
  }
  schemaReady = true;
}

function splitStatements(script) {
  return script
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(/;\s*\n/)
    .map((s) => s.trim().replace(/;$/, ''))
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

async function route(request, url, env, sql) {
  const method = request.method;
  const parts = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  const [p0, p1, p2] = parts;

  if (method === 'GET' && p0 === 'health' && !p1) return json(await health(sql));
  if (method === 'GET' && p0 === 'dashboard' && p1 === 'stats') return json(await dashboardStats(sql));

  if (p0 === 'products' && method === 'GET') {
    if (!p1) return json(await findAllProducts(sql));
    const id = toInt(p1, 'product id');
    if (!p2) {
      const product = await findProductById(sql, id);
      if (!product) throw new ApiError(404, `Product with ID ${id} not found.`);
      return json(product);
    }
    if (p2 === 'related') {
      if (!(await findProductById(sql, id))) throw new ApiError(404, `Product with ID ${id} not found.`);
      return json(await findRelatedProducts(sql, id, Number(url.searchParams.get('limit') || 4)));
    }
  }

  if (p0 === 'orders') {
    if (method === 'POST' && !p1) return json(await createOrder(sql, await readJson(request)), 201);
    if (method === 'GET' && p1) {
      const order = await findOrderById(sql, toInt(p1, 'order id'));
      if (!order) throw new ApiError(404, `Order #${p1} not found.`);
      return json(order);
    }
  }

  if (p0 === 'admin') {
    if (method === 'POST' && ['insert', 'delete', 'update'].includes(p1)) {
      checkAdminKey(request, env);
      const body = await readJson(request);
      if (p1 === 'insert') return json(await insertRecord(sql, body.table, body.data || {}));
      if (p1 === 'delete') return json(await deleteRecord(sql, body.table, body.id));
      return json(await updateRecord(sql, body.table, body.id, body.data || {}));
    }
    if (method === 'GET' && p1 === 'tables') return json(await tableCounts(sql));
    if (method === 'GET' && p1 === 'columns') return json(await tableColumns(sql, url.searchParams.get('table')));
    if (method === 'GET' && p1 === 'records') {
      return json(await tableRecords(
        sql,
        url.searchParams.get('table'),
        Number(url.searchParams.get('limit') || 50),
        Number(url.searchParams.get('offset') || 0),
      ));
    }
  }

  if (p0 === 'advanced') {
    if (method === 'GET' && p1 === 'joins') return json(await joinsDemo(sql));
    if (method === 'GET' && p1 === 'aggregates') return json(await aggregatesDemo(sql));
    if (method === 'POST' && p1 === 'transaction-demo') {
      const body = await readJson(request);
      return json(await transactionDemo(sql, Boolean(body.shouldFail)));
    }
    if (method === 'POST' && p1 === 'explain') {
      const body = await readJson(request);
      return json(await explainQuery(sql, body.query));
    }
  }

  if (method === 'POST' && p0 === 'sql' && !p1) {
    const body = await readJson(request);
    return json(await sqlConsole(sql, body.query));
  }

  throw new ApiError(404, `No endpoint ${method} ${url.pathname}`);
}

// ---------------------------------------------------------------------------
// Health & stats
// ---------------------------------------------------------------------------

async function health(sql) {
  const [{ version }] = await sql`SELECT version() AS version`;
  return {
    status: 'ok',
    database: 'connected',
    engine: version.startsWith('CockroachDB') ? 'CockroachDB' : 'PostgreSQL',
    version,
    driver: 'postgres.js via Cloudflare Hyperdrive',
    framework: 'Cloudflare Workers',
  };
}

async function dashboardStats(sql) {
  const [row] = await sql`
    SELECT (SELECT count(*) FROM users) AS total_users,
           (SELECT count(*) FROM sellers) AS total_sellers,
           (SELECT count(*) FROM stores) AS total_stores,
           (SELECT count(*) FROM products) AS total_products,
           (SELECT count(*) FROM orders) AS total_orders,
           (SELECT count(*) FROM payments) AS total_payments,
           (SELECT count(*) FROM withdrawals WHERE status IN ('pending', 'under_review')) AS pending_withdrawals,
           (SELECT count(*) FROM reviews) AS total_reviews,
           (SELECT COALESCE(sum(amount), 0) FROM payments WHERE pay_status = 'completed') AS total_revenue`;
  return {
    totalUsers: row.total_users,
    totalSellers: row.total_sellers,
    totalStores: row.total_stores,
    totalProducts: row.total_products,
    totalOrders: row.total_orders,
    totalPayments: row.total_payments,
    totalRevenue: row.total_revenue,
    pendingWithdrawals: row.pending_withdrawals,
    totalReviews: row.total_reviews,
  };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

function mapProduct(r) {
  return {
    id: r.id,
    storeId: r.store_id,
    name: r.name,
    price: r.price,
    stock: r.stock,
    description: r.description,
    storeName: r.store_name,
    city: r.city,
  };
}

async function findAllProducts(sql) {
  const rows = await sql`
    SELECT p.id, p.store_id, p.name, p.price, p.stock, p.description, s.name AS store_name, s.city
    FROM products p JOIN stores s ON p.store_id = s.id
    ORDER BY p.id ASC`;
  return rows.map(mapProduct);
}

async function findProductById(sql, id) {
  const rows = await sql`
    SELECT p.id, p.store_id, p.name, p.price, p.stock, p.description, s.name AS store_name, s.city
    FROM products p JOIN stores s ON p.store_id = s.id
    WHERE p.id = ${id}`;
  return rows.length ? mapProduct(rows[0]) : null;
}

// Same store first, then closest in price
async function findRelatedProducts(sql, id, limit) {
  const capped = Math.max(1, Math.min(Number.isFinite(limit) ? limit : 4, 12));
  const rows = await sql`
    SELECT p.id, p.store_id, p.name, p.price, p.stock, p.description, s.name AS store_name, s.city
    FROM products p
    JOIN stores s ON p.store_id = s.id
    JOIN products target ON target.id = ${id}
    WHERE p.id <> target.id
    ORDER BY (p.store_id = target.store_id) DESC, abs(p.price - target.price) ASC, p.id ASC
    LIMIT ${capped}`;
  return rows.map(mapProduct);
}

// ---------------------------------------------------------------------------
// Orders: multi-table ACID checkout
// ---------------------------------------------------------------------------

/**
 * CockroachDB runs every transaction at SERIALIZABLE isolation. When two checkouts conflict,
 * one is aborted with SQLSTATE 40001 and must be retried by the client, which happens here.
 * Any error inside sql.begin() rolls the whole transaction back.
 */
async function createOrder(sql, req) {
  const userId = toInt(req.userId, 'userId');
  const items = Array.isArray(req.items) ? req.items : [];
  if (items.length === 0) throw new ApiError(400, 'Cart is empty.');
  const payMethod = req.payMethod || 'UPI';

  for (let attempt = 1; ; attempt++) {
    try {
      return await sql.begin((tx) => checkoutTransaction(tx, userId, items, payMethod));
    } catch (err) {
      if (err.code === '40001' && attempt < MAX_TRANSACTION_ATTEMPTS) continue;
      if (err instanceof ApiError) throw err;
      throw new ApiError(400, `Checkout transaction failed: ${err.message}`);
    }
  }
}

async function checkoutTransaction(tx, userId, items, payMethod) {
  let grandTotal = 0;
  const prepared = [];

  for (const item of items) {
    const productId = toInt(item.productId, 'productId');
    const qty = toInt(item.qty, 'qty');
    if (qty <= 0) throw new ApiError(400, `Invalid item quantity: ${item.qty}`);

    const rows = await tx`SELECT name, price, stock FROM products WHERE id = ${productId}`;
    if (!rows.length) throw new ApiError(400, `Product with ID ${productId} not found.`);
    const { name, price, stock } = rows[0];
    if (stock < qty) {
      throw new ApiError(400, `Insufficient stock for product '${name}'. Available: ${stock}, Requested: ${qty}`);
    }
    grandTotal += price * qty;
    prepared.push({ productId, productName: name, qty, price });
  }
  grandTotal = Math.round(grandTotal * 100) / 100;

  const [order] = await tx`
    INSERT INTO orders (user_id, status, total_price) VALUES (${userId}, 'completed', ${grandTotal})
    RETURNING id`;

  for (const item of prepared) {
    item.orderId = order.id;
    const [line] = await tx`
      INSERT INTO ordered_items (order_id, product_id, qty, price)
      VALUES (${order.id}, ${item.productId}, ${item.qty}, ${item.price})
      RETURNING id`;
    item.id = line.id;

    // Row lock, then a guarded decrement: concurrent checkouts can never over-sell
    await tx`SELECT stock FROM products WHERE id = ${item.productId} FOR UPDATE`;
    const updated = await tx`
      UPDATE products SET stock = stock - ${item.qty}
      WHERE id = ${item.productId} AND stock >= ${item.qty}
      RETURNING id`;
    if (!updated.length) {
      throw new ApiError(400, `Failed to decrement inventory for product ID: ${item.productId}`);
    }
  }

  const [payment] = await tx`
    INSERT INTO payments (order_id, amount, pay_method, pay_status)
    VALUES (${order.id}, ${grandTotal}, ${payMethod}, 'completed')
    RETURNING pay_id, paid_at`;

  return {
    id: order.id,
    userId,
    status: 'completed',
    totalPrice: grandTotal,
    customerName: null,
    items: prepared,
    payment: {
      payId: payment.pay_id,
      orderId: order.id,
      amount: grandTotal,
      paidAt: payment.paid_at,
      payMethod,
      payStatus: 'completed',
    },
  };
}

async function findOrderById(sql, id) {
  const rows = await sql`
    SELECT o.id, o.user_id, o.status, o.total_price, u.first_name || ' ' || u.last_name AS customer_name
    FROM orders o JOIN users u ON o.user_id = u.user_id
    WHERE o.id = ${id}`;
  if (!rows.length) return null;
  const o = rows[0];
  const items = await sql`
    SELECT oi.id, oi.order_id, oi.product_id, oi.qty, oi.price, p.name AS product_name
    FROM ordered_items oi JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ${id}`;
  return {
    id: o.id,
    userId: o.user_id,
    status: o.status,
    totalPrice: o.total_price,
    customerName: o.customer_name,
    items: items.map((i) => ({
      id: i.id,
      orderId: i.order_id,
      productId: i.product_id,
      qty: i.qty,
      price: i.price,
      productName: i.product_name,
    })),
  };
}

// ---------------------------------------------------------------------------
// Professor interface: parameterized INSERT / DELETE / UPDATE
// ---------------------------------------------------------------------------

function checkAdminKey(request, env) {
  const key = (request.headers.get('X-Admin-Key') || '').trim();
  if (!key) throw new ApiError(401, 'Missing X-Admin-Key header. Administrative access required.');
  if (!env.ADMIN_API_KEY || key !== env.ADMIN_API_KEY) {
    throw new ApiError(403, 'Invalid Administrative API Key. Access denied.');
  }
}

function validateTable(table) {
  const t = String(table || '').toLowerCase().trim();
  if (!PK_MAP[t]) throw new ApiError(400, `Target table '${table}' is not recognized or permitted.`);
  return t;
}

/**
 * Identifiers cannot be bound as query parameters, so every requested column is checked against
 * the table's real columns (information_schema) before it is placed in the SQL text.
 */
async function validateColumns(sql, table, columns) {
  const rows = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = ${table}`;
  const known = new Set(rows.map((r) => r.column_name.toLowerCase()));
  for (const col of columns) {
    if (!known.has(String(col).toLowerCase())) {
      throw new ApiError(400, `Unknown column '${col}' for table '${table}'.`);
    }
  }
}

function placeholders(n, offset = 0) {
  return Array.from({ length: n }, (_, i) => `$${i + 1 + offset}`);
}

async function fetchRecord(sql, table, pk, id) {
  const rows = await sql.unsafe(`SELECT * FROM ${table} WHERE ${pk} = $1`, [id]);
  return rows[0] || null;
}

async function insertRecord(sql, rawTable, data) {
  const start = Date.now();
  const table = validateTable(rawTable);
  const pk = PK_MAP[table];
  const filtered = { ...data };
  const pkVal = filtered[pk];
  if (pkVal === null || pkVal === undefined || String(pkVal).trim() === '' || String(pkVal).trim() === '0') {
    delete filtered[pk];
  }
  const columns = Object.keys(filtered);
  if (!columns.length) throw new ApiError(400, `Cannot insert record: No columns provided for table ${table}`);
  await validateColumns(sql, table, columns);

  const rows = await runMutation(() => sql.unsafe(
    `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders(columns.length).join(', ')}) RETURNING *`,
    columns.map((c) => filtered[c]),
  ), 'INSERT');
  const record = rows[0];
  return mutationResponse('INSERT', table, record[pk], rows.count,
    `Record inserted successfully into table '${table}' via parameterized statement.`, record, start);
}

async function deleteRecord(sql, rawTable, id) {
  const start = Date.now();
  const table = validateTable(rawTable);
  const pk = PK_MAP[table];
  const existing = await fetchRecord(sql, table, pk, id);
  if (!existing) throw new ApiError(400, `Record with ${pk} = ${id} does not exist in table '${table}'.`);

  const rows = await runMutation(() => sql.unsafe(`DELETE FROM ${table} WHERE ${pk} = $1`, [id]), 'DELETE');
  return mutationResponse('DELETE', table, id, rows.count,
    `Record with ${pk} = ${id} was successfully deleted from table '${table}'.`, existing, start);
}

async function updateRecord(sql, rawTable, id, data) {
  const start = Date.now();
  const table = validateTable(rawTable);
  const pk = PK_MAP[table];
  const filtered = { ...data };
  delete filtered[pk];
  const columns = Object.keys(filtered);
  if (!columns.length) throw new ApiError(400, `No updatable fields provided for table '${table}'.`);
  await validateColumns(sql, table, columns);

  const setClause = columns.map((c, i) => `${c} = $${i + 1}`).join(', ');
  const rows = await runMutation(() => sql.unsafe(
    `UPDATE ${table} SET ${setClause} WHERE ${pk} = $${columns.length + 1} RETURNING *`,
    [...columns.map((c) => filtered[c]), id],
  ), 'UPDATE');
  if (!rows.length) throw new ApiError(400, `No record found with ${pk} = ${id} in table '${table}'.`);
  return mutationResponse('UPDATE', table, id, rows.count,
    `Record with ${pk} = ${id} was successfully updated via parameterized statement.`, rows[0], start);
}

async function runMutation(fn, op) {
  try {
    return await fn();
  } catch (err) {
    if (err.code === '23503') {
      throw new ApiError(400, 'Cannot complete operation: it violates a foreign key constraint (referenced or missing parent record).');
    }
    if (err.code) throw new ApiError(400, `${op} Failed: ${err.message}`);
    throw err;
  }
}

function mutationResponse(operation, table, id, affectedRows, message, record, start) {
  return {
    success: true,
    operation,
    table,
    id,
    affectedRows,
    message,
    record,
    executionTimeMs: Date.now() - start,
  };
}

async function tableCounts(sql) {
  const counts = {};
  for (const table of Object.keys(PK_MAP)) {
    const [{ n }] = await sql.unsafe(`SELECT count(*) AS n FROM ${table}`);
    counts[table] = n;
  }
  return counts;
}

async function tableColumns(sql, rawTable) {
  const table = validateTable(rawTable);
  const rows = await sql`
    SELECT column_name, udt_name, character_maximum_length, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = ${table}
    ORDER BY ordinal_position`;
  return rows.map((r) => ({
    name: r.column_name,
    type: r.udt_name,
    size: r.character_maximum_length || 0,
    nullable: r.is_nullable === 'YES',
    isPk: r.column_name === PK_MAP[table],
  }));
}

async function tableRecords(sql, rawTable, limit, offset) {
  const table = validateTable(rawTable);
  const lim = Math.max(1, Math.min(Number.isFinite(limit) ? limit : 50, 200));
  const off = Math.max(0, Number.isFinite(offset) ? offset : 0);
  return sql.unsafe(`SELECT * FROM ${table} ORDER BY ${PK_MAP[table]} ASC LIMIT $1 OFFSET $2`, [lim, off]);
}

// ---------------------------------------------------------------------------
// Advanced demonstrations
// ---------------------------------------------------------------------------

async function joinsDemo(sql) {
  return sql`
    SELECT o.id AS order_id,
           u.first_name || ' ' || u.last_name AS customer_name,
           u.email AS customer_email,
           p.name AS product_name,
           oi.qty,
           oi.price AS unit_price,
           (oi.qty * oi.price) AS line_total,
           o.status AS order_status,
           pay.pay_method,
           pay.pay_status
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    JOIN ordered_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    LEFT JOIN payments pay ON o.id = pay.order_id
    ORDER BY o.id ASC, oi.id ASC`;
}

async function aggregatesDemo(sql) {
  return sql`
    SELECT s.id AS store_id,
           s.name AS store_name,
           s.city,
           s.rating,
           count(p.id) AS total_products,
           COALESCE(sum(p.stock), 0) AS total_inventory,
           round(avg(p.price), 2) AS average_product_price,
           min(p.price) AS min_price,
           max(p.price) AS max_price
    FROM stores s
    LEFT JOIN products p ON s.id = p.store_id
    GROUP BY s.id, s.name, s.city, s.rating
    ORDER BY total_products DESC, s.name ASC`;
}

/**
 * Genuine ACID demo: inserts an order and line items inside BEGIN ... COMMIT. With shouldFail,
 * a foreign key / CHECK violation aborts the transaction and CockroachDB rolls everything back.
 */
async function transactionDemo(sql, shouldFail) {
  const start = Date.now();
  const steps = [];
  const [{ version }] = await sql`SELECT version() AS version`;
  const resp = { databaseEngine: version.split(' (')[0] };
  let testOrderId = null;

  try {
    await sql.begin(async (tx) => {
      steps.push('[STEP 1] BEGIN: explicit transaction opened on CockroachDB (SERIALIZABLE isolation).');

      const [order] = await tx`
        INSERT INTO orders (user_id, status, total_price) VALUES (4, 'pending', 12499.00) RETURNING id`;
      testOrderId = order.id;
      steps.push(`[STEP 2] INSERT INTO orders (order_id=${testOrderId}, user_id=4, total_price=12499.00). Uncommitted.`);

      await tx`INSERT INTO ordered_items (order_id, product_id, qty, price) VALUES (${testOrderId}, 1, 1, 3499.00)`;
      steps.push(`[STEP 3] INSERT INTO ordered_items (order_id=${testOrderId}, product_id=1, qty=1, price=3499.00).`);

      if (shouldFail) {
        steps.push('[STEP 4] [SIMULATED FAILURE]: INSERT with non-existent foreign key (product_id = 999999) and negative quantity (qty = -10)...');
        await tx`INSERT INTO ordered_items (order_id, product_id, qty, price) VALUES (${testOrderId}, 999999, -10, 9000.00)`;
      } else {
        steps.push('[STEP 4] [NORMAL WORKFLOW]: second valid item INSERT (product_id=3, qty=1, price=9000.00). All constraints passed.');
        await tx`INSERT INTO ordered_items (order_id, product_id, qty, price) VALUES (${testOrderId}, 3, 1, 9000.00)`;
      }
    });

    steps.push('[STEP 5] COMMIT: all operations committed atomically to durable, Raft-replicated storage.');
    const [{ n }] = await sql`SELECT count(*) AS n FROM ordered_items WHERE order_id = ${testOrderId}`;
    steps.push(`[STEP 6] [VERIFICATION]: ${n} item(s) found for Order #${testOrderId}.`);

    await sql.begin(async (tx) => {
      await tx`DELETE FROM ordered_items WHERE order_id = ${testOrderId}`;
      await tx`DELETE FROM orders WHERE id = ${testOrderId}`;
    });
    steps.push('[STEP 7] Cleaned up temporary test order. Database state restored.');

    Object.assign(resp, {
      success: true,
      rolledBack: false,
      outcome: 'COMMITTED',
      message: 'Transaction completed successfully! All operations were committed atomically.',
    });
  } catch (err) {
    steps.push(`[EXCEPTION CAUGHT] ${err.code ? `SQLSTATE ${err.code}: ` : ''}${err.message}`);
    steps.push('[ROLLBACK EXECUTED] ROLLBACK: all uncommitted modifications were discarded.');
    const [{ n }] = testOrderId
      ? await sql`SELECT count(*) AS n FROM orders WHERE id = ${testOrderId}`
      : [{ n: 0 }];
    steps.push(`[ATOMICITY VERIFIED] Rows remaining for test order #${testOrderId}: ${n}.`);
    Object.assign(resp, {
      success: true,
      rolledBack: true,
      outcome: 'ROLLED_BACK',
      message: 'Rollback demonstrated successfully! A constraint violation aborted the transaction, so zero partial state was written.',
    });
  }

  resp.executionSteps = steps;
  resp.elapsedMs = Date.now() - start;
  return resp;
}

/**
 * The SQL console and EXPLAIN endpoints are public, so they run inside a READ ONLY transaction:
 * CockroachDB rejects any write or DDL (including EXPLAIN ANALYZE of a write).
 * The mode is set with an explicit SET TRANSACTION and verified before the user's SQL runs,
 * because options on BEGIN are not reliably honoured through the Hyperdrive pooler.
 */
async function readOnly(sql, fn) {
  return sql.begin(async (tx) => {
    await tx`SET TRANSACTION READ ONLY`;
    const [{ transaction_read_only: ro }] = await tx`SHOW transaction_read_only`;
    if (ro !== 'on' && ro !== true) {
      throw new ApiError(500, 'Refusing to run console SQL: transaction is not read-only.');
    }
    return fn(tx);
  });
}

async function explainQuery(sql, query) {
  const trimmed = String(query || '').trim().replace(/;+$/, '');
  if (!trimmed) throw new ApiError(400, 'Query string cannot be empty.');
  try {
    return await readOnly(sql, (tx) => tx.unsafe(`EXPLAIN ${trimmed}`));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(400, `Execution plan analysis error: ${err.message}`);
  }
}

async function sqlConsole(sql, query) {
  const start = Date.now();
  const raw = String(query || '').trim().replace(/;+$/, '');
  if (!raw) return { success: false, error: 'Query string cannot be empty.' };

  try {
    const result = await readOnly(sql, (tx) => tx.unsafe(raw));
    const elapsed = Date.now() - start;
    const columns = (result.columns || []).map((c) => c.name);
    if (columns.length) {
      return {
        success: true,
        columns,
        rows: [...result],
        rowCount: result.length,
        executionTime: elapsed,
      };
    }
    return {
      success: true,
      affectedRows: result.count || 0,
      rowCount: result.count || 0,
      columns: ['status', 'affected_rows'],
      rows: [{ status: 'SUCCESS', affected_rows: result.count || 0 }],
      message: `Query executed successfully (${result.command || 'OK'}).`,
      executionTime: elapsed,
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    return { success: false, error: err.message, executionTime: Date.now() - start };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toInt(value, label) {
  const n = Number(value);
  if (!Number.isInteger(n)) throw new ApiError(400, `Invalid ${label}: ${value}`);
  return n;
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, 'Request body must be valid JSON.');
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function errorResponse(err) {
  if (err instanceof ApiError) return json({ success: false, error: err.message }, err.status);
  if (err.code) return json({ success: false, error: `Database error: ${err.message}` }, 400);
  console.error('Unhandled API error', err);
  return json({ success: false, error: 'An internal server error occurred. Please try again.' }, 500);
}
