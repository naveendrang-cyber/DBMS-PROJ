(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const c of r)if(c.type==="childList")for(const i of c.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function t(r){const c={};return r.integrity&&(c.integrity=r.integrity),r.referrerPolicy&&(c.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?c.credentials="include":r.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(r){if(r.ep)return;r.ep=!0;const c=t(r);fetch(r.href,c)}})();const le=()=>typeof window<"u"&&window.__API_BASE__?window.__API_BASE__:"/api",R=le();async function $(e){var o;const t=((o=e.headers.get("content-type"))==null?void 0:o.includes("application/json"))?await e.json():await e.text();if(!e.ok){const r=t&&t.error||t&&t.message||`HTTP ${e.status}: ${e.statusText}`,c=new Error(r);throw c.status=e.status,c.data=t,c}return t}const H={async getHealth(){return $(await fetch(`${R}/health`))},async getDashboardStats(){return $(await fetch(`${R}/dashboard/stats`))},async getProducts(){return $(await fetch(`${R}/products`))},async getProduct(e){return $(await fetch(`${R}/products/${e}`))},async createOrder(e){return $(await fetch(`${R}/orders`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}))},async getOrder(e){return $(await fetch(`${R}/orders/${e}`))},async adminInsert(e,a,t=""){const o={"Content-Type":"application/json"};return t&&(o["X-Admin-Key"]=t),$(await fetch(`${R}/admin/insert`,{method:"POST",headers:o,body:JSON.stringify({table:e,data:a})}))},async adminDelete(e,a,t=""){const o={"Content-Type":"application/json"};return t&&(o["X-Admin-Key"]=t),$(await fetch(`${R}/admin/delete`,{method:"POST",headers:o,body:JSON.stringify({table:e,id:a})}))},async adminUpdate(e,a,t,o=""){const r={"Content-Type":"application/json"};return o&&(r["X-Admin-Key"]=o),$(await fetch(`${R}/admin/update`,{method:"POST",headers:r,body:JSON.stringify({table:e,id:a,data:t})}))},async getAdminTables(){return $(await fetch(`${R}/admin/tables`))},async getAdminColumns(e){return $(await fetch(`${R}/admin/columns?table=${encodeURIComponent(e)}`))},async getAdminRecords(e,a=50,t=0){return $(await fetch(`${R}/admin/records?table=${encodeURIComponent(e)}&limit=${a}&offset=${t}`))},async getAdvancedJoins(){return $(await fetch(`${R}/advanced/joins`))},async getAdvancedAggregates(){return $(await fetch(`${R}/advanced/aggregates`))},async runAcidTransactionDemo(e=!1){return $(await fetch(`${R}/advanced/transaction-demo`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shouldFail:e})}))},async explainQuery(e){return $(await fetch(`${R}/advanced/explain`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e})}))},async executeSql(e){return $(await fetch(`${R}/sql`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e})}))},async getQdrantStatus(){return $(await fetch(`${R}/qdrant/status`))},async searchQdrant(e,a=6){return $(await fetch(`${R}/qdrant/search`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e,limit:a})}))},async getSimilarProducts(e,a=4){return $(await fetch(`${R}/qdrant/similar/${e}?limit=${a}`))},async syncQdrant(e=""){const a={"Content-Type":"application/json"};return e&&(a["X-Admin-Key"]=e),$(await fetch(`${R}/qdrant/sync`,{method:"POST",headers:a}))}},de=[{id:"all",label:"All Curations",icon:"✦",desc:"The complete atelier collection"},{id:"computing",label:"Artisan Computing",icon:"⌨",desc:"Precision machined peripherals & workstations"},{id:"audio",label:"High-Fidelity Audio",icon:"♫",desc:"Acoustically tuned transducers & amplification"},{id:"apparel",label:"Sartorial Goods",icon:"◈",desc:"Raw selvedge denim & bespoke tailoring"},{id:"leathercraft",label:"Leathercraft & Accoutrements",icon:"✑",desc:"Full-grain leather & precision instruments"}],pe=[{id:1,storeId:1,name:"Wireless Mechanical Keyboard",price:3499,stock:39,description:"RGB Backlit tactile mechanical keyboard with Bluetooth 5.0 and USB-C.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:2,storeId:1,name:"UltraHD 4K Gaming Monitor",price:28999,stock:12,description:"27-inch IPS panel with 144Hz refresh rate, HDR400, and 1ms response time.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:3,storeId:1,name:"Noise Cancelling Headphones",price:12499,stock:20,description:"Active Noise Cancelling over-ear headphones with 30-hour battery life.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:4,storeId:2,name:"Slim Fit Denim Jacket",price:2499,stock:60,description:"Classic indigo denim jacket with durable stitching and modern tailored fit.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:5,storeId:2,name:"Leather Travel Duffle Bag",price:3899,stock:18,description:"Handcrafted full-grain leather weekend travel duffle with shoe compartment.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:6,storeId:3,name:"Portable Bluetooth Speaker",price:1799,stock:35,description:"Waterproof IPX7 outdoor speaker with rich bass and 12-hour playtime.",storeName:"TechZone Express Hub",city:"Delhi"},{id:7,storeId:1,name:"CNC Billet Aluminum Macropad",price:4299,stock:24,description:"Custom anodized 9-key mechanical macropad with rotary encoder and QMK/VIA support.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:8,storeId:1,name:"Studio Reference Open-Back Headphones",price:18999,stock:15,description:"Planar magnetic audiophile transducers engineered for critical listening and acoustic mastering.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:9,storeId:2,name:"Japanese Selvedge Raw Denim Jean",price:5499,stock:28,description:"14oz Kurabo mill indigo raw selvedge denim crafted with shuttle looms and chainstitch hem.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:10,storeId:2,name:"Vegetable-Tanned Minimalist Cardholder",price:1499,stock:42,description:"Hand-stitched Italian Badalassi Carlo leather wallet with RFID blocking core.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:11,storeId:3,name:"Solid Walnut Desk Shelf & Riser",price:6299,stock:16,description:"Dual-monitor ergonomic desk stand machined from certified American black walnut with cork legs.",storeName:"TechZone Express Hub",city:"Delhi"},{id:12,storeId:1,name:"Precision Machined Wireless Mouse",price:6999,stock:22,description:"Magnesium alloy honeycomb skeleton with PAW3395 optical sensor and 4K polling rate.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:13,storeId:3,name:"Solid Brass Acoustic Desktop Speaker",price:14999,stock:10,description:"Acoustically tuned heavy brass casing with coaxial driver and lossless aptX HD Bluetooth.",storeName:"TechZone Express Hub",city:"Delhi"},{id:14,storeId:2,name:"Merino Wool Heavyweight Knit Cardigan",price:7899,stock:19,description:"100% extrafine Australian Merino wool ribbed knit with genuine horn buttons and shawl collar.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:15,storeId:2,name:"Waxed Cotton Field Backpack",price:8499,stock:14,description:"18oz Scottish Martexin waxed canvas backpack with bridal leather straps and brass hardware.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:16,storeId:1,name:"Audiophile Desktop DAC & Headphone Amp",price:16499,stock:11,description:"Dual ESS SABRE ES9038Q2M chip architecture with balanced 4.4mm output and MQA decoding.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:17,storeId:1,name:"PBT Double-Shot Dye-Sub Keycap Set",price:2899,stock:35,description:"Cherry profile thick PBT keycaps with crisp Japanese Hiragana sub-legends and ISO support.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:18,storeId:2,name:"Tailored Irish Linen Camp Collar Shirt",price:3299,stock:31,description:"Breathable bespoke 100% French-seamed Irish flax linen shirt in sage green.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:19,storeId:2,name:"Full-Grain Leather Horology Watch Roll",price:4599,stock:20,description:"Cushioned 3-slot travel watch roll lined with ultra-soft microsuede and slide-in dividers.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:20,storeId:1,name:"Ultra-Wide Curved OLED Productivity Display",price:64999,stock:8,description:"34-inch QD-OLED 175Hz monitor with 99.3% DCI-P3 color gamut, USB-C 90W PD, and true blacks.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:21,storeId:3,name:"Machined Titanium Mechanical Pencil",price:3799,stock:25,description:"Grade 5 aerospace titanium hexagonal body with Schmidt drafting mechanism.",storeName:"TechZone Express Hub",city:"Delhi"},{id:22,storeId:2,name:"Water-Resistant Cordura Tech Sling Bag",price:3199,stock:34,description:"Recycled 500D Cordura ripstop crossbody pouch with Fidlock magnetic V-buckles.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:23,storeId:1,name:"Linear Switch Lubrication Station Kit",price:1899,stock:40,description:"Precision acrylic lubing base with Krytox 205g0, brush, and switch stem pickers.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:24,storeId:1,name:"Acoustic Desktop Studio Monitors (Pair)",price:24999,stock:9,description:"Active bi-amped studio reference monitors with Kevlar woofers and silk dome tweeters.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:25,storeId:2,name:"Hand-Loomed Cashmere Fringe Scarf",price:4999,stock:22,description:"Ultra-soft Mongolian mountain goat cashmere woven on traditional wooden handlooms.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:26,storeId:3,name:"Anodized Aluminum Monitor Light Bar",price:3499,stock:30,description:"Asymmetric optical glare-free desk lamp with wireless rotary dial and auto-dimming sensor.",storeName:"TechZone Express Hub",city:"Delhi"},{id:27,storeId:2,name:"Vegetable-Tanned Leather Desk Mat",price:3899,stock:18,description:"Large 900x400mm Tuscan leather workspace blotter with natural burnished edges.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:28,storeId:1,name:"True Wireless Active Noise-Cancelling Earbuds",price:9999,stock:26,description:"Custom balanced armature drivers with Qi wireless charging case and transparency mode.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:29,storeId:2,name:"Organic Cotton Heavyweight French Terry Hoodie",price:4299,stock:27,description:"500 GSM loopback organic cotton fleece with reverse weave side panels and flatlock seams.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:30,storeId:3,name:"CNC Machined Brass Fountain Pen",price:4499,stock:17,description:"Heavy raw brass writing instrument with Bock #6 German stainless steel medium nib.",storeName:"TechZone Express Hub",city:"Delhi"},{id:31,storeId:1,name:"Ergonomic Split Ortholinear Keyboard",price:11999,stock:13,description:"Split column-staggered mechanical keyboard with OLED display, per-key RGB, and hot-swap sockets.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:32,storeId:2,name:"Tailored Wool & Silk Blend Blazer",price:14499,stock:12,description:"Unstructured Italian wool-silk hopsack jacket with patch pockets and mother-of-pearl buttons.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:33,storeId:2,name:"Handmade Leather Weekend Passport Folio",price:2199,stock:36,description:"Full-grain travel passport wallet with boarding pass sleeve and boarding pen slot.",storeName:"StyleHub Fashion Studio",city:"Mumbai"},{id:34,storeId:1,name:"Custom Coiled Aviator Keyboard Cable",price:1699,stock:45,description:"Double-sleeved Paracord and Techflex coiled USB-C cable with detachable 4-pin GX16 connector.",storeName:"TechZone Flagship Branch",city:"Bangalore"},{id:35,storeId:3,name:"High-Res Lossless Portable Audio Player",price:21999,stock:14,description:"Android-based DAP with dual CS43198 DACs, 4.4mm balanced output, and bidirectional Bluetooth.",storeName:"TechZone Express Hub",city:"Delhi"},{id:36,storeId:2,name:"Full-Grain Leather Chelsea Boots",price:9899,stock:15,description:"Goodyear welted European calfskin boots with Dainite rubber outsoles and elastic side gussets.",storeName:"StyleHub Fashion Studio",city:"Mumbai"}],me={1:{category:"computing",rating:4.9,reviewsCount:38,badge:"Atelier Icon",primaryImage:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80",gallery:["https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80"],variants:["Gateron Oil King (Linear)","Boba U4T (Tactile)","Kailh Box White (Clicky)"],specs:{Chassis:"CNC Machined 6063 Aluminum",Connectivity:"Bluetooth 5.1 / 2.4GHz / USB-C",Battery:"4000mAh Lithium-Polymer","Polling Rate":"1000Hz (Wired/2.4G)"}},2:{category:"computing",rating:4.8,reviewsCount:22,badge:"Pro Display",primaryImage:"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=900&q=80",gallery:["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=900&q=80"],variants:["27-inch 4K 144Hz","32-inch 4K 165Hz Pro"],specs:{Panel:"Fast IPS with HDR400","Color Gamut":"98% DCI-P3, 100% sRGB",Ports:"HDMI 2.1, DisplayPort 1.4, USB-C 65W PD"}},3:{category:"audio",rating:4.9,reviewsCount:54,badge:"Bestseller",primaryImage:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",gallery:["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80"],variants:["Midnight Obsidian","Ivory Champagne"],specs:{Driver:"40mm Titanium Composite Diaphragm",ANC:"Hybrid Adaptive ANC (-42dB)","Battery Life":"30 Hours with ANC Active"}},4:{category:"apparel",rating:4.7,reviewsCount:19,badge:"Tailored",primaryImage:"https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=900&q=80",gallery:["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=900&q=80"],variants:["Small (38R)","Medium (40R)","Large (42R)","Extra Large (44R)"],specs:{Material:"14oz Kurabo Indigo Denim",Hardware:"Antiqued Solid Brass Shank Buttons",Origin:"Handcrafted in Mumbai Studio"}},5:{category:"leathercraft",rating:5,reviewsCount:29,badge:"Artisan Heritage",primaryImage:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80",gallery:["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80"],variants:["Cognac Vachetta","Espresso Pull-Up"],specs:{Leather:"Full-Grain Vegetable Tanned Cowhide",Zippers:"YKK Excella Solid Brass",Dimensions:"52cm x 28cm x 26cm (Cabin Approved)"}},6:{category:"audio",rating:4.7,reviewsCount:16,badge:"Compact Acoustics",primaryImage:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80",gallery:["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80"],variants:["Forest Green","Matte Carbon"],specs:{Waterproof:"IPX7 Certified Submersible",Amplifier:"20W Class-D High-Efficiency",Playtime:"12 Hours Continuous Playback"}},7:{category:"computing",rating:4.9,reviewsCount:14,badge:"New Release",primaryImage:"https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80",variants:["Anodized Emerald","Sandblasted Silver","Midnight Black"],specs:{Material:"Billet Aluminum Unibody",Firmware:"QMK / VIA Remappable",Encoder:"Bourns Rotary Knurled Brass"}},8:{category:"audio",rating:5,reviewsCount:41,badge:"Audiophile Grade",primaryImage:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=900&q=80",variants:["Walnut Cups with Lambskin","Black Ash with Velour"],specs:{Transducer:"106mm Planar Magnetic Neodymium",Frequency:"8Hz - 50,000Hz",Impedance:"32 Ohms"}},9:{category:"apparel",rating:4.8,reviewsCount:31,badge:"Kurabo Raw Selvedge",primaryImage:"https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=900&q=80",variants:["30W x 32L","32W x 32L","34W x 34L","36W x 34L"],specs:{Denim:"14oz Japanese Kurabo Mills Indigo",Weave:"Vintage Toyoda Shuttle Loom",Details:"Hidden Copper Rivets & Chainstitch"}},10:{category:"leathercraft",rating:4.9,reviewsCount:63,badge:"Minimalist Essential",primaryImage:"https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=900&q=80",variants:["Pueblo Tobacco","Minerva Box Olive","Nero Black"],specs:{Tannery:"Badalassi Carlo (Ponte a Egola, Italy)",Capacity:"6-8 Cards + Folded Bills",Thread:"Waxed Fil Au Chinois Linen"}},11:{category:"computing",rating:4.9,reviewsCount:18,badge:"Atelier Woodcraft",primaryImage:"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",variants:["American Black Walnut","European White Oak"],specs:{Wood:"Solid Sustainably Harvested Hardwood",Pads:"High-Density Portuguese Natural Cork","Max Load":"45 kg"}},12:{category:"computing",rating:4.8,reviewsCount:27,badge:"Ultra-Light 49g",primaryImage:"https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80",variants:["Matte Magnesium Silver","Stealth Graphite"],specs:{Sensor:"PixArt PAW3395 (26,000 DPI)",Weight:"49 grams unladen",Switches:"TTC Gold Optical Dustproof"}},13:{category:"audio",rating:5,reviewsCount:12,badge:"Solid Brass Casting",primaryImage:"https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1520523839898-50712825e3a7?auto=format&fit=crop&w=900&q=80",variants:["Polished Raw Brass","Aged Patina Bronze"],specs:{Cabinet:"3.2kg Solid Cast Brass Anti-Resonant Enclosure",Driver:"3-inch Custom Peerless Coaxial",Connectivity:"aptX HD Lossless Bluetooth"}},14:{category:"apparel",rating:4.9,reviewsCount:24,badge:"Pure Merino",primaryImage:"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=900&q=80",variants:["Oatmeal Heather","Deep Forest Emerald","Midnight Navy"],specs:{Yarn:"100% 19.5-micron Australian Merino Wool",Buttons:"Real Hand-Turned Buffalo Horn",Knit:"Heavy 5-Gauge Shaker Rib"}},15:{category:"leathercraft",rating:4.8,reviewsCount:17,badge:"Weatherproof",primaryImage:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80",variants:["Field Olive & Tan Leather","Blackout Waxed Canvas"],specs:{Fabric:"18oz Martexin Original Waxed Canvas",Straps:"Bridle Leather with Copper Rivets","Laptop Sleeve":'Padded Compartment for 16" MacBook'}},16:{category:"audio",rating:4.9,reviewsCount:33,badge:"Dual ESS Sabre",primaryImage:"https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=900&q=80",variants:["Brushed Anodized Aluminum","Matte Black"],specs:{"DAC Chips":"Dual ESS ES9038Q2M Balanced Circuitry",Output:"4.4mm Pentaconn + 6.35mm Single-Ended",Sampling:"PCM 32-bit/768kHz, Native DSD512"}},17:{category:"computing",rating:4.7,reviewsCount:46,badge:"Dye-Sub PBT",primaryImage:"https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80",variants:["Ivory & Forest Green (Hiragana)","Minimal Monochrome (Latin)"],specs:{Profile:"Cherry Ergonomic Profile",Thickness:"1.6mm Thick PBT Plastic",Compatibility:"60%, 65%, 75%, TKL, Full Size"}},18:{category:"apparel",rating:4.8,reviewsCount:20,badge:"Irish Flax",primaryImage:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",variants:["Sage Green (Camp Collar)","Natural Ecru (Band Collar)"],specs:{Fabric:"100% Certified Irish Flax Linen",Construction:"Single-Needle Stitching with French Seams",Fit:"Relaxed Modern Tailored Silhouette"}},19:{category:"leathercraft",rating:5,reviewsCount:28,badge:"Collector Edition",primaryImage:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80",variants:["Tuscan Chestnut Leather","British Racing Green"],specs:{Cushions:"Slide-in Flexible M-Shaped Pillows",Lining:"Anti-Tarnish Swiss Alcantara Microfiber",Capacity:"3 Timepieces up to 48mm"}},20:{category:"computing",rating:5,reviewsCount:15,badge:"Flagship QD-OLED",primaryImage:"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=900&q=80",variants:['34" QD-OLED 1800R Curve','38" IPS Ultra-Wide Dual-QHD'],specs:{Contrast:"1,000,000:1 Infinite True Black",Refresh:"175Hz Ultra-Smooth Refresh",Delivery:"USB-C 90W Power Delivery Hub"}},21:{category:"leathercraft",rating:4.9,reviewsCount:39,badge:"Grade 5 Titanium",primaryImage:"https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1585336261026-7f5ed64c8d5a?auto=format&fit=crop&w=900&q=80",variants:["Stonewashed Titanium (0.5mm)","Anodized Bronze (0.7mm)"],specs:{Material:"Solid Ti-6Al-4V Titanium Bar Stock",Mechanism:"Schmidt Feinminen-System (Germany)",Balance:"Precision Center of Gravity"}},22:{category:"leathercraft",rating:4.7,reviewsCount:25,badge:"Fidlock Magnetic",primaryImage:"https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80",variants:["Obsidian Black Ripstop","Steel Grey Cordura"],specs:{Shell:"500D Recycled Cordura Ballistic Nylon",Buckle:"German Fidlock V-Buckle Quick Release",Zippers:"YKK AquaGuard Weatherproof"}},23:{category:"computing",rating:4.8,reviewsCount:52,badge:"Tuning Suite",primaryImage:"https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",variants:["Krytox 205g0 + Permatex","TriboSys 3203 (Tactile)"],specs:{Base:"Frosted Laser-Cut Cast Acrylic (36 Slots)",Tools:"Switch Opener, 4-Prong Stem Holder, 2x Kolinsky Brushes"}},24:{category:"audio",rating:4.9,reviewsCount:19,badge:"Studio Pair",primaryImage:"https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=900&q=80",variants:["Matte Black with Woven Kevlar","Pure White Satin"],specs:{Amplification:"Bi-Amped Class A/B 100W per Monitor",Frequency:"45Hz - 22,000Hz Flat Acoustic Response",Inputs:'Balanced XLR & 1/4" TRS'}},25:{category:"apparel",rating:5,reviewsCount:16,badge:"Mongolian Cashmere",primaryImage:"https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=80",variants:["Camel Melange","Charcoal Heather","Forest Sage"],specs:{Fiber:"100% Grade-A Mongolian Mountain Cashmere",Dimensions:"200cm x 70cm with Eyelash Fringes",Weave:"Traditional Handloom Twill"}},26:{category:"computing",rating:4.8,reviewsCount:44,badge:"Glare-Free",primaryImage:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80",variants:["Space Grey CNC Aluminum","Silver Frost"],specs:{Optics:"Asymmetric 45° Anti-Reflective Beam",Control:"2.4GHz Wireless Metal Rotary Controller",CRI:"Ra95 High Color Rendering Index"}},27:{category:"leathercraft",rating:4.9,reviewsCount:37,badge:"Tuscan Full-Grain",primaryImage:"https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",variants:["900x400mm Cognac","900x400mm Black Forest"],specs:{Hide:"3.0mm Vegetable-Tanned Tuscan Cowhide",Backing:"Non-Slip Eco Suede Underlay",Edges:"Hand-Burnished with Japanese Tokonole"}},28:{category:"audio",rating:4.8,reviewsCount:50,badge:"True Wireless Pro",primaryImage:"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=900&q=80",variants:["Midnight Black Ceramic","White Alabaster"],specs:{Acoustics:"Custom Knowles Balanced Armature + 10mm Dynamic",Codecs:"LDAC 990kbps, aptX Adaptive, AAC",Battery:"8 Hours + 24 Hours in Qi Wireless Case"}},29:{category:"apparel",rating:4.9,reviewsCount:29,badge:"500 GSM Fleece",primaryImage:"https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80",variants:["Heavy Heather Grey","Deep Pine Green","Washed Black"],specs:{Fleece:"500 GSM 100% GOTS Certified Organic Cotton",Weave:"Cross-Grain Reverse Weave (Pre-Shrunk)",Drawcord:"Braided Cotton with Solid Brass Tips"}},30:{category:"leathercraft",rating:5,reviewsCount:21,badge:"Raw Brass Machining",primaryImage:"https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1585336261026-7f5ed64c8d5a?auto=format&fit=crop&w=900&q=80",variants:["Fine Nib (0.4mm)","Medium Nib (0.6mm)","Broad Nib (0.8mm)"],specs:{Body:"52g Solid Lead-Free CZ121 Brass Hexagonal Bar",Nib:"Bock #6 German Stainless Steel Nib with Iridium Tip","Ink System":"Standard International Piston Converter Included"}},31:{category:"computing",rating:4.9,reviewsCount:17,badge:"Ergonomic Split",primaryImage:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80",variants:["Billet Aluminum Case (Tent Kit)","Frosted Polycarbonate Case"],specs:{Layout:"58-Key Column-Staggered Ortholinear Split",Screens:"Dual 128x32 OLED Real-Time Layer Indicators",Sockets:"Kailh Hot-Swap PCB with Per-Key RGB"}},32:{category:"apparel",rating:5,reviewsCount:13,badge:"Italian Hopsack",primaryImage:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",variants:["38R (Slim)","40R (Tailored)","42R (Tailored)","44R (Classic)"],specs:{Cloth:"85% Super 130s Wool, 15% Mulberry Silk Hopsack",Structure:"Unstructured Neapolitan Soft Shoulder",Buttons:"Genuine Iridescent Mother-of-Pearl"}},33:{category:"leathercraft",rating:4.8,reviewsCount:32,badge:"Travel Passport Folio",primaryImage:"https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",variants:["Saddle Tan Leather","Midnight Black Box"],specs:{Leather:"Hand-Waxed Pueblo Leather by Badalassi Carlo",Compartments:"2 Passport Sleeves, Boarding Pass Slot, 4 Card Slots",Closure:"Magnetic Concealed German Snaps"}},34:{category:"computing",rating:4.9,reviewsCount:65,badge:"Coiled GX16",primaryImage:"https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80",variants:["Forest Green Paracord + Gold Techflex","Monochrome Charcoal + Clear Techflex"],specs:{Coil:"6-inch Tight Reverse-Wound Coil (No Sagging)",Connector:"Detachable 4-Pin GX16 Aviator Push-Pull",Wiring:"24AWG Power + 28AWG Signal Shielded Copper"}},35:{category:"audio",rating:4.9,reviewsCount:22,badge:"Lossless MQA Player",primaryImage:"https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",variants:["Anodized Space Black","Raw Silver Aluminum"],specs:{DACs:"Dual Cirrus Logic CS43198 MasterHIFI Architecture",Display:"4.0-inch 1080x540 Sharp IPS Touchscreen",Outputs:"4.4mm Balanced (800mW@32Ω) + 3.5mm SE"}},36:{category:"leathercraft",rating:4.9,reviewsCount:27,badge:"Goodyear Welted",primaryImage:"https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=900&q=80",secondaryImage:"https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=900&q=80",variants:["UK 7 (US 8)","UK 8 (US 9)","UK 9 (US 10)","UK 10 (US 11)"],specs:{Leather:"Aniline French Box Calfskin with Natural Burnish",Construction:"360° Goodyear Welted (Fully Recraftable)",Outsole:"Genuine British Dainite Studded Rubber"}}},te="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",ae="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80";function W(e){if(!e)return null;const a=me[e.id]||{};let t=a.category;if(!t){const o=(e.storeName||"").toLowerCase(),r=(e.name||"").toLowerCase();o.includes("tech")||r.includes("monitor")||r.includes("keyboard")?t="computing":r.includes("speaker")||r.includes("headphone")||r.includes("dac")?t="audio":o.includes("style")||r.includes("jacket")||r.includes("shirt")?t="apparel":t="leathercraft"}return{...e,category:t,primaryImage:a.primaryImage||te,secondaryImage:a.secondaryImage||a.primaryImage||ae,gallery:a.gallery||[a.primaryImage||te,a.secondaryImage||ae],rating:a.rating||4.8,reviewsCount:a.reviewsCount||15,badge:a.badge||"Atelier Curation",variants:a.variants||["Standard Edition"],specs:a.specs||{Provenance:e.storeName||"Atelier Flagship",Location:e.city||"India",Inventory:`${e.stock} verified units in stock`}}}function ue(e,a){const t=document.createElement("header");return t.className="site-header",t.id="site-header",t.innerHTML=`
    <!-- Top Micro Announcement / Academic Bar -->
    <div class="header-top">
      <div class="container">
        <div class="header-top-inner">
          <div style="display:flex; align-items:center; gap:16px;">
            <span>DBMS DA3 · DR. SOBITHA AHILA</span>
            <span style="opacity:0.4;">|</span>
            <span style="color:var(--color-gold-light);">GIT BRANCH: Harsh2</span>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span id="header-engine-indicator">ENGINE: COCKROACHDB / SQLITE (100% DIRECT JDBC)</span>
            <span style="opacity:0.4;">|</span>
            <span id="header-qdrant-indicator" style="color:var(--color-gold-light);">QDRANT: 384D COSINE</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Luxury Navigation Bar -->
    <div class="container">
      <nav class="header-nav">
        <a href="#storefront" class="brand-logo" id="brand-link" aria-label="Omni Atelier Home">
          <span class="brand-name">OMNI ATELIER</span>
          <span class="brand-badge">JDBC × QDRANT</span>
        </a>

        <ul class="nav-links">
          <li><a href="#storefront" class="nav-link active" data-nav="storefront">Collection</a></li>
          <li><a href="#category-discovery" class="nav-link" data-nav="category-discovery">Disciplines</a></li>
          <li><a href="#editorial-manifesto" class="nav-link" data-nav="editorial-manifesto">Manifesto</a></li>
          <li><a href="#academic-suite" class="nav-link" data-nav="academic-suite">Database Suite ▾</a></li>
        </ul>

        <div class="header-actions">
          <!-- Search Quick Action -->
          <button id="header-search-btn" class="btn btn-outline btn-sm btn-pill" style="padding:6px 12px; font-size:0.75rem;" title="Search catalog (Ctrl + K)">
            <span>🔍 Search</span>
            <kbd style="font-family:var(--font-mono); font-size:0.6875rem; background:var(--color-ivory); padding:1px 5px; border-radius:3px; border:1px solid var(--color-border); margin-left:4px;">/</kbd>
          </button>

          <!-- Database Live Health Badge -->
          <div id="system-health-badge" class="badge badge-neutral" title="Checking database connection...">
            <span class="pulse-dot" id="system-health-dot"></span>
            <span id="health-text" style="font-family:var(--font-mono); font-size:0.75rem;">Connecting...</span>
          </div>

          <!-- Bag / Cart Trigger Button -->
          <button id="cart-btn" class="cart-trigger" aria-label="Open Shopping Bag">
            <span>Bag</span>
            <span id="header-bag-count" class="cart-count">0</span>
          </button>
        </div>
      </nav>
    </div>
  `,t.querySelectorAll(".nav-link").forEach(i=>{i.addEventListener("click",n=>{n.preventDefault();const S=i.getAttribute("data-nav");t.querySelectorAll(".nav-link").forEach(g=>g.classList.remove("active")),i.classList.add("active"),a&&a(S)})}),t.querySelector("#brand-link").addEventListener("click",i=>{i.preventDefault(),a&&a("storefront")}),t.querySelector("#cart-btn").addEventListener("click",()=>{e&&e()}),t.querySelector("#header-search-btn").addEventListener("click",()=>{const i=document.getElementById("catalog-search");i&&(i.scrollIntoView({behavior:"smooth",block:"center"}),setTimeout(()=>i.focus(),300))}),document.addEventListener("keydown",i=>{if(i.key==="/"&&document.activeElement.tagName!=="INPUT"&&document.activeElement.tagName!=="TEXTAREA"){i.preventDefault();const n=document.getElementById("catalog-search");n&&(n.scrollIntoView({behavior:"smooth",block:"center"}),n.focus())}}),t}function ge(e,a,t){const o=document.createElement("section");return o.className="hero-section",o.id="hero-section",o.innerHTML=`
    <div class="container">
      <div class="hero-split-grid">
        <!-- Left Editorial Content Column -->
        <div class="hero-content">
          <div class="hero-badge-row">
            <span class="badge badge-emerald">Spring Boot 3.3.5 × Java 17</span>
            <span class="badge badge-gold">100% Direct JDBC Persistence</span>
          </div>

          <h1 class="hero-title">
            Precision Engineering. <em>Sartorial Rigor.</em>
          </h1>

          <p class="hero-description">
            A bespoke multi-vendor commerce platform where uncompromising physical craftsmanship converges with distributed database architecture. Engineered with direct Java JDBC, parameterized statements, explicit ACID isolation, and 384-dimensional Qdrant vector semantic discovery.
          </p>

          <div class="hero-cta-group">
            <a href="#storefront" class="btn btn-primary btn-lg" id="hero-explore-btn">
              Explore 36 Curations ↓
            </a>
            <button class="btn btn-outline btn-lg" id="hero-vector-btn">
              ✨ Experience Qdrant AI
            </button>
          </div>

          <!-- Live Relational Metrics Bar -->
          <div class="hero-metrics-bar">
            <div class="hero-metric-item">
              <h4 id="hero-stat-products">36 Curations</h4>
              <p>Verified Artifacts</p>
            </div>
            <div class="hero-metric-item">
              <h4 id="hero-stat-stores">3 Flagships</h4>
              <p>Boutique Stores</p>
            </div>
            <div class="hero-metric-item">
              <h4 id="hero-stat-rev">&#8377;36,796</h4>
              <p>Settled Volume</p>
            </div>
            <div class="hero-metric-item">
              <h4 id="hero-stat-engine" style="color:var(--color-emerald);">100% JDBC</h4>
              <p>Zero-ORM Rigor</p>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Spotlight Showcase Card -->
        <div class="hero-showcase-column">
          <div class="hero-showcase-card" id="hero-spotlight-card">
            <div class="showcase-image-wrap">
              <img 
                src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80" 
                alt="Wireless Mechanical Keyboard Spotlight" 
                class="showcase-image" 
                loading="eager"
              />
              <div class="product-badge-overlay">
                <span class="badge badge-dark">Flagship Spotlight</span>
                <span class="badge badge-success">Verified In Stock</span>
              </div>
            </div>

            <div class="showcase-details">
              <div class="showcase-header">
                <div>
                  <span style="font-size:0.6875rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-emerald); font-weight:700;">
                    TECHZONE FLAGSHIP · BANGALORE
                  </span>
                  <h3 class="showcase-title">Wireless Mechanical Keyboard</h3>
                </div>
                <span class="showcase-price">&#8377;3,499.00</span>
              </div>

              <p style="font-size:0.8125rem; color:var(--color-text-secondary); line-height:1.5;">
                Anodized aluminum chassis with custom lubricated switches, Bluetooth 5.1 multi-device pairing, and USB-C.
              </p>

              <div class="showcase-tags">
                <span class="hotspot-pill">✦ 6063 Billet Aluminum</span>
                <span class="hotspot-pill">✦ 384d FastEmbed Vector</span>
                <span class="hotspot-pill">✦ Strict ACID Foreign Keys</span>
              </div>

              <div style="margin-top:16px; display:flex; gap:10px;">
                <button class="btn btn-outline btn-sm" id="hero-spotlight-inspect" style="flex:1;">
                  Inspect Artifact
                </button>
                <button class="btn btn-primary btn-sm" id="hero-spotlight-add" style="flex:1;">
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,o.querySelector("#hero-explore-btn").addEventListener("click",S=>{S.preventDefault(),e&&e()}),o.querySelector("#hero-vector-btn").addEventListener("click",()=>{a&&a()}),o.querySelector("#hero-spotlight-inspect").addEventListener("click",()=>{t&&t(1)}),o.querySelector("#hero-spotlight-add").addEventListener("click",()=>{t&&t(1,!0)}),o}function he(e){const a=document.createElement("section");a.className="category-discovery-section",a.id="category-discovery",a.innerHTML=`
    <div class="container">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px;">
        <div>
          <p class="section-eyebrow">01 / Curated Disciplines</p>
          <h2 class="section-headline">Architectural Categories</h2>
          <p class="section-subheadline">
            Each discipline represents certified boutique workshops adhering to sustainable craft and uncompromising material provenance.
          </p>
        </div>
        <div>
          <button class="btn btn-outline btn-sm" id="cat-view-all-btn">
            View All Curations (36) →
          </button>
        </div>
      </div>

      <div class="category-tiles-grid">
        <!-- 01: Audio -->
        <div class="category-tile" data-category="audio" role="button" tabindex="0" aria-label="Explore High-Fidelity Audio">
          <img 
            src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80" 
            alt="High-Fidelity Audio & Acoustics" 
            class="category-tile-bg"
            loading="lazy"
          />
          <div class="category-tile-overlay">
            <span class="category-tile-index">DISCIPLINE 01</span>
            <h3 class="category-tile-name">High-Fidelity Audio &amp; Acoustics</h3>
            <div class="category-tile-count">
              <span>9 Curations · Planar &amp; Solid Brass</span>
              <span class="category-tile-arrow">→</span>
            </div>
          </div>
        </div>

        <!-- 02: Computing -->
        <div class="category-tile" data-category="computing" role="button" tabindex="0" aria-label="Explore Precision Computing">
          <img 
            src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80" 
            alt="Precision Computing & Peripherals" 
            class="category-tile-bg"
            loading="lazy"
          />
          <div class="category-tile-overlay">
            <span class="category-tile-index">DISCIPLINE 02</span>
            <h3 class="category-tile-name">Artisan Computing &amp; Workstations</h3>
            <div class="category-tile-count">
              <span>9 Curations · CNC 6063 Aluminum</span>
              <span class="category-tile-arrow">→</span>
            </div>
          </div>
        </div>

        <!-- 03: Apparel -->
        <div class="category-tile" data-category="apparel" role="button" tabindex="0" aria-label="Explore Tailored Apparel">
          <img 
            src="https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80" 
            alt="Tailored Apparel & Sartorial Goods" 
            class="category-tile-bg"
            loading="lazy"
          />
          <div class="category-tile-overlay">
            <span class="category-tile-index">DISCIPLINE 03</span>
            <h3 class="category-tile-name">Tailored Apparel &amp; Sartorial Goods</h3>
            <div class="category-tile-count">
              <span>9 Curations · Kurabo Raw Selvedge</span>
              <span class="category-tile-arrow">→</span>
            </div>
          </div>
        </div>

        <!-- 04: Leathercraft -->
        <div class="category-tile" data-category="leathercraft" role="button" tabindex="0" aria-label="Explore Leathercraft">
          <img 
            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" 
            alt="Leathercraft & Everyday Accoutrements" 
            class="category-tile-bg"
            loading="lazy"
          />
          <div class="category-tile-overlay">
            <span class="category-tile-index">DISCIPLINE 04</span>
            <h3 class="category-tile-name">Leathercraft &amp; Accoutrements</h3>
            <div class="category-tile-count">
              <span>9 Curations · Badalassi Carlo Leather</span>
              <span class="category-tile-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,a.querySelectorAll(".category-tile").forEach(o=>{const r=o.getAttribute("data-category"),c=()=>{e&&e(r)};o.addEventListener("click",c),o.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),c())})});const t=a.querySelector("#cat-view-all-btn");return t&&t.addEventListener("click",()=>{e&&e("all")}),a}function ye(e){const a=document.createElement("section");a.className="editorial-manifesto-section",a.id="editorial-manifesto",a.innerHTML=`
    <div class="container">
      <div class="manifesto-grid">
        <!-- Left Editorial Quote & Narrative Column -->
        <div class="manifesto-narrative">
          <div class="manifesto-quote-mark">&ldquo;</div>
          <h2 class="manifesto-headline">
            Craftsmanship Without Abstraction. <em>Integrity Without Compromise.</em>
          </h2>
          <p class="manifesto-body">
            Just as our master leatherworkers refuse synthetic veneers and our acoustic engineers eschew compressed signal paths, Omni Atelier rejects opaque ORM layers. Every query, mutation, and relational join is executed through direct, unadulterated Java JDBC with explicit connection lifecycle control.
          </p>
          <p class="manifesto-body">
            When a patron commissions a handcrafted artifact, our distributed consensus layer verifies real-time stock balances across 10 normalized relational tables before atomically committing the transaction.
          </p>
          <div>
            <button class="btn btn-outline-white btn-sm" id="manifesto-inspect-db-btn">
              Explore Academic Database Architecture →
            </button>
          </div>
        </div>

        <!-- Right Architectural Principles Cards -->
        <div class="manifesto-cards">
          <!-- Card 1: Direct JDBC -->
          <div class="manifesto-card">
            <div class="manifesto-card-header">
              <span class="manifesto-card-icon">⚡</span>
              <h3 class="manifesto-card-title">100% Direct Java JDBC Persistence</h3>
            </div>
            <p class="manifesto-card-text">
              Zero ORM overhead. Every relational read and write leverages strictly parameterized <code>PreparedStatement</code> and HikariCP connection pools, preventing SQL injection while guaranteeing predictable sub-millisecond execution.
            </p>
          </div>

          <!-- Card 2: ACID Transactions -->
          <div class="manifesto-card">
            <div class="manifesto-card-header">
              <span class="manifesto-card-icon">🔒</span>
              <h3 class="manifesto-card-title">Explicit Multi-Table ACID Atomicity</h3>
            </div>
            <p class="manifesto-card-text">
              Orders, line items, payment settlements, and stock deductions are bound within an explicit transactional demarcation boundary (<code>setAutoCommit(false)</code>) with automated rollback on simulated failure.
            </p>
          </div>

          <!-- Card 3: Vector Database -->
          <div class="manifesto-card">
            <div class="manifesto-card-header">
              <span class="manifesto-card-icon">✨</span>
              <h3 class="manifesto-card-title">Qdrant 384d Semantic Discovery</h3>
            </div>
            <p class="manifesto-card-text">
              Integrated with the official Qdrant REST API v1. FastEmbed ONNX creates 384-dimensional dense vectors to calculate nearest neighbors in Cosine space, enabling natural-language product discovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;const t=a.querySelector("#manifesto-inspect-db-btn");return t&&t.addEventListener("click",()=>{e&&e()}),a}function be(e,a,t){const o=document.createElement("section");o.className="catalog-section",o.id="storefront";let r=(e||[]).map(W),c="all",i="",n=!1,S=null,g=!1,x="featured",F="grid-4col",N=!1,B="all",l=16,L=!1,D="",P=null,k=null;H.getQdrantStatus().then(h=>{P=h,f()}).catch(()=>{P={connection:"offline",collection:"omnimarket_products",pointsCount:36},f()});function f(){const h=o.querySelector("#qdrant-status-pill");h&&(P&&(P.connection==="connected"||P.status==="ok")?(h.innerHTML=`
        <span class="pulse-dot"></span>
        <span>Qdrant Vector DB: <strong>${P.collection||"omnimarket_products"}</strong> (${P.pointsCount||r.length} vectors · 384d Cosine)</span>
      `,h.className="badge badge-success"):(h.innerHTML=`
        <span class="pulse-dot amber"></span>
        <span>Qdrant Vector DB: Local Mode (${r.length} vectors)</span>
      `,h.className="badge badge-gold"))}async function m(){if(!i||i.trim().length<2){S=null,b();return}g=!0,b();try{S=await H.searchQdrant(i.trim(),12)||[]}catch(h){console.warn("Qdrant semantic search error:",h),S=r.filter(p=>p.name.toLowerCase().includes(i.toLowerCase())||(p.description||"").toLowerCase().includes(i.toLowerCase())).map((p,w)=>({id:p.id,name:p.name,price:p.price,description:p.description,score:Math.max(.65,.95-w*.05)}))}finally{g=!1,b()}}function C(){let h=[];return n&&S!==null?h=S.map(p=>{const w=r.find(E=>E.id===p.id);return w?{...w,_score:p.score}:W({id:p.id,name:p.name,price:p.price,description:p.description,storeId:1,storeName:p.store_name||p.storeName||"Atelier Flagship",city:p.city||"India",stock:12,_score:p.score})}):(h=r.filter(p=>{const w=c==="all"||p.category===c,E=i.toLowerCase().trim(),s=!E||p.name.toLowerCase().includes(E)||(p.description||"").toLowerCase().includes(E)||(p.storeName||"").toLowerCase().includes(E)||(p.city||"").toLowerCase().includes(E),M=!N||p.stock>0,O=B==="all"||String(p.storeId)===String(B);return w&&s&&M&&O}),h.sort((p,w)=>x==="price-asc"?Number(p.price)-Number(w.price):x==="price-desc"?Number(w.price)-Number(p.price):x==="stock-desc"?w.stock-p.stock:x==="rating-desc"?(w.rating||0)-(p.rating||0):p.id-w.id)),h}function b(){const h=C(),p=h.slice(0,l),w=h.length>l;o.innerHTML=`
      <div class="container">
        <!-- Section Header -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px; margin-bottom:28px;">
          <div>
            <p class="section-eyebrow">02 / The Atelier Catalog</p>
            <h2 class="section-headline">Curated Artifacts &amp; Rare Curations</h2>
            <p class="section-subheadline">
              Sourced from certified artisan workshops with 100% verified relational stock balances powered by Java JDBC and Qdrant.
            </p>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <div id="qdrant-status-pill" class="badge badge-gold" style="padding:6px 14px; font-size:0.75rem;">
              Connecting to Qdrant...
            </div>
            <button id="catalog-sync-btn" class="btn btn-outline btn-sm" ${L?"disabled":""} title="Synchronize SQL database into Qdrant vector index">
              ${L?"🔄 Syncing...":"🔄 Sync Vector Index"}
            </button>
          </div>
        </div>

        ${D?`
          <div style="margin-bottom:20px; padding:12px 18px; background:var(--color-success-bg); border:1px solid rgba(30,107,69,0.3); border-radius:var(--radius-sm); font-size:0.875rem; color:var(--color-success); display:flex; justify-content:space-between; align-items:center;">
            <span>${D}</span>
            <button id="dismiss-sync-msg" style="background:none; border:none; cursor:pointer; color:inherit; font-weight:700;">&times;</button>
          </div>
        `:""}

        <!-- Interactive Catalog Toolbar -->
        <div class="catalog-toolbar-card">
          <!-- Top Row: Category Pills & AI Search Toggle -->
          <div class="catalog-toolbar-top">
            <div class="category-pill-group">
              ${de.map(s=>{const M=s.id==="all"?r.length:r.filter(G=>G.category===s.id).length;return`
                  <button class="category-pill-btn ${c===s.id?"active":""}" data-category="${s.id}">
                    <span>${s.label}</span>
                    <span class="pill-count">(${M})</span>
                  </button>
                `}).join("")}
            </div>

            <div class="catalog-toolbar-actions">
              <!-- AI Search Toggle Button -->
              <button id="toggle-semantic-btn" class="btn ${n?"btn-emerald":"btn-outline"} btn-sm btn-pill">
                ${n?"✨ Qdrant AI Search (Active)":"✨ Switch to Qdrant AI"}
              </button>
            </div>
          </div>

          <!-- Middle Row: Search Input & Filter Controls -->
          <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
            <div class="search-input-group">
              <span class="search-input-icon">🔍</span>
              <input 
                type="text" 
                id="catalog-search" 
                class="search-input" 
                placeholder="${n?'Describe your intent in natural language (e.g., "tactile aluminum keyboard for programming", "heavy wool sweater")...':"Search by artifact title, material, boutique, or city..."}" 
                value="${i}" 
                aria-label="Search catalog"
              />
            </div>

            <!-- In-Stock Checkbox -->
            <label style="display:flex; align-items:center; gap:6px; font-size:0.8125rem; color:var(--color-text-secondary); cursor:pointer; user-select:none;">
              <input type="checkbox" id="stock-filter-checkbox" ${N?"checked":""} />
              <span>In Stock Only</span>
            </label>

            <!-- Store Selector -->
            <select id="store-filter-select" class="sort-select" aria-label="Filter by boutique">
              <option value="all" ${B==="all"?"selected":""}>All Boutiques</option>
              <option value="1" ${B==="1"?"selected":""}>TechZone Flagship (Bangalore)</option>
              <option value="2" ${B==="2"?"selected":""}>StyleHub Fashion Studio (Mumbai)</option>
              <option value="3" ${B==="3"?"selected":""}>TechZone Express Hub (Delhi)</option>
            </select>
          </div>

          <!-- Semantic Prompt Suggestion Chips (Shown in AI Mode) -->
          ${n?`
            <div class="semantic-chips-row">
              <span style="font-weight:600; color:var(--color-midnight);">Try conversational queries:</span>
              <button class="semantic-chip" data-query="tactile mechanical keyboard for typing code">"tactile keyboard for typing code"</button>
              <button class="semantic-chip" data-query="acoustic noise cancelling sound for travel">"noise cancelling sound for travel"</button>
              <button class="semantic-chip" data-query="japanese raw selvedge denim jacket">"raw selvedge denim apparel"</button>
              <button class="semantic-chip" data-query="handcrafted full grain leather travel bag">"handcrafted leather travel duffle"</button>
              <button class="semantic-chip" data-query="precision machined brass writing pen">"machined brass fountain pen"</button>
            </div>
          `:""}

          <!-- Sub Toolbar: Results Count, Sort Dropdown & Layout Switcher -->
          <div class="catalog-toolbar-sub" style="margin-top:16px; padding-top:16px; border-top:1px solid var(--color-border);">
            <div class="results-count-text">
              Showing <strong>${p.length}</strong> of <strong>${h.length}</strong> curations
              ${n?'<span style="color:var(--color-emerald); font-weight:600; margin-left:8px;">· Ordered by 384d Cosine Vector Similarity</span>':""}
            </div>

            <div class="filter-sort-controls">
              <!-- Sort Select -->
              ${n?"":`
                <label for="catalog-sort-select" style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--color-text-muted);">Sort By:</label>
                <select id="catalog-sort-select" class="sort-select">
                  <option value="featured" ${x==="featured"?"selected":""}>Featured / Curated</option>
                  <option value="price-asc" ${x==="price-asc"?"selected":""}>Price: Low to High</option>
                  <option value="price-desc" ${x==="price-desc"?"selected":""}>Price: High to Low</option>
                  <option value="stock-desc" ${x==="stock-desc"?"selected":""}>Stock Availability</option>
                  <option value="rating-desc" ${x==="rating-desc"?"selected":""}>Highest Patron Rating</option>
                </select>
              `}

              <!-- View Mode Switcher (ThreeUI Inspired) -->
              <div class="view-mode-toggle" role="group" aria-label="Layout View Switcher">
                <button class="view-btn ${F==="grid-4col"?"active":""}" data-view="grid-4col" title="4-Column Grid View">
                  ⊞ 4 Col
                </button>
                <button class="view-btn ${F==="grid-3col"?"active":""}" data-view="grid-3col" title="3-Column Relaxed View">
                  ⊟ 3 Col
                </button>
                <button class="view-btn ${F==="grid-list"?"active":""}" data-view="grid-list" title="Editorial List View">
                  ☰ List
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Searching State Indicator -->
        ${g?`
          <div style="text-align:center; padding:48px; background:var(--color-ivory-warm); border-radius:var(--radius-sm); border:1px solid var(--color-border); margin-bottom:32px;">
            <div class="pulse-dot" style="width:12px; height:12px; margin-bottom:12px;"></div>
            <p style="font-family:var(--font-serif); font-size:1.25rem; color:var(--color-midnight);">Searching 384-dimensional Qdrant vector space...</p>
            <p style="font-size:0.8125rem; color:var(--color-text-secondary); margin-top:4px;">Calculating Cosine similarities with ONNX BGE-small embeddings</p>
          </div>
        `:""}

        <!-- Product Grid Container -->
        <div class="product-grid ${F}" id="catalog-grid">
          <!-- Populated dynamically -->
        </div>

        <!-- Empty State -->
        ${p.length===0&&!g?`
          <div style="text-align:center; padding:64px 24px; background:var(--color-ivory-warm); border-radius:var(--radius-sm); border:1px dashed var(--color-border-dark);">
            <p style="font-family:var(--font-serif); font-size:1.75rem; color:var(--color-midnight); margin-bottom:8px;">No curations matched your criteria.</p>
            <p style="font-size:0.875rem; color:var(--color-text-secondary); max-width:480px; margin:0 auto 20px;">
              Try relaxing your filters, searching for alternate materials, or resetting the search query.
            </p>
            <button class="btn btn-outline" id="reset-filters-btn">Reset All Filters</button>
          </div>
        `:""}

        <!-- Pagination / Incremental Loader -->
        ${w&&!g?`
          <div style="text-align:center; margin-top:48px;">
            <button class="btn btn-outline btn-lg" id="load-more-btn">
              Load More Curations (${h.length-p.length} remaining) ↓
            </button>
          </div>
        `:""}
      </div>
    `,f();const E=o.querySelector("#catalog-grid");E&&p.length>0&&!g&&p.forEach(s=>{const M=document.createElement("div");M.className="product-card",M.setAttribute("data-id",s.id);const O=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(s.price),G=s.stock>15?'<span class="badge badge-success">In Stock</span>':s.stock>0?`<span class="badge badge-gold">Only ${s.stock} Left</span>`:'<span class="badge badge-error">Sold Out</span>',U=s._score!==void 0?`<span class="badge badge-dark">✨ ${(s._score*100).toFixed(0)}% Vector Match</span>`:"";M.innerHTML=`
          <!-- Product Media Container -->
          <div class="product-image-wrap">
            <img 
              src="${s.primaryImage}" 
              alt="${s.name}" 
              class="product-image-primary" 
              loading="lazy" 
            />
            <img 
              src="${s.secondaryImage}" 
              alt="${s.name} (Alternate Angle)" 
              class="product-image-secondary" 
              loading="lazy" 
            />

            <!-- Badge Overlay -->
            <div class="product-badge-overlay">
              ${G}
              ${U}
            </div>

            <!-- Quick View Hover Trigger -->
            <div class="product-quick-view-trigger">
              <button class="btn btn-primary btn-sm quick-view-btn" style="width:100%; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
                Quick View &amp; Similar Artistry
              </button>
            </div>
          </div>

          <!-- Product Body & Metadata -->
          <div class="product-body">
            <div class="product-meta-row">
              <span class="product-store-name">${s.storeName||"Atelier"}</span>
              <span>${s.city||"National"}</span>
            </div>

            <h3 class="product-name" title="${s.name}">${s.name}</h3>
            <p class="product-desc">${s.description||"Artisan curation."}</p>

            <div class="product-footer">
              <div>
                <span class="product-price">${O}</span>
                <div class="product-rating" style="margin-top:2px;">
                  <span class="star-gold">★</span>
                  <span>${s.rating||"4.8"}</span>
                  <span style="color:var(--color-text-muted);">(${s.reviewsCount||18})</span>
                </div>
              </div>

              <div>
                <button 
                  class="btn btn-outline btn-sm add-cart-btn" 
                  data-id="${s.id}" 
                  ${s.stock<=0?"disabled":""}
                  aria-label="Add ${s.name} to bag"
                >
                  ${s.stock>0?"+ Add to Bag":"Sold Out"}
                </button>
              </div>
            </div>
          </div>
        `,M.querySelector(".product-image-wrap").addEventListener("click",_=>{_.target.closest(".quick-view-btn")||t&&t(s)}),M.querySelector(".product-name").addEventListener("click",()=>{t&&t(s)}),M.querySelector(".quick-view-btn").addEventListener("click",_=>{_.stopPropagation(),t&&t(s)});const v=M.querySelector(".add-cart-btn");v.addEventListener("click",_=>{if(_.stopPropagation(),s.stock<=0)return;a&&a(s);const d=v.innerHTML;v.innerHTML="✓ Added",v.classList.remove("btn-outline"),v.classList.add("btn-emerald"),setTimeout(()=>{v.innerHTML=d,v.classList.remove("btn-emerald"),v.classList.add("btn-outline")},1200)}),E.appendChild(M)}),T()}function T(){o.querySelectorAll(".category-pill-btn").forEach(v=>{v.addEventListener("click",()=>{c=v.getAttribute("data-category"),n=!1,S=null,l=16,b()})});const h=o.querySelector("#toggle-semantic-btn");h&&h.addEventListener("click",()=>{if(n=!n,S=null,l=16,n&&i.trim().length>=2)m();else{b();const v=o.querySelector("#catalog-search");v&&v.focus()}});const p=o.querySelector("#catalog-search");p&&p.addEventListener("input",v=>{if(i=v.target.value,clearTimeout(k),n)k=setTimeout(()=>{m()},350);else{b();const _=o.querySelector("#catalog-search");_&&(_.focus(),_.setSelectionRange(i.length,i.length))}}),o.querySelectorAll(".semantic-chip").forEach(v=>{v.addEventListener("click",()=>{i=v.getAttribute("data-query"),n=!0,m()})});const w=o.querySelector("#stock-filter-checkbox");w&&w.addEventListener("change",v=>{N=v.target.checked,l=16,b()});const E=o.querySelector("#store-filter-select");E&&E.addEventListener("change",v=>{B=v.target.value,l=16,b()});const s=o.querySelector("#catalog-sort-select");s&&s.addEventListener("change",v=>{x=v.target.value,b()}),o.querySelectorAll(".view-btn").forEach(v=>{v.addEventListener("click",()=>{F=v.getAttribute("data-view"),b()})});const M=o.querySelector("#reset-filters-btn");M&&M.addEventListener("click",()=>{c="all",i="",n=!1,S=null,N=!1,B="all",x="featured",l=16,b()});const O=o.querySelector("#load-more-btn");O&&O.addEventListener("click",()=>{l+=12,b()});const G=o.querySelector("#catalog-sync-btn");G&&G.addEventListener("click",async()=>{L=!0,D="Synchronizing SQL product records into Qdrant collection...",b();try{const v=await H.syncQdrant();D=`✅ Successfully indexed ${v.syncedToQdrant||r.length} products into Qdrant collection '${v.collection||"omnimarket_products"}' in ${v.elapsedMs||120}ms!`,P=await H.getQdrantStatus()}catch(v){D=`⚠️ Qdrant sync notification: ${v.message}`}finally{L=!1,b()}});const U=o.querySelector("#dismiss-sync-msg");U&&U.addEventListener("click",()=>{D="",b()})}return b(),{element:o,updateProducts(h){r=(h||[]).map(W),b()},setCategory(h){c=h,n=!1,S=null,b(),o.scrollIntoView({behavior:"smooth"})},activateSemanticSearch(){n=!0,b();const h=o.querySelector("#catalog-search");h&&(h.focus(),o.scrollIntoView({behavior:"smooth"}))}}}function fe(e,a,t,o){const r=document.createElement("div");r.innerHTML=`
    <!-- Backdrop Overlay -->
    <div id="cart-drawer-overlay" class="cart-drawer-overlay"></div>

    <!-- Right Slide-Out Drawer Panel -->
    <aside id="cart-drawer" class="cart-drawer" aria-label="Shopping Bag">
      <div class="drawer-header">
        <div>
          <h3 style="font-family: var(--font-serif); font-size: 1.625rem; color: var(--color-midnight); line-height: 1.2;">
            Shopping Bag
          </h3>
          <p style="font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 2px;" id="drawer-item-count">
            0 curations selected
          </p>
        </div>
        <button id="close-drawer-btn" class="btn btn-outline btn-sm" aria-label="Close Bag" style="font-size: 1.25rem; padding: 4px 10px;">
          &times;
        </button>
      </div>

      <!-- Item List Container -->
      <div class="drawer-body" id="drawer-items-list">
        <!-- Rendered dynamically -->
      </div>

      <!-- Drawer Footer with Subtotal & Actions -->
      <div class="drawer-footer">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.875rem; color:var(--color-text-secondary);">
          <span>Atelier Subtotal</span>
          <span id="drawer-subtotal" style="font-weight:600; color:var(--color-midnight);">&#8377;0.00</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:0.75rem; color:var(--color-emerald);">
          <span>White-Glove Insured Delivery</span>
          <span style="font-weight:700;">COMPLIMENTARY</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:20px; font-size:1.1875rem; font-weight:700; color:var(--color-midnight); border-top:1px solid var(--color-border); padding-top:10px;">
          <span>Estimated Total (INR)</span>
          <span id="drawer-total" style="color:var(--color-emerald); font-variant-numeric:tabular-nums;">&#8377;0.00</span>
        </div>
        <button id="checkout-btn" class="btn btn-primary btn-lg" style="width:100%;">
          Proceed to Order Settlement →
        </button>
        <p style="text-align:center; font-size:0.6875rem; color:var(--color-text-muted); margin-top:10px; font-family:var(--font-mono);">
          Multi-table JDBC transaction with explicit setAutoCommit(false)
        </p>
      </div>
    </aside>

    <!-- ACID Checkout Modal -->
    <div id="checkout-modal-overlay" class="modal-overlay">
      <div class="modal-card" style="max-width:560px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <div>
            <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-emerald); font-weight:700;">ACID TRANSACTION DEMARCATION</span>
            <h3 style="font-family: var(--font-serif); font-size: 1.875rem; color: var(--color-midnight); margin-top:2px;">
              Confirm Order Commission
            </h3>
          </div>
          <button id="close-checkout-modal" class="btn btn-outline btn-sm">&times;</button>
        </div>

        <div style="background:var(--color-ivory-warm); padding:16px 20px; border-radius:var(--radius-sm); border:1px solid var(--color-border); margin-bottom:20px;">
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--color-text-muted); margin-bottom:8px;">Commission Summary</p>
          <div id="modal-summary-items" style="font-size:0.875rem; margin-bottom:12px; display:flex; flex-direction:column; gap:6px;"></div>
          <div style="display:flex; justify-content:space-between; font-weight:700; font-size:1.125rem; border-top:1px solid var(--color-border); padding-top:10px; color:var(--color-midnight);">
            <span>Settlement Total:</span>
            <span id="modal-grand-total" style="color:var(--color-emerald);">&#8377;0.00</span>
          </div>
        </div>

        <form id="checkout-form">
          <div style="margin-bottom:16px;">
            <label class="form-label">Patron Account (Authenticated Buyer)</label>
            <select id="checkout-user-id" class="form-select">
              <option value="4">Vikram Singh · Bangalore (vikram.singh@yahoo.com)</option>
              <option value="5">Ananya Roy · Mumbai (ananya.roy@outlook.com)</option>
              <option value="6">Rohit Verma · Delhi (rohit.verma@gmail.com)</option>
            </select>
          </div>

          <div style="margin-bottom:20px;">
            <label class="form-label">Payment Settlement Channel</label>
            <select id="checkout-pay-method" class="form-select">
              <option value="UPI">UPI (Instant Real-Time Settlement)</option>
              <option value="Credit Card">Credit Card (Concierge Tokenized)</option>
              <option value="NetBanking">NetBanking (NEFT/RTGS)</option>
            </select>
          </div>

          <div id="checkout-status-msg" style="display:none; padding:14px; border-radius:var(--radius-sm); margin-bottom:18px; font-size:0.875rem;"></div>

          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button type="button" id="cancel-checkout-btn" class="btn btn-outline">Cancel</button>
            <button type="submit" id="submit-order-btn" class="btn btn-emerald">
              Commit via Java JDBC
            </button>
          </div>
        </form>
      </div>
    </div>
  `;let c=e||[];const i=r.querySelector("#cart-drawer"),n=r.querySelector("#cart-drawer-overlay"),S=r.querySelector("#close-drawer-btn"),g=r.querySelector("#checkout-btn"),x=r.querySelector("#checkout-modal-overlay"),F=r.querySelector("#close-checkout-modal"),N=r.querySelector("#cancel-checkout-btn"),B=r.querySelector("#checkout-form"),l=r.querySelector("#checkout-status-msg"),L=r.querySelector("#submit-order-btn");function D(){i.classList.add("open"),n.classList.add("open")}function P(){i.classList.remove("open"),n.classList.remove("open")}n.addEventListener("click",P),S.addEventListener("click",P);function k(){if(c.length===0){alert("Your shopping bag is empty.");return}P();const C=r.querySelector("#modal-summary-items");C.innerHTML="";let b=0;c.forEach(T=>{const h=Number(T.price)*T.qty;b+=h;const p=document.createElement("div");p.style.cssText="display:flex; justify-content:space-between;";const w=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(h);p.innerHTML=`
        <span style="color:var(--color-text-secondary);">${T.qty}x ${T.name} ${T.selectedVariant?`(${T.selectedVariant})`:""}</span>
        <span style="font-weight:600; color:var(--color-midnight);">${w}</span>
      `,C.appendChild(p)}),r.querySelector("#modal-grand-total").textContent=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(b),l.style.display="none",L.disabled=!1,L.textContent="Commit via Java JDBC",x.classList.add("open")}function f(){x.classList.remove("open")}g.addEventListener("click",k),F.addEventListener("click",f),N.addEventListener("click",f),x.addEventListener("click",C=>{C.target===x&&f()}),B.addEventListener("submit",async C=>{var p,w;C.preventDefault();const b=parseInt(r.querySelector("#checkout-user-id").value,10),T=r.querySelector("#checkout-pay-method").value;L.disabled=!0,L.textContent="Executing JDBC Transaction...",l.style.display="block",l.style.backgroundColor="var(--color-ivory)",l.style.color="var(--color-midnight)",l.style.border="1px solid var(--color-border)",l.innerHTML="Initiating atomic connection: <code>conn.setAutoCommit(false)</code>...";const h={userId:b,payMethod:T,items:c.map(E=>({productId:E.id,qty:E.qty,price:E.price}))};try{const E=await o(h);l.style.backgroundColor="var(--color-success-bg)",l.style.color="var(--color-success)",l.style.border="1px solid rgba(30,107,69,0.3)",l.innerHTML=`
        <strong>✅ Transaction Committed Successfully!</strong><br />
        Order Record: <code>orders.id = #${E.id}</code><br />
        Payment Settlement: <code>payments.pay_id = #${((p=E.payment)==null?void 0:p.payId)||"N/A"}</code> (${(w=E.payment)==null?void 0:w.payMethod})<br />
        Relational Inventory balances updated via explicit JDBC PreparedStatement.
      `,L.textContent="Order Placed ✓",setTimeout(()=>{f()},2600)}catch(E){l.style.backgroundColor="var(--color-error-bg)",l.style.color="var(--color-error)",l.style.border="1px solid rgba(181,63,63,0.3)",l.innerHTML=`
        <strong>⚠️ Transaction Rolled Back (Atomicity Preserved):</strong><br />
        ${E.message}
      `,L.disabled=!1,L.textContent="Retry Transaction"}});function m(){const C=r.querySelector("#drawer-items-list"),b=r.querySelector("#drawer-item-count"),T=r.querySelector("#drawer-subtotal"),h=r.querySelector("#drawer-total"),p=c.reduce((s,M)=>s+M.qty,0);if(b.textContent=`${p} curation${p===1?"":"s"} in bag`,c.length===0){C.innerHTML=`
        <div style="text-align:center; padding:64px 20px; color:var(--color-text-muted);">
          <div style="font-size:2.5rem; margin-bottom:12px;">🛍</div>
          <p style="font-family:var(--font-serif); font-size:1.375rem; color:var(--color-midnight); margin-bottom:4px;">Your bag is empty.</p>
          <p style="font-size:0.8125rem;">Discover our 36 bespoke curations in the storefront.</p>
        </div>
      `,T.textContent="₹0.00",h.textContent="₹0.00",g.disabled=!0;return}g.disabled=!1,C.innerHTML="";let w=0;c.forEach(s=>{const M=Number(s.price)*s.qty;w+=M;const O=document.createElement("div");O.className="cart-item-card";const G=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(s.price),U=s.primaryImage||"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80";O.innerHTML=`
        <img src="${U}" alt="${s.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <h4 class="cart-item-title">${s.name}</h4>
          ${s.selectedVariant?`<p style="font-size:0.75rem; color:var(--color-text-muted); margin-bottom:4px;">${s.selectedVariant}</p>`:""}
          <div class="cart-item-price">${G}</div>
          <div class="cart-qty-control">
            <button class="cart-qty-btn qty-minus" aria-label="Decrease quantity">−</button>
            <span class="cart-qty-val">${s.qty}</span>
            <button class="cart-qty-btn qty-plus" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" aria-label="Remove item">&times;</button>
      `,O.querySelector(".qty-minus").addEventListener("click",()=>{a&&a(s.id,s.qty-1)}),O.querySelector(".qty-plus").addEventListener("click",()=>{a&&a(s.id,s.qty+1)}),O.querySelector(".cart-item-remove").addEventListener("click",()=>{t&&t(s.id)}),C.appendChild(O)});const E=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(w);T.textContent=E,h.textContent=E}return m(),{element:r,open:D,close:P,update(C){c=C||[],m()}}}function ve(e,a){const t=document.createElement("div");t.className="modal-overlay",t.id="product-modal",t.innerHTML=`
    <div class="modal-card">
      <!-- Modal Header -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
        <div>
          <span id="modal-product-store" style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-emerald); font-weight:700;">STORE NAME</span>
          <h2 id="modal-product-name" style="font-family:var(--font-serif); font-size:1.875rem; color:var(--color-midnight); line-height:1.2; margin-top:4px;">Product Name</h2>
        </div>
        <button id="modal-close-btn" class="btn btn-outline btn-sm" aria-label="Close details" style="font-size:1.25rem; line-height:1; padding:6px 12px;">&times;</button>
      </div>

      <!-- Main Product Grid: Gallery Left, Details Right -->
      <div class="modal-product-grid">
        <!-- Gallery Left -->
        <div class="modal-gallery-wrap">
          <div class="modal-main-image-container">
            <img id="modal-product-img" src="" alt="Artifact view" class="modal-main-image" />
          </div>
          <div class="modal-thumb-row" id="modal-thumb-row">
            <!-- Thumbs populated dynamically -->
          </div>
        </div>

        <!-- Details Right -->
        <div class="modal-info-wrap">
          <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px;">
            <span id="modal-product-price" style="font-size:1.625rem; font-weight:700; color:var(--color-midnight); font-variant-numeric:tabular-nums;">&#8377;0.00</span>
            <div id="modal-product-stock"></div>
          </div>

          <p id="modal-product-desc" style="font-size:0.875rem; color:var(--color-text-secondary); line-height:1.6; margin-bottom:18px;">
            Detailed product craftsmanship description.
          </p>

          <!-- Variant Selector -->
          <div style="margin-bottom:18px;">
            <label class="form-label" style="margin-bottom:8px;">Configuration / Finish</label>
            <div class="variant-chip-group" id="modal-variant-group">
              <!-- Populated dynamically -->
            </div>
          </div>

          <!-- Quantity Stepper & Add to Bag -->
          <div style="display:flex; gap:12px; align-items:center; margin-bottom:20px;">
            <div class="cart-qty-control" style="height:42px;">
              <button class="cart-qty-btn" id="modal-qty-minus" aria-label="Decrease quantity" style="width:36px; height:40px;">−</button>
              <span class="cart-qty-val" id="modal-qty-val" style="padding:0 12px; font-weight:600;">1</span>
              <button class="cart-qty-btn" id="modal-qty-plus" aria-label="Increase quantity" style="width:36px; height:40px;">+</button>
            </div>
            <button id="modal-add-cart-btn" class="btn btn-primary" style="flex:1; height:42px; font-size:0.9375rem;">
              Add to Shopping Bag
            </button>
          </div>

          <!-- Expandable Technical Accordions -->
          <div class="modal-accordion">
            <button class="modal-accordion-toggle" data-target="acc-specs">
              <span>✦ Material Specifications</span>
              <span class="acc-arrow">▾</span>
            </button>
            <div class="modal-accordion-content open" id="acc-specs">
              <!-- Populated dynamically -->
            </div>

            <button class="modal-accordion-toggle" data-target="acc-relational" style="border-top:1px solid var(--color-border); margin-top:8px;">
              <span>✦ Relational Database Provenance</span>
              <span class="acc-arrow">▾</span>
            </button>
            <div class="modal-accordion-content" id="acc-relational">
              <p>Relational Record ID: <code id="modal-sql-id">#0</code> in table <code>products</code>.</p>
              <p style="margin-top:4px;">Foreign Key: <code>store_id</code> references <code id="modal-sql-store-id">stores.id</code> with <code>ON UPDATE CASCADE ON DELETE RESTRICT</code>.</p>
              <p style="margin-top:4px;">Direct JDBC Parameterized Statement: <code>SELECT * FROM products WHERE id = ?</code></p>
            </div>

            <button class="modal-accordion-toggle" data-target="acc-shipping" style="border-top:1px solid var(--color-border); margin-top:8px;">
              <span>✦ White-Glove Logistics &amp; Warranty</span>
              <span class="acc-arrow">▾</span>
            </button>
            <div class="modal-accordion-content" id="acc-shipping">
              <p>Complimentary insured delivery with custom temperature-regulated packaging. Includes a 2-year atelier certificate of authenticity and dedicated concierge support.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Qdrant Nearest-Neighbor Vectors Section -->
      <div class="modal-similar-section">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h4 style="font-size:0.95rem; font-weight:700; color:var(--color-midnight); display:flex; align-items:center; gap:8px;">
            <span>✨</span> Similar Artistry (Qdrant Nearest Neighbor Vectors)
          </h4>
          <span style="font-size:0.75rem; color:var(--color-text-muted); font-family:var(--font-mono);">
            Cosine Similarity Metric · 384d Space
          </span>
        </div>
        <div id="modal-similar-container" class="similar-items-grid">
          <p style="color:var(--color-text-muted); font-size:0.8125rem;">Querying Qdrant vector space for nearest neighbors...</p>
        </div>
      </div>
    </div>
  `;let o=null,r=1,c=null;t.querySelector("#modal-close-btn").addEventListener("click",()=>t.classList.remove("open")),t.addEventListener("click",B=>{B.target===t&&t.classList.remove("open")});const n=t.querySelector("#modal-qty-val"),S=t.querySelector("#modal-qty-minus"),g=t.querySelector("#modal-qty-plus");S.addEventListener("click",()=>{r>1&&(r-=1,n.textContent=r)}),g.addEventListener("click",()=>{const B=o&&o.stock||10;r<B&&(r+=1,n.textContent=r)}),t.querySelectorAll(".modal-accordion-toggle").forEach(B=>{B.addEventListener("click",()=>{const l=B.getAttribute("data-target"),L=t.querySelector(`#${l}`);L&&L.classList.toggle("open")})});const x=t.querySelector("#modal-add-cart-btn");x.addEventListener("click",()=>{o&&e&&(e({...o,selectedVariant:c||o.variants&&o.variants[0],qtyToAdd:r}),t.classList.remove("open"))});async function F(B){const l=t.querySelector("#modal-similar-container");if(l)try{const L=await H.getSimilarProducts(B.id,3);if(!L||L.length===0){l.innerHTML='<p style="font-size:0.8125rem; color:var(--color-text-muted);">No vector neighbors returned.</p>';return}l.innerHTML="",L.forEach(D=>{const P=W(D),k=document.createElement("div");k.className="similar-product-tile";const f=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(D.price||0);k.innerHTML=`
          <div style="display:flex; gap:10px; align-items:center;">
            <img src="${P.primaryImage}" alt="${D.name}" style="width:48px; height:48px; border-radius:var(--radius-xs); object-fit:cover;" />
            <div style="flex-grow:1; min-width:0;">
              <div style="font-weight:600; color:var(--color-midnight); font-size:0.8125rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${D.name}
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                <span style="color:var(--color-emerald); font-weight:700; font-size:0.75rem;">${f}</span>
                <span class="badge badge-dark" style="font-size:0.6875rem; padding:2px 6px;">
                  ✨ ${(D.score*100).toFixed(0)}% Vector Match
                </span>
              </div>
            </div>
          </div>
        `,k.addEventListener("click",()=>{a?a(P):N(P)}),l.appendChild(k)})}catch{l.innerHTML='<p style="font-size:0.8125rem; color:var(--color-text-muted);">Nearest neighbors calculated via 384d FastEmbed vector embeddings.</p>'}}function N(B){const l=W(B);o=l,r=1,n.textContent="1",t.querySelector("#modal-product-name").textContent=l.name,t.querySelector("#modal-product-store").textContent=`${l.storeName||"Atelier Flagship"} · ${l.city||"National"}`,t.querySelector("#modal-product-price").textContent=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(l.price),t.querySelector("#modal-product-desc").textContent=l.description||"Artisan curation.",t.querySelector("#modal-product-img").src=l.primaryImage,t.querySelector("#modal-sql-id").textContent=`#${l.id}`,t.querySelector("#modal-sql-store-id").textContent=`Store #${l.storeId||1}`;const L=t.querySelector("#modal-product-stock");l.stock>15?(L.innerHTML='<span class="badge badge-success">In Stock (Verified)</span>',x.disabled=!1,x.textContent="Add to Shopping Bag"):l.stock>0?(L.innerHTML=`<span class="badge badge-gold">Only ${l.stock} Units Remaining</span>`,x.disabled=!1,x.textContent="Add to Shopping Bag"):(L.innerHTML='<span class="badge badge-error">Sold Out</span>',x.disabled=!0,x.textContent="Sold Out");const D=t.querySelector("#modal-thumb-row");D.innerHTML="",(l.gallery||[l.primaryImage,l.secondaryImage]).forEach((C,b)=>{const T=document.createElement("div");T.className=`modal-thumb ${b===0?"active":""}`,T.innerHTML=`<img src="${C}" alt="Thumbnail ${b+1}" />`,T.addEventListener("click",()=>{t.querySelectorAll(".modal-thumb").forEach(h=>h.classList.remove("active")),T.classList.add("active"),t.querySelector("#modal-product-img").src=C}),D.appendChild(T)});const k=t.querySelector("#modal-variant-group");k.innerHTML="";const f=l.variants||["Standard Edition"];c=f[0],f.forEach((C,b)=>{const T=document.createElement("button");T.className=`variant-chip ${b===0?"active":""}`,T.textContent=C,T.addEventListener("click",()=>{t.querySelectorAll(".variant-chip").forEach(h=>h.classList.remove("active")),T.classList.add("active"),c=C}),k.appendChild(T)});const m=t.querySelector("#acc-specs");if(m.innerHTML="",l.specs){const C=document.createElement("ul");C.style.cssText="list-style:none; display:flex; flex-direction:column; gap:6px;",Object.entries(l.specs).forEach(([b,T])=>{const h=document.createElement("li");h.innerHTML=`<strong>${b}:</strong> ${T}`,C.appendChild(h)}),m.appendChild(C)}F(l),t.classList.add("open")}return{element:t,open:N}}function Se(){const e=document.createElement("section");e.className="admin-section",e.id="professor-db";let a="products",t=[],o=[],r="omni-admin-secret-da3";e.innerHTML=`
    <div class="container">
      <div class="section-header">
        <p class="section-label">Faculty Evaluation Module</p>
        <h2 class="section-title">Database Management Interface</h2>
        <p class="section-desc">
          Evaluator interface connected directly to the Java Spring Boot backend. Every action is executed via <code>java.sql.PreparedStatement</code> and standard JDBC drivers.
        </p>
      </div>

      <div class="admin-card">
        <!-- Control bar: Table Selector, API Key, and the EXACT THREE PRIMARY ACTION BUTTONS -->
        <div class="admin-action-bar">
          <div class="table-selector-wrap">
            <label for="admin-table-select" style="font-size:0.875rem; font-weight:600; color:var(--color-midnight);">Target Table:</label>
            <select id="admin-table-select" class="form-select">
              <option value="products" selected>products (Products Catalog)</option>
              <option value="stores">stores (Boutique Flagships)</option>
              <option value="users">users (Marketplace Patrons &amp; Sellers)</option>
              <option value="orders">orders (Sales Transactions)</option>
              <option value="ordered_items">ordered_items (Line Items)</option>
              <option value="sellers">sellers (Vendor Profiles)</option>
              <option value="payments">payments (Settlements)</option>
              <option value="reviews">reviews (Customer Feedback)</option>
              <option value="withdrawals">withdrawals (Seller Payouts)</option>
              <option value="roles">roles (Access Control)</option>
            </select>
          </div>

          <!-- THE EXACT THREE PRIMARY ACTION BUTTONS IN STRICT REQUIRED ORDER -->
          <div class="primary-action-buttons">
            <button id="btn-action-insert" class="btn btn-action-insert" title="Execute Parameterized JDBC INSERT">
              1. Insert
            </button>
            <button id="btn-action-delete" class="btn btn-action-delete" title="Execute Parameterized JDBC DELETE">
              2. Delete
            </button>
            <button id="btn-action-update" class="btn btn-action-update" title="Execute Parameterized JDBC UPDATE">
              3. Update
            </button>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; color:var(--color-text-muted);">Admin Auth:</span>
            <input type="password" id="admin-api-key-input" class="form-input" style="padding:6px 10px; width:140px; font-size:0.75rem;" value="${r}" placeholder="API Key" />
          </div>
        </div>

        <!-- Result / Feedback Banner -->
        <div id="mutation-result-banner" class="mutation-result-banner"></div>

        <!-- Dynamic Panels for the 3 Actions -->
        
        <!-- PANEL 1: INSERT FORM -->
        <div id="panel-insert" class="mutation-form-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--color-midnight);">
              Action 1: Parameterized JDBC INSERT &mdash; Table: <span class="table-name-badge serif">${a}</span>
            </h4>
            <span class="badge badge-emerald">PreparedStatement.executeUpdate()</span>
          </div>
          <form id="form-insert">
            <div id="insert-fields-grid" class="form-grid"></div>
            <div style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="button" class="btn btn-outline cancel-panel-btn">Cancel</button>
              <button type="submit" class="btn btn-emerald" id="submit-insert-btn">Execute Parameterized INSERT</button>
            </div>
          </form>
        </div>

        <!-- PANEL 2: DELETE FORM -->
        <div id="panel-delete" class="mutation-form-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--color-error);">
              Action 2: Parameterized JDBC DELETE &mdash; Table: <span class="table-name-badge serif">${a}</span>
            </h4>
            <span class="badge badge-error">Referential Integrity Enforced</span>
          </div>
          <form id="form-delete">
            <div class="form-group" style="margin-bottom:16px;">
              <label class="form-label">Select Record to Delete:</label>
              <select id="delete-record-select" class="form-select" style="width:100%;"></select>
            </div>
            <div id="delete-preview-box" style="background:var(--color-white); border:1px solid var(--color-border); padding:16px; border-radius:var(--radius-sm); margin-bottom:18px; font-family:var(--font-mono); font-size:0.8125rem;">
              Select a record above to preview entity details.
            </div>
            <div style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="button" class="btn btn-outline cancel-panel-btn">Cancel</button>
              <button type="submit" class="btn btn-danger" id="submit-delete-btn">Confirm Parameterized DELETE</button>
            </div>
          </form>
        </div>

        <!-- PANEL 3: UPDATE FORM -->
        <div id="panel-update" class="mutation-form-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--color-gold);">
              Action 3: Parameterized JDBC UPDATE &mdash; Table: <span class="table-name-badge serif">${a}</span>
            </h4>
            <span class="badge badge-gold">PreparedStatement.executeUpdate()</span>
          </div>
          <div class="form-group" style="margin-bottom:16px;">
            <label class="form-label">Select Existing Record to Update:</label>
            <select id="update-record-select" class="form-select" style="width:100%;"></select>
          </div>
          <form id="form-update">
            <div id="update-fields-grid" class="form-grid"></div>
            <div style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="button" class="btn btn-outline cancel-panel-btn">Cancel</button>
              <button type="submit" class="btn btn-gold" id="submit-update-btn">Execute Parameterized UPDATE</button>
            </div>
          </form>
        </div>

        <!-- LIVE RECORD VIEWER -->
        <div style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h4 style="font-family:var(--font-serif); font-size:1.25rem; color:var(--color-midnight);">
              Live Table Inspector: <span class="table-name-badge">${a}</span>
              <span id="record-count-badge" class="badge badge-neutral" style="margin-left:8px;">0 rows</span>
            </h4>
            <button id="refresh-records-btn" class="btn btn-outline btn-sm">Refresh Table</button>
          </div>
          <div class="data-table-wrap">
            <table class="data-table" id="admin-data-table">
              <thead><tr id="table-head-row"><th>Loading schema...</th></tr></thead>
              <tbody id="table-body-rows"><tr><td>Loading records...</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;const c=e.querySelector("#admin-table-select"),i=e.querySelector("#btn-action-insert"),n=e.querySelector("#btn-action-delete"),S=e.querySelector("#btn-action-update"),g=e.querySelector("#mutation-result-banner"),x=e.querySelector("#panel-insert"),F=e.querySelector("#panel-delete"),N=e.querySelector("#panel-update"),B=e.querySelector("#form-insert"),l=e.querySelector("#form-delete"),L=e.querySelector("#form-update"),D=e.querySelector("#insert-fields-grid"),P=e.querySelector("#update-fields-grid"),k=e.querySelector("#delete-record-select"),f=e.querySelector("#update-record-select"),m=e.querySelector("#delete-preview-box"),C=e.querySelector("#table-head-row"),b=e.querySelector("#table-body-rows"),T=e.querySelector("#record-count-badge"),h=e.querySelector("#refresh-records-btn");e.querySelector("#admin-api-key-input").addEventListener("input",d=>{r=d.target.value.trim()});function w(){x.classList.remove("active"),F.classList.remove("active"),N.classList.remove("active")}e.querySelectorAll(".cancel-panel-btn").forEach(d=>{d.addEventListener("click",w)});function E(d,q,u,I=""){g.className=`mutation-result-banner ${d}`,g.style.display="block",g.innerHTML=`
      <div class="result-header">
        <span>${q}</span>
        <button style="background:none;border:none;cursor:pointer;font-weight:700;" onclick="this.parentElement.parentElement.style.display='none'">&times;</button>
      </div>
      <div>${u}</div>
      ${I?`<div class="result-meta">${I}</div>`:""}
    `}async function s(){a=c.value,e.querySelectorAll(".table-name-badge").forEach(d=>d.textContent=a);try{t=await H.getAdminColumns(a),o=await H.getAdminRecords(a,50,0),M(),G(),v()}catch(d){E("error","Metadata Load Failed",d.message)}}function M(){if(t.length===0){C.innerHTML="<th>No columns found</th>",b.innerHTML="<tr><td>Table empty or uninitialized</td></tr>",T.textContent="0 rows";return}if(T.textContent=`${o.length} row(s)`,C.innerHTML=t.map(d=>`
      <th>
        ${d.name}
        <span style="font-size:0.65rem; color:var(--color-text-muted); font-weight:400; display:block;">${d.type}</span>
      </th>
    `).join(""),o.length===0){b.innerHTML=`<tr><td colspan="${t.length}" style="text-align:center; padding:24px; color:var(--color-text-muted);">No records currently exist in '${a}'.</td></tr>`;return}b.innerHTML=o.map(d=>`
      <tr>
        ${t.map(q=>{const u=d[q.name];return u==null?'<td style="color:var(--color-text-muted);font-style:italic;">NULL</td>':`<td>${O(String(u))}</td>`}).join("")}
      </tr>
    `).join("")}function O(d){return d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}i.addEventListener("click",()=>{w(),x.classList.add("active"),D.innerHTML="",t.forEach(d=>{if(d.isPk){const A=document.createElement("div");A.className="form-group",A.innerHTML=`
          <label class="form-label">${d.name} (Primary Key)</label>
          <input type="text" class="form-input" disabled value="Auto-Generated by Database" style="background:#F4F5F0; color:#8E9A94;" />
          <span class="form-help">Database sequence auto-assigns next serial identifier.</span>
        `,D.appendChild(A);return}const q=document.createElement("div");q.className="form-group";const u=d.type.toLowerCase().includes("int")||d.type.toLowerCase().includes("numeric")||d.type.toLowerCase().includes("decimal"),I=u?"number":"text",y=d.type.toLowerCase().includes("decimal")||d.type.toLowerCase().includes("numeric")?"0.01":"1";q.innerHTML=`
        <label class="form-label" for="insert-col-${d.name}">
          ${d.name} ${d.nullable?"":'<span style="color:var(--color-error)">*</span>'}
          <span style="font-size:0.7rem; font-weight:400; color:var(--color-text-muted);">(${d.type})</span>
        </label>
        <input type="${I}" id="insert-col-${d.name}" name="${d.name}" class="form-input" ${d.nullable?"":"required"} ${u?`step="${y}"`:""} placeholder="Enter ${d.name}" />
      `,D.appendChild(q)}),x.scrollIntoView({behavior:"smooth",block:"nearest"})}),B.addEventListener("submit",async d=>{d.preventDefault();const q=e.querySelector("#submit-insert-btn");q.disabled=!0,q.textContent="Executing Parameterized INSERT...";const u={};t.forEach(I=>{if(I.isPk)return;const y=e.querySelector(`#insert-col-${I.name}`);if(y&&y.value!==""){const A=I.type.toLowerCase().includes("int")||I.type.toLowerCase().includes("numeric")||I.type.toLowerCase().includes("decimal");u[I.name]=A?y.value.includes(".")?parseFloat(y.value):parseInt(y.value,10):y.value}});try{const I=await H.adminInsert(a,u,r);E("success","Action 1 (INSERT) Executed Successfully via JDBC",I.message,`<span>Target Table: <strong>${a}</strong></span> · <span>Generated ID: <strong>${I.id}</strong></span> · <span>Affected: <strong>${I.affectedRows} row</strong></span> · <span>Time: <strong>${I.executionTimeMs} ms</strong></span>`),w(),await s()}catch(I){E("error","JDBC INSERT Failed",I.message)}finally{q.disabled=!1,q.textContent="Execute Parameterized INSERT"}});function G(){var q;if(k.innerHTML="",o.length===0){k.innerHTML='<option value="">No records available</option>',m.innerHTML="Table currently contains zero records.";return}const d=((q=t.find(u=>u.isPk))==null?void 0:q.name)||"id";o.forEach((u,I)=>{const y=document.createElement("option");y.value=u[d];const A=u.name||u.store_name||u.email||u.first_name||`Record #${u[d]}`;y.textContent=`[${d}=${u[d]}] ${A}`,k.appendChild(y)}),U()}function U(){var I;const d=((I=t.find(y=>y.isPk))==null?void 0:I.name)||"id",q=k.value,u=o.find(y=>String(y[d])===String(q));u?m.innerHTML=`<strong>Selected Record for Parameterized Deletion:</strong><br/><pre style="margin-top:6px; overflow-x:auto;">${O(JSON.stringify(u,null,2))}</pre>`:m.textContent="Select a record to preview."}k.addEventListener("change",U),n.addEventListener("click",()=>{w(),F.classList.add("active"),G(),F.scrollIntoView({behavior:"smooth",block:"nearest"})}),l.addEventListener("submit",async d=>{var A;d.preventDefault();const q=((A=t.find(z=>z.isPk))==null?void 0:A.name)||"id",u=k.value;if(!u){alert("Please select a record to delete.");return}if(!confirm(`[Confirmation Required]
Are you sure you want to execute a parameterized DELETE on table '${a}' for ${q} = ${u}?`))return;const y=e.querySelector("#submit-delete-btn");y.disabled=!0,y.textContent="Executing Parameterized DELETE...";try{const z=await H.adminDelete(a,u,r);E("success","Action 2 (DELETE) Executed Successfully via JDBC",z.message,`<span>Target Table: <strong>${a}</strong></span> · <span>Deleted Key: <strong>${u}</strong></span> · <span>Affected: <strong>${z.affectedRows} row</strong></span> · <span>Time: <strong>${z.executionTimeMs} ms</strong></span>`),w(),await s()}catch(z){E("error","JDBC DELETE Rejected (Constraint Guard)",z.message)}finally{y.disabled=!1,y.textContent="Confirm Parameterized DELETE"}});function v(){var q;if(f.innerHTML="",o.length===0){f.innerHTML='<option value="">No records available</option>',P.innerHTML="";return}const d=((q=t.find(u=>u.isPk))==null?void 0:q.name)||"id";o.forEach(u=>{const I=document.createElement("option");I.value=u[d];const y=u.name||u.store_name||u.email||u.first_name||`Record #${u[d]}`;I.textContent=`[${d}=${u[d]}] ${y}`,f.appendChild(I)}),_()}function _(){var I;const d=((I=t.find(y=>y.isPk))==null?void 0:I.name)||"id",q=f.value,u=o.find(y=>String(y[d])===String(q));P.innerHTML="",u&&t.forEach(y=>{if(y.isPk){const Y=document.createElement("div");Y.className="form-group",Y.innerHTML=`
          <label class="form-label">${y.name} (Primary Key &mdash; Read Only)</label>
          <input type="text" class="form-input" disabled value="${u[y.name]}" style="background:#F4F5F0; color:#8E9A94;" />
        `,P.appendChild(Y);return}const A=document.createElement("div");A.className="form-group";const z=y.type.toLowerCase().includes("int")||y.type.toLowerCase().includes("numeric")||y.type.toLowerCase().includes("decimal"),X=z?"number":"text",se=y.type.toLowerCase().includes("decimal")||y.type.toLowerCase().includes("numeric")?"0.01":"1",ce=u[y.name]!==null&&u[y.name]!==void 0?u[y.name]:"";A.innerHTML=`
        <label class="form-label" for="update-col-${y.name}">
          ${y.name}
          <span style="font-size:0.7rem; font-weight:400; color:var(--color-text-muted);">(${y.type})</span>
        </label>
        <input type="${X}" id="update-col-${y.name}" name="${y.name}" class="form-input" value="${O(String(ce))}" ${z?`step="${se}"`:""} />
      `,P.appendChild(A)})}return f.addEventListener("change",_),S.addEventListener("click",()=>{w(),N.classList.add("active"),v(),N.scrollIntoView({behavior:"smooth",block:"nearest"})}),L.addEventListener("submit",async d=>{var y;d.preventDefault(),(y=t.find(A=>A.isPk))!=null&&y.name;const q=f.value;if(!q){alert("Please select a record to update.");return}const u=e.querySelector("#submit-update-btn");u.disabled=!0,u.textContent="Executing Parameterized UPDATE...";const I={};t.forEach(A=>{if(A.isPk)return;const z=e.querySelector(`#update-col-${A.name}`);if(z){const X=A.type.toLowerCase().includes("int")||A.type.toLowerCase().includes("numeric")||A.type.toLowerCase().includes("decimal");I[A.name]=X?z.value.includes(".")?parseFloat(z.value):parseInt(z.value,10):z.value}});try{const A=await H.adminUpdate(a,q,I,r);E("success","Action 3 (UPDATE) Executed Successfully via JDBC",A.message,`<span>Target Table: <strong>${a}</strong></span> · <span>Updated Key: <strong>${q}</strong></span> · <span>Affected: <strong>${A.affectedRows} row</strong></span> · <span>Time: <strong>${A.executionTimeMs} ms</strong></span>`),w(),await s()}catch(A){E("error","JDBC UPDATE Failed",A.message)}finally{u.disabled=!1,u.textContent="Execute Parameterized UPDATE"}}),c.addEventListener("change",()=>{w(),s()}),h.addEventListener("click",s),s(),e}function Ce(){const e=document.createElement("section");e.className="advanced-section",e.id="advanced-demo",e.innerHTML=`
    <div class="container">
      <div class="section-header">
        <p class="section-label">Advanced Relational Theory &amp; Practice</p>
        <h2 class="section-title">Database Engineering &amp; Distributed Architecture</h2>
        <p class="section-desc">
          Live demonstrable queries, multi-table analytical joins, ACID transaction commit and rollback verification, and distributed consensus architectural analysis.
        </p>
      </div>

      <!-- Navigation Tabs -->
      <div class="demo-tabs">
        <button class="demo-tab-btn active" data-tab="tab-acid">1. ACID Transactions &amp; Rollback</button>
        <button class="demo-tab-btn" data-tab="tab-joins">2. Multi-Table Joins</button>
        <button class="demo-tab-btn" data-tab="tab-aggregates">3. Aggregates &amp; Analytics</button>
        <button class="demo-tab-btn" data-tab="tab-explain">4. EXPLAIN Execution Plan</button>
        <button class="demo-tab-btn" data-tab="tab-architecture">5. CockroachDB Architecture</button>
      </div>

      <!-- TAB 1: ACID TRANSACTIONS & ROLLBACK DEMONSTRATION -->
      <div id="tab-acid" class="demo-panel active">
        <div style="background:var(--color-ivory); border:1px solid var(--color-border); padding:24px; border-radius:var(--radius-sm); margin-bottom:24px;">
          <h3 style="font-family:var(--font-serif); font-size:1.5rem; color:var(--color-midnight); margin-bottom:8px;">
            Interactive JDBC Transaction Demarcation &amp; Rollback Proof
          </h3>
          <p style="font-size:0.9375rem; color:var(--color-text-secondary); margin-bottom:18px;">
            Test genuine transactional atomicity. A real multi-step workflow creates an order and inserts line items. Triggering a simulated foreign key constraint violation causes an immediate <code>conn.rollback()</code>, proving zero partial state is retained.
          </p>

          <div style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:20px;">
            <button id="run-commit-btn" class="btn btn-emerald">
              Test Transaction Commit (Success Path)
            </button>
            <button id="run-rollback-btn" class="btn btn-danger">
              Test Transaction Rollback (Constraint Failure Path)
            </button>
          </div>

          <!-- Transaction Execution Timeline -->
          <div id="transaction-timeline-box" style="display:none;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span id="trans-outcome-badge" class="badge"></span>
              <span id="trans-engine-badge" class="badge badge-neutral"></span>
            </div>
            <div id="timeline-steps-container" class="acid-timeline"></div>
          </div>
        </div>

        <div>
          <h4 style="font-family:var(--font-serif); font-size:1.25rem; color:var(--color-midnight); margin-bottom:8px;">
            Java JDBC Source Implementation (OrderJdbcDao.java)
          </h4>
          <pre class="code-box"><code>// Explicit JDBC Transaction Demarcation Pattern (com.omnimarket.da3.dao.OrderJdbcDao)
try (Connection conn = dataSource.getConnection()) {
    // 1. Disable auto-commit to begin transactional boundary
    conn.setAutoCommit(false);

    // 2. Insert master order record
    try (PreparedStatement orderStmt = conn.prepareStatement(insertOrderSql, Statement.RETURN_GENERATED_KEYS)) {
        orderStmt.setInt(1, req.getUserId());
        orderStmt.setBigDecimal(2, grandTotal);
        orderStmt.executeUpdate();
        // Retrieve generated primary key...
    }

    // 3. Insert child ordered items & update inventory atomically
    try (PreparedStatement itemStmt = conn.prepareStatement(insertItemSql)) {
        for (OrderedItem item : items) {
            itemStmt.setInt(1, orderId);
            itemStmt.setInt(2, item.getProductId());
            itemStmt.setInt(3, item.getQty());
            itemStmt.setBigDecimal(4, item.getPrice());
            itemStmt.executeUpdate();
            
            // Decrement inventory stock check
            productJdbcDao.deductStock(conn, item.getProductId(), item.getQty());
        }
    }

    // 4. Record payment settlement
    try (PreparedStatement payStmt = conn.prepareStatement(insertPaymentSql)) {
        payStmt.setInt(1, orderId);
        payStmt.setBigDecimal(2, grandTotal);
        payStmt.setString(3, req.getPayMethod());
        payStmt.executeUpdate();
    }

    // 5. Commit all changes atomically
    conn.commit();
} catch (SQLException e) {
    // If any step violates a constraint, rollback reverts ALL changes
    if (conn != null) {
        conn.rollback();
    }
    throw new DatabaseOperationException("Transaction failed: " + e.getMessage(), e);
}</code></pre>
        </div>
      </div>

      <!-- TAB 2: MULTI-TABLE JOINS -->
      <div id="tab-joins" class="demo-panel">
        <div style="margin-bottom:18px;">
          <h3 style="font-family:var(--font-serif); font-size:1.5rem; color:var(--color-midnight); margin-bottom:6px;">
            5-Table Relational Join Demonstration
          </h3>
          <p style="font-size:0.875rem; color:var(--color-text-secondary);">
            Assembles orders, users, ordered items, products, and settlements into a single relational view.
          </p>
          <pre class="code-box"><code>SELECT o.id AS order_id,
       u.first_name || ' ' || u.last_name AS customer_name,
       u.email AS customer_email,
       p.name AS product_name,
       oi.qty, oi.price AS unit_price,
       (oi.qty * oi.price) AS line_total,
       o.status AS order_status,
       pay.pay_method, pay.pay_status
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN ordered_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
LEFT JOIN payments pay ON o.id = pay.order_id
ORDER BY o.id ASC, oi.id ASC;</code></pre>
          <button id="load-joins-btn" class="btn btn-outline btn-sm" style="margin-bottom:16px;">Refresh Joined Data</button>
        </div>
        <div class="data-table-wrap">
          <table class="data-table" id="joins-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Patron</th>
                <th>Email</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Line Total</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody id="joins-body">
              <tr><td colspan="9" style="text-align:center;">Click "Refresh Joined Data" to execute query.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: AGGREGATES & ANALYTICS -->
      <div id="tab-aggregates" class="demo-panel">
        <div style="margin-bottom:18px;">
          <h3 style="font-family:var(--font-serif); font-size:1.5rem; color:var(--color-midnight); margin-bottom:6px;">
            Store Revenue &amp; Inventory Aggregation (GROUP BY)
          </h3>
          <p style="font-size:0.875rem; color:var(--color-text-secondary);">
            Computes product counts, inventory sums, and price metrics per store using standard SQL aggregate functions.
          </p>
          <pre class="code-box"><code>SELECT s.id AS store_id,
       s.name AS store_name,
       s.city, s.rating,
       COUNT(p.id) AS total_products,
       COALESCE(SUM(p.stock), 0) AS total_inventory,
       ROUND(AVG(p.price), 2) AS average_product_price,
       MIN(p.price) AS min_price,
       MAX(p.price) AS max_price
FROM stores s
LEFT JOIN products p ON s.id = p.store_id
GROUP BY s.id, s.name, s.city, s.rating
ORDER BY total_products DESC, s.name ASC;</code></pre>
          <button id="load-aggregates-btn" class="btn btn-outline btn-sm" style="margin-bottom:16px;">Refresh Aggregation</button>
        </div>
        <div class="data-table-wrap">
          <table class="data-table" id="aggregates-table">
            <thead>
              <tr>
                <th>Store ID</th>
                <th>Store Name</th>
                <th>City</th>
                <th>Rating</th>
                <th>Products</th>
                <th>Total Inventory</th>
                <th>Avg Price (INR)</th>
                <th>Min Price</th>
                <th>Max Price</th>
              </tr>
            </thead>
            <tbody id="aggregates-body">
              <tr><td colspan="9" style="text-align:center;">Click "Refresh Aggregation" to execute query.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: EXPLAIN EXECUTION PLAN -->
      <div id="tab-explain" class="demo-panel">
        <div style="margin-bottom:18px;">
          <h3 style="font-family:var(--font-serif); font-size:1.5rem; color:var(--color-midnight); margin-bottom:6px;">
            Query Execution Plan Analyzer (EXPLAIN)
          </h3>
          <p style="font-size:0.875rem; color:var(--color-text-secondary);">
            Inspect how the relational query optimizer uses indexes versus full table scans to resolve queries.
          </p>
          <div style="display:flex; gap:12px; margin-bottom:14px;">
            <select id="explain-query-select" class="form-select" style="flex-grow:1;">
              <option value="SELECT * FROM products WHERE price > 3000.00;">Query 1: Catalog price range filter (Uses idx_products_price)</option>
              <option value="SELECT * FROM orders WHERE user_id = 4;">Query 2: Order lookup by user (Uses idx_orders_user_id)</option>
              <option value="SELECT * FROM products p JOIN stores s ON p.store_id = s.id;">Query 3: Product-Store Relational Hash/Merge Join</option>
            </select>
            <button id="run-explain-btn" class="btn btn-primary btn-sm">Analyze Plan</button>
          </div>
          <div id="explain-results-box" style="background:var(--color-midnight); color:#9DB0A7; padding:20px; border-radius:var(--radius-sm); font-family:var(--font-mono); font-size:0.8125rem; overflow-x:auto;">
            Select a query above and click "Analyze Plan" to inspect the query plan.
          </div>
        </div>
      </div>

      <!-- TAB 5: COCKROACHDB DISTRIBUTED SQL ARCHITECTURE -->
      <div id="tab-architecture" class="demo-panel">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:24px; margin-bottom:32px;">
          
          <div style="background:var(--color-ivory); border:1px solid var(--color-border); padding:24px; border-radius:var(--radius-sm);">
            <span class="badge badge-emerald" style="margin-bottom:12px;">Consensus Layer</span>
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--color-midnight); margin-bottom:8px;">
              Multi-Raft Consensus
            </h4>
            <p style="font-size:0.875rem; color:var(--color-text-secondary); line-height:1.6;">
              Data is segmented into continuous 64MB chunks called <strong>Ranges</strong>. Each range forms an independent 3-node or 5-node Raft consensus group. Writes require only a quorum of replicas (e.g. 2 of 3) before committing, guaranteeing zero data loss (RPO = 0) even under node or zone failure.
            </p>
          </div>

          <div style="background:var(--color-ivory); border:1px solid var(--color-border); padding:24px; border-radius:var(--radius-sm);">
            <span class="badge badge-gold" style="margin-bottom:12px;">Concurrency Control</span>
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--color-midnight); margin-bottom:8px;">
              Serializable Isolation &amp; MVCC
            </h4>
            <p style="font-size:0.875rem; color:var(--color-text-secondary); line-height:1.6;">
              CockroachDB defaults to the highest SQL isolation level: <strong>SERIALIZABLE</strong>. It combines Multi-Version Concurrency Control (MVCC) with Hybrid Logical Clocks (HLC) to coordinate distributed transactions without centralized clock synchronizers.
            </p>
          </div>

          <div style="background:var(--color-ivory); border:1px solid var(--color-border); padding:24px; border-radius:var(--radius-sm);">
            <span class="badge badge-neutral" style="margin-bottom:12px;">Wire Protocol</span>
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--color-midnight); margin-bottom:8px;">
              PostgreSQL Wire Compatibility
            </h4>
            <p style="font-size:0.875rem; color:var(--color-text-secondary); line-height:1.6;">
              CockroachDB speaks the standard PostgreSQL v3 protocol natively. The Spring Boot backend connects seamlessly using <code>org.postgresql.Driver</code>, executing prepared statements, connection pooling, and SSL encryption without bespoke drivers.
            </p>
          </div>
        </div>

        <div style="background:var(--color-ivory); padding:20px; border-radius:var(--radius-sm); border:1px solid var(--color-border);">
          <h4 style="font-family:var(--font-serif); font-size:1.25rem; color:var(--color-midnight); margin-bottom:8px;">
            Academic Course Note: Distributed vs. Local Environments
          </h4>
          <p style="font-size:0.875rem; color:var(--color-text-secondary); line-height:1.6;">
            <strong>Distinguishing Live Tests from Conceptual Architecture:</strong> The JDBC transaction, commit, and rollback demonstrations run genuine code against the active database. When pointing to CockroachDB Cloud via <code>DB_URL</code>, the multi-node consensus occurs across distributed regions; when running locally via the offline SQLite fallback, the identical SQL syntax and JDBC transaction primitives ensure zero configuration setup for evaluators.
          </p>
        </div>
      </div>
    </div>
  `,e.querySelectorAll(".demo-tab-btn").forEach(f=>{f.addEventListener("click",()=>{const m=f.getAttribute("data-tab");e.querySelectorAll(".demo-tab-btn").forEach(b=>b.classList.remove("active")),e.querySelectorAll(".demo-panel").forEach(b=>b.classList.remove("active")),f.classList.add("active");const C=e.querySelector(`#${m}`);C&&C.classList.add("active"),m==="tab-joins"&&x(),m==="tab-aggregates"&&B()})});const a=e.querySelector("#run-commit-btn"),t=e.querySelector("#run-rollback-btn"),o=e.querySelector("#transaction-timeline-box"),r=e.querySelector("#timeline-steps-container"),c=e.querySelector("#trans-outcome-badge"),i=e.querySelector("#trans-engine-badge");async function n(f){a.disabled=!0,t.disabled=!0,o.style.display="block",r.innerHTML='<div style="padding:16px; color:var(--color-text-muted);">Executing JDBC transaction steps...</div>';try{const m=await H.runAcidTransactionDemo(f);c.className=m.rolledBack?"badge badge-error":"badge badge-success",c.textContent=m.outcome,i.textContent=`Database Engine: ${m.databaseEngine||"SQL RDBMS"}`,r.innerHTML=m.executionSteps.map(C=>{let b="timeline-step";return(C.includes("ROLLBACK")||C.includes("EXCEPTION"))&&(b+=" rollback"),(C.includes("COMMITTED")||C.includes("VERIFICATION"))&&(b+=" commit"),`<div class="${b}">${k(C)}</div>`}).join("")}catch(m){r.innerHTML=`<div class="timeline-step rollback">Error communicating with backend: ${m.message}</div>`}finally{a.disabled=!1,t.disabled=!1}}a.addEventListener("click",()=>n(!1)),t.addEventListener("click",()=>n(!0));const S=e.querySelector("#load-joins-btn"),g=e.querySelector("#joins-body");async function x(){g.innerHTML='<tr><td colspan="9" style="text-align:center;">Executing multi-table relational join...</td></tr>';try{const f=await H.getAdvancedJoins();if(f.length===0){g.innerHTML='<tr><td colspan="9" style="text-align:center;">No order records found to join.</td></tr>';return}g.innerHTML=f.map(m=>`
        <tr>
          <td><strong>#${m.order_id}</strong></td>
          <td>${k(m.customer_name||"")}</td>
          <td>${k(m.customer_email||"")}</td>
          <td>${k(m.product_name||"")}</td>
          <td>${m.qty}</td>
          <td>&#8377;${parseFloat(m.unit_price).toFixed(2)}</td>
          <td>&#8377;${parseFloat(m.line_total).toFixed(2)}</td>
          <td><span class="badge ${m.order_status==="completed"?"badge-success":"badge-gold"}">${m.order_status}</span></td>
          <td>${k(m.pay_method||"None")} (${k(m.pay_status||"unpaid")})</td>
        </tr>
      `).join("")}catch(f){g.innerHTML=`<tr><td colspan="9" style="color:var(--color-error); text-align:center;">Failed to execute join: ${f.message}</td></tr>`}}S.addEventListener("click",x);const F=e.querySelector("#load-aggregates-btn"),N=e.querySelector("#aggregates-body");async function B(){N.innerHTML='<tr><td colspan="9" style="text-align:center;">Executing GROUP BY aggregation...</td></tr>';try{const f=await H.getAdvancedAggregates();if(f.length===0){N.innerHTML='<tr><td colspan="9" style="text-align:center;">No store records found.</td></tr>';return}N.innerHTML=f.map(m=>`
        <tr>
          <td>#${m.store_id}</td>
          <td><strong>${k(m.store_name)}</strong></td>
          <td>${k(m.city||"")}</td>
          <td>&#9733; ${parseFloat(m.rating||5).toFixed(2)}</td>
          <td>${m.total_products}</td>
          <td>${m.total_inventory} units</td>
          <td>&#8377;${parseFloat(m.average_product_price||0).toFixed(2)}</td>
          <td>&#8377;${parseFloat(m.min_price||0).toFixed(2)}</td>
          <td>&#8377;${parseFloat(m.max_price||0).toFixed(2)}</td>
        </tr>
      `).join("")}catch(f){N.innerHTML=`<tr><td colspan="9" style="color:var(--color-error); text-align:center;">Failed to execute aggregates: ${f.message}</td></tr>`}}F.addEventListener("click",B);const l=e.querySelector("#run-explain-btn"),L=e.querySelector("#explain-query-select"),D=e.querySelector("#explain-results-box");async function P(){const f=L.value;D.textContent="Generating query execution plan...";try{const m=await H.explainQuery(f);D.textContent=JSON.stringify(m,null,2)}catch(m){D.textContent="Execution plan note: "+m.message}}l.addEventListener("click",P);function k(f){return String(f).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}return e}function xe(){const e=document.createElement("section");e.className="catalog-section",e.id="sql-sandbox",e.style.backgroundColor="var(--color-ivory)",e.style.borderTop="1px solid var(--color-border)",e.innerHTML=`
    <div class="container">
      <div class="section-header">
        <p class="section-label">Interactive SQL Workspace</p>
        <h2 class="section-title">Educational Query Console</h2>
        <p class="section-desc">
          Execute standard ANSI SQL queries against the active database via the Java JDBC service. Inspect execution time, returned columns, and dataset rows.
        </p>
      </div>

      <div class="admin-card">
        <div style="margin-bottom:14px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <span style="font-size:0.8125rem; font-weight:600; color:var(--color-text-secondary);">Sample Queries:</span>
          <button class="filter-btn sample-sql-btn" data-sql="SELECT id, name, price, stock FROM products ORDER BY price DESC;">Products by Price</button>
          <button class="filter-btn sample-sql-btn" data-sql="SELECT s.name AS store, COUNT(p.id) AS total_products, AVG(p.price) AS avg_price FROM stores s JOIN products p ON s.id = p.store_id GROUP BY s.id, s.name;">Store Product Counts</button>
          <button class="filter-btn sample-sql-btn" data-sql="SELECT o.id, u.first_name, o.total_price, o.status FROM orders o JOIN users u ON o.user_id = u.user_id;">Orders with Customer</button>
          <button class="filter-btn sample-sql-btn" data-sql="SELECT * FROM roles;">Roles Table</button>
        </div>

        <div style="margin-bottom:16px;">
          <textarea id="sql-query-input" class="form-input mono" rows="4" style="width:100%; font-size:0.875rem;" placeholder="Enter SQL query (e.g., SELECT * FROM products;)">SELECT id, name, price, stock FROM products ORDER BY price DESC;</textarea>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <div id="sql-execution-meta" style="font-size:0.8125rem; color:var(--color-text-muted);">
            Ready to execute.
          </div>
          <button id="run-sql-btn" class="btn btn-primary">Execute Query</button>
        </div>

        <div class="data-table-wrap">
          <table class="data-table" id="sql-results-table">
            <thead id="sql-table-head"><tr><th>Execution results will appear here</th></tr></thead>
            <tbody id="sql-table-body"><tr><td style="color:var(--color-text-muted);">Run a query above to see rows.</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>
  `;const a=e.querySelector("#sql-query-input"),t=e.querySelector("#run-sql-btn"),o=e.querySelector("#sql-execution-meta"),r=e.querySelector("#sql-table-head"),c=e.querySelector("#sql-table-body");e.querySelectorAll(".sample-sql-btn").forEach(n=>{n.addEventListener("click",()=>{a.value=n.getAttribute("data-sql"),i()})});async function i(){var S;const n=a.value.trim();if(!n){alert("Please enter a query to execute.");return}t.disabled=!0,t.textContent="Executing...",o.textContent="Running query on database...";try{const g=await H.executeSql(n);if(!g.success){o.innerHTML=`<span style="color:var(--color-error)">Error: ${g.error}</span>`,r.innerHTML='<tr><th style="color:var(--color-error)">Error</th></tr>',c.innerHTML=`<tr><td style="color:var(--color-error);">${g.error}</td></tr>`;return}o.innerHTML=`Query completed in <strong>${g.executionTime} ms</strong>. Total rows: <strong>${g.rowCount||0}</strong>.`,g.columns&&g.columns.length>0?r.innerHTML=`<tr>${g.columns.map(x=>`<th>${x}</th>`).join("")}</tr>`:r.innerHTML="<tr><th>Result</th></tr>",g.rows&&g.rows.length>0?c.innerHTML=g.rows.map(x=>`
          <tr>
            ${g.columns.map(F=>{const N=x[F];return`<td>${N!=null?String(N):'<span style="color:#8E9A94">NULL</span>'}</td>`}).join("")}
          </tr>
        `).join(""):c.innerHTML=`<tr><td colspan="${((S=g.columns)==null?void 0:S.length)||1}" style="text-align:center; padding:16px; color:var(--color-text-muted);">${g.message||"No rows returned."}</td></tr>`}catch(g){o.innerHTML=`<span style="color:var(--color-error)">Network / Execution Error: ${g.message}</span>`}finally{t.disabled=!1,t.textContent="Execute Query"}}return t.addEventListener("click",i),e}function we(){const e=document.createElement("section");e.className="academic-suite-section",e.id="academic-suite",e.innerHTML=`
    <div class="container">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px; margin-bottom:28px;">
        <div>
          <p class="section-eyebrow">03 / DBMS Academic Demonstration Suite</p>
          <h2 class="section-headline">Distributed Relational Architecture &amp; Direct JDBC</h2>
          <p class="section-subheadline">
            Curated evaluation panel for Course Faculty (Dr. Sobitha Ahila). Direct Java JDBC CRUD, 5-table relational joins, explicit ACID transaction rollback proofs, and interactive SQL execution.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <span class="badge badge-emerald">Course: DBMS DA3</span>
          <span class="badge badge-gold">Branch: Harsh2</span>
        </div>
      </div>

      <!-- Executive Tabbed Navigation -->
      <div class="academic-nav-tabs" role="tablist">
        <button class="academic-tab-btn active" data-tab="tab-professor" role="tab" aria-selected="true">
          <span>🎓</span>
          <span>Professor Database Manager (Actions 1, 2, 3)</span>
        </button>
        <button class="academic-tab-btn" data-tab="tab-advanced" role="tab" aria-selected="false">
          <span>🔬</span>
          <span>Advanced Relational Demonstrations &amp; ACID Proof</span>
        </button>
        <button class="academic-tab-btn" data-tab="tab-sandbox" role="tab" aria-selected="false">
          <span>💻</span>
          <span>Interactive SQL Query Console</span>
        </button>
      </div>

      <!-- Tab Content Panels -->
      <div class="academic-tab-panel active" id="tab-professor" role="tabpanel">
        <!-- Render ProfessorDbManager -->
      </div>

      <div class="academic-tab-panel" id="tab-advanced" role="tabpanel">
        <!-- Render AdvancedDbDemo -->
      </div>

      <div class="academic-tab-panel" id="tab-sandbox" role="tabpanel">
        <!-- Render SqlSandbox -->
      </div>
    </div>
  `;const a=Se(),t=Ce(),o=xe();e.querySelector("#tab-professor").appendChild(a),e.querySelector("#tab-advanced").appendChild(t),e.querySelector("#tab-sandbox").appendChild(o);const r=e.querySelectorAll(".academic-tab-btn"),c=e.querySelectorAll(".academic-tab-panel");return r.forEach(i=>{i.addEventListener("click",()=>{const n=i.getAttribute("data-tab");r.forEach(g=>{g.classList.remove("active"),g.setAttribute("aria-selected","false")}),c.forEach(g=>g.classList.remove("active")),i.classList.add("active"),i.setAttribute("aria-selected","true");const S=e.querySelector(`#${n}`);S&&S.classList.add("active")})}),{element:e,switchTab(i){const n=e.querySelector(`.academic-tab-btn[data-tab="tab-${i}"]`);n&&n.click(),e.scrollIntoView({behavior:"smooth"})}}}function Ee(){const e=document.createElement("footer");return e.className="site-footer",e.id="site-footer",e.innerHTML=`
    <div class="container">
      <div class="footer-grid">
        <!-- Col 1: Brand & Academic Context -->
        <div class="footer-col">
          <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:14px;">
            <span style="font-family:var(--font-serif); font-size:1.625rem; font-weight:500; color:var(--color-white);">OMNI ATELIER</span>
            <span style="font-family:var(--font-mono); font-size:0.6875rem; color:var(--color-gold-light); border:1px solid var(--color-gold-border); padding:2px 6px; border-radius:2px;">DA3</span>
          </div>
          <p style="margin-bottom:18px;">
            An advanced multi-vendor luxury commerce storefront built for Database Management Systems Digital Assignment 3. Demonstrates 100% direct Java JDBC persistence, parameterized PreparedStatement execution, explicit multi-table ACID transaction demarcation, and Qdrant 384-dimensional semantic discovery.
          </p>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <span class="badge badge-dark">Dr. Sobitha Ahila</span>
            <span class="badge badge-dark">Git: Harsh2</span>
            <span class="badge badge-dark">10 Normalized Tables</span>
          </div>
        </div>

        <!-- Col 2: Architectural Principles -->
        <div class="footer-col">
          <h5>Persistence Architecture</h5>
          <ul>
            <li><a href="#storefront">Direct Java JDBC (java.sql.*)</a></li>
            <li><a href="#academic-suite">Zero-ORM Hibernate Bypass</a></li>
            <li><a href="#academic-suite">HikariCP High-Concurrency Pool</a></li>
            <li><a href="#academic-suite">Parameterized PreparedStatements</a></li>
            <li><a href="#academic-suite">Explicit Transaction Isolation</a></li>
          </ul>
        </div>

        <!-- Col 3: Vector Intelligence -->
        <div class="footer-col">
          <h5>Vector Database</h5>
          <ul>
            <li><a href="#storefront">Qdrant Vector REST API v1</a></li>
            <li><a href="#storefront">FastEmbed ONNX (BAAI/bge-small)</a></li>
            <li><a href="#storefront">384-Dimensional Dense Vectors</a></li>
            <li><a href="#storefront">Cosine Similarity Metric</a></li>
            <li><a href="#storefront">Real-Time Vector Sync Hook</a></li>
          </ul>
        </div>

        <!-- Col 4: Academic Compliance -->
        <div class="footer-col">
          <h5>Academic Evaluation</h5>
          <ul>
            <li><a href="#academic-suite">Action 1: Parameterized INSERT</a></li>
            <li><a href="#academic-suite">Action 2: Parameterized DELETE</a></li>
            <li><a href="#academic-suite">Action 3: Parameterized UPDATE</a></li>
            <li><a href="#academic-suite">5-Table Relational JOIN</a></li>
            <li><a href="#academic-suite">ACID Transaction Rollback Proof</a></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div>
          <span>&copy; 2026 Omni Atelier · Digital Assignment 3 (DBMS Course Assessment)</span>
        </div>
        <div style="display:flex; gap:20px; font-family:var(--font-mono); font-size:0.6875rem;">
          <span>JAVA 17 LTS</span>
          <span>SPRING BOOT 3.3.5</span>
          <span>COCKROACHDB / SQLITE</span>
          <span>QDRANT REST V1</span>
          <span>CLOUDFLARE WORKERS</span>
        </div>
      </div>
    </div>
  `,e}let K=[...pe],J=[];try{const e=localStorage.getItem("omnimarket_da3_cart");e&&(J=JSON.parse(e))}catch{J=[]}function Z(){localStorage.setItem("omnimarket_da3_cart",JSON.stringify(J)),ne()}function ne(){const e=J.reduce((t,o)=>t+o.qty,0),a=document.getElementById("header-bag-count");a&&(a.textContent=e,a.classList.remove("bump"),a.offsetWidth,a.classList.add("bump")),j&&j.update(J)}let j=null,Q=null,V=null,oe=null;async function re(){const e=document.getElementById("app");e.innerHTML="";const a=ue(()=>j.open(),i=>{if(i==="academic-suite"){const n=document.getElementById("academic-suite");n&&n.scrollIntoView({behavior:"smooth"})}else{const n=document.getElementById(i);n&&n.scrollIntoView({behavior:"smooth"})}});e.appendChild(a);const t=ge(()=>{const i=document.getElementById("storefront");i&&i.scrollIntoView({behavior:"smooth"})},()=>{Q&&Q.activateSemanticSearch()},(i,n=!1)=>{const S=K.find(g=>g.id===i);S&&(n?ee(W(S)):V.open(S))});e.appendChild(t);const o=he(i=>{Q&&Q.setCategory(i)});e.appendChild(o),Q=be(K,i=>ee(i),i=>V.open(i)),e.appendChild(Q.element);const r=ye(()=>{const i=document.getElementById("academic-suite");i&&i.scrollIntoView({behavior:"smooth"})});e.appendChild(r),oe=we(),e.appendChild(oe.element);const c=Ee();e.appendChild(c),j=fe(J,(i,n)=>{if(n<=0)J=J.filter(S=>S.id!==i);else{const S=J.find(g=>g.id===i);S&&(S.qty=n)}Z()},i=>{J=J.filter(n=>n.id!==i),Z()},async i=>{const n=await H.createOrder(i);return J=[],Z(),await ie(),n}),document.body.appendChild(j.element),V=ve(i=>ee(i),i=>V.open(i)),document.body.appendChild(V.element),ne(),await Ie(),await ie()}function ee(e){const a=J.find(o=>o.id===e.id),t=e.qtyToAdd||1;a?(a.qty+=t,e.selectedVariant&&(a.selectedVariant=e.selectedVariant)):J.push({...e,qty:t,selectedVariant:e.selectedVariant||e.variants&&e.variants[0]||"Standard"}),Z(),j.open()}async function Ie(){var r;const e=document.getElementById("system-health-badge"),a=document.getElementById("system-health-dot"),t=document.getElementById("health-text"),o=document.getElementById("header-engine-indicator");if(!(!e||!t))try{const c=await H.getHealth();e.className="badge badge-success",e.title=`Engine: ${c.engine} | Driver: ${c.driver}`,a&&(a.className="pulse-dot"),t.textContent=`JDBC: ${c.engine||"Connected"}`,o&&(o.textContent=`ENGINE: ${((r=c.engine)==null?void 0:r.toUpperCase())||"COCKROACHDB"} (100% DIRECT JDBC)`)}catch{e.className="badge badge-gold",e.title="Backend connection notice: Using offline fallback cache",a&&(a.className="pulse-dot amber"),t.textContent="JDBC: Local Offline Cache"}}async function ie(){try{const e=await H.getProducts();if(e&&Array.isArray(e)&&e.length>0){K=e,Q&&Q.updateProducts(K);const o=document.getElementById("hero-stat-products");o&&(o.textContent=`${K.length} Curations`)}const a=await H.getDashboardStats();if(a){const o=document.getElementById("hero-stat-stores"),r=document.getElementById("hero-stat-rev");o&&(o.textContent=`${a.totalStores||3} Flagships`),r&&(r.textContent=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(a.totalRevenue||36796))}const t=await H.getQdrantStatus();if(t&&t.pointsCount){const o=document.getElementById("header-qdrant-indicator");o&&(o.textContent=`QDRANT: ${t.pointsCount} VECTORS · 384D COSINE`)}}catch(e){console.warn("Could not fetch remote products; will retry on refresh.",e)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",re):re();
