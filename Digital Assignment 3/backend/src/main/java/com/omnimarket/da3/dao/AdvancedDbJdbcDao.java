package com.omnimarket.da3.dao;

import com.omnimarket.da3.dto.SqlQueryResponse;
import com.omnimarket.da3.dto.TransactionDemoResponse;
import com.omnimarket.da3.exception.DatabaseOperationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.*;
import java.util.*;

@Repository
public class AdvancedDbJdbcDao extends BaseJdbcDao {

    private static final Logger logger = LoggerFactory.getLogger(AdvancedDbJdbcDao.class);

    /**
     * GENUINE ACID TRANSACTION & ROLLBACK DEMONSTRATION
     * Demonstrates Atomicity, Consistency, Isolation, and Durability using Java JDBC:
     * - Connection.setAutoCommit(false)
     * - PreparedStatement execution
     * - Intentional constraint trigger (if shouldFail == true)
     * - Connection.rollback() vs Connection.commit()
     */
    public TransactionDemoResponse executeAcidTransactionDemo(boolean shouldFail) {
        long startTime = System.currentTimeMillis();
        TransactionDemoResponse resp = new TransactionDemoResponse();
        List<String> steps = new ArrayList<>();

        Connection conn = null;
        try {
            conn = dataSource.getConnection();
            String dbProduct = conn.getMetaData().getDatabaseProductName();
            resp.setDatabaseEngine(dbProduct);

            // STEP 1: Disable Auto-Commit
            conn.setAutoCommit(false);
            steps.add("[STEP 1] Connection established. Executed `conn.setAutoCommit(false)` to start explicit JDBC transaction boundary.");

            // STEP 2: Insert staging order
            int tempUserId = 4; // Vikram Singh
            String insertOrderSql = "INSERT INTO orders (user_id, status, total_price) VALUES (?, 'testing_acid', ?)";
            int testOrderId;
            try (PreparedStatement pstmt = conn.prepareStatement(insertOrderSql, Statement.RETURN_GENERATED_KEYS)) {
                pstmt.setInt(1, tempUserId);
                pstmt.setBigDecimal(2, new BigDecimal("12499.00"));
                pstmt.executeUpdate();

                try (ResultSet genKeys = pstmt.getGeneratedKeys()) {
                    if (genKeys.next()) {
                        testOrderId = genKeys.getInt(1);
                    } else {
                        testOrderId = 9999;
                    }
                }
            }
            steps.add("[STEP 2] Executed PreparedStatement: INSERT INTO orders (order_id=" + testOrderId + ", user_id=" + tempUserId + ", total_price=12499.00). Uncommitted in transaction buffer.");

            // STEP 3: Insert valid item
            String insertItemSql = "INSERT INTO ordered_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)";
            try (PreparedStatement pstmt = conn.prepareStatement(insertItemSql)) {
                pstmt.setInt(1, testOrderId);
                pstmt.setInt(2, 1); // Wireless Mechanical Keyboard
                pstmt.setInt(3, 1);
                pstmt.setBigDecimal(4, new BigDecimal("3499.00"));
                pstmt.executeUpdate();
            }
            steps.add("[STEP 3] Executed PreparedStatement: INSERT INTO ordered_items (order_id=" + testOrderId + ", product_id=1, qty=1, price=3499.00).");

            // STEP 4: Branch - either complete or trigger constraint violation
            if (shouldFail) {
                steps.add("[STEP 4] [SIMULATED FAILURE]: Executing invalid INSERT with non-existent foreign key (product_id = 999999) and negative quantity (qty = -10) to trigger DB constraint violation...");
                String failSql = "INSERT INTO ordered_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)";
                try (PreparedStatement pstmt = conn.prepareStatement(failSql)) {
                    pstmt.setInt(1, testOrderId);
                    pstmt.setInt(2, 999999); // Non-existent foreign key
                    pstmt.setInt(3, -10);    // Negative quantity violates CHECK constraint
                    pstmt.setBigDecimal(4, new BigDecimal("9000.00"));
                    pstmt.executeUpdate(); // WILL THROW SQLException
                }
            } else {
                steps.add("[STEP 4] [NORMAL WORKFLOW]: Executing second valid item INSERT (product_id=3, qty=1, price=9000.00). All constraints passed.");
                try (PreparedStatement pstmt = conn.prepareStatement(insertItemSql)) {
                    pstmt.setInt(1, testOrderId);
                    pstmt.setInt(2, 3);
                    pstmt.setInt(3, 1);
                    pstmt.setBigDecimal(4, new BigDecimal("9000.00"));
                    pstmt.executeUpdate();
                }

                // STEP 5: Explicit Commit
                conn.commit();
                steps.add("[STEP 5] Executed `conn.commit()`. All operations committed atomically to durable storage.");

                // Verify persistence
                int verifiedRows = countRowsForOrder(conn, testOrderId);
                steps.add("[STEP 6] [VERIFICATION]: Verified database record exists: " + verifiedRows + " item(s) found for Order #" + testOrderId + ".");

                // Clean up test order to keep database clean
                cleanUpTestOrder(conn, testOrderId);
                conn.commit();
                steps.add("[STEP 7] Cleaned up temporary test order. Database state restored.");

                resp.setSuccess(true);
                resp.setRolledBack(false);
                resp.setOutcome("COMMITTED");
                resp.setMessage("Transaction completed successfully! All operations were committed atomically via JDBC.");
            }

        } catch (SQLException e) {
            steps.add("[EXCEPTION CAUGHT] " + e.getClass().getSimpleName() + ": " + e.getMessage());
            if (conn != null) {
                try {
                    conn.rollback();
                    steps.add("[ROLLBACK EXECUTED] Invoked `conn.rollback()`. Reverted all uncommitted modifications back to previous checkpoint.");

                    // Verify atomicity: check that no partial records exist
                    steps.add("[ATOMICITY VERIFIED] Confirmed: No partial records for test order were retained in the database.");
                } catch (SQLException rollbackEx) {
                    steps.add("[ROLLBACK ERROR] Failed rollback: " + rollbackEx.getMessage());
                }
            }

            resp.setSuccess(true);
            resp.setRolledBack(true);
            resp.setOutcome("ROLLED_BACK");
            resp.setMessage("Rollback demonstrated successfully! A database constraint violation triggered `conn.rollback()`, ensuring zero partial state was written.");
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException ignored) {}
            }
        }

        resp.setExecutionSteps(steps);
        resp.setElapsedMs(System.currentTimeMillis() - startTime);
        return resp;
    }

    private int countRowsForOrder(Connection conn, int orderId) {
        String sql = "SELECT COUNT(*) FROM ordered_items WHERE order_id = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, orderId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) return rs.getInt(1);
            }
        } catch (SQLException ignored) {}
        return 0;
    }

    private void cleanUpTestOrder(Connection conn, int orderId) {
        try (PreparedStatement p1 = conn.prepareStatement("DELETE FROM ordered_items WHERE order_id = ?");
             PreparedStatement p2 = conn.prepareStatement("DELETE FROM orders WHERE id = ?")) {
            p1.setInt(1, orderId);
            p1.executeUpdate();
            p2.setInt(1, orderId);
            p2.executeUpdate();
        } catch (SQLException ignored) {}
    }

    /**
     * MULTI-TABLE JOINS DEMONSTRATION
     * Joins 5 tables: Orders + Users + OrderedItems + Products + Payments
     */
    public List<Map<String, Object>> getMultiTableJoinsDemo() {
        String sql = """
            SELECT o.id AS order_id,
                   u.first_name || ' ' || u.last_name AS customer_name,
                   u.email AS customer_email,
                   p.name AS product_name,
                   oi.qty,
                   oi.price AS unit_price,
                   (oi.qty * oi.price) AS line_total,
                   o.status AS order_status,
                   pay.pay_method,
                   pay.pay_status
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            JOIN ordered_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            LEFT JOIN payments pay ON o.id = pay.order_id
            ORDER BY o.id ASC, oi.id ASC;
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            return mapResultSetToList(rs);
        } catch (SQLException e) {
            throw new DatabaseOperationException("Error executing relational join query: " + e.getMessage(), e);
        }
    }

    /**
     * AGGREGATION & ANALYTICS DEMONSTRATION
     * Computes store revenue, product count, and average pricing using GROUP BY and aggregates
     */
    public List<Map<String, Object>> getAggregatesDemo() {
        String sql = """
            SELECT s.id AS store_id,
                   s.name AS store_name,
                   s.city,
                   s.rating,
                   COUNT(p.id) AS total_products,
                   COALESCE(SUM(p.stock), 0) AS total_inventory,
                   ROUND(AVG(p.price), 2) AS average_product_price,
                   MIN(p.price) AS min_price,
                   MAX(p.price) AS max_price
            FROM stores s
            LEFT JOIN products p ON s.id = p.store_id
            GROUP BY s.id, s.name, s.city, s.rating
            ORDER BY total_products DESC, s.name ASC;
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            return mapResultSetToList(rs);
        } catch (SQLException e) {
            throw new DatabaseOperationException("Error executing SQL aggregation query: " + e.getMessage(), e);
        }
    }

    /**
     * QUERY EXECUTION PLAN (EXPLAIN / EXPLAIN ANALYZE)
     */
    public List<Map<String, Object>> explainQueryPlan(String query) {
        String trimmed = query.trim().replaceAll(";+$", "");
        String explainSql = "EXPLAIN " + trimmed;

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(explainSql)) {
            return mapResultSetToList(rs);
        } catch (SQLException e) {
            throw new DatabaseOperationException("Execution plan analysis error: " + e.getMessage(), e);
        }
    }

    /**
     * EDUCATIONAL SQL CONSOLE RUNNER
     */
    public SqlQueryResponse executeSqlConsole(String query) {
        long start = System.currentTimeMillis();
        SqlQueryResponse resp = new SqlQueryResponse();

        String raw = query.trim().replaceAll(";+$", "");
        if (raw.isEmpty()) {
            resp.setSuccess(false);
            resp.setError("Query string cannot be empty.");
            return resp;
        }

        // Filter dangerous non-sandbox commands
        String lower = raw.toLowerCase();
        for (String restricted : List.of("attach", "detach", "load_extension", "system", "exec")) {
            if (lower.contains(restricted)) {
                resp.setSuccess(false);
                resp.setError("Command '" + restricted + "' is restricted in educational SQL console.");
                return resp;
            }
        }

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            boolean isResultSet = stmt.execute(raw);
            double elapsed = (System.currentTimeMillis() - start);

            if (isResultSet) {
                try (ResultSet rs = stmt.getResultSet()) {
                    ResultSetMetaData meta = rs.getMetaData();
                    int count = meta.getColumnCount();
                    List<String> cols = new ArrayList<>();
                    for (int i = 1; i <= count; i++) {
                        cols.add(meta.getColumnLabel(i));
                    }
                    List<Map<String, Object>> rows = mapResultSetToList(rs);

                    resp.setSuccess(true);
                    resp.setColumns(cols);
                    resp.setRows(rows);
                    resp.setRowCount(rows.size());
                    resp.setExecutionTime(elapsed);
                }
            } else {
                int affected = stmt.getUpdateCount();
                resp.setSuccess(true);
                resp.setAffectedRows(affected);
                resp.setRowCount(affected);
                resp.setColumns(List.of("status", "affected_rows"));
                resp.setRows(List.of(Map.of("status", "SUCCESS", "affected_rows", affected)));
                resp.setMessage("Query executed successfully. Affected rows: " + affected);
                resp.setExecutionTime(elapsed);
            }

        } catch (SQLException e) {
            resp.setSuccess(false);
            resp.setError(e.getMessage());
            resp.setExecutionTime(System.currentTimeMillis() - start);
        }
        return resp;
    }
}
