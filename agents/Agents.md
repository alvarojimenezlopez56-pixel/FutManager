# 🤖 Carpeta de Agentes de IA

Este directorio contiene las especificaciones y archivos de lógica para los agentes de Inteligencia Artificial que colaboran en el desarrollo, mantenimiento y control de calidad de **FutManager**.

---

## 🗂️ Estructura del Directorio de Agentes

- **`Agents.md`** (este archivo): Índice y explicación de la arquitectura multi-agente.
- **`developer-agent.txt`** (Lógica de Desarrollo): Instrucciones del sistema y reglas de codificación para el agente encargado del código.
- **`qa-agent.txt`** (Lógica de QA y Pruebas): Instrucciones para el agente de pruebas, enfocado en JUnit, Mockito y cobertura de código.
- **`codex-agent-logic.json`** (Configuración): Parámetros de comportamiento, temperatura y prompts para la orquestación.

---

## 🎭 Roles de los Agentes

### 1. Developer Agent (Agente de Desarrollo)
- **Propósito:** Escribir código limpio en Spring Boot (JPA, Controladores, Servicios) y componentes interactivos en React (estilizados con Vanilla CSS y animaciones premium).
- **Lógica de Entrada:** Define las plantillas de código, mapeadores de DTOs y lógica de negocio.
- **Instrucciones:** Ver archivo [developer-agent.txt](file:///c:/Users/alvar/Downloads/FutManager/agents/developer-agent.txt).

### 2. QA Agent (Agente de Control de Calidad)
- **Propósito:** Diseñar y ejecutar suites de pruebas unitarias y de integración en JUnit 5. Validar que las estadísticas cumplan con el rango `[0-99]`.
- **Lógica de Entrada:** Asegurar cobertura del 100% sobre las restricciones del backend.
- **Instrucciones:** Ver archivo [qa-agent.txt](file:///c:/Users/alvar/Downloads/FutManager/agents/qa-agent.txt).

---

## ⚙️ Orquestación de Agentes
La orquestación se realiza mediante AntiGravity IDE. Los agentes leen las especificaciones de la carpeta `.codex/` y planifican los cambios en fases incrementales:
1. **Fase de Análisis y Diseño:** Investigación del modelo de dominio.
2. **Fase de Desarrollo:** Creación de componentes e integración con JPA.
3. **Fase de Calidad (Testing):** Ejecución automatizada de pruebas y exposición del reporte de cobertura a través del endpoint `/api/test-results`.
