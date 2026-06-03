package com.futmanager.dto;

public class JugadorDTO {
    private Long id;
    private String nombre;
    private String apodo;
    private String posicion;
    private String nacionalidad;

    public JugadorDTO() {
    }

    public JugadorDTO(Long id, String nombre, String apodo, String posicion, String nacionalidad) {
        this.id = id;
        this.nombre = nombre;
        this.apodo = apodo;
        this.posicion = posicion;
        this.nacionalidad = nacionalidad;
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

    public String getApodo() {
        return apodo;
    }

    public void setApodo(String apodo) {
        this.apodo = apodo;
    }

    public String getPosicion() {
        return posicion;
    }

    public void setPosicion(String posicion) {
        this.posicion = posicion;
    }

    public String getNacionalidad() {
        return nacionalidad;
    }

    public void setNacionalidad(String nacionalidad) {
        this.nacionalidad = nacionalidad;
    }
}
