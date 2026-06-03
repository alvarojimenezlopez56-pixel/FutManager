package com.futmanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.futmanager.dto.AlineacionRequestDTO;
import com.futmanager.model.Alineacion;
import com.futmanager.model.CartaFUT;
import com.futmanager.model.Equipo;
import com.futmanager.model.Jugador;
import com.futmanager.repository.AlineacionRepository;
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
import java.util.HashMap;
import java.util.Map;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AlineacionIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JugadorRepository jugadorRepository;

    @Autowired
    private EquipoRepository equipoRepository;

    @Autowired
    private CartaFUTRepository cartaFUTRepository;

    @Autowired
    private AlineacionRepository alineacionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private CartaFUT carta;

    @BeforeEach
    public void setUp() {
        alineacionRepository.deleteAll();
        cartaFUTRepository.deleteAll();
        jugadorRepository.deleteAll();
        equipoRepository.deleteAll();

        Jugador jugador = new Jugador(null, "Andrés", "Iniesta", "MC", "España");
        jugador = jugadorRepository.save(jugador);

        Equipo equipo = new Equipo(null, "Barcelona Club", "Liga Española", "España");
        equipo = equipoRepository.save(equipo);

        carta = new CartaFUT(null, jugador, equipo, 90, 80, 85, 92, 91, 70, 75, "ORO");
        carta = cartaFUTRepository.save(carta);
    }

    @Test
    public void testCrearYBuscarAlineacion() throws Exception {
        Map<String, Long> posiciones = new HashMap<>();
        posiciones.put("MC", carta.getId());

        AlineacionRequestDTO requestDTO = new AlineacionRequestDTO(null, "Alineación de Ensayo", "4-3-3", posiciones);

        mockMvc.perform(post("/api/alineaciones")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.nombre", is("Alineación de Ensayo")))
                .andExpect(jsonPath("$.formacion", is("4-3-3")))
                .andExpect(jsonPath("$.posiciones.MC.id", is(carta.getId().intValue())));
    }

    @Test
    public void testCrearAlineacionInvalidaRetornaBadRequest() throws Exception {
        // Nombre vacío es inválido
        AlineacionRequestDTO requestDTO = new AlineacionRequestDTO(null, "", "4-3-3", new HashMap<>());

        mockMvc.perform(post("/api/alineaciones")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testEliminarAlineacion() throws Exception {
        Alineacion alineacion = new Alineacion(null, "Alineación Borrar", "4-4-2");
        alineacion = alineacionRepository.save(alineacion);

        mockMvc.perform(delete("/api/alineaciones/" + alineacion.getId()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/alineaciones/" + alineacion.getId()))
                .andExpect(status().isNotFound());
    }
}
