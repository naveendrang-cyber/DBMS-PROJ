package com.omnimarket.da3.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.omnimarket.da3.dto.VectorSearchHit;
import com.omnimarket.da3.model.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Service
public class QdrantVectorService {

    private static final Logger logger = LoggerFactory.getLogger(QdrantVectorService.class);

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final EmbeddingService embeddingService;

    @Value("${qdrant.url:http://localhost:6333}")
    private String qdrantUrl;

    @Value("${qdrant.api-key:}")
    private String apiKey;

    @Value("${qdrant.collection-name:omnimarket_products}")
    private String collectionName;

    @Value("${qdrant.dimensions:384}")
    private int vectorDimensions;

    @Value("${qdrant.distance:Cosine}")
    private String distanceMetric;

    @Value("${qdrant.timeout-ms:5000}")
    private int timeoutMs;

    public QdrantVectorService(ObjectMapper objectMapper, EmbeddingService embeddingService) {
        this.objectMapper = objectMapper;
        this.embeddingService = embeddingService;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    private HttpRequest.Builder baseRequestBuilder(String path) {
        String cleanBase = qdrantUrl.endsWith("/") ? qdrantUrl.substring(0, qdrantUrl.length() - 1) : qdrantUrl;
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(cleanBase + path))
                .header("Content-Type", "application/json")
                .timeout(Duration.ofMillis(timeoutMs));

        if (apiKey != null && !apiKey.isBlank()) {
            builder.header("api-key", apiKey);
        }
        return builder;
    }

    /**
     * Check Qdrant cluster connectivity and collection status
     */
    public Map<String, Object> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("endpoint", qdrantUrl);
        status.put("collection", collectionName);
        status.put("configuredDimensions", vectorDimensions);
        status.put("distanceMetric", distanceMetric);

        try {
            HttpRequest req = baseRequestBuilder("/healthz").GET().build();
            HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());

