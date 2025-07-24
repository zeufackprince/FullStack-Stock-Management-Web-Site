## Running the Project with Docker

This project is containerized using Docker and Docker Compose for easy setup and deployment. Below are the instructions and details specific to this project:

### Project-Specific Docker Requirements
- **Base Image:** Uses `eclipse-temurin:21-jdk` for building and `eclipse-temurin:21-jre` for running the application (Java 21).
- **Build Tool:** Maven Wrapper (`mvnw`) is used for building the project inside the container.
- **Port:** The application exposes port **1010**.
- **User:** Runs as a non-root user (`appuser`) for improved security.
- **JVM Options:** Container-aware memory settings are enabled by default.

### Environment Variables
- No required environment variables are specified in the Dockerfile or `docker-compose.yml` by default.
- If you need to add environment variables, you can uncomment and use the `env_file` section in `docker-compose.yml`.

### Build and Run Instructions
1. **Build and start the application:**
   ```sh
   docker compose up --build
   ```
   This will build the Docker image and start the service defined in `docker-compose.yml`.

2. **Accessing the Application:**
   - The application will be available on your host at [http://localhost:1010](http://localhost:1010).

### Special Configuration
- **No external services** (such as databases or caches) are required or configured by default.
- **No persistent volumes** are needed for this service.
- If you add additional services (e.g., a database), update `docker-compose.yml` accordingly.

### Ports
- **java-app:** Exposes port **1010** (container: 1010 → host: 1010)

---

_If you make changes to the application's configuration (e.g., add environment variables or external services), update the Docker and Compose files as needed and document those changes here._
