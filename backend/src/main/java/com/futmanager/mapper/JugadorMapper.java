package com.futmanager.mapper;

import com.futmanager.dto.JugadorDTO;
import com.futmanager.model.Jugador;

public class JugadorMapper {
    public static JugadorDTO toDTO(Jugador jugador) {
        if (jugador == null) return null;
        return new JugadorDTO(
                jugador.getId(),
                jugador.getNombre(),
                jugador.getApodo(),
                jugador.getPosicion(),
                jugador.getNacionalidad()
        );
    }

    public static Jugador toEntity(JugadorDTO dto) {
        if (dto == null) return null;
        return new Jugador(
                dto.getId(),
                dto.getNombre(),
                dto.getApodo(),
                dto.getPosicion(),
                dto.getNacionalidad()
        );
    }
}
