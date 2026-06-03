package com.futmanager.service;

import com.futmanager.dto.AlineacionRequestDTO;
import com.futmanager.model.Alineacion;
import com.futmanager.model.AlineacionPosicion;
import com.futmanager.model.CartaFUT;
import com.futmanager.repository.AlineacionRepository;
import com.futmanager.repository.CartaFUTRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class AlineacionService {

    private final AlineacionRepository alineacionRepository;
    private final CartaFUTRepository cartaFUTRepository;

    @Autowired
    public AlineacionService(AlineacionRepository alineacionRepository, CartaFUTRepository cartaFUTRepository) {
        this.alineacionRepository = alineacionRepository;
        this.cartaFUTRepository = cartaFUTRepository;
    }

    public List<Alineacion> findAll() {
        return alineacionRepository.findAll();
    }

    public Optional<Alineacion> findById(Long id) {
        return alineacionRepository.findById(id);
    }

    public Alineacion save(AlineacionRequestDTO requestDTO) {
        if (requestDTO.getNombre() == null || requestDTO.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la alineación es obligatorio");
        }
        if (requestDTO.getFormacion() == null || requestDTO.getFormacion().trim().isEmpty()) {
            throw new IllegalArgumentException("La formación es obligatoria");
        }

        Alineacion alineacion;
        if (requestDTO.getId() != null) {
            alineacion = alineacionRepository.findById(requestDTO.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Alineación no encontrada con ID: " + requestDTO.getId()));
            alineacion.setNombre(requestDTO.getNombre());
            alineacion.setFormacion(requestDTO.getFormacion());
            alineacion.getPosiciones().clear();
        } else {
            alineacion = new Alineacion(null, requestDTO.getNombre(), requestDTO.getFormacion());
        }

        if (requestDTO.getPosiciones() != null) {
            for (Map.Entry<String, Long> entry : requestDTO.getPosiciones().entrySet()) {
                String posicionClave = entry.getKey();
                Long cartaId = entry.getValue();

                if (cartaId != null) {
                    CartaFUT carta = cartaFUTRepository.findById(cartaId)
                            .orElseThrow(() -> new IllegalArgumentException("Carta FUT no encontrada con ID: " + cartaId));
                    AlineacionPosicion pos = new AlineacionPosicion(null, alineacion, posicionClave, carta);
                    alineacion.getPosiciones().add(pos);
                }
            }
        }

        return alineacionRepository.save(alineacion);
    }

    public void delete(Long id) {
        if (!alineacionRepository.existsById(id)) {
            throw new IllegalArgumentException("Alineación no encontrada con ID: " + id);
        }
        alineacionRepository.deleteById(id);
    }
}
