package com.omnimarket.da3;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class JdbcConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    @DisplayName("Verify JDBC DataSource and Connection Lifecycle")
    void testJdbcConnection() throws Exception {
        assertNotNull(dataSource, "DataSource bean must be configured and injected");

        try (Connection conn = dataSource.getConnection()) {
            assertNotNull(conn, "JDBC Connection must not be null");
            assertFalse(conn.isClosed(), "JDBC Connection must be active");

            DatabaseMetaData meta = conn.getMetaData();
            assertNotNull(meta.getDatabaseProductName(), "Database product name must be present");
            assertNotNull(meta.getDriverName(), "JDBC Driver name must be present");

            // Execute test query
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT 1;")) {
                assertTrue(rs.next(), "SELECT 1 must return at least one row");
                assertEquals(1, rs.getInt(1), "Result of SELECT 1 must equal 1");
            }
        }
    }
}
