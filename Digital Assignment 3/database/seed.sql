-- ============================================================================
-- DIGITAL ASSIGNMENT 3: SAMPLE SEED DATA (COCKROACHDB / POSTGRESQL)
-- Idempotent seed statements using standard ON CONFLICT clauses
-- ============================================================================

-- 1. ROLES
INSERT INTO roles (id, role_name) VALUES
(1, 'Administrator'),
(2, 'Seller'),
(3, 'Buyer')
ON CONFLICT (id) DO NOTHING;

-- 2. USERS
INSERT INTO users (user_id, role_id, first_name, last_name, email, password, phone, status) VALUES
(1, 1, 'Alice', 'Vance', 'admin@omnimarket.com', 'adminpass123', '+91 98765 00001', 'active'),
(2, 2, 'Rahul', 'Sharma', 'rahul.techzone@gmail.com', 'sellerpass123', '+91 98765 11111', 'active'),
(3, 2, 'Priya', 'Patel', 'priya.stylehub@gmail.com', 'sellerpass456', '+91 98765 22222', 'active'),
(4, 3, 'Vikram', 'Singh', 'vikram.singh@yahoo.com', 'buyerpass123', '+91 98765 33333', 'active'),
(5, 3, 'Ananya', 'Roy', 'ananya.roy@outlook.com', 'buyerpass456', '+91 98765 44444', 'active'),
(6, 3, 'Rohit', 'Verma', 'rohit.verma@gmail.com', 'buyerpass789', '+91 98765 55555', 'active')
ON CONFLICT (user_id) DO NOTHING;

-- 3. SELLERS
INSERT INTO sellers (id, user_id, store_name, description, status) VALUES
(1, 2, 'TechZone Electronics', 'Leading supplier of premium computer peripherals and gaming accessories.', 'active'),
(2, 3, 'StyleHub Apparel', 'Modern clothing, footwear, and travel accessories store.', 'active')
ON CONFLICT (id) DO NOTHING;

-- 4. STORES
INSERT INTO stores (id, seller_id, name, rating, status, city, address) VALUES
(1, 1, 'TechZone Flagship Branch', 4.85, 'active', 'Bangalore', '102 MG Road, Indiranagar'),
(2, 2, 'StyleHub Fashion Studio', 4.70, 'active', 'Mumbai', '45 Linking Road, Bandra West'),
(3, 1, 'TechZone Express Hub', 4.60, 'active', 'Delhi', '12 Connaught Place, New Delhi')
ON CONFLICT (id) DO NOTHING;

