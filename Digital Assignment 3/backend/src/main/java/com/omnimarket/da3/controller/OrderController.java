package com.omnimarket.da3.controller;

import com.omnimarket.da3.dao.OrderJdbcDao;
import com.omnimarket.da3.dto.CheckoutRequest;
import com.omnimarket.da3.exception.ApiException;
import com.omnimarket.da3.model.Order;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderJdbcDao orderJdbcDao;

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CheckoutRequest request) {
        Order order = orderJdbcDao.createOrderWithTransaction(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable int id) {
        Order order = orderJdbcDao.findOrderById(id);
        if (order == null) {
            throw new ApiException(404, "Order #" + id + " not found.");
        }
        return ResponseEntity.ok(order);
    }
}