            if (resp.statusCode() == 200) {
                status.put("connection", "connected");
                status.put("status", "ok");

                // Check collection metadata
                HttpRequest colReq = baseRequestBuilder("/collections/" + collectionName).GET().build();
                HttpResponse<String> colResp = httpClient.send(colReq, HttpResponse.BodyHandlers.ofString());
                if (colResp.statusCode() == 200) {
                    JsonNode colJson = objectMapper.readTree(colResp.body()).path("result");
                    status.put("collectionStatus", colJson.path("status").asText("green"));
                    status.put("pointsCount", colJson.path("points_count").asInt(0));
                    status.put("vectorsCount", colJson.path("vectors_count").asInt(0));
                } else {
                    status.put("collectionStatus", "not_created");
                    status.put("pointsCount", 0);
                }
            } else {
                status.put("connection", "degraded");
                status.put("status", "HTTP " + resp.statusCode());
            }
        } catch (Exception e) {
            status.put("connection", "unreachable");
            status.put("status", "offline");
            status.put("error", e.getMessage());
        }

        return status;
    }

    /**
     * Ensure collection exists idempotently
     */
    public boolean ensureCollection() {
        try {
            HttpRequest checkReq = baseRequestBuilder("/collections/" + collectionName).GET().build();
            HttpResponse<String> checkResp = httpClient.send(checkReq, HttpResponse.BodyHandlers.ofString());

            if (checkResp.statusCode() == 200) {
                return true;
            }

            // Create collection
            Map<String, Object> body = Map.of(
                    "vectors", Map.of(
                            "size", vectorDimensions,
                            "distance", distanceMetric
                    )
            );
            HttpRequest createReq = baseRequestBuilder("/collections/" + collectionName)
                    .PUT(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> createResp = httpClient.send(createReq, HttpResponse.BodyHandlers.ofString());
            return createResp.statusCode() == 200;
        } catch (Exception e) {
            logger.warn("Could not ensure Qdrant collection: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Search product vectors using natural language semantic query
     */
    public List<VectorSearchHit> search(String query, int limit) {
        ensureCollection();

        List<Float> queryVector = embeddingService.generateEmbedding(query);

        Map<String, Object> body = Map.of(
                "vector", queryVector,
                "limit", limit,
                "with_payload", true
        );

        try {
            HttpRequest req = baseRequestBuilder("/collections/" + collectionName + "/points/search")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(resp.body());
                JsonNode hitsNode = root.path("result");

                List<VectorSearchHit> hits = new ArrayList<>();
                for (JsonNode node : hitsNode) {
                    VectorSearchHit hit = new VectorSearchHit();
                    hit.setId(node.path("id").asInt());
                    hit.setScore(node.path("score").asDouble());

                    JsonNode payload = node.path("payload");
                    hit.setName(payload.path("name").asText(""));
                    hit.setDescription(payload.path("description").asText(""));
                    hit.setStoreName(payload.path("store_name").asText(""));
                    hit.setCity(payload.path("city").asText(""));
                    hit.setPrice(BigDecimal.valueOf(payload.path("price").asDouble(0.0)));

                    Map<String, Object> pMap = objectMapper.convertValue(payload, Map.class);
                    hit.setPayload(pMap);

                    hits.add(hit);
                }
                return hits;
            } else {
                throw new RuntimeException("Qdrant search failed with HTTP " + resp.statusCode() + ": " + resp.body());
            }
        } catch (Exception e) {
            logger.error("Vector search failed on Qdrant: {}", e.getMessage());
            throw new RuntimeException("Vector search error: " + e.getMessage(), e);
        }
    }

    /**
     * Recommend similar products based on vector similarity to a target product
     */
    public List<VectorSearchHit> findSimilar(Product targetProduct, int limit) {
        if (targetProduct == null) return Collections.emptyList();

        String combinedText = targetProduct.getName() + " " +
                (targetProduct.getDescription() != null ? targetProduct.getDescription() : "") + " " +
                (targetProduct.getStoreName() != null ? targetProduct.getStoreName() : "");

        List<VectorSearchHit> results = search(combinedText, limit + 1);

        // Exclude the source product itself
        List<VectorSearchHit> filtered = new ArrayList<>();
        for (VectorSearchHit hit : results) {
            if (targetProduct.getId() == null || hit.getId() != targetProduct.getId()) {
                filtered.add(hit);
                if (filtered.size() >= limit) break;
            }
        }
        return filtered;
    }

    /**
     * Upsert a product into Qdrant collection with embedding
     */
    public boolean upsertProduct(Product product) {
        if (product == null || product.getId() == null) return false;
        ensureCollection();

        try {
            String text = product.getName() + " " +
                    (product.getDescription() != null ? product.getDescription() : "") + " " +
                    (product.getStoreName() != null ? product.getStoreName() : "");

            List<Float> vector = embeddingService.generateEmbedding(text);

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("product_id", product.getId());
            payload.put("name", product.getName());
            payload.put("price", product.getPrice() != null ? product.getPrice().doubleValue() : 0.0);
            payload.put("description", product.getDescription() != null ? product.getDescription() : "");
            payload.put("store_id", product.getStoreId());
            payload.put("store_name", product.getStoreName() != null ? product.getStoreName() : "OmniMarket Flagship");
            payload.put("city", product.getCity() != null ? product.getCity() : "");

            Map<String, Object> point = Map.of(
                    "id", product.getId(),
                    "vector", vector,
                    "payload", payload
            );

            Map<String, Object> body = Map.of("points", List.of(point));

            HttpRequest req = baseRequestBuilder("/collections/" + collectionName + "/points")
                    .PUT(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
            return resp.statusCode() == 200;
        } catch (Exception e) {
            logger.warn("Failed to upsert product #{} into Qdrant: {}", product.getId(), e.getMessage());
            return false;
        }
    }

    /**
     * Delete a point from Qdrant
     */
    public boolean deleteProduct(int productId) {
        try {
            Map<String, Object> body = Map.of("points", List.of(productId));
            HttpRequest req = baseRequestBuilder("/collections/" + collectionName + "/points/delete")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
            return resp.statusCode() == 200;
        } catch (Exception e) {
            logger.warn("Failed to delete product #{} from Qdrant: {}", productId, e.getMessage());
            return false;
        }
    }

    /**
     * Batch synchronize all products from SQL database via JDBC into Qdrant
     */
    public Map<String, Object> syncAllProducts(List<Product> products) {
        long start = System.currentTimeMillis();
        ensureCollection();

        int synced = 0;
        int failed = 0;

        for (Product p : products) {
            boolean ok = upsertProduct(p);
            if (ok) synced++;
            else failed++;
        }

        long elapsed = System.currentTimeMillis() - start;
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", "success");
        res.put("totalProducts", products.size());
        res.put("syncedToQdrant", synced);
        res.put("failed", failed);
        res.put("collection", collectionName);
        res.put("elapsedMs", elapsed);
        return res;
    }
}
