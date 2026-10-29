-- ============================================================================
-- DIGITAL ASSIGNMENT 3: ADVANCED DATABASE SCHEMA (COCKROACHDB / POSTGRESQL)
-- Course: Database Management Systems (Advanced Database Architecture)
-- Distributed SQL Schema with Referential Integrity, Constraints, and Indexes
-- ============================================================================

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES roles(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. SELLERS TABLE
CREATE TABLE IF NOT EXISTS sellers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    store_name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. STORES TABLE
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL REFERENCES sellers(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 0.0 AND rating <= 5.0),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'under_review')),
    city VARCHAR(50),
    address VARCHAR(255)
);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    store_id INT NOT NULL REFERENCES stores(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0.0),
    stock INT NOT NULL CHECK (stock >= 0),
    description TEXT
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0.0)
);

-- 7. ORDERED ITEMS TABLE
CREATE TABLE IF NOT EXISTS ordered_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    qty INT NOT NULL CHECK (qty > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0.0)
);

-- 8. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    pay_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0.0),
    paid_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    pay_method VARCHAR(30) NOT NULL CHECK (pay_method IN ('UPI', 'Credit Card', 'Debit Card', 'NetBanking', 'Wallet')),
    pay_status VARCHAR(30) DEFAULT 'completed' CHECK (pay_status IN ('completed', 'pending', 'failed', 'refunded'))
);

-- 9. WITHDRAWALS TABLE
CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL REFERENCES sellers(id) ON UPDATE CASCADE ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0.0),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'completed', 'rejected')),
    req_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
    comment TEXT NOT NULL
);

-- SECONDARY INDEXES FOR HIGH-CONCURRENCY DISTRIBUTED SQL PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_stores_seller_id ON stores(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_ordered_items_order_id ON ordered_items(order_id);
CREATE INDEX IF NOT EXISTS idx_ordered_items_product_id ON ordered_items(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_seller_id ON withdrawals(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
