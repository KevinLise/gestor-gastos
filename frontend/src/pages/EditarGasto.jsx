// =============================================
// pages/EditarGasto.jsx
// =============================================
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GastoForm from '../components/common/GastoForm';
import { gastosService } from '../services/api';

export default function EditarGasto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gasto, setGasto] = useState(null);
  const [loadingGet, setLoadingGet] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await gastosService.getOne(id);
        setGasto(res.data.data);
      } catch (err) {
        setError('No se encontró el gasto o hubo un error al cargarlo');
      } finally {
        setLoadingGet(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      setLoadingSave(true);
      setError(null);
      await gastosService.update(id, data);
      navigate('/historial', { state: { mensaje: 'Gasto actualizado correctamente' } });
    } catch (err) {
      setError(err.message || 'Error al actualizar el gasto');
      setLoadingSave(false);
    }
  };

  if (loadingGet) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  if (error && !gasto) {
    return (
      <div className="alert alert-error" style={{ maxWidth: 500 }}>
         {error}
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Editar gasto 
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Modifica los campos que necesites y guarda los cambios.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
           {error}
        </div>
      )}

      <div className="card">
        <GastoForm initialData={gasto} onSubmit={handleSubmit} loading={loadingSave} />
      </div>
    </div>
  );
}
