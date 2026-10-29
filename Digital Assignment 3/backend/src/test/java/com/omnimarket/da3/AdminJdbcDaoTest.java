package com.omnimarket.da3;

import com.omnimarket.da3.dao.AdminJdbcDao;
import com.omnimarket.da3.dto.MutationResponse;
import com.omnimarket.da3.exception.DatabaseOperationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AdminJdbcDaoTest {

    @Autowired
    private AdminJdbcDao adminJdbcDao;

    private static Object testProductId;

    @Test
    @Order(1)
    @DisplayName("Action 1: Parameterized JDBC INSERT for Product Entity")
    void testAction1Insert() {
        Map<String, Object> data = new HashMap<>();
        data.put("store_id", 1);
        data.put("name", "Test Artisan Ceramic Cup");
        data.put("price", new BigDecimal("799.00"));
        data.put("stock", 25);
        data.put("description", "Hand-thrown minimalist stoneware ceramic cup with matte glaze.");

        MutationResponse resp = adminJdbcDao.insertRecord("products", data);

        assertNotNull(resp);
        assertTrue(resp.isSuccess(), "Insert must succeed");
        assertEquals("INSERT", resp.getOperation());
        assertEquals("products", resp.getTable());
        assertNotNull(resp.getId(), "Generated ID must be returned");
        assertEquals(1, resp.getAffectedRows(), "Affected rows must be 1");

        testProductId = resp.getId();
        assertNotNull(testProductId);
    }

    @Test
    @Order(2)
    @DisplayName("Action 3: Parameterized JDBC UPDATE for Product Entity")
    void testAction3Update() {
        assertNotNull(testProductId, "Product ID from previous insert must exist");

        Map<String, Object> updateData = new HashMap<>();
        updateData.put("name", "Updated Artisan Ceramic Cup (Gold Rim)");
        updateData.put("price", new BigDecimal("899.00"));
        updateData.put("stock", 30);

        MutationResponse resp = adminJdbcDao.updateRecord("products", testProductId, updateData);

        assertNotNull(resp);
        assertTrue(resp.isSuccess(), "Update must succeed");
        assertEquals("UPDATE", resp.getOperation());
        assertEquals("products", resp.getTable());
        assertEquals(1, resp.getAffectedRows(), "Affected rows must be 1");
        assertNotNull(resp.getRecord(), "Updated record must be returned");
        assertEquals("Updated Artisan Ceramic Cup (Gold Rim)", resp.getRecord().get("name"));
    }

    @Test
    @Order(3)
    @DisplayName("Action 2: Parameterized JDBC DELETE for Product Entity")
    void testAction2Delete() {
        assertNotNull(testProductId, "Product ID must exist to delete");

        MutationResponse resp = adminJdbcDao.deleteRecord("products", testProductId);

        assertNotNull(resp);
        assertTrue(resp.isSuccess(), "Delete must succeed");
        assertEquals("DELETE", resp.getOperation());
        assertEquals("products", resp.getTable());
        assertEquals(1, resp.getAffectedRows(), "Affected rows must be 1");
    }

    @Test
    @Order(4)
    @DisplayName("Unknown column names are rejected before SQL is built")
    void testRejectsUnknownColumn() {
        Map<String, Object> data = new HashMap<>();
        data.put("name = 'x' WHERE 1=1; --", "injected");

        assertThrows(DatabaseOperationException.class, () -> adminJdbcDao.updateRecord("products", 1, data));
        assertThrows(DatabaseOperationException.class, () -> adminJdbcDao.insertRecord("products", data));
    }

    @Test
    @Order(5)
    @DisplayName("String form values are coerced to numeric CockroachDB columns")
    void testStringValuesCoerced() {
        Map<String, Object> data = new HashMap<>();
        data.put("store_id", "1");
        data.put("name", "Form Input Test Item");
        data.put("price", "1299.50");
        data.put("stock", "7");

        MutationResponse resp = adminJdbcDao.insertRecord("products", data);
        assertTrue(resp.isSuccess());
        assertEquals(0, new BigDecimal("1299.50").compareTo((BigDecimal) resp.getRecord().get("price")));

        adminJdbcDao.deleteRecord("products", resp.getId());
    }
}
