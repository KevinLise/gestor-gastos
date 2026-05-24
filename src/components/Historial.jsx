// ============================================
// HISTORIAL — Lista de gastos con filtros + CRUD
// ============================================

import React, { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useApp } from '../context/AppContext.jsx'
import { CATEGORIAS } from '../utils/constants.js'
import {
  formatCOP,
  formatDate,
  sortByDate,
  getCategoriaEmoji,
  getCategoriaLabel,
  getCategoriaColor,
} from '../utils/helpers.js'
import './Historial.css'

export default function Historial() {
  const { gastos, deleteGasto, setEditing } = useApp()

  const [search,     setSearch]     = useState('')
  const [filterCat,  setFilterCat]  = useState('all')
  const [filterMes,  setFilterMes]  = useState('all')
  const [sortOrder,  setSortOrder]  = useState('fecha-desc')
  const [toDelete,   setToDelete]   = useState(null)

  // Meses disponibles
  const meses = useMemo(() => {
    const set = new Set(gastos.map(g => g.fecha.slice(0, 7)))
    return [...set].sort((a, b) => b.localeCompare(a))
  }, [gastos])

  // Filtrar + ordenar
  const filtered = useMemo(() => {
    let list = [...gastos]

    if (search.trim())
      list = list.filter(g =>
        g.nombre.toLowerCase().includes(search.toLowerCase()) ||
        g.descripcion?.toLowerCase().includes(search.toLowerCase())
      )

    if (filterCat !== 'all')
      list = list.filter(g => g.categoria === filterCat)

    if (filterMes !== 'all')
      list = list.filter(g => g.fecha.startsWith(filterMes))

    switch (sortOrder) {
      case 'fecha-desc': list.sort((a, b) => b.fecha.localeCompare(a.fecha)); break
      case 'fecha-asc':  list.sort((a, b) => a.fecha.localeCompare(b.fecha)); break
      case 'monto-desc': list.sort((a, b) => b.monto - a.monto); break
      case 'monto-asc':  list.sort((a, b) => a.monto - b.monto); break
      default: break
    }

    return list
  }, [gastos, search, filterCat, filterMes, sortOrder])

  const totalFiltrado = filtered.reduce((a, g) => a + g.monto, 0)

  const handleDelete = (id) => setToDelete(id)

  const confirmDelete = () => {
    deleteGasto(toDelete)
    toast.success(' Gasto eliminado')
    setToDelete(null)
  }

  return (
    <div className="historial animate-fadeInUp">
      {/* Header */}
      <div className="historial__header">
        <div>
          <h2 className="historial__title"> Historial de Gastos</h2>
          <p className="historial__sub">
            {filtered.length} gasto{filtered.length !== 1 ? 's' : ''}
            {filtered.length > 0 && <> · Total: <strong>{formatCOP(totalFiltrado)}</strong></>}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="historial__filters">
        <div className="filter-search">
          <span className="filter-search__icon"></span>
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="filter-input"
          />
          {search && (
            <button className="filter-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <select
          className="filter-select"
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {CATEGORIAS.map(c => (
            <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filterMes}
          onChange={e => setFilterMes(e.target.value)}
        >
          <option value="all">Todos los meses</option>
          {meses.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
        >
          <option value="fecha-desc">Más reciente primero</option>
          <option value="fecha-asc">Más antiguo primero</option>
          <option value="monto-desc">Mayor monto</option>
          <option value="monto-asc">Menor monto</option>
        </select>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="historial__empty">
          <div style={{ fontSize: '2.5rem' }}></div>
          <p>No se encontraron gastos con estos filtros</p>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => { setSearch(''); setFilterCat('all'); setFilterMes('all') }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <ul className="gastos-list">
          {filtered.map((g, idx) => (
            <GastoItem
              key={g.id}
              gasto={g}
              onEdit={() => setEditing(g)}
              onDelete={() => handleDelete(g.id)}
              style={{ animationDelay: `${idx * 0.04}s` }}
            />
          ))}
        </ul>
      )}

      {/* Modal de confirmación */}
      {toDelete && (
        <DeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  )
}

// ---- GastoItem ----

function GastoItem({ gasto, onEdit, onDelete, style }) {
  const color = getCategoriaColor(gasto.categoria)
  const emoji = getCategoriaEmoji(gasto.categoria)
  const label = getCategoriaLabel(gasto.categoria)

  return (
    <li className="gasto-item animate-fadeInUp" style={style}>
      <div
        className="gasto-item__accent"
        style={{ background: color }}
      />

      <div
        className="gasto-item__icon"
        style={{ background: color + '22', border: `1px solid ${color}44` }}
      >
        {emoji}
      </div>

      <div className="gasto-item__body">
        <div className="gasto-item__row">
          <span className="gasto-item__nombre">{gasto.nombre}</span>
          <span className="gasto-item__monto">{formatCOP(gasto.monto)}</span>
        </div>
        <div className="gasto-item__meta">
          <span
            className="gasto-item__badge"
            style={{ background: color + '22', color, border: `1px solid ${color}44` }}
          >
            {label}
          </span>
          <span className="gasto-item__fecha"> {formatDate(gasto.fecha)}</span>
          {gasto.descripcion && (
            <span className="gasto-item__desc" title={gasto.descripcion}>
               {gasto.descripcion}
            </span>
          )}
        </div>
      </div>

      <div className="gasto-item__actions">
        <button
          className="icon-btn icon-btn--edit"
          onClick={onEdit}
          title="Editar"
        >
          
        </button>
        <button
          className="icon-btn icon-btn--delete"
          onClick={onDelete}
          title="Eliminar"
        >
          
        </button>
      </div>
    </li>
  )
}

// ---- DeleteModal ----

function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay animate-fadeIn" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__icon"></div>
        <h3 className="modal__title">Eliminar gasto</h3>
        <p className="modal__text">¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer.</p>
        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>Cancelar</button>
          <button className="btn btn--danger" onClick={onConfirm}>Sí, eliminar</button>
        </div>
      </div>
    </div>
  )
}
