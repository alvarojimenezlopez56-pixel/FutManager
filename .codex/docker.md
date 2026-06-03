# Infraestructura y Contenedores (Docker)

Para garantizar un entorno de desarrollo reproducible, local y libre de dependencias externas en el sistema operativo del desarrollador, el motor de base de datos **MySQL** se desplegará mediante un contenedor Docker utilizando **Docker Compose**.

---

## 📄 Estructura del docker-compose.yml

Se debe crear un archivo `docker-compose.yml` en la **raíz del proyecto** con la siguiente configuración:

```yaml
version: '3.8'

services:
  mysql-db:
    image: mysql:8.0
    container_name: futmanager_db
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: futmanager
      MYSQL_USER: futuser
      MYSQL_PASSWORD: futpassword
    volumes:
      - futmanager_data:/var/lib/mysql
    networks:
      - futmanager_net
    restart: unless-stopped

volumes:
  futmanager_data:
    driver: local

networks:
  futmanager_net:
    driver: bridge
```

---

## 🔧 Detalles de Configuración

1. **Servicio (`mysql-db`):**
   - **Imagen:** `mysql:8.0` para mayor estabilidad y compatibilidad.
   - **Puertos:** Mapeo de `3306:3306`. Esto permite que el backend de Spring Boot se conecte a `localhost:3306` desde fuera del contenedor.
   - **Base de Datos por Defecto:** Se creará automáticamente la base de datos `futmanager` al inicializarse el contenedor.
   - **Variables de Entorno:**
     - `MYSQL_ROOT_PASSWORD`: Contraseña para el superusuario root.
     - `MYSQL_DATABASE`: Nombre de la base de datos inicial (`futmanager`).
     - `MYSQL_USER` y `MYSQL_PASSWORD`: Credenciales de acceso para la aplicación.
2. **Volúmenes (`futmanager_data`):**
   - Mapea el directorio `/var/lib/mysql` dentro del contenedor a un volumen local persistente gestionado por Docker. Esto asegura que la información de los jugadores y equipos no se pierda al reiniciar o apagar el contenedor.
3. **Redes (`futmanager_net`):**
   - Red puente (bridge) para permitir que otros servicios (por ejemplo, si el backend se empaquetara también en Docker en el futuro) puedan comunicarse por nombre de servicio.

---

## 🚀 Comandos Clave de Gestión

- **Levantar la infraestructura (en segundo plano):**
  ```bash
  docker compose up -d
  ```
- **Verificar que el contenedor está corriendo:**
  ```bash
  docker ps
  ```
- **Detener los servicios sin borrar datos:**
  ```bash
  docker compose stop
  ```
- **Detener los servicios eliminando contenedores y redes:**
  ```bash
  docker compose down
  ```
- **Detener los servicios eliminando contenedores y los datos persistidos (limpieza total):**
  ```bash
  docker compose down -v
  ```
