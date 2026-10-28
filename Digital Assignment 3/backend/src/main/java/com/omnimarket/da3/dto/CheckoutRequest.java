package com.omnimarket.da3.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CheckoutRequest {
    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotNull(message = "Payment method is required")
    private String payMethod;

    @NotEmpty(message = "Cart items cannot be empty")
    private List<CartItemDto> items;

    public static class CartItemDto {
        private Integer productId;
        private Integer qty;

        public Integer getProductId() { return productId; }
        public void setProductId(Integer productId) { this.productId = productId; }

        public Integer getQty() { return qty; }
        public void setQty(Integer qty) { this.qty = qty; }
    }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getPayMethod() { return payMethod; }
    public void setPayMethod(String payMethod) { this.payMethod = payMethod; }

    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) { this.items = items; }
}
