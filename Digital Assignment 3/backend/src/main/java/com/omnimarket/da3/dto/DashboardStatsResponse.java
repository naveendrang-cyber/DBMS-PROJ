package com.omnimarket.da3.dto;

import java.math.BigDecimal;

public class DashboardStatsResponse {
    private int totalUsers;
    private int totalSellers;
    private int totalStores;
    private int totalProducts;
    private int totalOrders;
    private int totalPayments;
    private BigDecimal totalRevenue;
    private int pendingWithdrawals;
    private int totalReviews;

    public DashboardStatsResponse() {}

    public int getTotalUsers() { return totalUsers; }
    public void setTotalUsers(int totalUsers) { this.totalUsers = totalUsers; }

    public int getTotalSellers() { return totalSellers; }
    public void setTotalSellers(int totalSellers) { this.totalSellers = totalSellers; }

    public int getTotalStores() { return totalStores; }
    public void setTotalStores(int totalStores) { this.totalStores = totalStores; }

    public int getTotalProducts() { return totalProducts; }
    public void setTotalProducts(int totalProducts) { this.totalProducts = totalProducts; }

    public int getTotalOrders() { return totalOrders; }
    public void setTotalOrders(int totalOrders) { this.totalOrders = totalOrders; }

    public int getTotalPayments() { return totalPayments; }
    public void setTotalPayments(int totalPayments) { this.totalPayments = totalPayments; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public int getPendingWithdrawals() { return pendingWithdrawals; }
    public void setPendingWithdrawals(int pendingWithdrawals) { this.pendingWithdrawals = pendingWithdrawals; }

    public int getTotalReviews() { return totalReviews; }
    public void setTotalReviews(int totalReviews) { this.totalReviews = totalReviews; }
}
