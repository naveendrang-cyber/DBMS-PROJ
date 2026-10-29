package com.omnimarket.da3.dao;

import com.omnimarket.da3.dto.MutationResponse;
import com.omnimarket.da3.exception.DatabaseOperationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.*;

@Repository
public class AdminJdbcDao extends BaseJdbcDao {

    private static final Logger logger = LoggerFactory.getLogger(AdminJdbcDao.class);

    /**
     * ACTION 1: PARAMETERIZED INSERT USING JDBC
     * Displays form schema, validates fields, prepares parameterized statement, returns generated record.
     */
    public MutationResponse insertRecord(String table, Map<String, Object> data) {
        long startTime = System.currentTimeMillis();
        validateTable(table);

        String pkCol = PK_MAP.get(table.toLowerCase());
        Map<String, Object> filteredData = new LinkedHashMap<>(data);

        // Remove PK if empty or null to allow auto-increment
        if (filteredData.containsKey(pkCol)) {
            Object pkVal = filteredData.get(pkCol);
            if (pkVal == null || pkVal.toString().trim().isEmpty() || "0".equals(pkVal.toString().trim())) {
                filteredData.remove(pkCol);
            }
        }

        if (filteredData.isEmpty()) {
            throw new DatabaseOperationException("Cannot insert record: No columns provided for table " + table);
        }

        List<String> columns = new ArrayList<>(filteredData.keySet());
        StringBuilder sql = new StringBuilder("INSERT INTO ").append(table).append(" (");
        StringBuilder placeholders = new StringBuilder(" VALUES (");

        for (int i = 0; i < columns.size(); i++) {
            sql.append(columns.get(i));
            placeholders.append("?");
            if (i < columns.size() - 1) {
                sql.append(", ");
                placeholders.append(", ");
            }
        }
        sql.append(")").append(placeholders).append(")");

        logger.info("Executing JDBC INSERT on table [{}]: {}", table, sql);

        try (Connection conn = dataSource.getConnection()) {
            boolean isPostgres = conn.getMetaData().getDatabaseProductName().toLowerCase().contains("postgres")
                    || conn.getMetaData().getDatabaseProductName().toLowerCase().contains("cockroach");

            // For PostgreSQL / CockroachDB we can append RETURNING or use Statement.RETURN_GENERATED_KEYS
            PreparedStatement pstmt;
            if (isPostgres) {
                pstmt = conn.prepareStatement(sql.toString(), Statement.RETURN_GENERATED_KEYS);
            } else {
                pstmt = conn.prepareStatement(sql.toString(), Statement.RETURN_GENERATED_KEYS);
            }

            for (int i = 0; i < columns.size(); i++) {
                Object val = filteredData.get(columns.get(i));
                pstmt.setObject(i + 1, val);
            }

            int affected = pstmt.executeUpdate();
            Object generatedId = null;

            try (ResultSet genKeys = pstmt.getGeneratedKeys()) {
                if (genKeys.next()) {
                    generatedId = genKeys.getObject(1);
                }
            }

            if (generatedId == null && filteredData.containsKey(pkCol)) {
                generatedId = filteredData.get(pkCol);
            }

            Map<String, Object> insertedRecord = null;
            if (generatedId != null) {
                insertedRecord = fetchRecordById(conn, table, pkCol, generatedId);
            }

            long elapsed = System.currentTimeMillis() - startTime;
            return MutationResponse.success(
                    "INSERT",
                    table,
                    generatedId,
                    affected,
                    "Record inserted successfully into table '" + table + "' via parameterized JDBC PreparedStatement.",
                    insertedRecord,
                    elapsed
            );

        } catch (SQLException e) {
            logger.error("JDBC INSERT Error on table {}: {}", table, e.getMessage());
            throw new DatabaseOperationException("JDBC INSERT Failed: " + e.getMessage(), e);
        }
    }

