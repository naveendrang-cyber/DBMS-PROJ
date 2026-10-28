package com.omnimarket.da3.dto;

import java.util.ArrayList;
import java.util.List;

public class TransactionDemoResponse {
    private boolean success;
    private boolean rolledBack;
    private String outcome;
    private String message;
    private List<String> executionSteps = new ArrayList<>();
    private long elapsedMs;
    private String databaseEngine;

    public TransactionDemoResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public boolean isRolledBack() { return rolledBack; }
    public void setRolledBack(boolean rolledBack) { this.rolledBack = rolledBack; }

    public String getOutcome() { return outcome; }
    public void setOutcome(String outcome) { this.outcome = outcome; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<String> getExecutionSteps() { return executionSteps; }
    public void setExecutionSteps(List<String> executionSteps) { this.executionSteps = executionSteps; }

    public long getElapsedMs() { return elapsedMs; }
    public void setElapsedMs(long elapsedMs) { this.elapsedMs = elapsedMs; }

    public String getDatabaseEngine() { return databaseEngine; }
    public void setDatabaseEngine(String databaseEngine) { this.databaseEngine = databaseEngine; }
}
