package com.futmanager.repository;

import com.futmanager.model.Jugador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JugadorRepository extends JpaRepository<Jugador, Long> {
    List<Jugador> findByPosicion(String posicion);
    List<Jugador> findByNacionalidad(String nacionalidad);
    List<Jugador> findByPosicionAndNacionalidad(String posicion, String nacionalidad);
}
