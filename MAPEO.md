# Documentación: Mapeo Automático de Datos

Este documento explica el concepto de mapeo automático de datos, sus ventajas en arquitecturas por capas y lo ilustra de forma visual.

---

## ❓ ¿Qué es el Mapeo Automático de Datos?

El **Mapeo de Datos (Data Mapping)** es el proceso de transformar y copiar datos desde un formato/modelo de datos a otro. En desarrollo de software, se usa principalmente para traducir objetos entre la capa de acceso a datos (Entidades JPA/Hibernate) y la capa de exposición API (DTOs).

El **Mapeo Automático** consiste en utilizar herramientas, librerías o frameworks que analizan la estructura de las clases y generan la lógica de copia automáticamente en tiempo de compilación o ejecución, eliminando la necesidad de escribir manualmente código repetitivo como `dto.setNombre(entity.getNombre())`.

### 🛠️ Librerías más utilizadas en el Ecosistema Java/Spring Boot:

1. **MapStruct:** Genera código Java estándar durante la compilación a través de un procesador de anotaciones (`@Mapper`). Es extremadamente rápido y seguro contra errores de tipos en tiempo de compilación.
2. **ModelMapper:** Utiliza reflexión en tiempo de ejecución para mapear objetos con la misma estructura de nombres de atributos de forma automática.
3. **Jackson ObjectMapper:** Usado por Spring Boot internamente para serializar y deserializar JSON a objetos Java.

---

## 🆚 Mapeo Manual vs. Mapeo Automático

| Característica | Mapeo Manual (Usado en el proyecto) | Mapeo Automático (ej. MapStruct) |
| :--- | :--- | :--- |
| **Líneas de Código** | Alto. Requiere escribir manualmente la asignación de cada atributo. | Mínimo. El framework autogenera la clase de implementación. |
| **Tiempo de Desarrollo** | Lento y monótono. Hay que modificar mappers por cada campo nuevo. | Instantáneo una vez configurado. |
| **Rendimiento** | Máximo. Son llamadas directas compiladas a métodos Java. | Máximo (MapStruct compila a código nativo) o Medio (si usa reflexión). |
| **Mantenibilidad** | Compleja. Mayor riesgo de olvidar actualizar mapeadores. | Muy sencilla. Detecta automáticamente cambios en campos homónimos. |

---

## 💡 Ejemplo Práctico de Configuración de MapStruct

Para implementar mapeo automático en este proyecto, solo tendríamos que:

1. Añadir la dependencia en `pom.xml`:
```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>
```

2. Definir una interfaz anotada:
```java
@Mapper(componentModel = "spring")
public interface JugadorMapper {
    JugadorDTO toDTO(Jugador jugador);
    Jugador toEntity(JugadorDTO dto);
}
```
*MapStruct implementará automáticamente todos los sets y gets correspondientes en la fase de compilación.*
