package com.omnimarket.da3.controller;

import com.omnimarket.da3.dao.AdvancedDbJdbcDao;
import com.omnimarket.da3.dto.SqlQueryRequest;
import com.omnimarket.da3.dto.SqlQueryResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SqlConsoleController {

    @Autowired
    private AdvancedDbJdbcDao advancedDbJdbcDao;

    @PostMapping("/sql")
    public ResponseEntity<SqlQueryResponse> executeSql(@Valid @RequestBody SqlQueryRequest request) {
        SqlQueryResponse response = advancedDbJdbcDao.executeSqlConsole(request.getQuery());
        return ResponseEntity.ok(response);
    }
}
