import React, { useState, useEffect } from 'react';

export default function JUnitResultsPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test-results');
      if (!response.ok) {
        throw new Error('No se pudo conectar al endpoint de resultados de tests.');
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="panel">
      <div className="junit-header">
        <h2>Reporte de Calidad y Pruebas JUnit</h2>
        <button className="btn btn-primary" onClick={fetchResults} disabled={loading}>
          {loading ? 'Cargando...' : '🔄 Actualizar Pruebas'}
        </button>
      </div>

      {error && (
        <div className="alert-banner error">
          <span>⚠️</span> {error}
        </div>
      )}

      {data && data.status === 'NO_REPORTS' && (
        <div className="alert-banner info">
          <span>ℹ️</span> <strong>Aviso del Servidor:</strong> {data.message || 'Ejecuta los tests en tu consola primero.'}
        </div>
      )}

      {data && (
        <>
          <div className="junit-summary-grid">
            <div className={`summary-card ${data.failed > 0 ? 'failed' : 'passed'}`}>
              <div className="summary-val">
                <span className={`badge ${data.status === 'PASSED' ? 'success' : (data.status === 'FAILED' ? 'failed' : 'pending')}`}>
                  {data.status}
                </span>
              </div>
              <div className="summary-label">Estado General</div>
            </div>
            
            <div className="summary-card">
              <div className="summary-val">{data.totalTests}</div>
              <div className="summary-label">Total Ejecutados</div>
            </div>

            <div className="summary-card">
              <div className="summary-val" style={{ color: '#28a745' }}>{data.passed}</div>
              <div className="summary-label">Pasados</div>
            </div>

            <div className="summary-card">
              <div className="summary-val" style={{ color: '#dc3545' }}>{data.failed}</div>
              <div className="summary-label">Fallados</div>
            </div>

            <div className="summary-card">
              <div className="summary-val">{data.executionTimeMs} ms</div>
              <div className="summary-label">Duración</div>
            </div>
          </div>

          <h3>Detalle de Pruebas JUnit</h3>
          <div className="test-list" style={{ marginTop: '15px' }}>
            {data.tests && data.tests.map((test, index) => (
              <div className="test-item" key={index}>
                <div className="test-info">
                  <span className="test-name">{test.name}</span>
                  <span className="test-class">{test.className}</span>
                </div>
                <span className={`badge ${
                  test.status === 'SUCCESS' ? 'success' : 
                  (test.status === 'FAILURE' || test.status === 'ERROR' ? 'failed' : 'pending')
                }`}>
                  {test.status}
                </span>
              </div>
            ))}
            {(!data.tests || data.tests.length === 0) && (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                No hay pruebas individuales registradas.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
