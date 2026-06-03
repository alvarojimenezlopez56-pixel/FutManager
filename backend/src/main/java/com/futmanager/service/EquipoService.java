package com.futmanager.service;

import com.futmanager.model.Equipo;
import com.futmanager.repository.EquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EquipoService {

    private final EquipoRepository equipoRepository;

    @Autowired
    public EquipoService(EquipoRepository equipoRepository) {
        this.equipoRepository = equipoRepository;
    }

    public List<Equipo> findAll() {
        return equipoRepository.findAll();
    }

    public Optional<Equipo> findById(Long id) {
        return equipoRepository.findById(id);
    }

    public Equipo save(Equipo equipo) {
        if (equipo.getNombre() == null || equipo.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del equipo no puede estar vacío");
        }
        if (equipo.getLiga() == null || equipo.getLiga().trim().isEmpty()) {
            throw new IllegalArgumentException("La liga del equipo no puede estar vacía");
        }
        if (equipo.getPais() == null || equipo.getPais().trim().isEmpty()) {
            throw new IllegalArgumentException("El país del equipo no puede estar vacío");
        }
        return equipoRepository.save(equipo);
    }

    public Equipo update(Long id, Equipo equipoDetails) {
        Equipo equipo = equipoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Equipo no encontrado con ID: " + id));

        if (equipoDetails.getNombre() == null || equipoDetails.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del equipo no puede estar vacío");
        }
        if (equipoDetails.getLiga() == null || equipoDetails.getLiga().trim().isEmpty()) {
            throw new IllegalArgumentException("La liga del equipo no puede estar vacía");
        }
        if (equipoDetails.getPais() == null || equipoDetails.getPais().trim().isEmpty()) {
            throw new IllegalArgumentException("El país del equipo no puede estar vacío");
        }

        equipo.setNombre(equipoDetails.getNombre());
        equipo.setLiga(equipoDetails.getLiga());
        equipo.setPais(equipoDetails.getPais());

        return equipoRepository.save(equipo);
    }

    public void delete(Long id) {
        if (!equipoRepository.existsById(id)) {
            throw new IllegalArgumentException("Equipo no encontrado con ID: " + id);
        }
        equipoRepository.deleteById(id);
    }
}
