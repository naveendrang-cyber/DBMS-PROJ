package com.omnimarket.da3.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class VectorSearchRequest {

    @NotBlank(message = "Search query must not be blank")
    @Size(max = 200, message = "Search query must not exceed 200 characters")
    private String query;

    @Min(value = 1, message = "Limit must be at least 1")
    @Max(value = 50, message = "Limit must not exceed 50")
    private int limit = 6;

    public VectorSearchRequest() {}

    public VectorSearchRequest(String query, int limit) {
        this.query = query;
        this.limit = limit;
    }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public int getLimit() { return limit; }
    public void setLimit(int limit) { this.limit = limit; }
}
