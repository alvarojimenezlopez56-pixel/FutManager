import React, { useState, useEffect } from 'react';

export default function ManagePanel({ onDataModified, cardToEdit, onCancelEditCard }) {
  // Entidades principales
  const [jugadores, setJugadores] = useState([]);
  const [equipos, setEquipos] = useState([]);

  // Estado del Formulario: Jugador
  const [playerForm, setPlayerForm] = useState({ id: null, nombre: '', apodo: '', posicion: 'DC', nacionalidad: '' });
  const [isEditingPlayer, setIsEditingPlayer] = useState(false);

  // Estado del Formulario: Equipo
  const [teamForm, setTeamForm] = useState({ id: null, nombre: '', liga: '', pais: '' });
  const [isEditingTeam, setIsEditingTeam] = useState(false);

  // Estado del Formulario: Carta FUT
  const [cardForm, setCardForm] = useState({
    id: null,
    jugadorId: '',
    equipoId: '',
    media: 80,
    ritmo: 80,
    tiro: 80,
    pase: 80,
    regate: 80,
    defensa: 80,
    fisico: 80,
    tipoCarta: 'ORO'
  });

  // Notificaciones internas
  const [notify, setNotify] = useState({ type: '', text: '' });

  const showNotify = (type, text) => {
    setNotify({ type, text });
    setTimeout(() => setNotify({ type: '', text: '' }), 4000);
  };

  // Cargar datos iniciales
  const loadInitialData = async () => {
    try {
      const resJ = await fetch('/api/jugadores');
      if (resJ.ok) {
        const dataJ = await resJ.json();
        setJugadores(dataJ);
      }
      const resE = await fetch('/api/equipos');
      if (resE.ok) {
        const dataE = await resE.json();
        setEquipos(dataE);
      }
    } catch (e) {
      console.error("Error al cargar datos en el panel de gestión", e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Escuchar si el padre nos pasa una carta para editar
  useEffect(() => {
    if (cardToEdit) {
      setCardForm({
        id: cardToEdit.id,
        jugadorId: cardToEdit.jugador.id,
        equipoId: cardToEdit.equipo.id,
        media: cardToEdit.media,
        ritmo: cardToEdit.ritmo,
        tiro: cardToEdit.tiro,
        pase: cardToEdit.pase,
        regate: cardToEdit.regate,
        defensa: cardToEdit.defensa,
        fisico: cardToEdit.fisico,
        tipoCarta: cardToEdit.tipoCarta
      });
      // Hacer scroll hasta el formulario de cartas
      const element = document.getElementById('card-form-section');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [cardToEdit]);

  // Manejadores de Guardado: Jugador
  const handleSavePlayer = async (e) => {
    e.preventDefault();
    if (!playerForm.nombre.trim() || !playerForm.nacionalidad.trim()) {
      showNotify('error', 'El nombre y la nacionalidad son obligatorios');
      return;
    }

    const method = isEditingPlayer ? 'PUT' : 'POST';
    const url = isEditingPlayer ? `/api/jugadores/${playerForm.id}` : '/api/jugadores';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerForm)
      });
      if (res.ok) {
        showNotify('success', isEditingPlayer ? 'Jugador actualizado correctamente' : 'Jugador creado correctamente');
        setPlayerForm({ id: null, nombre: '', apodo: '', posicion: 'DC', nacionalidad: '' });
        setIsEditingPlayer(false);
        loadInitialData();
        onDataModified();
      } else {
        const errText = await res.text();
        showNotify('error', `Error: ${errText}`);
      }
    } catch (err) {
      showNotify('error', `Error de conexión: ${err.message}`);
    }
  };

  const handleEditPlayer = (p) => {
    setPlayerForm(p);
    setIsEditingPlayer(true);
  };

  const handleDeletePlayer = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este jugador? Se podrían invalidar sus cartas asociadas.")) return;
    try {
      const res = await fetch(`/api/jugadores/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotify('success', 'Jugador eliminado');
        loadInitialData();
        onDataModified();
      } else {
        showNotify('error', 'No se pudo eliminar el jugador. Asegúrate de eliminar primero las cartas vinculadas.');
      }
    } catch (e) {
      showNotify('error', e.message);
    }
  };

  // Manejadores de Guardado: Equipo
  const handleSaveTeam = async (e) => {
    e.preventDefault();
    if (!teamForm.nombre.trim() || !teamForm.liga.trim() || !teamForm.pais.trim()) {
      showNotify('error', 'Todos los campos de equipo son obligatorios');
      return;
    }

    const method = isEditingTeam ? 'PUT' : 'POST';
    const url = isEditingTeam ? `/api/equipos/${teamForm.id}` : '/api/equipos';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamForm)
      });
      if (res.ok) {
        showNotify('success', isEditingTeam ? 'Equipo actualizado correctamente' : 'Equipo creado correctamente');
        setTeamForm({ id: null, nombre: '', liga: '', pais: '' });
        setIsEditingTeam(false);
        loadInitialData();
        onDataModified();
      } else {
        const errText = await res.text();
        showNotify('error', `Error: ${errText}`);
      }
    } catch (err) {
      showNotify('error', `Error de conexión: ${err.message}`);
    }
  };

  const handleEditTeam = (t) => {
    setTeamForm(t);
    setIsEditingTeam(true);
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este equipo? Se podrían invalidar las cartas asociadas.")) return;
    try {
      const res = await fetch(`/api/equipos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotify('success', 'Equipo eliminado');
        loadInitialData();
        onDataModified();
      } else {
        showNotify('error', 'No se pudo eliminar el equipo. Asegúrate de eliminar primero las cartas vinculadas.');
      }
    } catch (e) {
      showNotify('error', e.message);
    }
  };

  // Manejadores de Guardado: Carta FUT
  const handleSaveCard = async (e) => {
    e.preventDefault();
    if (!cardForm.jugadorId || !cardForm.equipoId) {
      showNotify('error', 'Debes seleccionar un jugador y un equipo');
      return;
    }

    // Estructurar objeto según esquema DTO de petición esperado
    const payload = {
      id: cardForm.id,
      jugadorId: parseInt(cardForm.jugadorId),
      equipoId: parseInt(cardForm.equipoId),
      media: parseInt(cardForm.media),
      ritmo: parseInt(cardForm.ritmo),
      tiro: parseInt(cardForm.tiro),
      pase: parseInt(cardForm.pase),
      regate: parseInt(cardForm.regate),
      defensa: parseInt(cardForm.defensa),
      fisico: parseInt(cardForm.fisico),
      tipoCarta: cardForm.tipoCarta
    };

    const isEdit = cardForm.id !== null;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/cartas/${cardForm.id}` : '/api/cartas';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showNotify('success', isEdit ? 'Carta FUT actualizada con éxito' : 'Carta FUT creada con éxito');
        handleResetCardForm();
        onDataModified();
      } else {
        const errText = await res.text();
        showNotify('error', `Error del Servidor: ${errText}`);
      }
    } catch (err) {
      showNotify('error', `Error de conexión: ${err.message}`);
    }
  };

  const handleResetCardForm = () => {
    setCardForm({
      id: null,
      jugadorId: '',
      equipoId: '',
      media: 80,
      ritmo: 80,
      tiro: 80,
      pase: 80,
      regate: 80,
      defensa: 80,
      fisico: 80,
      tipoCarta: 'ORO'
    });
    if (onCancelEditCard) onCancelEditCard();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {notify.text && (
        <div className={`alert-banner ${notify.type}`}>
          <span>{notify.type === 'error' ? '❌' : '✅'}</span>
          {notify.text}
        </div>
      )}

      {/* SECCIÓN 1: CARTAS FUT */}
      <div id="card-form-section" className="panel">
        <h2>{cardForm.id ? '✏️ Editar Carta FUT' : '🃏 Nueva Carta FUT'}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Configura las estadísticas y asocia jugador y equipo. Rango obligatorio de estadísticas: 0 a 99.
        </p>

        <form onSubmit={handleSaveCard}>
          <div className="form-row">
            <div className="form-group">
              <label>Jugador</label>
              <select
                className="select-field"
                value={cardForm.jugadorId}
                onChange={e => setCardForm({ ...cardForm, jugadorId: e.target.value })}
              >
                <option value="">-- Seleccionar Jugador --</option>
                {jugadores.map(j => (
                  <option key={j.id} value={j.id}>{j.nombre} ({j.posicion})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Equipo</label>
              <select
                className="select-field"
                value={cardForm.equipoId}
                onChange={e => setCardForm({ ...cardForm, equipoId: e.target.value })}
              >
                <option value="">-- Seleccionar Equipo --</option>
                {equipos.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-three">
            <div className="form-group">
              <label>Valoración (Media)</label>
              <input
                type="number"
                className="input-field"
                min="-10" max="150" // Dejamos amplio para testear validación del backend
                value={cardForm.media}
                onChange={e => setCardForm({ ...cardForm, media: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label>Tipo de Carta</label>
              <select
                className="select-field"
                value={cardForm.tipoCarta}
                onChange={e => setCardForm({ ...cardForm, tipoCarta: e.target.value })}
              >
                <option value="ORO">Oro</option>
                <option value="PLATA">Plata</option>
                <option value="BRONCE">Bronce</option>
                <option value="ESPECIAL">Especial</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ritmo (PAC)</label>
              <input
                type="number"
                className="input-field"
                value={cardForm.ritmo}
                onChange={e => setCardForm({ ...cardForm, ritmo: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="form-row-three">
            <div className="form-group">
              <label>Tiro (SHO)</label>
              <input
                type="number"
                className="input-field"
                value={cardForm.tiro}
                onChange={e => setCardForm({ ...cardForm, tiro: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label>Pase (PAS)</label>
              <input
                type="number"
                className="input-field"
                value={cardForm.pase}
                onChange={e => setCardForm({ ...cardForm, pase: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label>Regate (DRI)</label>
              <input
                type="number"
                className="input-field"
                value={cardForm.regate}
                onChange={e => setCardForm({ ...cardForm, regate: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Defensa (DEF)</label>
              <input
                type="number"
                className="input-field"
                value={cardForm.defensa}
                onChange={e => setCardForm({ ...cardForm, defensa: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label>Físico (PHY)</label>
              <input
                type="number"
                className="input-field"
                value={cardForm.fisico}
                onChange={e => setCardForm({ ...cardForm, fisico: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button type="submit" className="btn btn-primary">
              💾 {cardForm.id ? 'Actualizar Carta' : 'Crear Carta'}
            </button>
            {cardForm.id && (
              <button type="button" className="btn btn-secondary" onClick={handleResetCardForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* SECCIÓN 2: GESTIONAR ENTIDADES SECUNDARIAS */}
      <div className="manage-grid">
        
        {/* JUGADORES */}
        <div className="panel">
          <h2>{isEditingPlayer ? '✏️ Editar Jugador' : '👤 Nuevo Jugador'}</h2>
          <form onSubmit={handleSavePlayer} style={{ margin: '15px 0' }}>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej. Lionel Messi"
                value={playerForm.nombre}
                onChange={e => setPlayerForm({ ...playerForm, nombre: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Apodo (FUT Card Display Name)</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej. Messi"
                value={playerForm.apodo}
                onChange={e => setPlayerForm({ ...playerForm, apodo: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Posición</label>
                <select
                  className="select-field"
                  value={playerForm.posicion}
                  onChange={e => setPlayerForm({ ...playerForm, posicion: e.target.value })}
                >
                  <option value="POR">POR (Arquero)</option>
                  <option value="DFC">DFC (Defensa Central)</option>
                  <option value="LD">LD (Lateral Derecho)</option>
                  <option value="LI">LI (Lateral Izquierdo)</option>
                  <option value="MC">MC (Mediocampista)</option>
                  <option value="MCO">MCO (Medio Ofensivo)</option>
                  <option value="MI">MI (Medio Izquierdo)</option>
                  <option value="MD">MD (Medio Derecho)</option>
                  <option value="ED">ED (Extremo Derecho)</option>
                  <option value="EI">EI (Extremo Izquierdo)</option>
                  <option value="DC">DC (Delantero Centro)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nacionalidad</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. Argentina"
                  value={playerForm.nacionalidad}
                  onChange={e => setPlayerForm({ ...playerForm, nacionalidad: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px' }}>
                {isEditingPlayer ? 'Actualizar' : 'Añadir Jugador'}
              </button>
              {isEditingPlayer && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px' }}
                  onClick={() => {
                    setPlayerForm({ id: null, nombre: '', apodo: '', posicion: 'DC', nacionalidad: '' });
                    setIsEditingPlayer(false);
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <h3 style={{ marginTop: '20px', fontSize: '1.1rem' }}>Lista de Jugadores</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {jugadores.map(j => (
              <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{j.nombre}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{j.posicion} | {j.nacionalidad}</div>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button className="btn" onClick={() => handleEditPlayer(j)} style={{ padding: '4px 8px', fontSize: '11px' }}>✏️</button>
                  <button className="btn btn-danger" onClick={() => handleDeletePlayer(j.id)} style={{ padding: '4px 8px', fontSize: '11px' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EQUIPOS */}
        <div className="panel">
          <h2>{isEditingTeam ? '✏️ Editar Equipo' : '🛡️ Nuevo Equipo'}</h2>
          <form onSubmit={handleSaveTeam} style={{ margin: '15px 0' }}>
            <div className="form-group">
              <label>Nombre del Club</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej. Real Madrid Club"
                value={teamForm.nombre}
                onChange={e => setTeamForm({ ...teamForm, nombre: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Liga / Competición</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej. Liga Española"
                value={teamForm.liga}
                onChange={e => setTeamForm({ ...teamForm, liga: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>País de Origen</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej. España"
                value={teamForm.pais}
                onChange={e => setTeamForm({ ...teamForm, pais: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px' }}>
                {isEditingTeam ? 'Actualizar' : 'Añadir Equipo'}
              </button>
              {isEditingTeam && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px' }}
                  onClick={() => {
                    setTeamForm({ id: null, nombre: '', liga: '', pais: '' });
                    setIsEditingTeam(false);
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <h3 style={{ marginTop: '20px', fontSize: '1.1rem' }}>Lista de Equipos</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {equipos.map(eq => (
              <div key={eq.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{eq.nombre}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{eq.liga} | {eq.pais}</div>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button className="btn" onClick={() => handleEditTeam(eq)} style={{ padding: '4px 8px', fontSize: '11px' }}>✏️</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteTeam(eq.id)} style={{ padding: '4px 8px', fontSize: '11px' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
