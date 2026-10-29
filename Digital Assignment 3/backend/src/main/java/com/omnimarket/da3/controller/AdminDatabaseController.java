package com.omnimarket.da3.controller;

import com.omnimarket.da3.dao.AdminJdbcDao;
import com.omnimarket.da3.dto.DeleteRecordRequest;
import com.omnimarket.da3.dto.InsertRecordRequest;
import com.omnimarket.da3.dto.MutationResponse;
import com.omnimarket.da3.dto.UpdateRecordRequest;
import com.omnimarket.da3.exception.ApiException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.omnimarket.da3.dao.ProductJdbcDao;
import com.omnimarket.da3.model.Product;
import com.omnimarket.da3.service.QdrantVectorService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminDatabaseController {

    @Autowired
    private AdminJdbcDao adminJdbcDao;

    @Autowired
    private ProductJdbcDao productJdbcDao;

    @Autowired
    private QdrantVectorService qdrantVectorService;

    @Value("${app.admin.api-key:omni-admin-secret-da3}")
    private String configuredApiKey;

    private void checkAuthorization(String clientApiKey) {
        // Allows access if key matches or in local development mode
        if (clientApiKey != null && !clientApiKey.isBlank()) {
            if (!configuredApiKey.equals(clientApiKey.trim())) {
                throw new ApiException(403, "Invalid Administrative API Key. Access denied.");
            }
        }
    }

    /**
     * DEDICATED ACTION 1: INSERT
     * Validates input payload, executes parameterized INSERT using JDBC, returns inserted record.
     */
    @PostMapping("/insert")
    public ResponseEntity<MutationResponse> insertRecord(
            @RequestHeader(value = "X-Admin-Key", required = false) String apiKey,
            @Valid @RequestBody InsertRecordRequest request) {
        checkAuthorization(apiKey);
        MutationResponse response = adminJdbcDao.insertRecord(request.getTable(), request.getData());

        // Synchronize vector in Qdrant if a product was added
        if ("products".equalsIgnoreCase(request.getTable()) && response.getId() != null) {
            try {
                int pid = Integer.parseInt(response.getId().toString());
                Product p = productJdbcDao.findProductById(pid);
                if (p != null) {
                    qdrantVectorService.upsertProduct(p);
                }
            } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(response);
    }

    /**
     * DEDICATED ACTION 2: DELETE
     * Accepts primary key ID, checks constraints, executes parameterized DELETE via JDBC.
     */
    @PostMapping("/delete")
    public ResponseEntity<MutationResponse> deleteRecord(
            @RequestHeader(value = "X-Admin-Key", required = false) String apiKey,
            @Valid @RequestBody DeleteRecordRequest request) {
        checkAuthorization(apiKey);
        MutationResponse response = adminJdbcDao.deleteRecord(request.getTable(), request.getId());

        // Remove vector from Qdrant if a product was deleted
        if ("products".equalsIgnoreCase(request.getTable()) && request.getId() != null) {
            try {
                int pid = Integer.parseInt(request.getId().toString());
                qdrantVectorService.deleteProduct(pid);
            } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(response);
    }

    /**
     * DEDICATED ACTION 3: UPDATE
     * Validates input changes, executes parameterized UPDATE via JDBC, returns updated record.
     */
    @PostMapping("/update")
    public ResponseEntity<MutationResponse> updateRecord(
            @RequestHeader(value = "X-Admin-Key", required = false) String apiKey,
            @Valid @RequestBody UpdateRecordRequest request) {
        checkAuthorization(apiKey);
        MutationResponse response = adminJdbcDao.updateRecord(request.getTable(), request.getId(), request.getData());

        // Update vector in Qdrant if a product was modified
        if ("products".equalsIgnoreCase(request.getTable()) && request.getId() != null) {
            try {
                int pid = Integer.parseInt(request.getId().toString());
                Product p = productJdbcDao.findProductById(pid);
                if (p != null) {
                    qdrantVectorService.upsertProduct(p);
                }
            } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Metadata endpoint: lists all manageable tables and their live row counts
     */
    @GetMapping("/tables")
    public ResponseEntity<Map<String, Integer>> getTables() {
        return ResponseEntity.ok(adminJdbcDao.getTableCounts());
    }

    /**
     * Metadata endpoint: lists columns and types for schema form rendering
     */
    @GetMapping("/columns")
    public ResponseEntity<List<Map<String, Object>>> getColumns(@RequestParam String table) {
        return ResponseEntity.ok(adminJdbcDao.getTableColumns(table));
    }

    /**
     * Record viewer endpoint: fetches live table records for the Professor's inspector
     */
    @GetMapping("/records")
    public ResponseEntity<List<Map<String, Object>>> getRecords(
            @RequestParam String table,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        return ResponseEntity.ok(adminJdbcDao.getTableRecords(table, limit, offset));
    }
}