-- 5. PRODUCTS
INSERT INTO products (id, store_id, name, price, stock, description) VALUES
(1, 1, 'Wireless Mechanical Keyboard', 3499.00, 45, 'RGB Backlit tactile mechanical keyboard with Bluetooth 5.0 and USB-C.'),
(2, 1, 'UltraHD 4K Gaming Monitor', 28999.00, 12, '27-inch IPS panel with 144Hz refresh rate, HDR400, and 1ms response time.'),
(3, 1, 'Noise Cancelling Headphones', 12499.00, 20, 'Active Noise Cancelling over-ear headphones with 30-hour battery life.'),
(4, 2, 'Slim Fit Denim Jacket', 2499.00, 60, 'Classic indigo denim jacket with durable stitching and modern tailored fit.'),
(5, 2, 'Leather Travel Duffle Bag', 3899.00, 18, 'Handcrafted full-grain leather weekend travel duffle with shoe compartment.'),
(6, 3, 'Portable Bluetooth Speaker', 1799.00, 35, 'Waterproof IPX7 outdoor speaker with rich bass and 12-hour playtime.'),
(7, 1, 'CNC Billet Aluminum Macropad', 4299.00, 24, 'Custom anodized 9-key mechanical macropad with rotary encoder and QMK/VIA support.'),
(8, 1, 'Studio Reference Open-Back Headphones', 18999.00, 15, 'Planar magnetic audiophile transducers engineered for critical listening and acoustic mastering.'),
(9, 2, 'Japanese Selvedge Raw Denim Jean', 5499.00, 28, '14oz Kurabo mill indigo raw selvedge denim crafted with shuttle looms and chainstitch hem.'),
(10, 2, 'Vegetable-Tanned Minimalist Cardholder', 1499.00, 42, 'Hand-stitched Italian Badalassi Carlo leather wallet with RFID blocking core.'),
(11, 3, 'Solid Walnut Desk Shelf & Riser', 6299.00, 16, 'Dual-monitor ergonomic desk stand machined from certified American black walnut with cork legs.'),
(12, 1, 'Precision Machined Wireless Mouse', 6999.00, 22, 'Magnesium alloy honeycomb skeleton with PAW3395 optical sensor and 4K polling rate.'),
(13, 3, 'Solid Brass Acoustic Desktop Speaker', 14999.00, 10, 'Acoustically tuned heavy brass casing with coaxial driver and lossless aptX HD Bluetooth.'),
(14, 2, 'Merino Wool Heavyweight Knit Cardigan', 7899.00, 19, '100% extrafine Australian Merino wool ribbed knit with genuine horn buttons and shawl collar.'),
(15, 2, 'Waxed Cotton Field Backpack', 8499.00, 14, '18oz Scottish Martexin waxed canvas backpack with bridal leather straps and brass hardware.'),
(16, 1, 'Audiophile Desktop DAC & Headphone Amp', 16499.00, 11, 'Dual ESS SABRE ES9038Q2M chip architecture with balanced 4.4mm output and MQA decoding.'),
(17, 1, 'PBT Double-Shot Dye-Sub Keycap Set', 2899.00, 35, 'Cherry profile thick PBT keycaps with crisp Japanese Hiragana sub-legends and ISO support.'),
(18, 2, 'Tailored Irish Linen Camp Collar Shirt', 3299.00, 31, 'Breathable bespoke 100% French-seamed Irish flax linen shirt in sage green.'),
(19, 2, 'Full-Grain Leather Horology Watch Roll', 4599.00, 20, 'Cushioned 3-slot travel watch roll lined with ultra-soft microsuede and slide-in dividers.'),
(20, 1, 'Ultra-Wide Curved OLED Productivity Display', 64999.00, 8, '34-inch QD-OLED 175Hz monitor with 99.3% DCI-P3 color gamut, USB-C 90W PD, and true blacks.'),
(21, 3, 'Machined Titanium Mechanical Pencil', 3799.00, 25, 'Grade 5 aerospace titanium hexagonal body with Schmidt drafting mechanism.'),
(22, 2, 'Water-Resistant Cordura Tech Sling Bag', 3199.00, 34, 'Recycled 500D Cordura ripstop crossbody pouch with Fidlock magnetic V-buckles.'),
(23, 1, 'Linear Switch Lubrication Station Kit', 1899.00, 40, 'Precision acrylic lubing base with Krytox 205g0, brush, and switch stem pickers.'),
(24, 1, 'Acoustic Desktop Studio Monitors (Pair)', 24999.00, 9, 'Active bi-amped studio reference monitors with Kevlar woofers and silk dome tweeters.'),
(25, 2, 'Hand-Loomed Cashmere Fringe Scarf', 4999.00, 22, 'Ultra-soft Mongolian mountain goat cashmere woven on traditional wooden handlooms.'),
(26, 3, 'Anodized Aluminum Monitor Light Bar', 3499.00, 30, 'Asymmetric optical glare-free desk lamp with wireless rotary dial and auto-dimming sensor.'),
(27, 2, 'Vegetable-Tanned Leather Desk Mat', 3899.00, 18, 'Large 900x400mm Tuscan leather workspace blotter with natural burnished edges.'),
(28, 1, 'True Wireless Active Noise-Cancelling Earbuds', 9999.00, 26, 'Custom balanced armature drivers with Qi wireless charging case and transparency mode.'),
(29, 2, 'Organic Cotton Heavyweight French Terry Hoodie', 4299.00, 27, '500 GSM loopback organic cotton fleece with reverse weave side panels and flatlock seams.'),
(30, 3, 'CNC Machined Brass Fountain Pen', 4499.00, 17, 'Heavy raw brass writing instrument with Bock #6 German stainless steel medium nib.'),
(31, 1, 'Ergonomic Split Ortholinear Keyboard', 11999.00, 13, 'Split column-staggered mechanical keyboard with OLED display, per-key RGB, and hot-swap sockets.'),
(32, 2, 'Tailored Wool & Silk Blend Blazer', 14499.00, 12, 'Unstructured Italian wool-silk hopsack jacket with patch pockets and mother-of-pearl buttons.'),
(33, 2, 'Handmade Leather Weekend Passport Folio', 2199.00, 36, 'Full-grain travel passport wallet with boarding pass sleeve and boarding pen slot.'),
(34, 1, 'Custom Coiled Aviator Keyboard Cable', 1699.00, 45, 'Double-sleeved Paracord and Techflex coiled USB-C cable with detachable 4-pin GX16 connector.'),
(35, 3, 'High-Res Lossless Portable Audio Player', 21999.00, 14, 'Android-based DAP with dual CS43198 DACs, 4.4mm balanced output, and bidirectional Bluetooth.'),
(36, 2, 'Full-Grain Leather Chelsea Boots', 9899.00, 15, 'Goodyear welted European calfskin boots with Dainite rubber outsoles and elastic side gussets.')
ON CONFLICT (id) DO NOTHING;

