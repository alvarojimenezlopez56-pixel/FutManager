import React, { useState, useEffect } from 'react';

// Coordenadas y mapeos de posiciones por formación
const FORMACIONES = {
  '4-3-3': [
    { key: 'POR', label: 'POR', top: '85%', left: '50%', posClave: 'POR' },
    { key: 'LI', label: 'LI', top: '65%', left: '15%', posClave: 'LI' },
    { key: 'DFC1', label: 'DFC', top: '70%', left: '36%', posClave: 'DFC' },
    { key: 'DFC2', label: 'DFC', top: '70%', left: '64%', posClave: 'DFC' },
    { key: 'LD', label: 'LD', top: '65%', left: '85%', posClave: 'LD' },
    { key: 'MC1', label: 'MC', top: '42%', left: '25%', posClave: 'MC' },
    { key: 'MC2', label: 'MC', top: '46%', left: '50%', posClave: 'MC' },
    { key: 'MC3', label: 'MC', top: '42%', left: '75%', posClave: 'MC' },
    { key: 'EI', label: 'EI', top: '16%', left: '20%', posClave: 'EI' },
    { key: 'DC', label: 'DC', top: '10%', left: '50%', posClave: 'DC' },
    { key: 'ED', label: 'ED', top: '16%', left: '80%', posClave: 'ED' },
  ],
  '4-4-2': [
    { key: 'POR', label: 'POR', top: '85%', left: '50%', posClave: 'POR' },
    { key: 'LI', label: 'LI', top: '65%', left: '15%', posClave: 'LI' },
    { key: 'DFC1', label: 'DFC', top: '70%', left: '36%', posClave: 'DFC' },
    { key: 'DFC2', label: 'DFC', top: '70%', left: '64%', posClave: 'DFC' },
    { key: 'LD', label: 'LD', top: '65%', left: '85%', posClave: 'LD' },
    { key: 'MI', label: 'MI', top: '38%', left: '15%', posClave: 'MI' },
    { key: 'MC1', label: 'MC', top: '42%', left: '36%', posClave: 'MC' },
    { key: 'MC2', label: 'MC', top: '42%', left: '64%', posClave: 'MC' },
    { key: 'MD', label: 'MD', top: '38%', left: '85%', posClave: 'MD' },
    { key: 'DC1', label: 'DC', top: '12%', left: '33%', posClave: 'DC' },
    { key: 'DC2', label: 'DC', top: '12%', left: '67%', posClave: 'DC' },
  ],
  '3-5-2': [
    { key: 'POR', label: 'POR', top: '85%', left: '50%', posClave: 'POR' },
    { key: 'DFC1', label: 'DFC', top: '70%', left: '22%', posClave: 'DFC' },
    { key: 'DFC2', label: 'DFC', top: '74%', left: '50%', posClave: 'DFC' },
    { key: 'DFC3', label: 'DFC', top: '70%', left: '78%', posClave: 'DFC' },
    { key: 'MI', label: 'MI', top: '45%', left: '15%', posClave: 'MI' },
    { key: 'MC1', label: 'MC', top: '50%', left: '34%', posClave: 'MC' },
    { key: 'MC2', label: 'MC', top: '50%', left: '66%', posClave: 'MC' },
    { key: 'MD', label: 'MD', top: '45%', left: '85%', posClave: 'MD' },
    { key: 'MCO', label: 'MCO', top: '28%', left: '50%', posClave: 'MCO' },
    { key: 'DC1', label: 'DC', top: '10%', left: '33%', posClave: 'DC' },
    { key: 'DC2', label: 'DC', top: '10%', left: '67%', posClave: 'DC' },
  ]
};

