package com.futmanager.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class AlineacionPosicion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "alineacion_id", nullable = false)
    @JsonIgnore
    private Alineacion alineacion;

    @Column(nullable = false)
    private String posicionClave; // ej. "POR", "LI", "DFC1", "DFC2", "LD", "MC1", "MC2", "MC3", "EI", "ED", "DC"

    @ManyToOne(optional = false)
    @JoinColumn(name = "carta_id", nullable = false)
    private CartaFUT carta;

    public AlineacionPosicion() {
    }

    public AlineacionPosicion(Long id, Alineacion alineacion, String posicionClave, CartaFUT carta) {
        this.id = id;
        this.alineacion = alineacion;
        this.posicionClave = posicionClave;
        this.carta = carta;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Alineacion getAlineacion() {
        return alineacion;
    }

    public void setAlineacion(Alineacion alineacion) {
        this.alineacion = alineacion;
    }

    public String getPosicionClave() {
        return posicionClave;
    }

    public void setPosicionClave(String posicionClave) {
        this.posicionClave = posicionClave;
    }

    public CartaFUT getCarta() {
        return carta;
    }

    public void setCarta(CartaFUT carta) {
        this.carta = carta;
    }
}
