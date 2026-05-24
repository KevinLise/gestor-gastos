// =============================================
// pages/NotFound.jsx
// =============================================
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>404</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Página no encontrada
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        La ruta que buscas no existe en este sistema.
      </p>
      <Link to="/" className="btn btn-primary">Volver al Dashboard</Link>
    </div>
  );
}