export default function AlineacionPanel() {
  const [formacion, setFormacion] = useState('4-3-3');
  const [posiciones, setPosiciones] = useState({});
  const [nombreAlineacion, setNombreAlineacion] = useState('');
  const [lineupId, setLineupId] = useState(null);
  
  // Galerías y alineaciones guardadas
  const [cartas, setCartas] = useState([]);
  const [savedLineups, setSavedLineups] = useState([]);

  // Control del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlotKey, setActiveSlotKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState('');

  // Notificaciones
  const [notify, setNotify] = useState({ type: '', text: '' });

  const showNotify = (type, text) => {
    setNotify({ type, text });
    setTimeout(() => setNotify({ type: '', text: '' }), 4000);
  };

  // Cargar cartas y alineaciones del servidor
  const loadData = async () => {
    try {
      const resCartas = await fetch('/api/cartas');
      if (resCartas.ok) {
        const dataCartas = await resCartas.json();
        setCartas(dataCartas);
      }
      const resLineups = await fetch('/api/alineaciones');
      if (resLineups.ok) {
        const dataLineups = await resLineups.json();
        setSavedLineups(dataLineups);
      }
    } catch (e) {
      console.error("Error al cargar datos en AlineacionPanel", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Adaptar posiciones al cambiar de formación (elimina claves que ya no correspondan)
  useEffect(() => {
    const slotsValidos = FORMACIONES[formacion].map(s => s.key);
    const nuevasPosiciones = {};
    slotsValidos.forEach(key => {
      if (posiciones[key]) {
        nuevasPosiciones[key] = posiciones[key];
      }
    });
    setPosiciones(nuevasPosiciones);
  }, [formacion]);

  // Cálculos de Química FIFA
  const getChemistryData = () => {
    const slots = FORMACIONES[formacion];
    
    // 1. Identificar qué cartas están en su posición preferida
    const cartasElegibles = [];
    const quimicaIndividual = {};

    slots.forEach(slot => {
      const carta = posiciones[slot.key];
      if (carta) {
        const enPosicionCorrecta = carta.jugador.posicion === slot.posClave;
        quimicaIndividual[slot.key] = {
          carta,
          enPosicionCorrecta,
          puntos: 0,
          puntosClub: 0,
          puntosNacionalidad: 0,
          puntosLiga: 0
        };
        if (enPosicionCorrecta) {
          cartasElegibles.push(carta);
        }
      }
    });

    // 2. Contar apariciones de Club, País (Nacionalidad) y Liga entre los elegibles
    const clubCounts = {};
    const paisCounts = {};
    const ligaCounts = {};

    cartasElegibles.forEach(c => {
      const clubName = c.equipo.nombre;
      const paisName = c.jugador.nacionalidad; // Usamos nacionalidad del jugador como país
      const ligaName = c.equipo.liga;

      clubCounts[clubName] = (clubCounts[clubName] || 0) + 1;
      paisCounts[paisName] = (paisCounts[paisName] || 0) + 1;
      ligaCounts[ligaName] = (ligaCounts[ligaName] || 0) + 1;
    });

    // 3. Calcular puntos de química para los jugadores elegibles
    let totalQuimica = 0;

    slots.forEach(slot => {
      const info = quimicaIndividual[slot.key];
      if (!info) return;

      if (info.enPosicionCorrecta) {
        const c = info.carta;
        const clubName = c.equipo.nombre;
        const paisName = c.jugador.nacionalidad;
        const ligaName = c.equipo.liga;

        // Reglas de química FIFA:
        // Club: 2 jugadores = +1, 5 = +2, 8 = +3
        const clubCount = clubCounts[clubName] || 0;
        const puntosClub = clubCount >= 8 ? 3 : (clubCount >= 5 ? 2 : (clubCount >= 2 ? 1 : 0));

        // Nacionalidad: 2 jugadores = +1, 5 = +2, 8 = +3
        const paisCount = paisCounts[paisName] || 0;
        const puntosNacionalidad = paisCount >= 8 ? 3 : (paisCount >= 5 ? 2 : (paisCount >= 2 ? 1 : 0));

        // Liga: 3 jugadores = +1, 5 = +2, 8 = +3
        const ligaCount = ligaCounts[ligaName] || 0;
        const puntosLiga = ligaCount >= 8 ? 3 : (ligaCount >= 5 ? 2 : (ligaCount >= 3 ? 1 : 0));

        const puntosTotales = Math.min(3, puntosClub + puntosNacionalidad + puntosLiga);
        info.puntos = puntosTotales;
        info.puntosClub = puntosClub;
        info.puntosNacionalidad = puntosNacionalidad;
        info.puntosLiga = puntosLiga;

        totalQuimica += puntosTotales;
      }
    });

    return {
      quimicaIndividual,
      totalQuimica,
      clubCounts,
      paisCounts,
      ligaCounts
    };
  };

  const { quimicaIndividual, totalQuimica, clubCounts, paisCounts, ligaCounts } = getChemistryData();

  // Abrir selector de jugador
  const handleOpenSelector = (slotKey) => {
    setActiveSlotKey(slotKey);
    // Filtrar automáticamente por la posición del slot para comodidad
    const slot = FORMACIONES[formacion].find(s => s.key === slotKey);
    setPositionFilter(slot ? slot.posClave : '');
    setSearchQuery('');
    setIsModalOpen(true);
  };

  // Asignar jugador seleccionado al slot activo
  const handleSelectCard = (carta) => {
    setPosiciones({
      ...posiciones,
      [activeSlotKey]: carta
    });
    setIsModalOpen(false);
    setActiveSlotKey(null);
  };

  // Quitar jugador de un slot
  const handleRemoveCard = (e, slotKey) => {
    e.stopPropagation();
    const nuevas = { ...posiciones };
    delete nuevas[slotKey];
    setPosiciones(nuevas);
  };

  // Guardar plantilla en el backend
  const handleSaveLineup = async (e) => {
    e.preventDefault();
    if (!nombreAlineacion.trim()) {
      showNotify('error', 'Debes escribir un nombre para la alineación');
      return;
    }

    // Estructurar el DTO de guardado: posiciones es un mapa de {posicionClave: cartaId}
    const posicionesPayload = {};
    Object.keys(posiciones).forEach(key => {
      posicionesPayload[key] = posiciones[key].id;
    });

    const payload = {
      id: lineupId,
      nombre: nombreAlineacion,
      formacion: formacion,
      posiciones: posicionesPayload
    };

    const isEdit = lineupId !== null;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/alineaciones/${lineupId}` : '/api/alineaciones';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showNotify('success', isEdit ? 'Alineación actualizada correctamente' : 'Alineación guardada correctamente');
        setNombreAlineacion('');
        setLineupId(null);
        setPosiciones({});
        loadData();
      } else {
        const errText = await res.text();
        showNotify('error', `Error al guardar: ${errText}`);
      }
    } catch (err) {
      showNotify('error', `Error de conexión: ${err.message}`);
    }
  };

  // Cargar una plantilla guardada en el terreno de juego
  const handleLoadLineup = (lineup) => {
    setLineupId(lineup.id);
    setNombreAlineacion(lineup.nombre);
    setFormacion(lineup.formacion);

    const cargadas = {};
    Object.keys(lineup.posiciones).forEach(key => {
      // lineup.posiciones[key] ya es la respuesta completa de la CartaFUT
      cargadas[key] = lineup.posiciones[key];
    });
    setPosiciones(cargadas);
    
    // Desplazar suavemente hasta el campo de fútbol
    const element = document.getElementById('soccer-pitch-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });

    showNotify('info', `Cargada plantilla: "${lineup.nombre}"`);
  };

  // Eliminar alineación
  const handleDeleteLineup = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("¿Seguro que deseas eliminar esta alineación?")) return;
    try {
      const res = await fetch(`/api/alineaciones/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotify('success', 'Alineación eliminada');
        if (lineupId === id) {
          setLineupId(null);
          setNombreAlineacion('');
          setPosiciones({});
        }
        loadData();
      } else {
        showNotify('error', 'No se pudo eliminar la alineación');
      }
    } catch (err) {
      showNotify('error', err.message);
    }
  };

  // Resetear el campo de juego
  const handleResetPitch = () => {
    setLineupId(null);
    setNombreAlineacion('');
    setPosiciones({});
    showNotify('info', 'Campo de juego reiniciado');
  };

  // Filtrado de cartas para el Selector de Jugadores
  const assignedCardIds = Object.values(posiciones).map(c => c.id);
  const filteredCards = cartas.filter(c => {
    // 1. Excluir si ya está asignado
    if (assignedCardIds.includes(c.id)) return false;

    // 2. Filtro por nombre
    const nameMatch = c.jugador.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      (c.jugador.apodo && c.jugador.apodo.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 3. Filtro por posición
    const positionMatch = positionFilter === '' || c.jugador.posicion === positionFilter;

    return nameMatch && positionMatch;
  });

  return (
    <div className="lineup-tab-container fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start' }}>
      
      {/* SECCIÓN PRINCIPAL: CAMPO DE JUEGO */}
      <div id="soccer-pitch-section" className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {notify.text && (
          <div className={`alert-banner ${notify.type}`}>
            <span>{notify.type === 'error' ? '❌' : notify.type === 'info' ? 'ℹ️' : '✅'}</span>
            {notify.text}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>⚽ Tácticas e Inserción de Plantilla</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Crea tu equipo definitivo y gestiona la compatibilidad entre las ligas, clubes y nacionalidades.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <select 
              className="select-field"
              value={formacion}
              onChange={e => setFormacion(e.target.value)}
              style={{ fontWeight: 'bold', fontSize: '1rem', border: '1px solid var(--gold)' }}
            >
              <option value="4-3-3">Formación 4-3-3</option>
              <option value="4-4-2">Formación 4-4-2</option>
              <option value="3-5-2">Formación 3-5-2</option>
            </select>
            <button className="btn" onClick={handleResetPitch}>🧹 Limpiar</button>
          </div>
        </div>

        {/* CONTENEDOR DEL CÉSPED (TERRENO DE JUEGO) */}
        <div className="soccer-pitch">
          {/* Líneas de tiza blanca */}
          <div className="penalty-area-top"></div>
          <div className="penalty-area-bottom"></div>

          {/* Renderizado de Slots */}
          {FORMACIONES[formacion].map(slot => {
            const info = quimicaIndividual[slot.key];
            const hasPlayer = !!info;
            
            return (
              <div 
                key={slot.key}
                className={`pitch-slot ${hasPlayer ? 'has-player' : ''}`}
                style={{ top: slot.top, left: slot.left }}
                onClick={() => handleOpenSelector(slot.key)}
              >
                {!hasPlayer ? (
                  <div className="slot-empty-content">
                    <span className="plus-sign">+</span>
                    <span className="slot-pos-label">{slot.label}</span>
                  </div>
                ) : (
                  <div className={`mini-fut-card ${info.carta.tipoCarta.toLowerCase()}`}>
                    
                    {/* Botón de quitar */}
                    <button 
                      className="remove-player-btn"
                      onClick={(e) => handleRemoveCard(e, slot.key)}
                      title="Quitar jugador"
                    >
                      ×
                    </button>

                    {/* Stats e información rápida */}
                    <div className="mini-card-header">
                      <span className="mini-card-rating">{info.carta.media}</span>
                      <span className={`mini-card-pos ${info.enPosicionCorrecta ? 'correct' : 'incorrect'}`}>
                        {info.carta.jugador.posicion}
                      </span>
                    </div>

                    <div className="mini-card-name">
                      {info.carta.jugador.apodo ? info.carta.jugador.apodo : info.carta.jugador.nombre}
                    </div>

                    <div className="mini-card-badge-row">
                      <span title={info.carta.equipo.nombre}>🛡️</span>
                      <span title={info.carta.jugador.nacionalidad}>🌍</span>
                    </div>

                    {/* Medidor de Química Individual (3 Diamantes/Flasks) */}
                    <div className="mini-card-chemistry-dots">
                      <span className={`chem-dot ${info.puntos >= 1 ? 'active' : ''}`}></span>
                      <span className={`chem-dot ${info.puntos >= 2 ? 'active' : ''}`}></span>
                      <span className={`chem-dot ${info.puntos >= 3 ? 'active' : ''}`}></span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BARRA DE QUÍMICA DE LA PLANTILLA */}
        <div className="chemistry-status-bar panel" style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
              🧪 Química de Plantilla
            </span>
            <span className={`chemistry-total-badge ${totalQuimica >= 30 ? 'maxed' : totalQuimica >= 20 ? 'high' : ''}`}>
              {totalQuimica} / 33
            </span>
          </div>
          <div className="progress-bar-container">
            <div 
              className={`progress-bar-fill ${totalQuimica >= 30 ? 'maxed' : totalQuimica >= 20 ? 'high' : ''}`}
              style={{ width: `${(totalQuimica / 33) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* FORMULARIO DE GUARDADO */}
        <form onSubmit={handleSaveLineup} className="panel" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <input 
              type="text"
              className="input-field"
              placeholder="Nombre de la alineación (ej. Los Galácticos)"
              value={nombreAlineacion}
              onChange={e => setNombreAlineacion(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '38px' }}>
            💾 {lineupId ? 'Actualizar Plantilla' : 'Guardar Plantilla'}
          </button>
        </form>

      </div>

      {/* SECCIÓN LATERAL: DESGLOSE DE QUÍMICA Y LISTA DE ALINEACIONES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* DESGLOSE DE QUÍMICA */}
        <div className="panel">
          <h3>📈 Reglas y Desglose de Química</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '5px', marginBottom: '15px' }}>
            Los jugadores deben estar en su posición preferida para ganar y aportar química.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* POR LIGA */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--gold)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px', marginBottom: '8px' }}>
                🏆 Ligas (3 = +1, 5 = +2, 8 = +3)
              </div>
              {Object.keys(ligaCounts).length === 0 ? (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ninguna liga activa</div>
              ) : (
                Object.keys(ligaCounts).map(name => (
                  <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', margin: '4px 0' }}>
                    <span>{name}</span>
                    <span style={{ fontWeight: '600' }}>{ligaCounts[name]} jugador(es)</span>
                  </div>
                ))
              )}
            </div>

            {/* POR EQUIPO */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--gold)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px', marginBottom: '8px' }}>
                🛡️ Clubes (2 = +1, 5 = +2, 8 = +3)
              </div>
              {Object.keys(clubCounts).length === 0 ? (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ningún club activo</div>
              ) : (
                Object.keys(clubCounts).map(name => (
                  <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', margin: '4px 0' }}>
                    <span>{name}</span>
                    <span style={{ fontWeight: '600' }}>{clubCounts[name]} jugador(es)</span>
                  </div>
                ))
              )}
            </div>

            {/* POR PAIS */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--gold)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px', marginBottom: '8px' }}>
                🌍 Nacionalidades (2 = +1, 5 = +2, 8 = +3)
              </div>
              {Object.keys(paisCounts).length === 0 ? (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ninguna nacionalidad activa</div>
              ) : (
                Object.keys(paisCounts).map(name => (
                  <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', margin: '4px 0' }}>
                    <span>{name}</span>
                    <span style={{ fontWeight: '600' }}>{paisCounts[name]} jugador(es)</span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* LISTA DE PLANTILLAS GUARDADAS */}
        <div className="panel">
          <h3>📁 Plantillas Guardadas</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', maxHeight: '350px', overflowY: 'auto' }}>
            {savedLineups.map(lineup => (
              <div 
                key={lineup.id} 
                className="saved-lineup-item"
                onClick={() => handleLoadLineup(lineup)}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: lineupId === lineup.id ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.02)',
                  border: lineupId === lineup.id ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                  padding: '12px', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: lineupId === lineup.id ? 'var(--gold)' : '#fff' }}>
                    {lineup.nombre}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Formación: {lineup.formacion} | {Object.keys(lineup.posiciones).length} jugadores
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '5px' }}>
                  <button 
                    className="btn btn-danger" 
                    onClick={(e) => handleDeleteLineup(e, lineup.id)}
                    style={{ padding: '6px 10px', fontSize: '11px' }}
                    title="Eliminar plantilla"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {savedLineups.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                No tienes plantillas guardadas
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SELECTOR MODAL DE JUGADORES */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content panel" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>👤 Seleccionar Jugador para {activeSlotKey}</h3>
              <button className="btn" onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'transparent', fontSize: '1.2rem', padding: 0 }}>
                ✕
              </button>
            </div>

            {/* Barra de Filtros del Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '10px', marginBottom: '15px' }}>
              <input 
                type="text"
                className="input-field"
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <select
                className="select-field"
                value={positionFilter}
                onChange={e => setPositionFilter(e.target.value)}
              >
                <option value="">Cualquier Posición</option>
                <option value="POR">POR</option>
                <option value="DFC">DFC</option>
                <option value="LD">LD</option>
                <option value="LI">LI</option>
                <option value="MC">MC</option>
                <option value="MCO">MCO</option>
                <option value="MI">MI</option>
                <option value="MD">MD</option>
                <option value="ED">ED</option>
                <option value="EI">EI</option>
                <option value="DC">DC</option>
              </select>
            </div>

            {/* Rejilla de cartas disponibles */}
            <div className="modal-cards-grid">
              {filteredCards.map(carta => {
                const isCorrectPos = carta.jugador.posicion === FORMACIONES[formacion].find(s => s.key === activeSlotKey)?.posClave;
                return (
                  <div 
                    key={carta.id} 
                    className={`modal-card-item ${carta.tipoCarta.toLowerCase()}`}
                    onClick={() => handleSelectCard(carta)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span className="modal-card-rating">{carta.media}</span>
                      <span className={`modal-card-pos ${isCorrectPos ? 'correct' : 'incorrect'}`}>
                        {carta.jugador.posicion} {isCorrectPos ? '✓' : '✗'}
                      </span>
                    </div>
                    
                    <div className="modal-card-name">
                      {carta.jugador.apodo ? carta.jugador.apodo : carta.jugador.nombre}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {carta.equipo.nombre}
                    </div>
                  </div>
                );
              })}

              {filteredCards.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                  No hay cartas disponibles con los filtros aplicados.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
