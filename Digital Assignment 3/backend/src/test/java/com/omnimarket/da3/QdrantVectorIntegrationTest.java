package com.omnimarket.da3;

import com.omnimarket.da3.dto.VectorSearchHit;
import com.omnimarket.da3.model.Product;
import com.omnimarket.da3.service.QdrantVectorService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class QdrantVectorIntegrationTest {

    @Autowired
    private QdrantVectorService qdrantVectorService;

    @Test
    @DisplayName("Verify Qdrant Status & Collection Metadata")
    public void testQdrantStatus() {
        Map<String, Object> status = qdrantVectorService.getStatus();
        assertThat(status).isNotNull();
        assertThat(status).containsKey("endpoint");
        assertThat(status).containsKey("collection");
        assertThat(status.get("configuredDimensions")).isEqualTo(384);
    }

    @Test
    @DisplayName("Verify Vector Upsert, Semantic Search & Deletion Lifecycle")
    public void testVectorLifecycle() {
        // Ensure collection exists
        boolean colOk = qdrantVectorService.ensureCollection();
        assertThat(colOk).isTrue();

        // Create test product
        Product testProduct = new Product();
        testProduct.setId(9999);
        testProduct.setName("Quantum Chronograph Watch");
        testProduct.setDescription("Swiss luxury automatic chronograph with titanium casing and sapphire glass");
        testProduct.setPrice(new BigDecimal("49999.00"));
        testProduct.setStoreId(1);
        testProduct.setStoreName("Horology Flagship");
        testProduct.setCity("Geneva");

        // Upsert product into Qdrant
        boolean upsertOk = qdrantVectorService.upsertProduct(testProduct);
        assertThat(upsertOk).isTrue();

        // Perform semantic query
        List<VectorSearchHit> hits = qdrantVectorService.search("luxury titanium timepiece", 3);
        assertThat(hits).isNotEmpty();

        // Find similar products
        List<VectorSearchHit> similar = qdrantVectorService.findSimilar(testProduct, 2);
        assertThat(similar).isNotNull();

        // Delete test product
        boolean delOk = qdrantVectorService.deleteProduct(9999);
        assertThat(delOk).isTrue();
    }
}
