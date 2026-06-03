package com.futmanager.mapper;

import com.futmanager.dto.EquipoDTO;
import com.futmanager.model.Equipo;

public class EquipoMapper {
    public static EquipoDTO toDTO(Equipo equipo) {
        if (equipo == null) return null;
        return new EquipoDTO(
                equipo.getId(),
                equipo.getNombre(),
                equipo.getLiga(),
                equipo.getPais()
        );
    }

    public static Equipo toEntity(EquipoDTO dto) {
        if (dto == null) return null;
        return new Equipo(
                dto.getId(),
                dto.getNombre(),
                dto.getLiga(),
                dto.getPais()
        );
    }
}
