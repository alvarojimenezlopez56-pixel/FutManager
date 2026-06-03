# Especificación del Frontend (React)

El frontend de **FutManager** se construirá como una Single Page Application (SPA) con **React**. Se enfocará en proporcionar una experiencia de usuario fluida, interactiva y con una estética premium basada en un tema oscuro con acentos dorados y efectos de brillo (estilo FUT Ultimate Team).

---

## 🎨 Temática Visual y Estilos (CSS Vanilla)

Para conseguir un acabado visual sobresaliente, se implementará una hoja de estilos `index.css` que configure:
- **Colores Principales:** Fondos oscuros (`#0d0e12`, `#15171e`), tonos de acento dorados (`#d4af37`, `#f3e5ab`) y bordes brillantes con gradientes.
- **Efecto Glassmorphism:** Paneles traslúcidos con desenfoque de fondo (`backdrop-filter: blur(10px)`) para tarjetas y paneles de control.
- **Tipografía Moderna:** Carga de fuentes limpias (ej. `Outfit` o `Inter` de Google Fonts).
- **Transiciones Suaves:** Micro-animaciones en botones, inputs y hover effects en las cartas de los jugadores.

---

## 🃏 Componente: Tarjeta estilo FUT (`FutCard`)

Este componente renderizará de forma interactiva una carta de fútbol. Su diseño imitará el escudo clásico de Ultimate Team:

```
+---------------------------+
|  [92]  [PAC: 89]          | <-- Media (Valoración) y Estadísticas principales
|  [DC]  [SHO: 93]          | <-- Posición
|        [PAS: 84]          |
|                           |
|        /\   /\            |
|       /  \_/  \           |
|      (  Avatar )          | <-- Silueta Genérica SVG o Imagen libre
|       \       /           |
|        \_____/            |
|                           |
|       J. PÉREZ            | <-- Nombre/Apodo del jugador
|                           |
|      [Escudo] [Bandera]   | <-- Escudo de equipo genérico y nacionalidad
|  DRI: 91  DEF: 42  PHY: 82| <-- Estadísticas físicas inferiores
+---------------------------+
```

### Características Visuales por Tipo de Carta:
- **ORO:** Gradiente dorado con reflejos brillantes.
- **PLATA:** Gradiente plateado/grisáceo metálico.
- **BRONCE:** Tonos cobrizos y mate.
- **ESPECIAL:** Fondo oscuro/morado con bordes de luz parpadeante o de gradiente arcoíris.

---

## 🖥️ Estructura de la Interfaz (Dashboard Principal)

La interfaz se organizará en tres secciones principales bien delimitadas y adaptables (Responsive Grid):

### 1. Panel de Administración (Gestión CRUD)
- **Formularios de Creación y Edición:**
  - Modales o paneles colapsables para añadir/editar **Jugadores**, **Equipos** y **Cartas**.
  - Validación dinámica en el frontend (ej. no permitir guardar si faltan campos obligatorios o si las estadísticas no están en el rango 0-99).
- **Tablas/Grillas de Selección:**
  - Selector interactivo de jugadores y equipos ya creados para asignarlos al crear una nueva carta.

### 2. Galería de Cartas FUT (Búsqueda y Filtros)
- Barra de búsqueda por nombre del jugador.
- Selector de filtros rápidos: tipo de carta, liga/equipo, valoración media mínima y máxima.
- Botones de acción directa dentro de cada carta: "Editar estadísticas" y "Eliminar carta" (con confirmación visual).

### 3. Panel de Resultados JUnit (`JUnitResultsPanel`)
- Un widget flotante o pestaña lateral que realiza un `fetch` a `/api/test-results` de forma periódica o manual al hacer click en un botón "Actualizar Tests".
- **Elementos Visuales:**
  - **Badge de Estado Global:** Verde con "PASSED" si todas las pruebas pasan; Rojo con "FAILED" si hay fallos.
  - **Métricas:** Número total de tests ejecutados, aprobados y fallados.
  - **Lista Desplegable:** Detalle de los nombres de los tests ejecutados y su clase origen para validar la cobertura rápidamente.
