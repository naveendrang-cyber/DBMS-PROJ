package com.omnimarket.da3.model;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class Payment {
    private Integer payId;
    private Integer orderId;
    private BigDecimal amount;
    private Timestamp paidAt;
    private String payMethod;
    private String payStatus;

    public Payment() {}

    public Integer getPayId() { return payId; }
    public void setPayId(Integer payId) { this.payId = payId; }

    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Timestamp getPaidAt() { return paidAt; }
    public void setPaidAt(Timestamp paidAt) { this.paidAt = paidAt; }

    public String getPayMethod() { return payMethod; }
    public void setPayMethod(String payMethod) { this.payMethod = payMethod; }

    public String getPayStatus() { return payStatus; }
    public void setPayStatus(String payStatus) { this.payStatus = payStatus; }
}
