package com.futmanager.service;

import com.futmanager.model.CartaFUT;
import com.futmanager.model.Jugador;
import com.futmanager.model.Equipo;
import com.futmanager.repository.CartaFUTRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CartaFUTServiceTest {

    @Mock
    private CartaFUTRepository cartaFUTRepository;

    @InjectMocks
    private CartaFUTService cartaFUTService;

    private Jugador jugadorValido;
    private Equipo equipoValido;
    private CartaFUT cartaValida;

    @BeforeEach
    public void setUp() {
        jugadorValido = new Jugador(1L, "Lionel", "Messi", "DC", "Argentina");
        equipoValido = new Equipo(1L, "Rosario FC", "Liga Argentina", "Argentina");
        cartaValida = new CartaFUT(1L, jugadorValido, equipoValido, 92, 85, 91, 88, 92, 45, 78, "ORO");
    }

    @Test
    public void testGuardarCartaValida() {
        when(cartaFUTRepository.save(any(CartaFUT.class))).thenReturn(cartaValida);
        
        CartaFUT guardada = cartaFUTService.save(cartaValida);
        
        assertNotNull(guardada);
        assertEquals(92, guardada.getMedia());
        assertEquals("ORO", guardada.getTipoCarta());
        verify(cartaFUTRepository, times(1)).save(cartaValida);
    }

    @Test
    public void testGuardarCartaConMediaFueraDeRangoSuperior() {
        cartaValida.setMedia(100);
        
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            cartaFUTService.save(cartaValida);
        });
        
        assertTrue(exception.getMessage().contains("media"));
        verify(cartaFUTRepository, never()).save(any(CartaFUT.class));
    }

    @Test
    public void testGuardarCartaConMediaFueraDeRangoInferior() {
        cartaValida.setMedia(-1);
        
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            cartaFUTService.save(cartaValida);
        });
        
        assertTrue(exception.getMessage().contains("media"));
        verify(cartaFUTRepository, never()).save(any(CartaFUT.class));
    }

    @Test
    public void testGuardarCartaConRitmoFueraDeRango() {
        cartaValida.setRitmo(105);
        
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            cartaFUTService.save(cartaValida);
        });
        
        assertTrue(exception.getMessage().contains("ritmo"));
        verify(cartaFUTRepository, never()).save(any(CartaFUT.class));
    }

    @Test
    public void testGuardarCartaSinJugador() {
        cartaValida.setJugador(null);
        
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            cartaFUTService.save(cartaValida);
        });
        
        assertTrue(exception.getMessage().contains("jugador"));
        verify(cartaFUTRepository, never()).save(any(CartaFUT.class));
    }

    @Test
    public void testGuardarCartaSinEquipo() {
        cartaValida.setEquipo(null);
        
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            cartaFUTService.save(cartaValida);
        });
        
        assertTrue(exception.getMessage().contains("equipo"));
        verify(cartaFUTRepository, never()).save(any(CartaFUT.class));
    }
}
