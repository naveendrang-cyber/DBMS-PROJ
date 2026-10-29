package com.omnimarket.da3.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public class UpdateRecordRequest {
    @NotBlank(message = "Table name is required")
    private String table;

    @NotNull(message = "Record primary key ID is required")
    private Object id;

    @NotNull(message = "Update data payload is required")
    private Map<String, Object> data;

    public String getTable() { return table; }
    public void setTable(String table) { this.table = table; }

    public Object getId() { return id; }
    public void setId(Object id) { this.id = id; }

    public Map<String, Object> getData() { return data; }
    public void setData(Map<String, Object> data) { this.data = data; }
}
