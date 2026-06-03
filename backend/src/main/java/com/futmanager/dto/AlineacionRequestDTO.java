package com.futmanager.dto;

import java.util.Map;

public class AlineacionRequestDTO {
    private Long id;
    private String nombre;
    private String formacion;
    private Map<String, Long> posiciones; // Clave de posición (ej. "POR", "MC1") -> ID de la carta

    public AlineacionRequestDTO() {
    }

    public AlineacionRequestDTO(Long id, String nombre, String formacion, Map<String, Long> posiciones) {
        this.id = id;
        this.nombre = nombre;
        this.formacion = formacion;
        this.posiciones = posiciones;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getFormacion() {
        return formacion;
    }

    public void setFormacion(String formacion) {
        this.formacion = formacion;
    }

    public Map<String, Long> getPosiciones() {
        return posiciones;
    }

    public void setPosiciones(Map<String, Long> posiciones) {
        this.posiciones = posiciones;
    }
}
