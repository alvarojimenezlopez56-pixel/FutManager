# Criterios de Aceptación y Validación Final

Este documento describe la lista de verificación final (checklist) y las pruebas manuales/automáticas requeridas para dar por completada la implementación del proyecto **FutManager**.

---

## 📋 Lista de Verificación de Aceptación (Checklist)

Para asegurar la calidad y el cumplimiento de los requisitos del proyecto, el desarrollo debe cumplir con los siguientes puntos al 100%:

- [ ] **1. Levantar Infraestructura de Datos (MySQL)**
  - El contenedor de MySQL se levanta correctamente al ejecutar `docker compose up -d` en la raíz del proyecto.
  - La base de datos `futmanager` es accesible a través del puerto `3306` con las credenciales especificadas en la documentación.
  - Los datos persisten correctamente tras un reinicio del contenedor (gracias al volumen Docker).

- [ ] **2. Inicio del Backend (Spring Boot)**
  - El backend compila y arranca sin errores mediante `./mvnw spring-boot:run`.
  - La conexión con MySQL se realiza con éxito al arrancar el backend (sin excepciones de conexión en el log).
  - Hibernate crea o actualiza las tablas `jugador`, `equipo` y `carta_fut` automáticamente.

- [ ] **3. Ejecución de Pruebas Unitarias e Integración (JUnit)**
  - Todos los tests JUnit se ejecutan con el comando `./mvnw test`.
  - El 100% de los tests pasan en verde (0 fallos, 0 errores).
  - Existen tests que validan explícitamente el rango de estadísticas [0-99] lanzando excepciones en los casos inválidos.

- [ ] **4. API REST Funcional y Filtros**
  - Los endpoints CRUD `/api/jugadores`, `/api/equipos` y `/api/cartas` responden correctamente a peticiones GET, POST, PUT y DELETE.
  - El filtrado por posición de jugadores y el rango de valoración media de cartas funcionan según lo especificado.
  - El endpoint `/api/test-results` expone un reporte en formato JSON con el estado de los tests JUnit.

- [ ] **5. Conectividad y Visualización en el Frontend (React)**
  - El frontend se inicia sin errores en modo desarrollo (`npm run dev` o equivalente).
  - El cliente React se conecta de manera transparente a la API de Spring Boot (ej. mediante proxies de desarrollo para evitar problemas de CORS).
  - Se visualizan las cartas en formato estético FUT con colores dinámicos (Oro, Plata, Bronce, Especial).
  - Se pueden realizar todas las operaciones del CRUD (crear equipos/jugadores/cartas, modificarlos y eliminarlos).
  - El panel de JUnit del frontend realiza fetch exitoso a `/api/test-results` y renderiza el estado de las pruebas correctamente (verde/rojo).

- [ ] **6. Documentación del Repositorio**
  - Existe un archivo `README.md` en la raíz del proyecto que explica claramente:
    - Requisitos previos para ejecutar el proyecto (Docker, Java, Node.js).
    - Pasos detallados para levantar la base de datos con Docker Compose.
    - Pasos detallados para compilar e iniciar el backend.
    - Pasos detallados para instalar dependencias e iniciar el frontend.
    - Comando para ejecutar los tests.
