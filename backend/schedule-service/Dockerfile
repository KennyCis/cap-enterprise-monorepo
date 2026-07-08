# Etapa 1: Construcción (Build)
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
# Copiamos los archivos de configuración de Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
# Damos permisos de ejecución al wrapper de Maven
RUN chmod +x ./mvnw
# Descargamos las dependencias (esto hace que los siguientes builds sean más rápidos)
RUN ./mvnw dependency:go-offline
# Copiamos el código fuente y compilamos
COPY src src
RUN ./mvnw clean package -DskipTests

# Etapa 2: Producción (Run)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copiamos solo el .jar compilado desde la etapa anterior
COPY --from=builder /app/target/*.jar app.jar
# Exponemos el puerto
EXPOSE 8083
# Comando para iniciar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]