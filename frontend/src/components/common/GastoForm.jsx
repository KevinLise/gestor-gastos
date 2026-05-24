// =============================================
// components/common/GastoForm.jsx
// Formulario reutilizable: crear + editar gasto
// =============================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIAS, fechaParaInput } from '../../services/utils';

const INITIAL_STATE = {
  nombre: '',
  descripcion: '',
  categoria: '',
  monto: '',
  fecha: new Date().toISOString().split('T')[0],
};

const GastoForm = ({ initialData = null, onSubmit, loading }) => {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre:      initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        categoria:   initialData.categoria || '',
        monto:       initialData.monto?.toString() || '',
        fecha:       fechaParaInput(initialData.fecha),
      });
    }
  }, [initialData]);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!form.categoria)     e.categoria = 'Selecciona una categoría';
    if (!form.monto || isNaN(form.monto) || Number(form.monto) < 0)
      e.monto = 'Ingresa un monto válido (≥ 0)';
    if (!form.fecha) e.fecha = 'La fecha es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      ...form,
      monto: Number(form.monto),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Nombre */}
        <div className="form-group">
          <label className="form-label" htmlFor="nombre">Nombre del gasto</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            className={`form-control ${errors.nombre ? 'error' : ''}`}
            placeholder="Ej: Almuerzo en restaurante"
            value={form.nombre}
            onChange={handleChange}
            maxLength={100}
          />
          {errors.nombre && <span className="form-error">{errors.nombre}</span>}
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label className="form-label" htmlFor="descripcion">
            Descripción <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(opcional)</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="form-control"
            placeholder="Detalles adicionales..."
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            style={{ resize: 'vertical', minHeight: 80 }}
          />
        </div>

        {/* Categoría y monto en fila */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Categoría */}
          <div className="form-group">
            <label className="form-label" htmlFor="categoria">Categoría</label>
            <select
              id="categoria"
              name="categoria"
              className={`form-control ${errors.categoria ? 'error' : ''}`}
              value={form.categoria}
              onChange={handleChange}
            >
              <option value="">Seleccionar...</option>
              {CATEGORIAS.map(({ value, label, emoji }) => (
                <option key={value} value={value}>{emoji} {label}</option>
              ))}
            </select>
            {errors.categoria && <span className="form-error">{errors.categoria}</span>}
          </div>

          {/* Monto */}
          <div className="form-group">
            <label className="form-label" htmlFor="monto">Monto (COP)</label>
            <input
              id="monto"
              name="monto"
              type="number"
              className={`form-control ${errors.monto ? 'error' : ''}`}
              placeholder="Ej: 25000"
              value={form.monto}
              onChange={handleChange}
              min={0}
              step={1}
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            {errors.monto && <span className="form-error">{errors.monto}</span>}
          </div>
        </div>

        {/* Fecha */}
        <div className="form-group">
          <label className="form-label" htmlFor="fecha">Fecha</label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            className={`form-control ${errors.fecha ? 'error' : ''}`}
            value={form.fecha}
            onChange={handleChange}
            style={{ colorScheme: 'dark' }}
          />
          {errors.fecha && <span className="form-error">{errors.fecha}</span>}
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid #0f172a', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Guardando...
              </>
            ) : (
              <>{initialData ? '💾 Guardar cambios' : '✅ Registrar gasto'}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default GastoForm;
