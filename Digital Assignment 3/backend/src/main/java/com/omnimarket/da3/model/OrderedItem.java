package com.omnimarket.da3.model;

import java.math.BigDecimal;

public class OrderedItem {
    private Integer id;
    private Integer orderId;
    private Integer productId;
    private Integer qty;
    private BigDecimal price;
    private String productName;

    public OrderedItem() {}

    public OrderedItem(Integer id, Integer orderId, Integer productId, Integer qty, BigDecimal price) {
        this.id = id;
        this.orderId = orderId;
        this.productId = productId;
        this.qty = qty;
        this.price = price;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
}
