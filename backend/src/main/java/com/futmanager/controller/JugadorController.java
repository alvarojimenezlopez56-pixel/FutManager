package com.futmanager.controller;

import com.futmanager.dto.JugadorDTO;
import com.futmanager.mapper.JugadorMapper;
import com.futmanager.model.Jugador;
import com.futmanager.service.JugadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jugadores")
@CrossOrigin(origins = "*")
public class JugadorController {

    private final JugadorService jugadorService;

    @Autowired
    public JugadorController(JugadorService jugadorService) {
        this.jugadorService = jugadorService;
    }

    @GetMapping
    public ResponseEntity<List<JugadorDTO>> getAllJugadores(
            @RequestParam(required = false) String posicion,
            @RequestParam(required = false) String nacionalidad) {
        
        List<Jugador> jugadores;
        if (posicion != null && !posicion.trim().isEmpty() && nacionalidad != null && !nacionalidad.trim().isEmpty()) {
            jugadores = jugadorService.findByPosicionAndNacionalidad(posicion, nacionalidad);
        } else if (posicion != null && !posicion.trim().isEmpty()) {
            jugadores = jugadorService.findByPosicion(posicion);
        } else if (nacionalidad != null && !nacionalidad.trim().isEmpty()) {
            jugadores = jugadorService.findByNacionalidad(nacionalidad);
        } else {
            jugadores = jugadorService.findAll();
        }
        
        List<JugadorDTO> dtos = jugadores.stream()
                .map(JugadorMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JugadorDTO> getJugadorById(@PathVariable Long id) {
        return jugadorService.findById(id)
                .map(j -> ResponseEntity.ok(JugadorMapper.toDTO(j)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<JugadorDTO> createJugador(@RequestBody JugadorDTO jugadorDTO) {
        Jugador jugador = JugadorMapper.toEntity(jugadorDTO);
        Jugador nuevoJugador = jugadorService.save(jugador);
        return ResponseEntity.status(HttpStatus.CREATED).body(JugadorMapper.toDTO(nuevoJugador));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JugadorDTO> updateJugador(@PathVariable Long id, @RequestBody JugadorDTO jugadorDTO) {
        Jugador jugadorDetails = JugadorMapper.toEntity(jugadorDTO);
        Jugador jugadorActualizado = jugadorService.update(id, jugadorDetails);
        return ResponseEntity.ok(JugadorMapper.toDTO(jugadorActualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJugador(@PathVariable Long id) {
        jugadorService.delete(id);
        return ResponseEntity.ok().build();
    }
}
