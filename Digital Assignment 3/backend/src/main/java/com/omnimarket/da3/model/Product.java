package com.omnimarket.da3.model;

import java.math.BigDecimal;

public class Product {
    private Integer id;
    private Integer storeId;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private String description;
    private String storeName;
    private String city;

    public Product() {}

    public Product(Integer id, Integer storeId, String name, BigDecimal price, Integer stock, String description) {
        this.id = id;
        this.storeId = storeId;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.description = description;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getStoreId() { return storeId; }
    public void setStoreId(Integer storeId) { this.storeId = storeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}
