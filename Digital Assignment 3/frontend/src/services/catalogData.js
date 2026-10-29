/**
 * OMNI ATELIER — PRODUCT METADATA & ASSET REGISTRY
 * Provides high-resolution photography, secondary hover angles, variant matrices,
 * and category taxonomies merged seamlessly with live relational records from SQL JDBC.
 */

export const CATEGORIES = [
  { id: 'all', label: 'All Curations', icon: '✦', desc: 'The complete atelier collection' },
  { id: 'computing', label: 'Artisan Computing', icon: '⌨', desc: 'Precision machined peripherals & workstations' },
  { id: 'audio', label: 'High-Fidelity Audio', icon: '♫', desc: 'Acoustically tuned transducers & amplification' },
  { id: 'apparel', label: 'Sartorial Goods', icon: '◈', desc: 'Raw selvedge denim & bespoke tailoring' },
  { id: 'leathercraft', label: 'Leathercraft & Accoutrements', icon: '✑', desc: 'Full-grain leather & precision instruments' },
];

export const BASELINE_PRODUCTS = [
  { id: 1, storeId: 1, name: 'Wireless Mechanical Keyboard', price: 3499.00, stock: 39, description: 'RGB Backlit tactile mechanical keyboard with Bluetooth 5.0 and USB-C.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 2, storeId: 1, name: 'UltraHD 4K Gaming Monitor', price: 28999.00, stock: 12, description: '27-inch IPS panel with 144Hz refresh rate, HDR400, and 1ms response time.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 3, storeId: 1, name: 'Noise Cancelling Headphones', price: 12499.00, stock: 20, description: 'Active Noise Cancelling over-ear headphones with 30-hour battery life.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 4, storeId: 2, name: 'Slim Fit Denim Jacket', price: 2499.00, stock: 60, description: 'Classic indigo denim jacket with durable stitching and modern tailored fit.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 5, storeId: 2, name: 'Leather Travel Duffle Bag', price: 3899.00, stock: 18, description: 'Handcrafted full-grain leather weekend travel duffle with shoe compartment.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 6, storeId: 3, name: 'Portable Bluetooth Speaker', price: 1799.00, stock: 35, description: 'Waterproof IPX7 outdoor speaker with rich bass and 12-hour playtime.', storeName: 'TechZone Express Hub', city: 'Delhi' },
  { id: 7, storeId: 1, name: 'CNC Billet Aluminum Macropad', price: 4299.00, stock: 24, description: 'Custom anodized 9-key mechanical macropad with rotary encoder and QMK/VIA support.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 8, storeId: 1, name: 'Studio Reference Open-Back Headphones', price: 18999.00, stock: 15, description: 'Planar magnetic audiophile transducers engineered for critical listening and acoustic mastering.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 9, storeId: 2, name: 'Japanese Selvedge Raw Denim Jean', price: 5499.00, stock: 28, description: '14oz Kurabo mill indigo raw selvedge denim crafted with shuttle looms and chainstitch hem.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 10, storeId: 2, name: 'Vegetable-Tanned Minimalist Cardholder', price: 1499.00, stock: 42, description: 'Hand-stitched Italian Badalassi Carlo leather wallet with RFID blocking core.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 11, storeId: 3, name: 'Solid Walnut Desk Shelf & Riser', price: 6299.00, stock: 16, description: 'Dual-monitor ergonomic desk stand machined from certified American black walnut with cork legs.', storeName: 'TechZone Express Hub', city: 'Delhi' },
  { id: 12, storeId: 1, name: 'Precision Machined Wireless Mouse', price: 6999.00, stock: 22, description: 'Magnesium alloy honeycomb skeleton with PAW3395 optical sensor and 4K polling rate.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 13, storeId: 3, name: 'Solid Brass Acoustic Desktop Speaker', price: 14999.00, stock: 10, description: 'Acoustically tuned heavy brass casing with coaxial driver and lossless aptX HD Bluetooth.', storeName: 'TechZone Express Hub', city: 'Delhi' },
  { id: 14, storeId: 2, name: 'Merino Wool Heavyweight Knit Cardigan', price: 7899.00, stock: 19, description: '100% extrafine Australian Merino wool ribbed knit with genuine horn buttons and shawl collar.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 15, storeId: 2, name: 'Waxed Cotton Field Backpack', price: 8499.00, stock: 14, description: '18oz Scottish Martexin waxed canvas backpack with bridal leather straps and brass hardware.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 16, storeId: 1, name: 'Audiophile Desktop DAC & Headphone Amp', price: 16499.00, stock: 11, description: 'Dual ESS SABRE ES9038Q2M chip architecture with balanced 4.4mm output and MQA decoding.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 17, storeId: 1, name: 'PBT Double-Shot Dye-Sub Keycap Set', price: 2899.00, stock: 35, description: 'Cherry profile thick PBT keycaps with crisp Japanese Hiragana sub-legends and ISO support.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 18, storeId: 2, name: 'Tailored Irish Linen Camp Collar Shirt', price: 3299.00, stock: 31, description: 'Breathable bespoke 100% French-seamed Irish flax linen shirt in sage green.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 19, storeId: 2, name: 'Full-Grain Leather Horology Watch Roll', price: 4599.00, stock: 20, description: 'Cushioned 3-slot travel watch roll lined with ultra-soft microsuede and slide-in dividers.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 20, storeId: 1, name: 'Ultra-Wide Curved OLED Productivity Display', price: 64999.00, stock: 8, description: '34-inch QD-OLED 175Hz monitor with 99.3% DCI-P3 color gamut, USB-C 90W PD, and true blacks.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 21, storeId: 3, name: 'Machined Titanium Mechanical Pencil', price: 3799.00, stock: 25, description: 'Grade 5 aerospace titanium hexagonal body with Schmidt drafting mechanism.', storeName: 'TechZone Express Hub', city: 'Delhi' },
  { id: 22, storeId: 2, name: 'Water-Resistant Cordura Tech Sling Bag', price: 3199.00, stock: 34, description: 'Recycled 500D Cordura ripstop crossbody pouch with Fidlock magnetic V-buckles.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 23, storeId: 1, name: 'Linear Switch Lubrication Station Kit', price: 1899.00, stock: 40, description: 'Precision acrylic lubing base with Krytox 205g0, brush, and switch stem pickers.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 24, storeId: 1, name: 'Acoustic Desktop Studio Monitors (Pair)', price: 24999.00, stock: 9, description: 'Active bi-amped studio reference monitors with Kevlar woofers and silk dome tweeters.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 25, storeId: 2, name: 'Hand-Loomed Cashmere Fringe Scarf', price: 4999.00, stock: 22, description: 'Ultra-soft Mongolian mountain goat cashmere woven on traditional wooden handlooms.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 26, storeId: 3, name: 'Anodized Aluminum Monitor Light Bar', price: 3499.00, stock: 30, description: 'Asymmetric optical glare-free desk lamp with wireless rotary dial and auto-dimming sensor.', storeName: 'TechZone Express Hub', city: 'Delhi' },
  { id: 27, storeId: 2, name: 'Vegetable-Tanned Leather Desk Mat', price: 3899.00, stock: 18, description: 'Large 900x400mm Tuscan leather workspace blotter with natural burnished edges.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 28, storeId: 1, name: 'True Wireless Active Noise-Cancelling Earbuds', price: 9999.00, stock: 26, description: 'Custom balanced armature drivers with Qi wireless charging case and transparency mode.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 29, storeId: 2, name: 'Organic Cotton Heavyweight French Terry Hoodie', price: 4299.00, stock: 27, description: '500 GSM loopback organic cotton fleece with reverse weave side panels and flatlock seams.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 30, storeId: 3, name: 'CNC Machined Brass Fountain Pen', price: 4499.00, stock: 17, description: 'Heavy raw brass writing instrument with Bock #6 German stainless steel medium nib.', storeName: 'TechZone Express Hub', city: 'Delhi' },
  { id: 31, storeId: 1, name: 'Ergonomic Split Ortholinear Keyboard', price: 11999.00, stock: 13, description: 'Split column-staggered mechanical keyboard with OLED display, per-key RGB, and hot-swap sockets.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 32, storeId: 2, name: 'Tailored Wool & Silk Blend Blazer', price: 14499.00, stock: 12, description: 'Unstructured Italian wool-silk hopsack jacket with patch pockets and mother-of-pearl buttons.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 33, storeId: 2, name: 'Handmade Leather Weekend Passport Folio', price: 2199.00, stock: 36, description: 'Full-grain travel passport wallet with boarding pass sleeve and boarding pen slot.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' },
  { id: 34, storeId: 1, name: 'Custom Coiled Aviator Keyboard Cable', price: 1699.00, stock: 45, description: 'Double-sleeved Paracord and Techflex coiled USB-C cable with detachable 4-pin GX16 connector.', storeName: 'TechZone Flagship Branch', city: 'Bangalore' },
  { id: 35, storeId: 3, name: 'High-Res Lossless Portable Audio Player', price: 21999.00, stock: 14, description: 'Android-based DAP with dual CS43198 DACs, 4.4mm balanced output, and bidirectional Bluetooth.', storeName: 'TechZone Express Hub', city: 'Delhi' },
  { id: 36, storeId: 2, name: 'Full-Grain Leather Chelsea Boots', price: 9899.00, stock: 15, description: 'Goodyear welted European calfskin boots with Dainite rubber outsoles and elastic side gussets.', storeName: 'StyleHub Fashion Studio', city: 'Mumbai' }
];

export const PRODUCT_METADATA = {
  1: {
    category: 'computing',
    rating: 4.9,
    reviewsCount: 38,
    badge: 'Atelier Icon',
    primaryImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80'
    ],
    variants: ['Gateron Oil King (Linear)', 'Boba U4T (Tactile)', 'Kailh Box White (Clicky)'],
    specs: {
      'Chassis': 'CNC Machined 6063 Aluminum',
      'Connectivity': 'Bluetooth 5.1 / 2.4GHz / USB-C',
      'Battery': '4000mAh Lithium-Polymer',
      'Polling Rate': '1000Hz (Wired/2.4G)'
    }
  },
  2: {
    category: 'computing',
    rating: 4.8,
    reviewsCount: 22,
    badge: 'Pro Display',
    primaryImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=900&q=80'
    ],
    variants: ['27-inch 4K 144Hz', '32-inch 4K 165Hz Pro'],
    specs: {
      'Panel': 'Fast IPS with HDR400',
      'Color Gamut': '98% DCI-P3, 100% sRGB',
      'Ports': 'HDMI 2.1, DisplayPort 1.4, USB-C 65W PD'
    }
  },
  3: {
    category: 'audio',
    rating: 4.9,
    reviewsCount: 54,
    badge: 'Bestseller',
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80'
    ],
    variants: ['Midnight Obsidian', 'Ivory Champagne'],
    specs: {
      'Driver': '40mm Titanium Composite Diaphragm',
      'ANC': 'Hybrid Adaptive ANC (-42dB)',
      'Battery Life': '30 Hours with ANC Active'
    }
  },
  4: {
    category: 'apparel',
    rating: 4.7,
    reviewsCount: 19,
    badge: 'Tailored',
    primaryImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=900&q=80'
    ],
    variants: ['Small (38R)', 'Medium (40R)', 'Large (42R)', 'Extra Large (44R)'],
    specs: {
      'Material': '14oz Kurabo Indigo Denim',
      'Hardware': 'Antiqued Solid Brass Shank Buttons',
      'Origin': 'Handcrafted in Mumbai Studio'
    }
  },
  5: {
    category: 'leathercraft',
    rating: 5.0,
    reviewsCount: 29,
    badge: 'Artisan Heritage',
    primaryImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80'
    ],
    variants: ['Cognac Vachetta', 'Espresso Pull-Up'],
    specs: {
      'Leather': 'Full-Grain Vegetable Tanned Cowhide',
      'Zippers': 'YKK Excella Solid Brass',
      'Dimensions': '52cm x 28cm x 26cm (Cabin Approved)'
    }
  },
  6: {
    category: 'audio',
    rating: 4.7,
    reviewsCount: 16,
    badge: 'Compact Acoustics',
    primaryImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80'
    ],
    variants: ['Forest Green', 'Matte Carbon'],
    specs: {
      'Waterproof': 'IPX7 Certified Submersible',
      'Amplifier': '20W Class-D High-Efficiency',
      'Playtime': '12 Hours Continuous Playback'
    }
  },
  7: {
    category: 'computing',
    rating: 4.9,
    reviewsCount: 14,
    badge: 'New Release',
    primaryImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
    variants: ['Anodized Emerald', 'Sandblasted Silver', 'Midnight Black'],
    specs: { 'Material': 'Billet Aluminum Unibody', 'Firmware': 'QMK / VIA Remappable', 'Encoder': 'Bourns Rotary Knurled Brass' }
  },
  8: {
    category: 'audio',
    rating: 5.0,
    reviewsCount: 41,
    badge: 'Audiophile Grade',
    primaryImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=900&q=80',
    variants: ['Walnut Cups with Lambskin', 'Black Ash with Velour'],
    specs: { 'Transducer': '106mm Planar Magnetic Neodymium', 'Frequency': '8Hz - 50,000Hz', 'Impedance': '32 Ohms' }
  },
  9: {
    category: 'apparel',
    rating: 4.8,
    reviewsCount: 31,
    badge: 'Kurabo Raw Selvedge',
    primaryImage: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=900&q=80',
    variants: ['30W x 32L', '32W x 32L', '34W x 34L', '36W x 34L'],
    specs: { 'Denim': '14oz Japanese Kurabo Mills Indigo', 'Weave': 'Vintage Toyoda Shuttle Loom', 'Details': 'Hidden Copper Rivets & Chainstitch' }
  },
  10: {
    category: 'leathercraft',
    rating: 4.9,
    reviewsCount: 63,
    badge: 'Minimalist Essential',
    primaryImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=900&q=80',
    variants: ['Pueblo Tobacco', 'Minerva Box Olive', 'Nero Black'],
    specs: { 'Tannery': 'Badalassi Carlo (Ponte a Egola, Italy)', 'Capacity': '6-8 Cards + Folded Bills', 'Thread': 'Waxed Fil Au Chinois Linen' }
  },
  11: {
    category: 'computing',
    rating: 4.9,
    reviewsCount: 18,
    badge: 'Atelier Woodcraft',
    primaryImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    variants: ['American Black Walnut', 'European White Oak'],
    specs: { 'Wood': 'Solid Sustainably Harvested Hardwood', 'Pads': 'High-Density Portuguese Natural Cork', 'Max Load': '45 kg' }
  },
  12: {
    category: 'computing',
    rating: 4.8,
    reviewsCount: 27,
    badge: 'Ultra-Light 49g',
    primaryImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80',
    variants: ['Matte Magnesium Silver', 'Stealth Graphite'],
    specs: { 'Sensor': 'PixArt PAW3395 (26,000 DPI)', 'Weight': '49 grams unladen', 'Switches': 'TTC Gold Optical Dustproof' }
  },
  13: {
    category: 'audio',
    rating: 5.0,
    reviewsCount: 12,
    badge: 'Solid Brass Casting',
    primaryImage: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?auto=format&fit=crop&w=900&q=80',
    variants: ['Polished Raw Brass', 'Aged Patina Bronze'],
    specs: { 'Cabinet': '3.2kg Solid Cast Brass Anti-Resonant Enclosure', 'Driver': '3-inch Custom Peerless Coaxial', 'Connectivity': 'aptX HD Lossless Bluetooth' }
  },
  14: {
    category: 'apparel',
    rating: 4.9,
    reviewsCount: 24,
    badge: 'Pure Merino',
    primaryImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=900&q=80',
    variants: ['Oatmeal Heather', 'Deep Forest Emerald', 'Midnight Navy'],
    specs: { 'Yarn': '100% 19.5-micron Australian Merino Wool', 'Buttons': 'Real Hand-Turned Buffalo Horn', 'Knit': 'Heavy 5-Gauge Shaker Rib' }
  },
  15: {
    category: 'leathercraft',
    rating: 4.8,
    reviewsCount: 17,
    badge: 'Weatherproof',
    primaryImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80',
    variants: ['Field Olive & Tan Leather', 'Blackout Waxed Canvas'],
    specs: { 'Fabric': '18oz Martexin Original Waxed Canvas', 'Straps': 'Bridle Leather with Copper Rivets', 'Laptop Sleeve': 'Padded Compartment for 16\" MacBook' }
  },
  16: {
    category: 'audio',
    rating: 4.9,
    reviewsCount: 33,
    badge: 'Dual ESS Sabre',
    primaryImage: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=900&q=80',
    variants: ['Brushed Anodized Aluminum', 'Matte Black'],
    specs: { 'DAC Chips': 'Dual ESS ES9038Q2M Balanced Circuitry', 'Output': '4.4mm Pentaconn + 6.35mm Single-Ended', 'Sampling': 'PCM 32-bit/768kHz, Native DSD512' }
  },
  17: {
    category: 'computing',
    rating: 4.7,
    reviewsCount: 46,
    badge: 'Dye-Sub PBT',
    primaryImage: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80',
    variants: ['Ivory & Forest Green (Hiragana)', 'Minimal Monochrome (Latin)'],
    specs: { 'Profile': 'Cherry Ergonomic Profile', 'Thickness': '1.6mm Thick PBT Plastic', 'Compatibility': '60%, 65%, 75%, TKL, Full Size' }
  },
  18: {
    category: 'apparel',
    rating: 4.8,
    reviewsCount: 20,
    badge: 'Irish Flax',
    primaryImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
    variants: ['Sage Green (Camp Collar)', 'Natural Ecru (Band Collar)'],
    specs: { 'Fabric': '100% Certified Irish Flax Linen', 'Construction': 'Single-Needle Stitching with French Seams', 'Fit': 'Relaxed Modern Tailored Silhouette' }
  },
  19: {
    category: 'leathercraft',
    rating: 5.0,
    reviewsCount: 28,
    badge: 'Collector Edition',
    primaryImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80',
    variants: ['Tuscan Chestnut Leather', 'British Racing Green'],
    specs: { 'Cushions': 'Slide-in Flexible M-Shaped Pillows', 'Lining': 'Anti-Tarnish Swiss Alcantara Microfiber', 'Capacity': '3 Timepieces up to 48mm' }
  },
  20: {
    category: 'computing',
    rating: 5.0,
    reviewsCount: 15,
    badge: 'Flagship QD-OLED',
    primaryImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=900&q=80',
    variants: ['34\" QD-OLED 1800R Curve', '38\" IPS Ultra-Wide Dual-QHD'],
    specs: { 'Contrast': '1,000,000:1 Infinite True Black', 'Refresh': '175Hz Ultra-Smooth Refresh', 'Delivery': 'USB-C 90W Power Delivery Hub' }
  },
  21: {
    category: 'leathercraft',
    rating: 4.9,
    reviewsCount: 39,
    badge: 'Grade 5 Titanium',
    primaryImage: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1585336261026-7f5ed64c8d5a?auto=format&fit=crop&w=900&q=80',
    variants: ['Stonewashed Titanium (0.5mm)', 'Anodized Bronze (0.7mm)'],
    specs: { 'Material': 'Solid Ti-6Al-4V Titanium Bar Stock', 'Mechanism': 'Schmidt Feinminen-System (Germany)', 'Balance': 'Precision Center of Gravity' }
  },
  22: {
    category: 'leathercraft',
    rating: 4.7,
    reviewsCount: 25,
    badge: 'Fidlock Magnetic',
    primaryImage: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80',
    variants: ['Obsidian Black Ripstop', 'Steel Grey Cordura'],
    specs: { 'Shell': '500D Recycled Cordura Ballistic Nylon', 'Buckle': 'German Fidlock V-Buckle Quick Release', 'Zippers': 'YKK AquaGuard Weatherproof' }
  },
  23: {
    category: 'computing',
    rating: 4.8,
    reviewsCount: 52,
    badge: 'Tuning Suite',
    primaryImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    variants: ['Krytox 205g0 + Permatex', 'TriboSys 3203 (Tactile)'],
    specs: { 'Base': 'Frosted Laser-Cut Cast Acrylic (36 Slots)', 'Tools': 'Switch Opener, 4-Prong Stem Holder, 2x Kolinsky Brushes' }
  },
  24: {
    category: 'audio',
    rating: 4.9,
    reviewsCount: 19,
    badge: 'Studio Pair',
    primaryImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=900&q=80',
    variants: ['Matte Black with Woven Kevlar', 'Pure White Satin'],
    specs: { 'Amplification': 'Bi-Amped Class A/B 100W per Monitor', 'Frequency': '45Hz - 22,000Hz Flat Acoustic Response', 'Inputs': 'Balanced XLR & 1/4\" TRS' }
  },
  25: {
    category: 'apparel',
    rating: 5.0,
    reviewsCount: 16,
    badge: 'Mongolian Cashmere',
    primaryImage: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=80',
    variants: ['Camel Melange', 'Charcoal Heather', 'Forest Sage'],
    specs: { 'Fiber': '100% Grade-A Mongolian Mountain Cashmere', 'Dimensions': '200cm x 70cm with Eyelash Fringes', 'Weave': 'Traditional Handloom Twill' }
  },
  26: {
    category: 'computing',
    rating: 4.8,
    reviewsCount: 44,
    badge: 'Glare-Free',
    primaryImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80',
    variants: ['Space Grey CNC Aluminum', 'Silver Frost'],
    specs: { 'Optics': 'Asymmetric 45° Anti-Reflective Beam', 'Control': '2.4GHz Wireless Metal Rotary Controller', 'CRI': 'Ra95 High Color Rendering Index' }
  },
  27: {
    category: 'leathercraft',
    rating: 4.9,
    reviewsCount: 37,
    badge: 'Tuscan Full-Grain',
    primaryImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    variants: ['900x400mm Cognac', '900x400mm Black Forest'],
    specs: { 'Hide': '3.0mm Vegetable-Tanned Tuscan Cowhide', 'Backing': 'Non-Slip Eco Suede Underlay', 'Edges': 'Hand-Burnished with Japanese Tokonole' }
  },
  28: {
    category: 'audio',
    rating: 4.8,
    reviewsCount: 50,
    badge: 'True Wireless Pro',
    primaryImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=900&q=80',
    variants: ['Midnight Black Ceramic', 'White Alabaster'],
    specs: { 'Acoustics': 'Custom Knowles Balanced Armature + 10mm Dynamic', 'Codecs': 'LDAC 990kbps, aptX Adaptive, AAC', 'Battery': '8 Hours + 24 Hours in Qi Wireless Case' }
  },
  29: {
    category: 'apparel',
    rating: 4.9,
    reviewsCount: 29,
    badge: '500 GSM Fleece',
    primaryImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80',
    variants: ['Heavy Heather Grey', 'Deep Pine Green', 'Washed Black'],
    specs: { 'Fleece': '500 GSM 100% GOTS Certified Organic Cotton', 'Weave': 'Cross-Grain Reverse Weave (Pre-Shrunk)', 'Drawcord': 'Braided Cotton with Solid Brass Tips' }
  },
  30: {
    category: 'leathercraft',
    rating: 5.0,
    reviewsCount: 21,
    badge: 'Raw Brass Machining',
    primaryImage: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1585336261026-7f5ed64c8d5a?auto=format&fit=crop&w=900&q=80',
    variants: ['Fine Nib (0.4mm)', 'Medium Nib (0.6mm)', 'Broad Nib (0.8mm)'],
    specs: { 'Body': '52g Solid Lead-Free CZ121 Brass Hexagonal Bar', 'Nib': 'Bock #6 German Stainless Steel Nib with Iridium Tip', 'Ink System': 'Standard International Piston Converter Included' }
  },
  31: {
    category: 'computing',
    rating: 4.9,
    reviewsCount: 17,
    badge: 'Ergonomic Split',
    primaryImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80',
    variants: ['Billet Aluminum Case (Tent Kit)', 'Frosted Polycarbonate Case'],
    specs: { 'Layout': '58-Key Column-Staggered Ortholinear Split', 'Screens': 'Dual 128x32 OLED Real-Time Layer Indicators', 'Sockets': 'Kailh Hot-Swap PCB with Per-Key RGB' }
  },
  32: {
    category: 'apparel',
    rating: 5.0,
    reviewsCount: 13,
    badge: 'Italian Hopsack',
    primaryImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    variants: ['38R (Slim)', '40R (Tailored)', '42R (Tailored)', '44R (Classic)'],
    specs: { 'Cloth': '85% Super 130s Wool, 15% Mulberry Silk Hopsack', 'Structure': 'Unstructured Neapolitan Soft Shoulder', 'Buttons': 'Genuine Iridescent Mother-of-Pearl' }
  },
  33: {
    category: 'leathercraft',
    rating: 4.8,
    reviewsCount: 32,
    badge: 'Travel Passport Folio',
    primaryImage: 'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
    variants: ['Saddle Tan Leather', 'Midnight Black Box'],
    specs: { 'Leather': 'Hand-Waxed Pueblo Leather by Badalassi Carlo', 'Compartments': '2 Passport Sleeves, Boarding Pass Slot, 4 Card Slots', 'Closure': 'Magnetic Concealed German Snaps' }
  },
  34: {
    category: 'computing',
    rating: 4.9,
    reviewsCount: 65,
    badge: 'Coiled GX16',
    primaryImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80',
    variants: ['Forest Green Paracord + Gold Techflex', 'Monochrome Charcoal + Clear Techflex'],
    specs: { 'Coil': '6-inch Tight Reverse-Wound Coil (No Sagging)', 'Connector': 'Detachable 4-Pin GX16 Aviator Push-Pull', 'Wiring': '24AWG Power + 28AWG Signal Shielded Copper' }
  },
  35: {
    category: 'audio',
    rating: 4.9,
    reviewsCount: 22,
    badge: 'Lossless MQA Player',
    primaryImage: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    variants: ['Anodized Space Black', 'Raw Silver Aluminum'],
    specs: { 'DACs': 'Dual Cirrus Logic CS43198 MasterHIFI Architecture', 'Display': '4.0-inch 1080x540 Sharp IPS Touchscreen', 'Outputs': '4.4mm Balanced (800mW@32Ω) + 3.5mm SE' }
  },
  36: {
    category: 'leathercraft',
    rating: 4.9,
    reviewsCount: 27,
    badge: 'Goodyear Welted',
    primaryImage: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=900&q=80',
    variants: ['UK 7 (US 8)', 'UK 8 (US 9)', 'UK 9 (US 10)', 'UK 10 (US 11)'],
    specs: { 'Leather': 'Aniline French Box Calfskin with Natural Burnish', 'Construction': '360° Goodyear Welted (Fully Recraftable)', 'Outsole': 'Genuine British Dainite Studded Rubber' }
  }
};

