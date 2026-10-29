package com.omnimarket.da3;

import com.omnimarket.da3.dao.AdvancedDbJdbcDao;
import com.omnimarket.da3.dao.OrderJdbcDao;
import com.omnimarket.da3.dto.CheckoutRequest;
import com.omnimarket.da3.dto.SqlQueryResponse;
import com.omnimarket.da3.dto.TransactionDemoResponse;
import com.omnimarket.da3.exception.DatabaseOperationException;
import com.omnimarket.da3.model.Order;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TransactionJdbcTest {

    @Autowired
    private AdvancedDbJdbcDao advancedDbJdbcDao;

    @Autowired
    private OrderJdbcDao orderJdbcDao;

    @Autowired
    private DataSource dataSource;

    @Test
    @DisplayName("Verify JDBC Explicit Transaction COMMIT on Valid Data")
    void testTransactionCommit() {
        TransactionDemoResponse resp = advancedDbJdbcDao.executeAcidTransactionDemo(false);

        assertNotNull(resp);
        assertTrue(resp.isSuccess());
        assertFalse(resp.isRolledBack(), "Successful transaction must not be rolled back");
        assertEquals("COMMITTED", resp.getOutcome());
        assertFalse(resp.getExecutionSteps().isEmpty(), "Execution steps log must be recorded");
        assertTrue(resp.getExecutionSteps().stream().anyMatch(s -> s.contains("conn.commit()")), "Must record commit execution");
    }

    @Test
    @DisplayName("Verify JDBC Explicit Transaction ROLLBACK on Simulated Constraint Failure")
    void testTransactionRollback() {
        TransactionDemoResponse resp = advancedDbJdbcDao.executeAcidTransactionDemo(true);

        assertNotNull(resp);
        assertTrue(resp.isSuccess());
        assertTrue(resp.isRolledBack(), "Failing transaction must trigger rollback");
        assertEquals("ROLLED_BACK", resp.getOutcome());
        assertFalse(resp.getExecutionSteps().isEmpty(), "Execution steps log must be recorded");
        assertTrue(resp.getExecutionSteps().stream().anyMatch(s -> s.contains("conn.rollback()")), "Must record rollback execution");
        assertTrue(resp.getExecutionSteps().stream().anyMatch(s -> s.contains("ATOMICITY VERIFIED")), "Must verify atomicity");
    }

    @Test
    @DisplayName("Verify Multi-Table Checkout JDBC Transaction Atomicity")
    void testCheckoutTransaction() {
        CheckoutRequest req = new CheckoutRequest();
        req.setUserId(4); // Vikram Singh
        req.setPayMethod("UPI");

        CheckoutRequest.CartItemDto item1 = new CheckoutRequest.CartItemDto();
        item1.setProductId(1); // Wireless Mechanical Keyboard
        item1.setQty(1);

        req.setItems(List.of(item1));

        Order order = orderJdbcDao.createOrderWithTransaction(req);
        assertNotNull(order);
        assertNotNull(order.getId());
        assertEquals("completed", order.getStatus());
        assertNotNull(order.getPayment());
        assertEquals("completed", order.getPayment().getPayStatus());
    }

    @Test
    @DisplayName("Checkout that over-draws stock mid-transaction rolls back completely (no partial order)")
    void testCheckoutRollbackLeavesNoPartialOrder() throws Exception {
        int productId = 11; // Solid Walnut Desk Shelf & Riser
        int stock = queryInt("SELECT stock FROM products WHERE id = " + productId);
        int ordersBefore = queryInt("SELECT count(*) FROM orders");

        // Each line passes the per-line stock check, but together they exceed stock,
        // so deductStock fails after the order row has already been inserted.
        CheckoutRequest.CartItemDto line = new CheckoutRequest.CartItemDto();
        line.setProductId(productId);
        line.setQty(stock);
        CheckoutRequest req = new CheckoutRequest();
        req.setUserId(4);
        req.setPayMethod("UPI");
        req.setItems(List.of(line, line));

        assertThrows(DatabaseOperationException.class, () -> orderJdbcDao.createOrderWithTransaction(req));

        assertEquals(ordersBefore, queryInt("SELECT count(*) FROM orders"), "No orphan order may be committed");
        assertEquals(stock, queryInt("SELECT stock FROM products WHERE id = " + productId), "Stock must be unchanged");
    }

    @Test
    @DisplayName("Public SQL console is read-only")
    void testSqlConsoleRejectsWrites() {
        SqlQueryResponse read = advancedDbJdbcDao.executeSqlConsole("SELECT count(*) AS n FROM products");
        assertTrue(read.isSuccess(), "SELECT must work");

        SqlQueryResponse write = advancedDbJdbcDao.executeSqlConsole("DELETE FROM reviews WHERE id = 1");
        assertFalse(write.isSuccess(), "DELETE must be rejected");
        assertTrue(write.getError().toLowerCase().contains("read-only") || write.getError().toLowerCase().contains("read only"),
                "Error should explain the read-only transaction: " + write.getError());
    }

    private int queryInt(String sql) throws Exception {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            rs.next();
            return rs.getInt(1);
        }
    }
}
