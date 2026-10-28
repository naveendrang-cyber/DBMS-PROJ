package com.omnimarket.da3.dao;

import org.springframework.beans.factory.annotation.Autowired;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.*;

public abstract class BaseJdbcDao {

    @Autowired
    protected DataSource dataSource;

    public static final Map<String, String> PK_MAP = Map.of(
            "roles", "id",
            "users", "user_id",
            "sellers", "id",
            "stores", "id",
            "products", "id",
            "orders", "id",
            "ordered_items", "id",
            "payments", "pay_id",
            "withdrawals", "id",
            "reviews", "id"
    );

    public static final Set<String> ALLOWED_TABLES = Set.of(
            "roles", "users", "sellers", "stores", "products",
            "orders", "ordered_items", "payments", "withdrawals", "reviews"
    );

    protected void validateTable(String table) {
        if (table == null || !ALLOWED_TABLES.contains(table.toLowerCase().trim())) {
            throw new IllegalArgumentException("Target table '" + table + "' is not recognized or permitted.");
        }
    }

    protected List<Map<String, Object>> mapResultSetToList(ResultSet rs) throws SQLException {
        List<Map<String, Object>> list = new ArrayList<>();
        ResultSetMetaData meta = rs.getMetaData();
        int colCount = meta.getColumnCount();

        while (rs.next()) {
            Map<String, Object> row = new LinkedHashMap<>();
            for (int i = 1; i <= colCount; i++) {
                String colName = meta.getColumnLabel(i);
                row.put(colName, rs.getObject(i));
            }
            list.add(row);
        }
        return list;
    }
}
