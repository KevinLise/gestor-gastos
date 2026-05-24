// =============================================
// pages/NuevoGasto.jsx
// =============================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GastoForm from '../components/common/GastoForm';
import { gastosService } from '../services/api';

export default function NuevoGasto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      await gastosService.create(data);
      navigate('/historial', { state: { mensaje: 'Gasto registrado exitosamente' } });
    } catch (err) {
      setError(err.message || 'Error al crear el gasto');
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Registrar gasto ➕
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Completa los campos para agregar un nuevo gasto a tu historial.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
          ⚠️ {error}
        </div>
      )}

      <div className="card">
        <GastoForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
