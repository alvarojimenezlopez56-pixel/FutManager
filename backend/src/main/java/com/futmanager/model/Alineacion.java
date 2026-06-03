package com.futmanager.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Alineacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String formacion; // "4-3-3", "4-4-2", "3-5-2"

    @OneToMany(mappedBy = "alineacion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AlineacionPosicion> posiciones = new ArrayList<>();

    public Alineacion() {
    }

    public Alineacion(Long id, String nombre, String formacion) {
        this.id = id;
        this.nombre = nombre;
        this.formacion = formacion;
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

    public List<AlineacionPosicion> getPosiciones() {
        return posiciones;
    }

    public void setPosiciones(List<AlineacionPosicion> posiciones) {
        this.posiciones = posiciones;
    }
}
