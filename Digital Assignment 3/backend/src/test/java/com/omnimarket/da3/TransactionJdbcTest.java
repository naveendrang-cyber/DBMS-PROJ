package com.omnimarket.da3;

import com.omnimarket.da3.dao.AdvancedDbJdbcDao;
import com.omnimarket.da3.dao.OrderJdbcDao;
import com.omnimarket.da3.dto.CheckoutRequest;
import com.omnimarket.da3.dto.TransactionDemoResponse;
import com.omnimarket.da3.model.Order;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TransactionJdbcTest {

    @Autowired
    private AdvancedDbJdbcDao advancedDbJdbcDao;

    @Autowired
    private OrderJdbcDao orderJdbcDao;

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
}
