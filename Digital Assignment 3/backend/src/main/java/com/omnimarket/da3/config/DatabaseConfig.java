package com.omnimarket.da3.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:26257/omnimarket?sslmode=disable}")
    private String dbUrl;

    @Value("${spring.datasource.username:root}")
    private String dbUsername;

    @Value("${spring.datasource.password:}")
    private String dbPassword;

    @Value("${app.datasource.max-pool-size:10}")
    private int maxPoolSize;

    @Bean
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        String username = dbUsername;
        String password = dbPassword;

        // CockroachDB Cloud hands out URLs of the form postgresql://user:pass@host:26257/db?sslmode=...
        // pgJDBC does not accept credentials inside the URL, so split them out here.
        String url = dbUrl.trim();
        if (url.startsWith("jdbc:")) {
            url = url.substring("jdbc:".length());
        }
        if (url.startsWith("postgres://")) {
            url = "postgresql://" + url.substring("postgres://".length());
        }
        URI uri = URI.create(url);
        if (uri.getRawUserInfo() != null) {
            String[] userInfo = uri.getRawUserInfo().split(":", 2);
            username = URLDecoder.decode(userInfo[0], StandardCharsets.UTF_8);
            if (userInfo.length > 1) {
                password = URLDecoder.decode(userInfo[1], StandardCharsets.UTF_8);
            }
            url = url.replace(uri.getRawUserInfo() + "@", "");
        }

        // stringtype=unspecified lets CockroachDB coerce string parameters (e.g. form input "799.00")
        // into the column's real type (DECIMAL, INT8, ...) instead of rejecting them as VARCHAR.
        String jdbcUrl = "jdbc:" + url;
        if (!jdbcUrl.contains("stringtype=")) {
            jdbcUrl += (jdbcUrl.contains("?") ? "&" : "?") + "stringtype=unspecified";
        }
        // CockroachDB Cloud certificates chain to a public CA. Without an explicit sslrootcert, pgJDBC
        // would look for ~/.postgresql/root.crt (absent on hosts like Render); verify against the JVM's
        // trust store instead, still with full hostname verification.
        if (jdbcUrl.contains("sslmode=verify-full") && !jdbcUrl.contains("sslrootcert=") && !jdbcUrl.contains("sslfactory=")) {
            jdbcUrl += "&sslfactory=org.postgresql.ssl.DefaultJavaSSLFactory";
        }

        config.setJdbcUrl(jdbcUrl);
        config.setDriverClassName("org.postgresql.Driver");
        if (username != null && !username.isBlank()) {
            config.setUsername(username);
        }
        if (password != null && !password.isBlank()) {
            config.setPassword(password);
        }

        config.setMaximumPoolSize(maxPoolSize);
        config.setMinimumIdle(2);
        config.setIdleTimeout(30000);
        config.setMaxLifetime(1800000);
        config.setConnectionTimeout(15000);
        config.setPoolName("OmniMarketHikariPool");

        logger.info("Configuring CockroachDB JDBC DataSource: {}", jdbcUrl);
        HikariDataSource ds = new HikariDataSource(config);
        initializeDatabase(ds);
        return ds;
    }

    /**
     * Applies db/schema.sql and db/seed.sql (packaged from the top-level database/ folder)
     * the first time the backend connects to an empty database. Later starts leave data untouched,
     * so rows deleted through the Professor interface are not re-seeded.
     */
    private void initializeDatabase(DataSource ds) {
        try (Connection conn = ds.getConnection()) {
            logger.info("Connected via JDBC: {} {}",
                    conn.getMetaData().getDatabaseProductName(), conn.getMetaData().getDatabaseProductVersion());

            // CockroachDB accepts connections to a database that does not exist yet; create it so a
            // fresh cluster works without running "crdb-cli.cmd init" first.
            String database = conn.getCatalog();
            if (database != null && !database.isBlank()) {
                try (Statement stmt = conn.createStatement()) {
                    stmt.execute("CREATE DATABASE IF NOT EXISTS \"" + database.replace("\"", "\"\"") + "\"");
                } catch (SQLException e) {
                    logger.warn("Could not ensure database '{}' exists (continuing): {}", database, e.getMessage());
                }
            }

            if (tableExists(conn, "roles")) {
                logger.info("Database schema already initialized. Ready for operations.");
                return;
            }

            logger.info("Database schema not found. Applying db/schema.sql ...");
            executeSqlScript(conn, "db/schema.sql");
            logger.info("Applying baseline seed data from db/seed.sql ...");
            executeSqlScript(conn, "db/seed.sql");
            logger.info("Database initialization completed successfully.");
        } catch (SQLException | IOException e) {
            throw new IllegalStateException("CockroachDB initialization failed: " + e.getMessage()
                    + ". Is the cluster running and does the database exist? (crdb-cli.cmd start / init)", e);
        }
    }

    private boolean tableExists(Connection conn, String tableName) throws SQLException {
        try (ResultSet rs = conn.getMetaData().getTables(null, null, tableName, new String[]{"TABLE"})) {
            return rs.next();
        }
    }

    private void executeSqlScript(Connection conn, String resourceName) throws IOException, SQLException {
        ClassPathResource resource = new ClassPathResource(resourceName);
        String sql;
        try (InputStream is = resource.getInputStream()) {
            sql = StreamUtils.copyToString(is, StandardCharsets.UTF_8);
        }

        StringBuilder withoutComments = new StringBuilder();
        for (String line : sql.split("\\R")) {
            if (!line.trim().startsWith("--")) {
                withoutComments.append(line).append('\n');
            }
        }

        // Statements end with ';' at end of line; none of the seed values contain that sequence.
        try (Statement stmt = conn.createStatement()) {
            for (String part : withoutComments.toString().split(";\\s*\\n")) {
                String trimmed = part.trim();
                if (!trimmed.isEmpty()) {
                    stmt.execute(trimmed);
                }
            }
        }
    }
}
