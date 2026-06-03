package com.futmanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.futmanager.dto.CartaFUTRequestDTO;
import com.futmanager.model.CartaFUT;
import com.futmanager.model.Equipo;
import com.futmanager.model.Jugador;
import com.futmanager.repository.CartaFUTRepository;
import com.futmanager.repository.EquipoRepository;
import com.futmanager.repository.JugadorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class CartaFUTIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JugadorRepository jugadorRepository;

    @Autowired
    private EquipoRepository equipoRepository;

    @Autowired
    private CartaFUTRepository cartaFUTRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Jugador jugador;
    private Equipo equipo;

    @BeforeEach
    public void setUp() {
        cartaFUTRepository.deleteAll();
        jugadorRepository.deleteAll();
        equipoRepository.deleteAll();

        jugador = new Jugador(null, "Andrés", "Iniesta", "MC", "España");
        jugador = jugadorRepository.save(jugador);

        equipo = new Equipo(null, "Barcelona Club", "Liga Española", "España");
        equipo = equipoRepository.save(equipo);
    }

    @Test
    public void testCrearYBuscarCartaFUT() throws Exception {
        CartaFUTRequestDTO requestDTO = new CartaFUTRequestDTO(null, jugador.getId(), equipo.getId(), 90, 80, 85, 92, 91, 70, 75, "ORO");

        mockMvc.perform(post("/api/cartas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.media", is(90)))
                .andExpect(jsonPath("$.jugador.nombre", is("Andrés")))
                .andExpect(jsonPath("$.equipo.nombre", is("Barcelona Club")));
    }

    @Test
    public void testCrearCartaFUTInvalidaRetornaBadRequest() throws Exception {
        // Media de 105 está fuera de rango [0-99]
        CartaFUTRequestDTO requestDTO = new CartaFUTRequestDTO(null, jugador.getId(), equipo.getId(), 105, 80, 85, 92, 91, 70, 75, "ORO");

        mockMvc.perform(post("/api/cartas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testActualizarCartaFUT() throws Exception {
        CartaFUT cartaOriginal = new CartaFUT(null, jugador, equipo, 88, 80, 80, 85, 88, 65, 70, "ORO");
        cartaOriginal = cartaFUTRepository.save(cartaOriginal);

        // Modificar media y tipo de carta
        CartaFUTRequestDTO requestDTO = new CartaFUTRequestDTO(cartaOriginal.getId(), jugador.getId(), equipo.getId(), 93, 80, 80, 85, 88, 65, 70, "ESPECIAL");

        mockMvc.perform(put("/api/cartas/" + cartaOriginal.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.media", is(93)))
                .andExpect(jsonPath("$.tipoCarta", is("ESPECIAL")));
    }

    @Test
    public void testEliminarCartaFUT() throws Exception {
        CartaFUT carta = new CartaFUT(null, jugador, equipo, 85, 75, 75, 80, 85, 60, 65, "PLATA");
        carta = cartaFUTRepository.save(carta);

        mockMvc.perform(delete("/api/cartas/" + carta.getId()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/cartas/" + carta.getId()))
                .andExpect(status().isNotFound());
    }
}
