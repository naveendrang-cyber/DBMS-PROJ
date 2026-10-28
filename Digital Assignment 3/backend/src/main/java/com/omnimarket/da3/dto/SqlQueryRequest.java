package com.omnimarket.da3.dto;

import jakarta.validation.constraints.NotBlank;

public class SqlQueryRequest {
    @NotBlank(message = "SQL query string cannot be empty")
    private String query;

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
}
