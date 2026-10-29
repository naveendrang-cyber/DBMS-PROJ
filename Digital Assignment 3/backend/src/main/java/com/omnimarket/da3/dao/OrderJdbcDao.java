package com.omnimarket.da3.dao;

import com.omnimarket.da3.dto.CheckoutRequest;
import com.omnimarket.da3.exception.DatabaseOperationException;
import com.omnimarket.da3.model.Order;
import com.omnimarket.da3.model.OrderedItem;
import com.omnimarket.da3.model.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class OrderJdbcDao extends BaseJdbcDao {

    private static final Logger logger = LoggerFactory.getLogger(OrderJdbcDao.class);

    @Autowired
    private ProductJdbcDao productJdbcDao;

    private static final int MAX_TRANSACTION_ATTEMPTS = 3;

    /**
     * Executes multi-table checkout using explicit JDBC Transaction (ACID).
     * CockroachDB runs every transaction at SERIALIZABLE isolation; when two checkouts conflict,
     * one is aborted with SQLSTATE 40001 and must be retried by the client, which happens here.
     */
    public Order createOrderWithTransaction(CheckoutRequest req) {
        for (int attempt = 1; ; attempt++) {
            try {
                return runCheckoutTransaction(req);
            } catch (SQLException e) {
                if ("40001".equals(e.getSQLState()) && attempt < MAX_TRANSACTION_ATTEMPTS) {
                    logger.warn("Serialization conflict on checkout (attempt {}/{}), retrying: {}",
                            attempt, MAX_TRANSACTION_ATTEMPTS, e.getMessage());
                    continue;
                }
                throw new DatabaseOperationException("Checkout transaction failed: " + e.getMessage(), e);
            }
        }
    }

    /**
     * One checkout attempt. Demonstrates setAutoCommit(false), commit(), and rollback().
     */
    private Order runCheckoutTransaction(CheckoutRequest req) throws SQLException {
        Connection conn = null;
        try {
            conn = dataSource.getConnection();
            // 1. Begin explicit transaction
            conn.setAutoCommit(false);
            logger.info("Starting explicit JDBC transaction for checkout (User ID: {})", req.getUserId());

            // 2. Fetch prices, verify stock, and calculate total amount
            BigDecimal grandTotal = BigDecimal.ZERO;
            List<OrderedItem> preparedItems = new ArrayList<>();

            for (CheckoutRequest.CartItemDto itemDto : req.getItems()) {
                if (itemDto.getQty() == null || itemDto.getQty() <= 0) {
                    throw new DatabaseOperationException("Invalid item quantity: " + itemDto.getQty());
                }

                String productSql = "SELECT name, price, stock FROM products WHERE id = ?";
                try (PreparedStatement pStmt = conn.prepareStatement(productSql)) {
                    pStmt.setInt(1, itemDto.getProductId());
                    try (ResultSet pRs = pStmt.executeQuery()) {
                        if (!pRs.next()) {
                            throw new DatabaseOperationException("Product with ID " + itemDto.getProductId() + " not found.");
                        }
                        String pName = pRs.getString("name");
                        BigDecimal price = pRs.getBigDecimal("price");
                        int stock = pRs.getInt("stock");

                        if (stock < itemDto.getQty()) {
                            throw new DatabaseOperationException("Insufficient stock for product '" + pName + "'. Available: " + stock + ", Requested: " + itemDto.getQty());
                        }

                        BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(itemDto.getQty()));
                        grandTotal = grandTotal.add(lineTotal);

                        OrderedItem item = new OrderedItem();
                        item.setProductId(itemDto.getProductId());
                        item.setProductName(pName);
                        item.setQty(itemDto.getQty());
                        item.setPrice(price);
                        preparedItems.add(item);
                    }
                }
            }

            // 3. Insert into orders table via PreparedStatement
            String insertOrderSql = "INSERT INTO orders (user_id, status, total_price) VALUES (?, 'completed', ?)";
            int orderId;
            try (PreparedStatement orderStmt = conn.prepareStatement(insertOrderSql, Statement.RETURN_GENERATED_KEYS)) {
                orderStmt.setInt(1, req.getUserId());
                orderStmt.setBigDecimal(2, grandTotal);
                orderStmt.executeUpdate();

                try (ResultSet genKeys = orderStmt.getGeneratedKeys()) {
                    if (genKeys.next()) {
                        orderId = genKeys.getInt(1);
                    } else {
                        throw new DatabaseOperationException("Failed to retrieve generated Order ID.");
                    }
                }
            }

            // 4. Insert each ordered_item and deduct stock via PreparedStatement
            String insertItemSql = "INSERT INTO ordered_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)";
            try (PreparedStatement itemStmt = conn.prepareStatement(insertItemSql)) {
                for (OrderedItem item : preparedItems) {
                    item.setOrderId(orderId);
                    itemStmt.setInt(1, orderId);
                    itemStmt.setInt(2, item.getProductId());
                    itemStmt.setInt(3, item.getQty());
                    itemStmt.setBigDecimal(4, item.getPrice());
                    itemStmt.executeUpdate();

                    // Deduct stock in same transaction
                    boolean stockUpdated = productJdbcDao.deductStock(conn, item.getProductId(), item.getQty());
                    if (!stockUpdated) {
                        throw new DatabaseOperationException("Failed to decrement inventory for product ID: " + item.getProductId());
                    }
                }
            }

            // 5. Insert payment record via PreparedStatement
            String insertPaymentSql = "INSERT INTO payments (order_id, amount, pay_method, pay_status) VALUES (?, ?, ?, 'completed')";
            Payment payment = new Payment();
            try (PreparedStatement payStmt = conn.prepareStatement(insertPaymentSql, Statement.RETURN_GENERATED_KEYS)) {
                payStmt.setInt(1, orderId);
                payStmt.setBigDecimal(2, grandTotal);
                payStmt.setString(3, req.getPayMethod() != null ? req.getPayMethod() : "UPI");
                payStmt.executeUpdate();

                try (ResultSet payKeys = payStmt.getGeneratedKeys()) {
                    if (payKeys.next()) {
                        payment.setPayId(payKeys.getInt(1));
                    }
                }
                payment.setOrderId(orderId);
                payment.setAmount(grandTotal);
                payment.setPayMethod(req.getPayMethod());
                payment.setPayStatus("completed");
            }

            // 6. Commit the entire transaction atomically
            conn.commit();
            logger.info("JDBC Transaction successfully committed. Order #{} created.", orderId);

            Order order = new Order();
            order.setId(orderId);
            order.setUserId(req.getUserId());
            order.setStatus("completed");
            order.setTotalPrice(grandTotal);
            order.setItems(preparedItems);
            order.setPayment(payment);
            return order;

        } catch (SQLException | RuntimeException e) {
            // Roll back on every failure, including business-rule exceptions: otherwise the
            // setAutoCommit(true) in finally would commit the partial order.
            if (conn != null) {
                try {
                    logger.warn("Checkout transaction failed. Performing JDBC rollback: {}", e.getMessage());
                    conn.rollback();
                } catch (SQLException rollbackEx) {
                    logger.error("Error during transaction rollback: {}", rollbackEx.getMessage());
                }
            }
            throw e;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException closeEx) {
                    logger.error("Error closing connection: {}", closeEx.getMessage());
                }
            }
        }
    }

    /**
     * Fetch order by ID including line items and payment metadata
     */
    public Order findOrderById(int orderId) {
        String orderSql = """
            SELECT o.id, o.user_id, o.status, o.total_price,
                   u.first_name || ' ' || u.last_name AS customer_name
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            WHERE o.id = ?;
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(orderSql)) {
            pstmt.setInt(1, orderId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (!rs.next()) return null;

                Order order = new Order();
                order.setId(rs.getInt("id"));
                order.setUserId(rs.getInt("user_id"));
                order.setStatus(rs.getString("status"));
                order.setTotalPrice(rs.getBigDecimal("total_price"));
                order.setCustomerName(rs.getString("customer_name"));

                // Fetch items
                String itemsSql = """
                    SELECT oi.id, oi.order_id, oi.product_id, oi.qty, oi.price, p.name AS product_name
                    FROM ordered_items oi
                    JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = ?;
                """;
                try (PreparedStatement itemStmt = conn.prepareStatement(itemsSql)) {
                    itemStmt.setInt(1, orderId);
                    try (ResultSet itemRs = itemStmt.executeQuery()) {
                        List<OrderedItem> items = new ArrayList<>();
                        while (itemRs.next()) {
                            OrderedItem item = new OrderedItem();
                            item.setId(itemRs.getInt("id"));
                            item.setOrderId(itemRs.getInt("order_id"));
                            item.setProductId(itemRs.getInt("product_id"));
                            item.setQty(itemRs.getInt("qty"));
                            item.setPrice(itemRs.getBigDecimal("price"));
                            item.setProductName(itemRs.getString("product_name"));
                            items.add(item);
                        }
                        order.setItems(items);
                    }
                }
                return order;
            }
        } catch (SQLException e) {
            throw new DatabaseOperationException("Failed to fetch order: " + e.getMessage(), e);
        }
    }
}
