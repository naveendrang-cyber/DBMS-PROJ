package com.omnimarket.da3.controller;

import com.omnimarket.da3.dao.AdvancedDbJdbcDao;
import com.omnimarket.da3.dto.SqlQueryRequest;
import com.omnimarket.da3.dto.TransactionDemoRequest;
import com.omnimarket.da3.dto.TransactionDemoResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/advanced")
public class AdvancedDbController {

    @Autowired
    private AdvancedDbJdbcDao advancedDbJdbcDao;

    /**
     * Multi-table analytical join demonstration
     */
    @GetMapping("/joins")
    public ResponseEntity<List<Map<String, Object>>> getMultiTableJoins() {
        return ResponseEntity.ok(advancedDbJdbcDao.getMultiTableJoinsDemo());
    }

    /**
     * Aggregation and group-by analytics demonstration
     */
    @GetMapping("/aggregates")
    public ResponseEntity<List<Map<String, Object>>> getAggregates() {
        return ResponseEntity.ok(advancedDbJdbcDao.getAggregatesDemo());
    }

    /**
     * Genuine ACID transaction & rollback demonstration
     */
    @PostMapping("/transaction-demo")
    public ResponseEntity<TransactionDemoResponse> runTransactionDemo(@RequestBody TransactionDemoRequest request) {
        TransactionDemoResponse resp = advancedDbJdbcDao.executeAcidTransactionDemo(request.isShouldFail());
        return ResponseEntity.ok(resp);
    }

    /**
     * Query execution plan (EXPLAIN) demonstration
     */
    @PostMapping("/explain")
    public ResponseEntity<List<Map<String, Object>>> explainQuery(@Valid @RequestBody SqlQueryRequest request) {
        return ResponseEntity.ok(advancedDbJdbcDao.explainQueryPlan(request.getQuery()));
    }
}
