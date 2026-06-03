package com.futmanager.service;

import com.futmanager.dto.AlineacionRequestDTO;
import com.futmanager.model.Alineacion;
import com.futmanager.model.AlineacionPosicion;
import com.futmanager.model.CartaFUT;
import com.futmanager.model.Equipo;
import com.futmanager.model.Jugador;
import com.futmanager.repository.AlineacionRepository;
import com.futmanager.repository.CartaFUTRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AlineacionServiceTest {

    @Mock
    private AlineacionRepository alineacionRepository;

    @Mock
    private CartaFUTRepository cartaFUTRepository;

    @InjectMocks
    private AlineacionService alineacionService;

    private CartaFUT cartaValida;
    private AlineacionRequestDTO requestDTO;
    private Alineacion alineacionMock;

    @BeforeEach
    public void setUp() {
        Jugador jugador = new Jugador(1L, "Lionel", "Messi", "DC", "Argentina");
        Equipo equipo = new Equipo(1L, "Rosario FC", "Liga Argentina", "Argentina");
        cartaValida = new CartaFUT(1L, jugador, equipo, 92, 85, 91, 88, 92, 45, 78, "ORO");

        Map<String, Long> posiciones = new HashMap<>();
        posiciones.put("DC", 1L);

        requestDTO = new AlineacionRequestDTO(null, "Mi Equipo Favorito", "4-3-3", posiciones);

        alineacionMock = new Alineacion(1L, "Mi Equipo Favorito", "4-3-3");
        AlineacionPosicion pos = new AlineacionPosicion(1L, alineacionMock, "DC", cartaValida);
        alineacionMock.getPosiciones().add(pos);
    }

    @Test
    public void testGuardarAlineacionValida() {
        when(cartaFUTRepository.findById(1L)).thenReturn(Optional.of(cartaValida));
        when(alineacionRepository.save(any(Alineacion.class))).thenReturn(alineacionMock);

        Alineacion guardada = alineacionService.save(requestDTO);

        assertNotNull(guardada);
        assertEquals("Mi Equipo Favorito", guardada.getNombre());
        assertEquals("4-3-3", guardada.getFormacion());
        assertFalse(guardada.getPosiciones().isEmpty());
        assertEquals("DC", guardada.getPosiciones().get(0).getPosicionClave());
        verify(alineacionRepository, times(1)).save(any(Alineacion.class));
    }

    @Test
    public void testGuardarAlineacionSinNombreLanzaExcepcion() {
        requestDTO.setNombre("");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            alineacionService.save(requestDTO);
        });

        assertTrue(exception.getMessage().contains("nombre"));
        verify(alineacionRepository, never()).save(any(Alineacion.class));
    }

    @Test
    public void testGuardarAlineacionConCartaInexistenteLanzaExcepcion() {
        when(cartaFUTRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            alineacionService.save(requestDTO);
        });

        assertTrue(exception.getMessage().contains("Carta FUT no encontrada"));
        verify(alineacionRepository, never()).save(any(Alineacion.class));
    }
}
