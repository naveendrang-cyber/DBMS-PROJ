-- Migration V3: Secondary Indexes, Constraints, and Sequence Synchronization

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

-- Verify sequence synchronization for PostgreSQL / CockroachDB engines
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'roles_id_seq') THEN
        PERFORM setval('roles_id_seq', COALESCE((SELECT MAX(id) FROM roles), 1));
        PERFORM setval('users_user_id_seq', COALESCE((SELECT MAX(user_id) FROM users), 1));
        PERFORM setval('sellers_id_seq', COALESCE((SELECT MAX(id) FROM sellers), 1));
        PERFORM setval('stores_id_seq', COALESCE((SELECT MAX(id) FROM stores), 1));
        PERFORM setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 1));
        PERFORM setval('orders_id_seq', COALESCE((SELECT MAX(id) FROM orders), 1));
        PERFORM setval('ordered_items_id_seq', COALESCE((SELECT MAX(id) FROM ordered_items), 1));
        PERFORM setval('payments_pay_id_seq', COALESCE((SELECT MAX(pay_id) FROM payments), 1));
        PERFORM setval('withdrawals_id_seq', COALESCE((SELECT MAX(id) FROM withdrawals), 1));
        PERFORM setval('reviews_id_seq', COALESCE((SELECT MAX(id) FROM reviews), 1));
    END IF;
END $$;
