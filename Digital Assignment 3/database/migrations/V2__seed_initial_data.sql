-- Migration V2: Initial Baseline Dataset for E-Commerce Marketplace
-- Roles, Users, Sellers, Stores, Products, Orders, Ordered Items, Payments, Withdrawals, Reviews

INSERT INTO roles (id, role_name) VALUES
(1, 'Administrator'),
(2, 'Seller'),
(3, 'Buyer')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (user_id, role_id, first_name, last_name, email, password, phone, status) VALUES
(1, 1, 'Alice', 'Vance', 'admin@omnimarket.com', 'adminpass123', '+91 98765 00001', 'active'),
(2, 2, 'Rahul', 'Sharma', 'rahul.techzone@gmail.com', 'sellerpass123', '+91 98765 11111', 'active'),
(3, 2, 'Priya', 'Patel', 'priya.stylehub@gmail.com', 'sellerpass456', '+91 98765 22222', 'active'),
(4, 3, 'Vikram', 'Singh', 'vikram.singh@yahoo.com', 'buyerpass123', '+91 98765 33333', 'active'),
(5, 3, 'Ananya', 'Roy', 'ananya.roy@outlook.com', 'buyerpass456', '+91 98765 44444', 'active'),
(6, 3, 'Rohit', 'Verma', 'rohit.verma@gmail.com', 'buyerpass789', '+91 98765 55555', 'active')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO sellers (id, user_id, store_name, description, status) VALUES
(1, 2, 'TechZone Electronics', 'Leading supplier of premium computer peripherals and gaming accessories.', 'active'),
(2, 3, 'StyleHub Apparel', 'Modern clothing, footwear, and travel accessories store.', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO stores (id, seller_id, name, rating, status, city, address) VALUES
(1, 1, 'TechZone Flagship Branch', 4.85, 'active', 'Bangalore', '102 MG Road, Indiranagar'),
(2, 2, 'StyleHub Fashion Studio', 4.70, 'active', 'Mumbai', '45 Linking Road, Bandra West'),
(3, 1, 'TechZone Express Hub', 4.60, 'active', 'Delhi', '12 Connaught Place, New Delhi')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, store_id, name, price, stock, description) VALUES
(1, 1, 'Wireless Mechanical Keyboard', 3499.00, 45, 'RGB Backlit tactile mechanical keyboard with Bluetooth 5.0 and USB-C.'),
(2, 1, 'UltraHD 4K Gaming Monitor', 28999.00, 12, '27-inch IPS panel with 144Hz refresh rate, HDR400, and 1ms response time.'),
(3, 1, 'Noise Cancelling Headphones', 12499.00, 20, 'Active Noise Cancelling over-ear headphones with 30-hour battery life.'),
(4, 2, 'Slim Fit Denim Jacket', 2499.00, 60, 'Classic indigo denim jacket with durable stitching and modern tailored fit.'),
(5, 2, 'Leather Travel Duffle Bag', 3899.00, 18, 'Handcrafted full-grain leather weekend travel duffle with shoe compartment.'),
(6, 3, 'Portable Bluetooth Speaker', 1799.00, 35, 'Waterproof IPX7 outdoor speaker with rich bass and 12-hour playtime.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, user_id, status, total_price) VALUES
(1, 4, 'completed', 3499.00),
(2, 5, 'completed', 28999.00),
(3, 6, 'processing', 4298.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO ordered_items (id, order_id, product_id, qty, price) VALUES
(1, 1, 1, 1, 3499.00),
(2, 2, 2, 1, 28999.00),
(3, 3, 4, 1, 2499.00),
(4, 3, 6, 1, 1799.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO payments (pay_id, order_id, amount, pay_method, pay_status) VALUES
(1, 1, 3499.00, 'UPI', 'completed'),
(2, 2, 28999.00, 'Credit Card', 'completed'),
(3, 3, 4298.00, 'NetBanking', 'completed')
ON CONFLICT (pay_id) DO NOTHING;

INSERT INTO withdrawals (id, seller_id, amount, status) VALUES
(1, 1, 15000.00, 'completed'),
(2, 2, 5000.00, 'pending')
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, user_id, product_id, comment) VALUES
(1, 4, 1, 'Amazing mechanical tactile feedback! Great build quality and battery life.'),
(2, 5, 2, 'Stunning 4K display and smooth 144Hz refresh rate. Excellent for gaming and coding.'),
(3, 6, 4, 'High quality denim material and perfect fit. Highly recommended!')
ON CONFLICT (id) DO NOTHING;