const FALLBACK_PRIMARY = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80';
const FALLBACK_SECONDARY = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80';

/**
 * Enriches a raw database product entity (from Java JDBC REST) with visual assets
 */
export function enrichProduct(rawProduct) {
  if (!rawProduct) return null;
  const meta = PRODUCT_METADATA[rawProduct.id] || {};

  // Infer category from store or name if not mapped
  let category = meta.category;
  if (!category) {
    const sName = (rawProduct.storeName || '').toLowerCase();
    const pName = (rawProduct.name || '').toLowerCase();
    if (sName.includes('tech') || pName.includes('monitor') || pName.includes('keyboard')) {
      category = 'computing';
    } else if (pName.includes('speaker') || pName.includes('headphone') || pName.includes('dac')) {
      category = 'audio';
    } else if (sName.includes('style') || pName.includes('jacket') || pName.includes('shirt')) {
      category = 'apparel';
    } else {
      category = 'leathercraft';
    }
  }

  return {
    ...rawProduct,
    category,
    primaryImage: meta.primaryImage || FALLBACK_PRIMARY,
    secondaryImage: meta.secondaryImage || meta.primaryImage || FALLBACK_SECONDARY,
    gallery: meta.gallery || [meta.primaryImage || FALLBACK_PRIMARY, meta.secondaryImage || FALLBACK_SECONDARY],
    rating: meta.rating || 4.8,
    reviewsCount: meta.reviewsCount || 15,
    badge: meta.badge || 'Atelier Curation',
    variants: meta.variants || ['Standard Edition'],
    specs: meta.specs || {
      'Provenance': rawProduct.storeName || 'Atelier Flagship',
      'Location': rawProduct.city || 'India',
      'Inventory': `${rawProduct.stock} verified units in stock`
    }
  };
}
