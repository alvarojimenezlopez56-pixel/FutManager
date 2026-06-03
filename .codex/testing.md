# Estrategia de Testing (JUnit 5)

Las pruebas automatizadas son un requisito fundamental de la aplicación **FutManager**. La solución debe incluir tanto pruebas unitarias (unit tests) como pruebas de integración (integration tests) utilizando el ecosistema estándar de **JUnit 5** y **Spring Boot Test**.

---

## 🧪 Pruebas Unitarias (Lógica de Negocio y Validación)

Se enfocarán en validar de forma aislada las reglas de negocio del servicio, principalmente en `CartaFutService` e `InscripcionService` o equivalentes, utilizando **Mockito** para mockear la capa de repositorio.

### Escenarios Críticos a Evaluar (Obligatorios):

1. **Validación de Límites Numéricos (Media y Atributos):**
   - **Caso de Éxito:** Permitir guardar una carta con una `media` y estadísticas en el rango válido [0-99] (por ejemplo, valor = 85).
   - **Caso de Error (Límite Superior):** Lanzar una excepción de tipo `IllegalArgumentException` o similar si la media es mayor a 99 (ej. 100).
   - **Caso de Error (Límite Inferior):** Lanzar una excepción si la media es menor a 0 (ej. -1).
   - **Estadísticas Individuales:** Validar las mismas reglas para `ritmo`, `tiro`, `pase`, `regate`, `defensa` y `fisico`.
2. **Validación de Asociaciones Obligatorias:**
   - Lanzar error si se intenta guardar una carta que no está vinculada a un `Jugador` existente.
   - Lanzar error si no está vinculada a un `Equipo` existente.

---

## 🔗 Pruebas de Integración (Capa de Acceso a Datos y API)

Se deben crear pruebas de integración que involucren la base de datos y la comunicación HTTP de los controladores usando `@SpringBootTest` y `MockMvc`.

### Escenarios de Integración a Evaluar:

1. **Operación de Guardado (Save):**
   - Enviar una petición `POST /api/cartas` con los datos correspondientes.
   - Verificar que se devuelva un código `201 Created`.
   - Comprobar que el registro se guarde físicamente en la base de datos MySQL (o base de datos de test) y que se le asigne un ID autoincremental.
2. **Operación de Búsqueda (Search/Read):**
   - Consultar una entidad existente mediante `GET /api/cartas/{id}`.
   - Comprobar que los datos devueltos coincidan exactamente con lo esperado (`200 OK`).
   - Consultar un ID inexistente y comprobar que devuelva un código `404 Not Found`.
3. **Operación de Actualización (Update):**
   - Modificar las estadísticas de una carta mediante `PUT /api/cartas/{id}`.
   - Comprobar que los cambios persistan en base de datos.
4. **Operación de Borrado (Delete):**
   - Borrar una entidad mediante `DELETE /api/cartas/{id}`.
   - Verificar que devuelva un código `204 No Content` o `200 OK`.
   - Comprobar que una búsqueda posterior de ese ID devuelva `404 Not Found`.

---

## 🛠️ Ejecución y Reporte de Cobertura

- **Comando para Ejecutar Tests:**
  ```bash
  ./mvnw test
  ```
- **Integración con el Endpoint de Resultados:**
  - El backend debe capturar o simular la última ejecución exitosa del reporte de tests y exponer los resultados a través del endpoint `/api/test-results` (especificado en `backend.md`), de manera que el frontend pueda mostrarlos de forma amigable.
