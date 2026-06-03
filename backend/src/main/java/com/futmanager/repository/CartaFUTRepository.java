package com.futmanager.repository;

import com.futmanager.model.CartaFUT;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CartaFUTRepository extends JpaRepository<CartaFUT, Long> {
    List<CartaFUT> findByMediaBetween(int min, int max);
    List<CartaFUT> findByTipoCarta(String tipoCarta);
    List<CartaFUT> findByEquipoId(Long equipoId);
}
