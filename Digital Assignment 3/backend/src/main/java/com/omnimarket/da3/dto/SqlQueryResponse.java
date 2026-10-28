package com.omnimarket.da3.dto;

import java.util.List;
import java.util.Map;

public class SqlQueryResponse {
    private boolean success;
    private List<String> columns;
    private List<Map<String, Object>> rows;
    private int rowCount;
    private int affectedRows;
    private double executionTime;
    private String message;
    private String error;

    public SqlQueryResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public List<String> getColumns() { return columns; }
    public void setColumns(List<String> columns) { this.columns = columns; }

    public List<Map<String, Object>> getRows() { return rows; }
    public void setRows(List<Map<String, Object>> rows) { this.rows = rows; }

    public int getRowCount() { return rowCount; }
    public void setRowCount(int rowCount) { this.rowCount = rowCount; }

    public int getAffectedRows() { return affectedRows; }
    public void setAffectedRows(int affectedRows) { this.affectedRows = affectedRows; }

    public double getExecutionTime() { return executionTime; }
    public void setExecutionTime(double executionTime) { this.executionTime = executionTime; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
