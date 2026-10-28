package com.omnimarket.da3.controller;

import com.omnimarket.da3.dao.ProductJdbcDao;
import com.omnimarket.da3.exception.ApiException;
import com.omnimarket.da3.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductJdbcDao productJdbcDao;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productJdbcDao.findAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id) {
        Product p = productJdbcDao.findProductById(id);
        if (p == null) {
            throw new ApiException(404, "Product with ID " + id + " not found.");
        }
        return ResponseEntity.ok(p);
    }
}
