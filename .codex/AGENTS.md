# Indice de Especificaciones - FutManager

Este archivo es el punto de partida y el índice principal para el desarrollo de **FutManager**, una aplicación didáctica diseñada para gestionar jugadores, equipos y cartas al estilo FUT (Football Ultimate Team).

---

## 🗂️ Archivos de Especificación (.codex)

Para comprender e implementar el proyecto, se deben leer y seguir las directrices detalladas en los siguientes documentos de especificación en este mismo directorio:

1. **[Contexto del Proyecto](file:///c:/Users/alvar/Downloads/FutManager/.codex/contexto.md)** (`contexto.md`): Propósito del proyecto, restricciones de propiedad intelectual y alcance.
2. **[Arquitectura del Sistema](file:///c:/Users/alvar/Downloads/FutManager/.codex/arquitectura.md)** (`arquitectura.md`): Stack tecnológico, arquitectura de capas en el backend y flujo de comunicación.
3. **[Diseño del Backend](file:///c:/Users/alvar/Downloads/FutManager/.codex/backend.md)** (`backend.md`): Modelado de base de datos, entidades JPA, endpoints de la API REST y filtrado.
4. **[Diseño del Frontend](file:///c:/Users/alvar/Downloads/FutManager/.codex/frontend.md)** (`frontend.md`): Interfaz React, visualización de cartas FUT, formularios CRUD y panel de JUnit.
5. **[Estrategia de Testing](file:///c:/Users/alvar/Downloads/FutManager/.codex/testing.md)** (`testing.md`): Pruebas unitarias e integración con JUnit, validaciones críticas.
6. **[Infraestructura y Docker](file:///c:/Users/alvar/Downloads/FutManager/.codex/docker.md)** (`docker.md`): Configuración de contenedores con Docker Compose para MySQL.
7. **[Criterios de Aceptación](file:///c:/Users/alvar/Downloads/FutManager/.codex/criterios-aceptacion.md)** (`criterios-aceptacion.md`): Checklist final para dar el desarrollo por completado.

---

## 🎯 Prioridades del Desarrollo

El desarrollo debe regirse estrictamente por las siguientes prioridades en orden de importancia:

1. **Funcionalidad Extremo a Extremo (End-to-End):** La aplicación debe ser completamente funcional en todas sus capas. El frontend debe poder realizar las operaciones CRUD (Crear, Leer, Actualizar, Borrar) y éstas deben persistirse correctamente en la base de datos MySQL a través del backend en Spring Boot.
2. **Pruebas Automatizadas (JUnit Obligatorio):** No se considera completada ninguna funcionalidad sin sus correspondientes tests unitarios y de integración. Los tests deben ser robustos y cubrir tanto casos de éxito como de error (ej. límites numéricos).
3. **Infraestructura Contenerizada (MySQL en Docker):** El backend no debe depender de una instalación local de MySQL. La base de datos debe levantarse única y exclusivamente mediante Docker Compose.
4. **Visibilidad del Estado de Calidad (Frontend JUnit Panel):** El frontend debe ofrecer una interfaz visual (panel de control) para visualizar el estado y los resultados de los tests de JUnit, consumiendo un endpoint dedicado en el backend.
