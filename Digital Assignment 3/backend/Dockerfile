# OmniMarket DA3 backend image (used by Render; works on any Docker host).
# Build context is "Digital Assignment 3/" so the shared database/*.sql files are available to Maven.
#   docker build -f backend/Dockerfile -t omnimarket-da3-backend .

FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend/pom.xml backend/pom.xml
RUN mvn -q -B -f backend/pom.xml dependency:go-offline
COPY backend/src backend/src
COPY database/schema.sql database/seed.sql database/
RUN mvn -q -B -f backend/pom.xml package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/backend/target/omnimarket-da3-backend-1.0.0.jar app.jar
# Render injects PORT; application.properties reads it (default 8080)
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
