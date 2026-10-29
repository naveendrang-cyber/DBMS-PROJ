package com.omnimarket.da3.dao;

import com.omnimarket.da3.exception.DatabaseOperationException;
import com.omnimarket.da3.model.Product;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProductJdbcDao extends BaseJdbcDao {

    /**
     * Fetch full product catalog with store information via relational JOIN
     */
    public List<Product> findAllProducts() {
        String sql = """
            SELECT p.id, p.store_id, p.name, p.price, p.stock, p.description,
                   s.name AS store_name, s.city
            FROM products p
            JOIN stores s ON p.store_id = s.id
            ORDER BY p.id ASC;
        """;

        List<Product> products = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                Product p = new Product();
                p.setId(rs.getInt("id"));
                p.setStoreId(rs.getInt("store_id"));
                p.setName(rs.getString("name"));
                p.setPrice(rs.getBigDecimal("price"));
                p.setStock(rs.getInt("stock"));
                p.setDescription(rs.getString("description"));
                p.setStoreName(rs.getString("store_name"));
                p.setCity(rs.getString("city"));
                products.add(p);
            }
            return products;
        } catch (SQLException e) {
            throw new DatabaseOperationException("Failed to fetch product catalog via JDBC: " + e.getMessage(), e);
        }
    }

    /**
     * Fetch a single product by ID via parameterized PreparedStatement
     */
    public Product findProductById(int id) {
        String sql = """
            SELECT p.id, p.store_id, p.name, p.price, p.stock, p.description,
                   s.name AS store_name, s.city
            FROM products p
            JOIN stores s ON p.store_id = s.id
            WHERE p.id = ?;
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Product p = new Product();
                    p.setId(rs.getInt("id"));
                    p.setStoreId(rs.getInt("store_id"));
                    p.setName(rs.getString("name"));
                    p.setPrice(rs.getBigDecimal("price"));
                    p.setStock(rs.getInt("stock"));
                    p.setDescription(rs.getString("description"));
                    p.setStoreName(rs.getString("store_name"));
                    p.setCity(rs.getString("city"));
                    return p;
                }
                return null;
            }
        } catch (SQLException e) {
            throw new DatabaseOperationException("Failed to fetch product " + id + " via JDBC: " + e.getMessage(), e);
        }
    }

    /**
     * Related products for the Quick View modal: same store first, then closest in price.
     */
    public List<Product> findRelatedProducts(int productId, int limit) {
        String sql = """
            SELECT p.id, p.store_id, p.name, p.price, p.stock, p.description,
                   s.name AS store_name, s.city
            FROM products p
            JOIN stores s ON p.store_id = s.id
            JOIN products target ON target.id = ?
            WHERE p.id <> target.id
            ORDER BY (p.store_id = target.store_id) DESC, abs(p.price - target.price) ASC, p.id ASC
            LIMIT ?;
        """;

        List<Product> products = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, productId);
            pstmt.setInt(2, Math.max(1, Math.min(limit, 12)));
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Product p = new Product();
                    p.setId(rs.getInt("id"));
                    p.setStoreId(rs.getInt("store_id"));
                    p.setName(rs.getString("name"));
                    p.setPrice(rs.getBigDecimal("price"));
                    p.setStock(rs.getInt("stock"));
                    p.setDescription(rs.getString("description"));
                    p.setStoreName(rs.getString("store_name"));
                    p.setCity(rs.getString("city"));
                    products.add(p);
                }
            }
            return products;
        } catch (SQLException e) {
            throw new DatabaseOperationException("Failed to fetch related products for " + productId + " via JDBC: " + e.getMessage(), e);
        }
    }

    /**
     * Deduct stock within an active JDBC transaction connection
     */
    public boolean deductStock(Connection conn, int productId, int qtyToDeduct) throws SQLException {
        // FOR UPDATE takes a row lock in CockroachDB so concurrent checkouts queue on this product
        String checkSql = "SELECT stock FROM products WHERE id = ? FOR UPDATE";
        String updateSql = "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?";

        try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
            checkStmt.setInt(1, productId);
            try (ResultSet rs = checkStmt.executeQuery()) {
                if (!rs.next()) {
                    return false;
                }
                int currentStock = rs.getInt("stock");
                if (currentStock < qtyToDeduct) {
                    return false;
                }
            }
        }

        try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
            updateStmt.setInt(1, qtyToDeduct);
            updateStmt.setInt(2, productId);
            updateStmt.setInt(3, qtyToDeduct);
            int affected = updateStmt.executeUpdate();
            return affected > 0;
        }
    }
}
