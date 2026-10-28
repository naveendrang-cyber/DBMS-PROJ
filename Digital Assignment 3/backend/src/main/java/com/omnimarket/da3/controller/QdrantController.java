package com.omnimarket.da3.controller;

import com.omnimarket.da3.dao.ProductJdbcDao;
import com.omnimarket.da3.dto.VectorSearchHit;
import com.omnimarket.da3.dto.VectorSearchRequest;
import com.omnimarket.da3.exception.ApiException;
import com.omnimarket.da3.model.Product;
import com.omnimarket.da3.service.QdrantVectorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/qdrant")
public class QdrantController {

    @Autowired
    private QdrantVectorService qdrantVectorService;

    @Autowired
    private ProductJdbcDao productJdbcDao;

    /**
     * Inspect Qdrant cluster connectivity and collection configuration
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        return ResponseEntity.ok(qdrantVectorService.getStatus());
    }

    /**
     * Semantic Product Search using Natural Language Query Vectors
     */
    @PostMapping("/search")
    public ResponseEntity<List<VectorSearchHit>> searchProducts(@Valid @RequestBody VectorSearchRequest request) {
        List<VectorSearchHit> results = qdrantVectorService.search(request.getQuery(), request.getLimit());
        return ResponseEntity.ok(results);
    }

    /**
     * Recommend Similar Products based on Vector Nearest Neighbors
     */
    @GetMapping("/similar/{productId}")
    public ResponseEntity<List<VectorSearchHit>> getSimilarProducts(
            @PathVariable int productId,
            @RequestParam(defaultValue = "4") int limit) {

        Product p = productJdbcDao.findProductById(productId);
        if (p == null) {
            throw new ApiException(404, "Product with ID " + productId + " not found.");
        }

        List<VectorSearchHit> similar = qdrantVectorService.findSimilar(p, limit);
        return ResponseEntity.ok(similar);
    }

    /**
     * Synchronize all products from SQL database via Java JDBC into Qdrant
     */
    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> syncProducts(
            @RequestHeader(value = "X-Admin-Key", required = false) String apiKey) {

        // Fetch products via strict Java JDBC
        List<Product> products = productJdbcDao.findAllProducts();

        // Push vectors to Qdrant
        Map<String, Object> result = qdrantVectorService.syncAllProducts(products);
        return ResponseEntity.ok(result);
    }
}
