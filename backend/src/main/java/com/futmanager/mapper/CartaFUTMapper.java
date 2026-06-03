package com.futmanager.mapper;

import com.futmanager.dto.CartaFUTResponseDTO;
import com.futmanager.dto.CartaFUTRequestDTO;
import com.futmanager.model.CartaFUT;
import com.futmanager.model.Jugador;
import com.futmanager.model.Equipo;

public class CartaFUTMapper {
    public static CartaFUTResponseDTO toResponseDTO(CartaFUT carta) {
        if (carta == null) return null;
        return new CartaFUTResponseDTO(
                carta.getId(),
                JugadorMapper.toDTO(carta.getJugador()),
                EquipoMapper.toDTO(carta.getEquipo()),
                carta.getMedia(),
                carta.getRitmo(),
                carta.getTiro(),
                carta.getPase(),
                carta.getRegate(),
                carta.getDefensa(),
                carta.getFisico(),
                carta.getTipoCarta()
        );
    }

    public static CartaFUT toEntity(CartaFUTRequestDTO dto, Jugador jugador, Equipo equipo) {
        if (dto == null) return null;
        return new CartaFUT(
                dto.getId(),
                jugador,
                equipo,
                dto.getMedia(),
                dto.getRitmo(),
                dto.getTiro(),
                dto.getPase(),
                dto.getRegate(),
                dto.getDefensa(),
                dto.getFisico(),
                dto.getTipoCarta()
        );
    }
}
