package com.futmanager.service;

import com.futmanager.model.Jugador;
import com.futmanager.repository.JugadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class JugadorService {

    private final JugadorRepository jugadorRepository;

    @Autowired
    public JugadorService(JugadorRepository jugadorRepository) {
        this.jugadorRepository = jugadorRepository;
    }

    public List<Jugador> findAll() {
        return jugadorRepository.findAll();
    }

    public Optional<Jugador> findById(Long id) {
        return jugadorRepository.findById(id);
    }

    public List<Jugador> findByPosicion(String posicion) {
        return jugadorRepository.findByPosicion(posicion);
    }

    public List<Jugador> findByNacionalidad(String nacionalidad) {
        return jugadorRepository.findByNacionalidad(nacionalidad);
    }

    public List<Jugador> findByPosicionAndNacionalidad(String posicion, String nacionalidad) {
        return jugadorRepository.findByPosicionAndNacionalidad(posicion, nacionalidad);
    }

    public Jugador save(Jugador jugador) {
        if (jugador.getNombre() == null || jugador.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del jugador no puede estar vacío");
        }
        if (jugador.getPosicion() == null || jugador.getPosicion().trim().isEmpty()) {
            throw new IllegalArgumentException("La posición del jugador no puede estar vacía");
        }
        if (jugador.getNacionalidad() == null || jugador.getNacionalidad().trim().isEmpty()) {
            throw new IllegalArgumentException("La nacionalidad del jugador no puede estar vacía");
        }
        return jugadorRepository.save(jugador);
    }

    public Jugador update(Long id, Jugador jugadorDetails) {
        Jugador jugador = jugadorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Jugador no encontrado con ID: " + id));
        
        if (jugadorDetails.getNombre() == null || jugadorDetails.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del jugador no puede estar vacío");
        }
        if (jugadorDetails.getPosicion() == null || jugadorDetails.getPosicion().trim().isEmpty()) {
            throw new IllegalArgumentException("La posición del jugador no puede estar vacía");
        }
        if (jugadorDetails.getNacionalidad() == null || jugadorDetails.getNacionalidad().trim().isEmpty()) {
            throw new IllegalArgumentException("La nacionalidad del jugador no puede estar vacía");
        }

        jugador.setNombre(jugadorDetails.getNombre());
        jugador.setApodo(jugadorDetails.getApodo());
        jugador.setPosicion(jugadorDetails.getPosicion());
        jugador.setNacionalidad(jugadorDetails.getNacionalidad());

        return jugadorRepository.save(jugador);
    }

    public void delete(Long id) {
        if (!jugadorRepository.existsById(id)) {
            throw new IllegalArgumentException("Jugador no encontrado con ID: " + id);
        }
        jugadorRepository.deleteById(id);
    }
}
