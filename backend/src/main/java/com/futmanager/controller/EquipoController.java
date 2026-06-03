package com.futmanager.controller;

import com.futmanager.dto.EquipoDTO;
import com.futmanager.mapper.EquipoMapper;
import com.futmanager.model.Equipo;
import com.futmanager.service.EquipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/equipos")
@CrossOrigin(origins = "*")
public class EquipoController {

    private final EquipoService equipoService;

    @Autowired
    public EquipoController(EquipoService equipoService) {
        this.equipoService = equipoService;
    }

    @GetMapping
    public ResponseEntity<List<EquipoDTO>> getAllEquipos() {
        List<EquipoDTO> dtos = equipoService.findAll().stream()
                .map(EquipoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipoDTO> getEquipoById(@PathVariable Long id) {
        return equipoService.findById(id)
                .map(e -> ResponseEntity.ok(EquipoMapper.toDTO(e)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EquipoDTO> createEquipo(@RequestBody EquipoDTO equipoDTO) {
        Equipo equipo = EquipoMapper.toEntity(equipoDTO);
        Equipo nuevoEquipo = equipoService.save(equipo);
        return ResponseEntity.status(HttpStatus.CREATED).body(EquipoMapper.toDTO(nuevoEquipo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipoDTO> updateEquipo(@PathVariable Long id, @RequestBody EquipoDTO equipoDTO) {
        Equipo equipoDetails = EquipoMapper.toEntity(equipoDTO);
        Equipo equipoActualizado = equipoService.update(id, equipoDetails);
        return ResponseEntity.ok(EquipoMapper.toDTO(equipoActualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipo(@PathVariable Long id) {
        equipoService.delete(id);
        return ResponseEntity.ok().build();
    }
}
