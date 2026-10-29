package com.omnimarket.da3.controller;

import com.omnimarket.da3.dto.DashboardStatsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> resp = new HashMap<>();
        try (Connection conn = dataSource.getConnection()) {
            boolean valid = conn.isValid(2);
            resp.put("status", valid ? "ok" : "degraded");
            resp.put("database", "connected");
            // CockroachDB reports itself as "PostgreSQL 13" over the wire protocol; version() has the real build
            String version = serverVersion(conn);
            resp.put("engine", version.startsWith("CockroachDB") ? "CockroachDB" : conn.getMetaData().getDatabaseProductName());
            resp.put("version", version);
            resp.put("driver", conn.getMetaData().getDriverName() + " (" + conn.getMetaData().getDriverVersion() + ")");
            resp.put("framework", "Java Spring Boot + Direct JDBC");
            return ResponseEntity.ok(resp);
        } catch (SQLException e) {
            resp.put("status", "error");
            resp.put("database", "disconnected");
            resp.put("error", e.getMessage());
            return ResponseEntity.status(500).body(resp);
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            stats.setTotalUsers(fetchCount(stmt, "SELECT COUNT(*) FROM users;"));
            stats.setTotalSellers(fetchCount(stmt, "SELECT COUNT(*) FROM sellers;"));
            stats.setTotalStores(fetchCount(stmt, "SELECT COUNT(*) FROM stores;"));
            stats.setTotalProducts(fetchCount(stmt, "SELECT COUNT(*) FROM products;"));
            stats.setTotalOrders(fetchCount(stmt, "SELECT COUNT(*) FROM orders;"));
            stats.setTotalPayments(fetchCount(stmt, "SELECT COUNT(*) FROM payments;"));
            stats.setPendingWithdrawals(fetchCount(stmt, "SELECT COUNT(*) FROM withdrawals WHERE status IN ('pending', 'under_review');"));
            stats.setTotalReviews(fetchCount(stmt, "SELECT COUNT(*) FROM reviews;"));

            try (ResultSet rs = stmt.executeQuery("SELECT COALESCE(SUM(amount), 0) FROM payments WHERE pay_status = 'completed';")) {
                if (rs.next()) {
                    stats.setTotalRevenue(rs.getBigDecimal(1));
                } else {
                    stats.setTotalRevenue(BigDecimal.ZERO);
                }
            }

            return ResponseEntity.ok(stats);
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private String serverVersion(Connection conn) throws SQLException {
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT version();")) {
            return rs.next() ? rs.getString(1) : conn.getMetaData().getDatabaseProductVersion();
        }
    }

    private int fetchCount(Statement stmt, String sql) {
        try (ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException ignored) {}
        return 0;
    }
}
