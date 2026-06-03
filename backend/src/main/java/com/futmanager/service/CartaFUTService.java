package com.futmanager.service;

import com.futmanager.model.CartaFUT;
import com.futmanager.repository.CartaFUTRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CartaFUTService {

    private final CartaFUTRepository cartaFUTRepository;

    @Autowired
    public CartaFUTService(CartaFUTRepository cartaFUTRepository) {
        this.cartaFUTRepository = cartaFUTRepository;
    }

    public List<CartaFUT> findAll() {
        return cartaFUTRepository.findAll();
    }

    public Optional<CartaFUT> findById(Long id) {
        return cartaFUTRepository.findById(id);
    }

    public List<CartaFUT> findByMediaBetween(int min, int max) {
        return cartaFUTRepository.findByMediaBetween(min, max);
    }

    public List<CartaFUT> findByTipoCarta(String tipoCarta) {
        return cartaFUTRepository.findByTipoCarta(tipoCarta);
    }

    public List<CartaFUT> findByEquipoId(Long equipoId) {
        return cartaFUTRepository.findByEquipoId(equipoId);
    }

    public CartaFUT save(CartaFUT carta) {
        validateCarta(carta);
        return cartaFUTRepository.save(carta);
    }

    public CartaFUT update(Long id, CartaFUT cartaDetails) {
        CartaFUT carta = cartaFUTRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Carta FUT no encontrada con ID: " + id));

        validateCarta(cartaDetails);

        carta.setJugador(cartaDetails.getJugador());
        carta.setEquipo(cartaDetails.getEquipo());
        carta.setMedia(cartaDetails.getMedia());
        carta.setRitmo(cartaDetails.getRitmo());
        carta.setTiro(cartaDetails.getTiro());
        carta.setPase(cartaDetails.getPase());
        carta.setRegate(cartaDetails.getRegate());
        carta.setDefensa(cartaDetails.getDefensa());
        carta.setFisico(cartaDetails.getFisico());
        carta.setTipoCarta(cartaDetails.getTipoCarta());

        return cartaFUTRepository.save(carta);
    }

    public void delete(Long id) {
        if (!cartaFUTRepository.existsById(id)) {
            throw new IllegalArgumentException("Carta FUT no encontrada con ID: " + id);
        }
        cartaFUTRepository.deleteById(id);
    }

    private void validateCarta(CartaFUT carta) {
        if (carta.getJugador() == null || carta.getJugador().getId() == null) {
            throw new IllegalArgumentException("La carta debe estar vinculada a un jugador válido");
        }
        if (carta.getEquipo() == null || carta.getEquipo().getId() == null) {
            throw new IllegalArgumentException("La carta debe estar vinculada a un equipo válido");
        }
        if (carta.getTipoCarta() == null || carta.getTipoCarta().trim().isEmpty()) {
            throw new IllegalArgumentException("El tipo de carta no puede estar vacío");
        }

        // Validaciones de estadísticas [0-99]
        validateStat("media", carta.getMedia());
        validateStat("ritmo", carta.getRitmo());
        validateStat("tiro", carta.getTiro());
        validateStat("pase", carta.getPase());
        validateStat("regate", carta.getRegate());
        validateStat("defensa", carta.getDefensa());
        validateStat("fisico", carta.getFisico());
    }

    private void validateStat(String statName, int value) {
        if (value < 0 || value > 99) {
            throw new IllegalArgumentException("La estadística '" + statName + "' debe estar en el rango de 0 a 99. Valor proporcionado: " + value);
        }
    }
}
