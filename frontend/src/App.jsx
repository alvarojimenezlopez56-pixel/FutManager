import React, { useState, useEffect } from 'react';
import FutCard from './components/FutCard';
import ManagePanel from './components/ManagePanel';
import JUnitResultsPanel from './components/JUnitResultsPanel';
import AlineacionPanel from './components/AlineacionPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('galeria'); // 'galeria' | 'gestion' | 'junit'
  const [cartas, setCartas] = useState([]);
  const [equipos, setEquipos] = useState([]);
  
  // Filtros de búsqueda
  const [filterMediaMin, setFilterMediaMin] = useState('');
  const [filterMediaMax, setFilterMediaMax] = useState('');
  const [filterTipoCarta, setFilterTipoCarta] = useState('');
  const [filterEquipoId, setFilterEquipoId] = useState('');
  const [searchNombre, setSearchNombre] = useState('');

  // Estado para pasar una carta a editar al panel de gestión
  const [cardToEdit, setCardToEdit] = useState(null);

  // Cargar cartas con los filtros aplicados
  const fetchCartas = async () => {
    try {
      const params = new URLSearchParams();
      if (filterMediaMin) params.append('mediaMin', filterMediaMin);
      if (filterMediaMax) params.append('mediaMax', filterMediaMax);
      if (filterTipoCarta) params.append('tipoCarta', filterTipoCarta);
      if (filterEquipoId) params.append('equipoId', filterEquipoId);

      const response = await fetch(`/api/cartas?${params.toString()}`);
      if (response.ok) {
        let data = await response.json();
        
        // Filtro por nombre (en frontend para mayor rapidez e interactividad)
        if (searchNombre.trim() !== '') {
          data = data.filter(c => 
            c.jugador.nombre.toLowerCase().includes(searchNombre.toLowerCase()) ||
            (c.jugador.apodo && c.jugador.apodo.toLowerCase().includes(searchNombre.toLowerCase()))
          );
        }
        setCartas(data);
      }
    } catch (e) {
      console.error("Error al cargar las cartas FUT", e);
    }
  };

  // Cargar equipos para el dropdown de filtros
  const fetchEquipos = async () => {
    try {
      const res = await fetch('/api/equipos');
      if (res.ok) {
        const data = await res.json();
        setEquipos(data);
      }
    } catch (e) {
      console.error("Error al cargar los equipos en filtros", e);
    }
  };

  useEffect(() => {
    fetchCartas();
  }, [filterMediaMin, filterMediaMax, filterTipoCarta, filterEquipoId, searchNombre]);

  useEffect(() => {
    fetchEquipos();
  }, []);

  // Borrar una carta
  const handleDeleteCard = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta carta FUT?")) return;
    try {
      const res = await fetch(`/api/cartas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCartas();
      } else {
        alert("Error al eliminar la carta");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  // Activar edición de una carta
  const handleEditCard = (carta) => {
    setCardToEdit(carta);
    setActiveTab('gestion');
  };

  return (
    <div className="app-container">
      <header className="header-banner">
        <div>
          <h1 className="app-title">FutManager</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Didactic FUT Card Manager App</p>
        </div>
        <nav className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'galeria' ? 'active' : ''}`}
            onClick={() => setActiveTab('galeria')}
          >
            🃏 Galería
          </button>
          <button 
            className={`tab-btn ${activeTab === 'alineacion' ? 'active' : ''}`}
            onClick={() => setActiveTab('alineacion')}
          >
            🛡️ Alineación y Química
          </button>
          <button 
            className={`tab-btn ${activeTab === 'gestion' ? 'active' : ''}`}
            onClick={() => setActiveTab('gestion')}
          >
            🛠️ Gestionar Datos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'junit' ? 'active' : ''}`}
            onClick={() => setActiveTab('junit')}
          >
            📊 Pruebas JUnit
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'galeria' && (
          <div className="tab-pane fade-in">
            <div className="gallery-section">
              <div className="panel">
                <h3>🔍 Filtrar y Buscar Cartas</h3>
                <div className="filters-bar" style={{ marginTop: '15px' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Buscar por jugador..."
                    value={searchNombre}
                    onChange={e => setSearchNombre(e.target.value)}
                  />
                  
                  <select 
                    className="select-field"
                    value={filterTipoCarta}
                    onChange={e => setFilterTipoCarta(e.target.value)}
                  >
                    <option value="">-- Todos los tipos --</option>
                    <option value="ORO">Oro</option>
                    <option value="PLATA">Plata</option>
                    <option value="BRONCE">Bronce</option>
                    <option value="ESPECIAL">Especial</option>
                  </select>

                  <select 
                    className="select-field"
                    value={filterEquipoId}
                    onChange={e => setFilterEquipoId(e.target.value)}
                  >
                    <option value="">-- Todos los equipos --</option>
                    {equipos.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.nombre}</option>
                    ))}
                  </select>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input 
                      type="number" 
                      className="input-field" 
                      style={{ width: '70px' }} 
                      placeholder="Min"
                      value={filterMediaMin}
                      onChange={e => setFilterMediaMin(e.target.value)}
                    />
                    <span>a</span>
                    <input 
                      type="number" 
                      className="input-field" 
                      style={{ width: '70px' }} 
                      placeholder="Max"
                      value={filterMediaMax}
                      onChange={e => setFilterMediaMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="cards-grid">
                {cartas.map(carta => (
                  <FutCard 
                    key={carta.id} 
                    carta={carta} 
                    onEdit={handleEditCard}
                    onDelete={handleDeleteCard}
                  />
                ))}
                {cartas.length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                    <h3>No se encontraron cartas FUT</h3>
                    <p style={{ marginTop: '5px' }}>Dirígete a la sección de "Gestionar Datos" para agregar jugadores, equipos y crear nuevas cartas.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alineacion' && (
          <div className="tab-pane fade-in">
            <AlineacionPanel />
          </div>
        )}

        {activeTab === 'gestion' && (
          <div className="tab-pane fade-in">
            <ManagePanel 
              onDataModified={() => {
                fetchCartas();
                fetchEquipos();
              }}
              cardToEdit={cardToEdit}
              onCancelEditCard={() => setCardToEdit(null)}
            />
          </div>
        )}

        {activeTab === 'junit' && (
          <div className="tab-pane fade-in">
            <JUnitResultsPanel />
          </div>
        )}
      </main>
    </div>
  );
}
