package com.futmanager.mapper;

import com.futmanager.dto.AlineacionResponseDTO;
import com.futmanager.dto.CartaFUTResponseDTO;
import com.futmanager.model.Alineacion;
import com.futmanager.model.AlineacionPosicion;
import java.util.HashMap;
import java.util.Map;

public class AlineacionMapper {

    public static AlineacionResponseDTO toResponseDTO(Alineacion alineacion) {
        if (alineacion == null) return null;
        
        Map<String, CartaFUTResponseDTO> posicionesMap = new HashMap<>();
        if (alineacion.getPosiciones() != null) {
            for (AlineacionPosicion pos : alineacion.getPosiciones()) {
                posicionesMap.put(pos.getPosicionClave(), CartaFUTMapper.toResponseDTO(pos.getCarta()));
            }
        }

        return new AlineacionResponseDTO(
                alineacion.getId(),
                alineacion.getNombre(),
                alineacion.getFormacion(),
                posicionesMap
        );
    }
}