-- 6. ORDERS
INSERT INTO orders (id, user_id, status, total_price) VALUES
(1, 4, 'completed', 3499.00),
(2, 5, 'completed', 28999.00),
(3, 6, 'processing', 4298.00)
ON CONFLICT (id) DO NOTHING;

-- 7. ORDERED ITEMS
INSERT INTO ordered_items (id, order_id, product_id, qty, price) VALUES
(1, 1, 1, 1, 3499.00),
(2, 2, 2, 1, 28999.00),
(3, 3, 4, 1, 2499.00),
(4, 3, 6, 1, 1799.00)
ON CONFLICT (id) DO NOTHING;

-- 8. PAYMENTS
INSERT INTO payments (pay_id, order_id, amount, pay_method, pay_status) VALUES
(1, 1, 3499.00, 'UPI', 'completed'),
(2, 2, 28999.00, 'Credit Card', 'completed'),
(3, 3, 4298.00, 'NetBanking', 'completed')
ON CONFLICT (pay_id) DO NOTHING;

-- 9. WITHDRAWALS
INSERT INTO withdrawals (id, seller_id, amount, status) VALUES
(1, 1, 15000.00, 'completed'),
(2, 2, 5000.00, 'pending')
ON CONFLICT (id) DO NOTHING;

-- 10. REVIEWS
INSERT INTO reviews (id, user_id, product_id, comment) VALUES
(1, 4, 1, 'Amazing mechanical tactile feedback! Great build quality and battery life.'),
(2, 5, 2, 'Stunning 4K display and smooth 144Hz refresh rate. Excellent for gaming and coding.'),
(3, 6, 4, 'High quality denim material and perfect fit. Highly recommended!')
ON CONFLICT (id) DO NOTHING;

-- Sync sequences for auto-increment columns (PostgreSQL / CockroachDB)
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
SELECT setval('sellers_id_seq', (SELECT MAX(id) FROM sellers));
SELECT setval('stores_id_seq', (SELECT MAX(id) FROM stores));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));
SELECT setval('ordered_items_id_seq', (SELECT MAX(id) FROM ordered_items));
SELECT setval('payments_pay_id_seq', (SELECT MAX(pay_id) FROM payments));
SELECT setval('withdrawals_id_seq', (SELECT MAX(id) FROM withdrawals));
SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));
