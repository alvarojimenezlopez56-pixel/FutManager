package com.futmanager.dto;

import java.util.Map;

public class AlineacionResponseDTO {
    private Long id;
    private String nombre;
    private String formacion;
    private Map<String, CartaFUTResponseDTO> posiciones; // Clave de posición -> Datos de la carta FUT

    public AlineacionResponseDTO() {
    }

    public AlineacionResponseDTO(Long id, String nombre, String formacion, Map<String, CartaFUTResponseDTO> posiciones) {
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

    public Map<String, CartaFUTResponseDTO> getPosiciones() {
        return posiciones;
    }

    public void setPosiciones(Map<String, CartaFUTResponseDTO> posiciones) {
        this.posiciones = posiciones;
    }
}
