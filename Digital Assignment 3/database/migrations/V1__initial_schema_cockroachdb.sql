-- Migration V1: Initial CockroachDB / PostgreSQL Schema
-- Tables: roles, users, sellers, stores, products, orders, ordered_items, payments, withdrawals, reviews

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

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

CREATE TABLE IF NOT EXISTS sellers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    store_name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL REFERENCES sellers(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 0.0 AND rating <= 5.0),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'under_review')),
    city VARCHAR(50),
    address VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    store_id INT NOT NULL REFERENCES stores(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0.0),
    stock INT NOT NULL CHECK (stock >= 0),
    description TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0.0)
);

CREATE TABLE IF NOT EXISTS ordered_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    qty INT NOT NULL CHECK (qty > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0.0)
);

CREATE TABLE IF NOT EXISTS payments (
    pay_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0.0),
    paid_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    pay_method VARCHAR(30) NOT NULL CHECK (pay_method IN ('UPI', 'Credit Card', 'Debit Card', 'NetBanking', 'Wallet')),
    pay_status VARCHAR(30) DEFAULT 'completed' CHECK (pay_status IN ('completed', 'pending', 'failed', 'refunded'))
);

CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL REFERENCES sellers(id) ON UPDATE CASCADE ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0.0),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'completed', 'rejected')),
    req_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
    comment TEXT NOT NULL
);
