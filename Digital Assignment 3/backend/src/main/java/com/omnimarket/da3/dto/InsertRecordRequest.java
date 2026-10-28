package com.omnimarket.da3.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public class InsertRecordRequest {
    @NotBlank(message = "Table name is required")
    private String table;

    @NotNull(message = "Record data payload is required")
    private Map<String, Object> data;

    public String getTable() { return table; }
    public void setTable(String table) { this.table = table; }

    public Map<String, Object> getData() { return data; }
    public void setData(Map<String, Object> data) { this.data = data; }
}
