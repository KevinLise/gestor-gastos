// ============================================
// GASTO FORM — Agregar / Editar gasto
// ============================================

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useApp } from '../context/AppContext.jsx'
import { CATEGORIAS, VIEWS } from '../utils/constants.js'
import { todayISO } from '../utils/helpers.js'
import './GastoForm.css'

const emptyForm = {
  nombre: '',
  categoria: '',
  monto: '',
  fecha: todayISO(),
  descripcion: '',
}

export default function GastoForm() {
  const { addGasto, updateGasto, editingGasto, setView } = useApp()
  const isEditing = Boolean(editingGasto)

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Cargar datos al editar
  useEffect(() => {
    if (editingGasto) {
      setForm({
        nombre:      editingGasto.nombre || '',
        categoria:   editingGasto.categoria || '',
        monto:       editingGasto.monto?.toString() || '',
        fecha:       editingGasto.fecha || todayISO(),
        descripcion: editingGasto.descripcion || '',
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [editingGasto])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.nombre.trim())       errs.nombre = 'El nombre es obligatorio'
    if (!form.categoria)           errs.categoria = 'Selecciona una categoría'
    if (!form.monto || isNaN(Number(form.monto)) || Number(form.monto) <= 0)
                                   errs.monto = 'Ingresa un monto válido mayor a 0'
    if (!form.fecha)               errs.fecha = 'La fecha es obligatoria'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        ...form,
        monto: Number(form.monto),
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
      }

      if (isEditing) {
        updateGasto({ ...editingGasto, ...payload })
        toast.success(' Gasto actualizado')
      } else {
        addGasto(payload)
        toast.success(' Gasto agregado')
        setForm(emptyForm)
      }

      setView(VIEWS.HISTORIAL)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setView(VIEWS.DASHBOARD)
    setForm(emptyForm)
    setErrors({})
  }

  return (
    <div className="form-page animate-fadeInUp">
      <div className="form-page__header">
        <h2 className="form-page__title">
          {isEditing ? ' Editar Gasto' : '➕ Agregar Gasto'}
        </h2>
        <p className="form-page__subtitle">
          {isEditing
            ? 'Modifica los datos del gasto seleccionado'
            : 'Registra un nuevo gasto en tu historial'}
        </p>
      </div>

      <form className="gasto-form" onSubmit={handleSubmit} noValidate>
        {/* Nombre */}
        <div className={`form-field ${errors.nombre ? 'has-error' : ''}`}>
          <label className="form-label" htmlFor="nombre">
            Nombre del gasto <span className="required">*</span>
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            className="form-input"
            placeholder="Ej: Almuerzo restaurante"
            value={form.nombre}
            onChange={handleChange}
            maxLength={80}
            autoFocus
          />
          {errors.nombre && <span className="form-error">{errors.nombre}</span>}
        </div>

        {/* Fila: categoría + monto */}
        <div className="form-row">
          <div className={`form-field ${errors.categoria ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="categoria">
              Categoría <span className="required">*</span>
            </label>
            <select
              id="categoria"
              name="categoria"
              className="form-select"
              value={form.categoria}
              onChange={handleChange}
            >
              <option value="">— Seleccionar —</option>
              {CATEGORIAS.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
            {errors.categoria && <span className="form-error">{errors.categoria}</span>}
          </div>

          <div className={`form-field ${errors.monto ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="monto">
              Monto (COP) <span className="required">*</span>
            </label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                id="monto"
                name="monto"
                type="number"
                className="form-input form-input--prefixed"
                placeholder="0"
                value={form.monto}
                onChange={handleChange}
                min="1"
                step="1"
              />
            </div>
            {errors.monto && <span className="form-error">{errors.monto}</span>}
          </div>
        </div>

        {/* Fecha */}
        <div className={`form-field ${errors.fecha ? 'has-error' : ''}`}>
          <label className="form-label" htmlFor="fecha">
            Fecha <span className="required">*</span>
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            className="form-input form-input--date"
            value={form.fecha}
            onChange={handleChange}
            max={todayISO()}
          />
          {errors.fecha && <span className="form-error">{errors.fecha}</span>}
        </div>

        {/* Descripción */}
        <div className="form-field">
          <label className="form-label" htmlFor="descripcion">
            Descripción <span className="optional">(opcional)</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="form-textarea"
            placeholder="Agrega una nota sobre este gasto..."
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            maxLength={200}
          />
          <span className="char-count">{form.descripcion.length}/200</span>
        </div>

        {/* Categoría preview */}
        {form.categoria && (
          <div className="category-preview">
            {CATEGORIAS.find(c => c.id === form.categoria)?.emoji}&nbsp;
            Categoría: <strong>{CATEGORIAS.find(c => c.id === form.categoria)?.label}</strong>
          </div>
        )}

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn--primary btn--lg"
            disabled={submitting}
          >
            {submitting
              ? <><span className="loader" /> Guardando…</>
              : isEditing ? ' Guardar cambios' : ' Agregar gasto'
            }
          </button>
        </div>
      </form>
    </div>
  )
}