    /**
     * ACTION 2: PARAMETERIZED DELETE USING JDBC
     * Accepts selected record ID, checks constraints, executes parameterized DELETE.
     */
    public MutationResponse deleteRecord(String table, Object id) {
        long startTime = System.currentTimeMillis();
        validateTable(table);
        String pkCol = PK_MAP.get(table.toLowerCase());

        String sql = "DELETE FROM " + table + " WHERE " + pkCol + " = ?";
        logger.info("Executing JDBC DELETE on table [{}] where {} = {}", table, pkCol, id);

        try (Connection conn = dataSource.getConnection()) {
            // First verify record exists
            Map<String, Object> existing = fetchRecordById(conn, table, pkCol, id);
            if (existing == null) {
                throw new DatabaseOperationException("Record with " + pkCol + " = " + id + " does not exist in table '" + table + "'.");
            }

            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setObject(1, id);
                int affected = pstmt.executeUpdate();

                long elapsed = System.currentTimeMillis() - startTime;
                return MutationResponse.success(
                        "DELETE",
                        table,
                        id,
                        affected,
                        "Record with " + pkCol + " = " + id + " was successfully deleted from table '" + table + "'.",
                        existing,
                        elapsed
                );
            }
        } catch (SQLException e) {
            logger.error("JDBC DELETE Error on table {}: {}", table, e.getMessage());
            if (e.getMessage().toLowerCase().contains("foreign key") || e.getMessage().toLowerCase().contains("constraint")) {
                throw new DatabaseOperationException("Cannot delete record: It is referenced by child records in other tables (Foreign Key Constraint Violation).", e);
            }
            throw new DatabaseOperationException("JDBC DELETE Failed: " + e.getMessage(), e);
        }
    }

    /**
     * ACTION 3: PARAMETERIZED UPDATE USING JDBC
     * Loads existing record, updates permitted fields, executes parameterized UPDATE, returns updated record.
     */
    public MutationResponse updateRecord(String table, Object id, Map<String, Object> data) {
        long startTime = System.currentTimeMillis();
        validateTable(table);
        String pkCol = PK_MAP.get(table.toLowerCase());

        Map<String, Object> filteredData = new LinkedHashMap<>(data);
        filteredData.remove(pkCol); // Don't update primary key

        if (filteredData.isEmpty()) {
            throw new DatabaseOperationException("No updatable fields provided for table '" + table + "'.");
        }

        List<String> columns = new ArrayList<>(filteredData.keySet());
        StringBuilder sql = new StringBuilder("UPDATE ").append(table).append(" SET ");

        for (int i = 0; i < columns.size(); i++) {
            sql.append(columns.get(i)).append(" = ?");
            if (i < columns.size() - 1) {
                sql.append(", ");
            }
        }
        sql.append(" WHERE ").append(pkCol).append(" = ?");

        logger.info("Executing JDBC UPDATE on table [{}] where {} = {}", table, pkCol, id);

        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
                int paramIndex = 1;
                for (String col : columns) {
                    pstmt.setObject(paramIndex++, filteredData.get(col));
                }
                pstmt.setObject(paramIndex, id);

                int affected = pstmt.executeUpdate();
                if (affected == 0) {
                    throw new DatabaseOperationException("No record found with " + pkCol + " = " + id + " in table '" + table + "'.");
                }

                Map<String, Object> updatedRecord = fetchRecordById(conn, table, pkCol, id);
                long elapsed = System.currentTimeMillis() - startTime;

                return MutationResponse.success(
                        "UPDATE",
                        table,
                        id,
                        affected,
                        "Record with " + pkCol + " = " + id + " was successfully updated via parameterized JDBC PreparedStatement.",
                        updatedRecord,
                        elapsed
                );
            }
        } catch (SQLException e) {
            logger.error("JDBC UPDATE Error on table {}: {}", table, e.getMessage());
            throw new DatabaseOperationException("JDBC UPDATE Failed: " + e.getMessage(), e);
        }
    }

    /**
     * Fetch paginated records from a given table using JDBC PreparedStatement
     */
    public List<Map<String, Object>> getTableRecords(String table, int limit, int offset) {
        validateTable(table);
        String pkCol = PK_MAP.get(table.toLowerCase());
        String sql = "SELECT * FROM " + table + " ORDER BY " + pkCol + " ASC LIMIT ? OFFSET ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, Math.min(limit, 200));
            pstmt.setInt(2, Math.max(offset, 0));

            try (ResultSet rs = pstmt.executeQuery()) {
                return mapResultSetToList(rs);
            }
        } catch (SQLException e) {
            logger.error("Error reading records from {}: {}", table, e.getMessage());
            throw new DatabaseOperationException("Failed to read records from " + table + ": " + e.getMessage(), e);
        }
    }

    /**
     * Inspect column metadata for table schema generation
     */
    public List<Map<String, Object>> getTableColumns(String table) {
        validateTable(table);
        List<Map<String, Object>> columns = new ArrayList<>();

        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            String tableNamePattern = table;
            
            // Try both lowercase and uppercase for PostgreSQL / CockroachDB compatibility
            try (ResultSet rs = meta.getColumns(null, null, tableNamePattern, null)) {
                boolean found = false;
                while (rs.next()) {
                    found = true;
                    Map<String, Object> col = new LinkedHashMap<>();
                    col.put("name", rs.getString("COLUMN_NAME"));
                    col.put("type", rs.getString("TYPE_NAME"));
                    col.put("size", rs.getInt("COLUMN_SIZE"));
                    col.put("nullable", rs.getInt("NULLABLE") == DatabaseMetaData.columnNullable);
                    col.put("isPk", rs.getString("COLUMN_NAME").equalsIgnoreCase(PK_MAP.get(table.toLowerCase())));
                    columns.add(col);
                }
                if (!found) {
                    try (ResultSet rsUpper = meta.getColumns(null, null, tableNamePattern.toUpperCase(), null)) {
                        while (rsUpper.next()) {
                            Map<String, Object> col = new LinkedHashMap<>();
                            col.put("name", rsUpper.getString("COLUMN_NAME"));
                            col.put("type", rsUpper.getString("TYPE_NAME"));
                            col.put("size", rsUpper.getInt("COLUMN_SIZE"));
                            col.put("nullable", rsUpper.getInt("NULLABLE") == DatabaseMetaData.columnNullable);
                            col.put("isPk", rsUpper.getString("COLUMN_NAME").equalsIgnoreCase(PK_MAP.get(table.toLowerCase())));
                            columns.add(col);
                        }
                    }
                }
            }
            return columns;
        } catch (SQLException e) {
            logger.error("Error inspecting columns for {}: {}", table, e.getMessage());
            throw new DatabaseOperationException("Failed to inspect table columns: " + e.getMessage(), e);
        }
    }

    /**
     * Fetch row count across all tables
     */
    public Map<String, Integer> getTableCounts() {
        Map<String, Integer> counts = new LinkedHashMap<>();
        try (Connection conn = dataSource.getConnection()) {
            for (String table : ALLOWED_TABLES) {
                try (Statement stmt = conn.createStatement();
                     ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM " + table)) {
                    if (rs.next()) {
                        counts.put(table, rs.getInt(1));
                    }
                } catch (SQLException e) {
                    counts.put(table, 0);
                }
            }
        } catch (SQLException e) {
            logger.error("Error fetching table counts: {}", e.getMessage());
        }
        return counts;
    }

    private Map<String, Object> fetchRecordById(Connection conn, String table, String pkCol, Object id) throws SQLException {
        String sql = "SELECT * FROM " + table + " WHERE " + pkCol + " = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setObject(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                List<Map<String, Object>> list = mapResultSetToList(rs);
                return list.isEmpty() ? null : list.get(0);
            }
        }
    }
}
