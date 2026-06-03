package com.futmanager.controller;

import com.futmanager.dto.AlineacionRequestDTO;
import com.futmanager.dto.AlineacionResponseDTO;
import com.futmanager.mapper.AlineacionMapper;
import com.futmanager.model.Alineacion;
import com.futmanager.service.AlineacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alineaciones")
@CrossOrigin(origins = "*")
public class AlineacionController {

    private final AlineacionService alineacionService;

    @Autowired
    public AlineacionController(AlineacionService alineacionService) {
        this.alineacionService = alineacionService;
    }

    @GetMapping
    public ResponseEntity<List<AlineacionResponseDTO>> getAllAlineaciones() {
        List<Alineacion> alineaciones = alineacionService.findAll();
        List<AlineacionResponseDTO> dtos = alineaciones.stream()
                .map(AlineacionMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlineacionResponseDTO> getAlineacionById(@PathVariable Long id) {
        return alineacionService.findById(id)
                .map(a -> ResponseEntity.ok(AlineacionMapper.toResponseDTO(a)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AlineacionResponseDTO> createAlineacion(@RequestBody AlineacionRequestDTO requestDTO) {
        Alineacion nueva = alineacionService.save(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(AlineacionMapper.toResponseDTO(nueva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlineacionResponseDTO> updateAlineacion(@PathVariable Long id, @RequestBody AlineacionRequestDTO requestDTO) {
        requestDTO.setId(id);
        Alineacion actualizada = alineacionService.save(requestDTO);
        return ResponseEntity.ok(AlineacionMapper.toResponseDTO(actualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlineacion(@PathVariable Long id) {
        alineacionService.delete(id);
        return ResponseEntity.ok().build();
    }
}
