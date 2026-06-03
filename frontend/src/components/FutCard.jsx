import React from 'react';

export default function FutCard({ carta, onEdit, onDelete }) {
  const { jugador, equipo, media, ritmo, tiro, pase, regate, defensa, fisico, tipoCarta } = carta;

  // Renderizar un avatar vectorial SVG genérico para evitar usar fotos protegidas
  const renderAvatarSVG = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="35" r="20" fill="currentColor" opacity="0.8"/>
      <path d="M15 85C15 65 30 55 50 55C70 55 85 65 85 85" fill="currentColor" opacity="0.8"/>
    </svg>
  );

  return (
    <div className={`card-wrapper`}>
      <div className={`fut-card ${tipoCarta.toLowerCase()}`}>
        <div className="card-header">
          <div className="rating-badge">
            <span className="rating-val">{media}</span>
            <span className="position-val">{jugador.posicion}</span>
          </div>
          <div className="card-top-stats">
            <div>FUT</div>
            <div style={{ fontSize: '10px', opacity: 0.8 }}>MGR</div>
          </div>
        </div>

        <div className="player-avatar">
          {renderAvatarSVG()}
        </div>

        <div className="player-name">
          {jugador.apodo ? jugador.apodo : jugador.nombre}
        </div>

        <div className="card-team-nationality">
          {/* Escudo de equipo genérico */}
          <div className="badge-placeholder" title={equipo.nombre}>
            🛡️
          </div>
          {/* Bandera / Nacionalidad genérica */}
          <div className="badge-placeholder" title={jugador.nacionalidad}>
            🌍
          </div>
        </div>

        <div className="card-stats-grid">
          <div className="stat-item">
            <span>PAC</span>
            <span className="stat-val">{ritmo}</span>
          </div>
          <div className="stat-item">
            <span>DRI</span>
            <span className="stat-val">{regate}</span>
          </div>
          <div className="stat-item">
            <span>SHO</span>
            <span className="stat-val">{tiro}</span>
          </div>
          <div className="stat-item">
            <span>DEF</span>
            <span className="stat-val">{defensa}</span>
          </div>
          <div className="stat-item">
            <span>PAS</span>
            <span className="stat-val">{pase}</span>
          </div>
          <div className="stat-item">
            <span>PHY</span>
            <span className="stat-val">{fisico}</span>
          </div>
        </div>
      </div>

      <div className="card-actions">
        {onEdit && (
          <button className="btn btn-primary" onClick={() => onEdit(carta)} style={{ padding: '6px 10px', fontSize: '12px' }}>
            ✏️
          </button>
        )}
        {onDelete && (
          <button className="btn btn-danger" onClick={() => onDelete(carta.id)} style={{ padding: '6px 10px', fontSize: '12px' }}>
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
