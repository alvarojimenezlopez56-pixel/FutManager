# FutManager 🃏⚽

**FutManager** es una aplicación didáctica diseñada para la gestión de jugadores, equipos y cartas de fútbol al estilo *FUT (Football Ultimate Team)*. Permite visualizar de forma interactiva las cartas creadas, filtrarlas dinámicamente y realizar operaciones CRUD completas en una interfaz premium y responsiva, con un panel integrado que reporta el estado en tiempo real de las pruebas automáticas **JUnit 5**.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React SPA (Vite), estilizado con Vanilla CSS.
- **Backend:** Spring Boot 3.x, JPA / Hibernate, JUnit 5, Mockito.
- **Base de Datos:** MySQL 8.x.
- **Infraestructura:** Docker & Docker Compose.

---

## 📋 Requisitos Previos

Antes de ejecutar el proyecto, asegúrese de tener instalados los siguientes componentes:
1. **Java Development Kit (JDK):** Versión 17 o superior (desarrollado y probado con JDK 26).
2. **Node.js y npm:** Versión 18 o superior para el desarrollo del frontend.
3. **Docker y Docker Desktop:** Para contenerizar la base de datos MySQL.
4. **Apache Maven:** Opcional (se incluye script/configuración para usar Maven en el backend).

---

## 🚀 Guía de Inicio Rápido

Siga estos pasos en orden para levantar la aplicación completa:

### 1. Base de Datos (Docker)
Abra una terminal en la raíz del proyecto y ejecute el siguiente comando para levantar el contenedor de MySQL:
```bash
docker compose up -d
```
*Esto iniciará la base de datos MySQL en el puerto `3306` con la base de datos `futmanager` preconfigurada.*

### 2. Backend (Spring Boot)
1. Diríjase a la carpeta `backend/`:
   ```bash
   cd backend
   ```
2. Ejecute las pruebas unitarias y de integración para generar los reportes de calidad:
   ```bash
   ./mvnw clean test
   ```
   *(Si no tiene Maven global, el proyecto incluye un Maven Wrapper `./mvnw` o `./mvnw.cmd` que automatizará la descarga del compilador).*
3. Inicie el servidor backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   *El servidor REST se levantará en [http://localhost:8080](http://localhost:8080).*

### 3. Frontend (React)
1. En una nueva terminal, diríjase a la carpeta `frontend/`:
   ```bash
   cd frontend
   ```
2. Instale las dependencias necesarias:
   ```bash
   npm install
   ```
3. Inicie el servidor de desarrollo de React:
   ```bash
   npm run dev
   ```
   *El frontend estará disponible en el puerto indicado en la consola (por defecto [http://localhost:5173](http://localhost:5173)).*

---

## 🧪 Pruebas Unitarias y de Integración

Las pruebas automáticas garantizan la estabilidad del sistema:
- **Pruebas Unitarias (`CartaFUTServiceTest`):** Validan el rango estricto de las estadísticas `[0-99]` y las asociaciones obligatorias de las cartas.
- **Pruebas de Integración (`CartaFUTIntegrationTest`):** Validan las rutas REST del CRUD completo en base de datos in-memory (H2) para que puedan ejecutarse sin requerir que el contenedor de MySQL esté corriendo.

Para ejecutar los tests manualmente en cualquier momento:
```bash
cd backend
./mvnw test
```
*Los resultados se generarán automáticamente en `backend/target/surefire-reports` y podrán visualizarse de forma gráfica en la pestaña "Pruebas JUnit" de la aplicación web.*

---

## 🗂️ Estructura de Especificación (.codex)
Las especificaciones formales de arquitectura, restricciones legales y diseño de base de datos se encuentran en el directorio `.codex/` de la raíz del proyecto:
- **`AGENTS.md`**: Índice y prioridades de desarrollo.
- **`contexto.md`**: Reglas de propiedad intelectual (sin marcas ni fotos oficiales).
- **`arquitectura.md`**: Diagrama de flujo y estructura de capas.
- **`backend.md`**: Endpoints y especificación de entidades JPA.
- **`frontend.md`**: Componentes e indexación de estilos.
- **`testing.md`**: Casos de test automatizados obligatorios.
- **`docker.md`**: Estructura detallada del archivo Docker Compose.
- **`criterios-aceptacion.md`**: Checklist de validación final.

---

## ⚽ Creador de Alineaciones y Química FIFA
Se ha implementado un creador de alineaciones interactivo y dinámico:
- **Formaciones**: Soporta las formaciones `4-3-3`, `4-4-2` y `3-5-2` posicionando automáticamente a los jugadores en un campo de fútbol de césped verde.
- **Cálculo de Química**: Calcula en tiempo real la química individual (0 a 3 diamantes) y de plantilla (máximo 33 puntos) bajo reglas de FIFA:
  - **Posición Preferida**: Si un jugador no está en su posición preferida, obtiene 0 de química. Su posición se ilumina en rojo (incorrecto) o verde (correcto).
  - **Coincidencias (Club, Liga y País)**: Suma puntos basándose en umbrales de jugadores en su posición correcta del mismo Club (2/5/8 jugadores), Liga (3/5/8 jugadores) y País/Nacionalidad (2/5/8 jugadores).
- **Persistencia**: Permite asignar nombres a las plantillas y guardarlas en base de datos para cargarlas o eliminarlas posteriormente.

---

## 🤖 Carpeta de Agentes de IA (`agents/`)
En cumplimiento de las directrices del proyecto, se ha creado el directorio `agents/` en la raíz del repositorio, conteniendo:
- **`Agents.md`**: Explicación detallada de la arquitectura multi-agente, roles y orquestación.
- **`developer-agent.txt`**: Lógica, reglas de estilo y restricciones para el agente de codificación full-stack.
- **`qa-agent.txt`**: Lógica de verificación y cobertura de pruebas para el agente QA enfocado en JUnit.
- **`codex-agent-logic.json`**: Configuración técnica de comportamiento de los agentes.


