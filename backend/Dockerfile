# =========================================================
# Stage 1 - Build (Maven + JDK 21)
# =========================================================
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copia primeiro o pom para aproveitar o cache de dependências
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copia o código-fonte e compila o JAR (testes correm no CI, não na imagem)
COPY src ./src
RUN mvn -B clean package -DskipTests

# =========================================================
# Stage 2 - Runtime (apenas JRE, imagem final otimizada)
# =========================================================
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Utilizador não-root por segurança
RUN addgroup -S app && adduser -S app -G app

# Copia somente o artefacto final
COPY --from=build /app/target/*.jar app.jar
RUN chown -R app:app /app
USER app

# Perfil docker e opções de JVM configuráveis
ENV SPRING_PROFILES_ACTIVE=docker
ENV JAVA_OPTS=""

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
