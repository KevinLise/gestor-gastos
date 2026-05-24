// =============================================
// pages/Historial.jsx — Lista completa de gastos
// =============================================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useGastos from '../hooks/useGastos';
import {
  formatCOP,
  formatFecha,
  CATEGORIAS,
  getCatEmoji,
} from '../services/utils';

export default function Historial() {
  const [filtros, setFiltros] = useState({ categoria: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const { gastos, loading, error, refetch, deleteGasto } = useGastos(filtros);

  const handleFiltro = (e) => {
    setFiltros(prev => ({ ...prev, categoria: e.target.value }));
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteGasto(id);
      setMensaje({ type: 'success', text: 'Gasto eliminado correctamente' });
      setConfirmId(null);
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setMensaje({ type: 'error', text: 'Error al eliminar el gasto' });
    } finally {
      setDeletingId(null);
    }
  };

  const totalFiltrado = gastos.reduce((acc, g) => acc + g.monto, 0);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ─── Encabezado ─────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Historial de gastos 🗂️
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {gastos.length} {gastos.length === 1 ? 'registro' : 'registros'} encontrados
          </p>
        </div>
        <Link to="/nuevo" className="btn btn-primary">+ Nuevo gasto</Link>
      </div>

      {/* ─── Alerta ──────────────────────────── */}
      {mensaje && (
        <div className={`alert alert-${mensaje.type}`}>
          {mensaje.type === 'success' ? '✅' : '⚠️'} {mensaje.text}
        </div>
      )}

      {/* ─── Filtros ─────────────────────────── */}
      <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Filtrar:
        </span>
        <select
          className="form-control"
          style={{ maxWidth: 200 }}
          value={filtros.categoria}
          onChange={handleFiltro}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map(({ value, label, emoji }) => (
            <option key={value} value={value}>{emoji} {label}</option>
          ))}
        </select>
        {filtros.categoria && (
          <button
            className="btn btn-ghost"
            onClick={() => setFiltros({ categoria: '' })}
          >
            ✕ Limpiar
          </button>
        )}
        <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--accent)' }}>
          Total: {formatCOP(totalFiltrado)}
        </div>
      </div>

      {/* ─── Tabla ───────────────────────────── */}
      {error && (
        <div className="alert alert-error">⚠️ Error al cargar gastos: {error}</div>
      )}

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : gastos.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No hay gastos{filtros.categoria ? ' en esta categoría' : ''} aún</p>
            <Link to="/nuevo" className="btn btn-primary">Registrar primer gasto</Link>
          </div>
        </div>
      ) : (
        <>
          {/* Vista escritorio: tabla */}
          <div className="table-wrapper" style={{ display: 'block' }}>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {gastos.map((gasto) => (
                  <React.Fragment key={gasto._id}>
                    <tr>
                      <td>
                        <div style={{ fontWeight: 500 }}>{gasto.nombre}</div>
                        {gasto.descripcion && (
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                            {gasto.descripcion}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge badge-${gasto.categoria}`}>
                          {getCatEmoji(gasto.categoria)} {gasto.categoria}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                        {formatFecha(gasto.fecha)}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                        {formatCOP(gasto.monto)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                            onClick={() => navigate(`/editar/${gasto._id}`)}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                            onClick={() => setConfirmId(gasto._id)}
                            disabled={deletingId === gasto._id}
                          >
                            {deletingId === gasto._id ? '...' : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Confirmación de eliminación inline */}
                    {confirmId === gasto._id && (
                      <tr>
                        <td colSpan={5} style={{ background: 'rgba(248,113,113,0.08)', borderTop: '1px solid rgba(248,113,113,0.2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--danger)' }}>
                              ⚠️ ¿Eliminar "{gasto.nombre}"? Esta acción no se puede deshacer.
                            </span>
                            <button
                              className="btn btn-danger"
                              style={{ padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}
                              onClick={() => handleDelete(gasto._id)}
                            >
                              Confirmar
                            </button>
                            <button
                              className="btn btn-ghost"
                              style={{ fontSize: '0.8125rem' }}
                              onClick={() => setConfirmId(null)}
                            >
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pie de tabla */}
          <div style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Mostrando {gastos.length} gasto{gastos.length !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </div>
  );
}
