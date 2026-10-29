package com.omnimarket.da3.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DeleteRecordRequest {
    @NotBlank(message = "Table name is required")
    private String table;

    @NotNull(message = "Record primary key ID is required")
    private Object id;

    public String getTable() { return table; }
    public void setTable(String table) { this.table = table; }

    public Object getId() { return id; }
    public void setId(Object id) { this.id = id; }
}
