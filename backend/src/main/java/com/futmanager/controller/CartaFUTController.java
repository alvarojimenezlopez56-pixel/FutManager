package com.futmanager.controller;

import com.futmanager.dto.CartaFUTResponseDTO;
import com.futmanager.dto.CartaFUTRequestDTO;
import com.futmanager.mapper.CartaFUTMapper;
import com.futmanager.model.CartaFUT;
import com.futmanager.model.Jugador;
import com.futmanager.model.Equipo;
import com.futmanager.service.CartaFUTService;
import com.futmanager.service.JugadorService;
import com.futmanager.service.EquipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cartas")
@CrossOrigin(origins = "*")
public class CartaFUTController {

    private final CartaFUTService cartaFUTService;
    private final JugadorService jugadorService;
    private final EquipoService equipoService;

    @Autowired
    public CartaFUTController(CartaFUTService cartaFUTService, JugadorService jugadorService, EquipoService equipoService) {
        this.cartaFUTService = cartaFUTService;
        this.jugadorService = jugadorService;
        this.equipoService = equipoService;
    }

    @GetMapping
    public ResponseEntity<List<CartaFUTResponseDTO>> getAllCartas(
            @RequestParam(required = false) Integer mediaMin,
            @RequestParam(required = false) Integer mediaMax,
            @RequestParam(required = false) String tipoCarta,
            @RequestParam(required = false) Long equipoId) {

        List<CartaFUT> cartas = cartaFUTService.findAll();

        // Filtro por mediaMin / mediaMax
        if (mediaMin != null || mediaMax != null) {
            int min = mediaMin != null ? mediaMin : 0;
            int max = mediaMax != null ? mediaMax : 99;
            cartas = cartas.stream()
                    .filter(c -> c.getMedia() >= min && c.getMedia() <= max)
                    .collect(Collectors.toList());
        }

        // Filtro por tipo de carta
        if (tipoCarta != null && !tipoCarta.trim().isEmpty()) {
            cartas = cartas.stream()
                    .filter(c -> c.getTipoCarta().equalsIgnoreCase(tipoCarta))
                    .collect(Collectors.toList());
        }

        // Filtro por equipo ID
        if (equipoId != null) {
            cartas = cartas.stream()
                    .filter(c -> c.getEquipo().getId().equals(equipoId))
                    .collect(Collectors.toList());
        }

        List<CartaFUTResponseDTO> dtos = cartas.stream()
                .map(CartaFUTMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartaFUTResponseDTO> getCartaById(@PathVariable Long id) {
        return cartaFUTService.findById(id)
                .map(c -> ResponseEntity.ok(CartaFUTMapper.toResponseDTO(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CartaFUTResponseDTO> createCarta(@RequestBody CartaFUTRequestDTO requestDTO) {
        if (requestDTO.getJugadorId() == null) {
            throw new IllegalArgumentException("El ID del jugador es obligatorio");
        }
        if (requestDTO.getEquipoId() == null) {
            throw new IllegalArgumentException("El ID del equipo es obligatorio");
        }

        Jugador jugador = jugadorService.findById(requestDTO.getJugadorId())
                .orElseThrow(() -> new IllegalArgumentException("Jugador no encontrado con ID: " + requestDTO.getJugadorId()));
        Equipo equipo = equipoService.findById(requestDTO.getEquipoId())
                .orElseThrow(() -> new IllegalArgumentException("Equipo no encontrado con ID: " + requestDTO.getEquipoId()));

        CartaFUT carta = CartaFUTMapper.toEntity(requestDTO, jugador, equipo);
        CartaFUT nuevaCarta = cartaFUTService.save(carta);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(CartaFUTMapper.toResponseDTO(nuevaCarta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartaFUTResponseDTO> updateCarta(@PathVariable Long id, @RequestBody CartaFUTRequestDTO requestDTO) {
        if (requestDTO.getJugadorId() == null) {
            throw new IllegalArgumentException("El ID del jugador es obligatorio");
        }
        if (requestDTO.getEquipoId() == null) {
            throw new IllegalArgumentException("El ID del equipo es obligatorio");
        }

        Jugador jugador = jugadorService.findById(requestDTO.getJugadorId())
                .orElseThrow(() -> new IllegalArgumentException("Jugador no encontrado con ID: " + requestDTO.getJugadorId()));
        Equipo equipo = equipoService.findById(requestDTO.getEquipoId())
                .orElseThrow(() -> new IllegalArgumentException("Equipo no encontrado con ID: " + requestDTO.getEquipoId()));

        CartaFUT cartaDetails = CartaFUTMapper.toEntity(requestDTO, jugador, equipo);
        CartaFUT cartaActualizada = cartaFUTService.update(id, cartaDetails);
        
        return ResponseEntity.ok(CartaFUTMapper.toResponseDTO(cartaActualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarta(@PathVariable Long id) {
        cartaFUTService.delete(id);
        return ResponseEntity.ok().build();
    }
}
