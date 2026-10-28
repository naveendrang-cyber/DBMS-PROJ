package com.omnimarket.da3.dto;

import java.util.Map;

public class MutationResponse {
    private boolean success;
    private String operation;
    private String table;
    private Object id;
    private int affectedRows;
    private String message;
    private Map<String, Object> record;
    private long executionTimeMs;

    public MutationResponse() {}

    public static MutationResponse success(String operation, String table, Object id, int affectedRows, String message, Map<String, Object> record, long elapsedMs) {
        MutationResponse r = new MutationResponse();
        r.success = true;
        r.operation = operation;
        r.table = table;
        r.id = id;
        r.affectedRows = affectedRows;
        r.message = message;
        r.record = record;
        r.executionTimeMs = elapsedMs;
        return r;
    }

    public static MutationResponse error(String operation, String table, String message) {
        MutationResponse r = new MutationResponse();
        r.success = false;
        r.operation = operation;
        r.table = table;
        r.message = message;
        return r;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getOperation() { return operation; }
    public void setOperation(String operation) { this.operation = operation; }

    public String getTable() { return table; }
    public void setTable(String table) { this.table = table; }

    public Object getId() { return id; }
    public void setId(Object id) { this.id = id; }

    public int getAffectedRows() { return affectedRows; }
    public void setAffectedRows(int affectedRows) { this.affectedRows = affectedRows; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Map<String, Object> getRecord() { return record; }
    public void setRecord(Map<String, Object> record) { this.record = record; }

    public long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(long executionTimeMs) { this.executionTimeMs = executionTimeMs; }
}
