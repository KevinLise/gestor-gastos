// ============================================
// UTILS — Funciones auxiliares
// ============================================

import { CATEGORIA_MAP } from './constants.js'

/**
 * Formato COP con separadores de miles
 */
export function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formato moneda extranjera
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Fecha legible en español
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Obtener año-mes de una fecha (YYYY-MM)
 */
export function getYearMonth(dateStr) {
  return dateStr.slice(0, 7)
}

/**
 * Mes actual en formato YYYY-MM
 */
export function currentYearMonth() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

/**
 * Hoy en formato YYYY-MM-DD
 */
export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Generar ID único
 */
export function generateId() {
  return `gasto_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Agrupar gastos por categoría (suma de montos)
 */
export function groupByCategoria(gastos) {
  const result = {}
  for (const g of gastos) {
    result[g.categoria] = (result[g.categoria] || 0) + g.monto
  }
  return result
}

/**
 * Gastos del mes actual
 */
export function gastosDelMes(gastos) {
  const ym = currentYearMonth()
  return gastos.filter(g => getYearMonth(g.fecha) === ym)
}

/**
 * Total de un array de gastos
 */
export function totalGastos(gastos) {
  return gastos.reduce((acc, g) => acc + g.monto, 0)
}

/**
 * Ordenar gastos por fecha (más reciente primero)
 */
export function sortByDate(gastos) {
  return [...gastos].sort((a, b) => b.fecha.localeCompare(a.fecha))
}

/**
 * Convierte monto COP a divisa destino
 */
export function convertCOP(amountCOP, rate) {
  return amountCOP * rate
}

/**
 * Color de categoría
 */
export function getCategoriaColor(id) {
  return CATEGORIA_MAP[id]?.color || '#9898c0'
}

/**
 * Emoji de categoría
 */
export function getCategoriaEmoji(id) {
  return CATEGORIA_MAP[id]?.emoji || ''
}

/**
 * Label de categoría
 */
export function getCategoriaLabel(id) {
  return CATEGORIA_MAP[id]?.label || id
}
