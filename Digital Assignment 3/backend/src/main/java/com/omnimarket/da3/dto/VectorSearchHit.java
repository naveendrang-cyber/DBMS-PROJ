package com.omnimarket.da3.dto;

import java.math.BigDecimal;
import java.util.Map;

public class VectorSearchHit {
    private int id;
    private double score;
    private String name;
    private BigDecimal price;
    private String description;
    private String storeName;
    private String city;
    private Map<String, Object> payload;

    public VectorSearchHit() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Map<String, Object> getPayload() { return payload; }
    public void setPayload(Map<String, Object> payload) { this.payload = payload; }
}
