// =============================================
// services/utils.js — Funciones de utilidad
// =============================================

// Formatear moneda COP
export const formatCOP = (monto) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(monto);

// Formatear moneda USD
export const formatUSD = (monto) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(monto);

// Formatear moneda EUR
export const formatEUR = (monto) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(monto);

// Formatear fecha legible
export const formatFecha = (fecha) =>
  new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

// Fecha para input type="date"
export const fechaParaInput = (fecha) => {
  const d = new Date(fecha);
  return d.toISOString().split('T')[0];
};

// Meses en español
export const MESES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

// Categorías disponibles
export const CATEGORIAS = [
  { value: 'comida',          label: 'Comida',          emoji: '🍽️' },
  { value: 'transporte',      label: 'Transporte',      emoji: '🚌' },
  { value: 'estudio',         label: 'Estudio',         emoji: '📚' },
  { value: 'entretenimiento', label: 'Entretenimiento', emoji: '🎮' },
  { value: 'salud',           label: 'Salud',           emoji: '💊' },
  { value: 'otros',           label: 'Otros',           emoji: '📦' },
];

// Colores por categoría para Chart.js
export const CATEGORIA_COLORS = {
  comida:          '#fb923c',
  transporte:      '#60a5fa',
  estudio:         '#a78bfa',
  entretenimiento: '#f472b6',
  salud:           '#34d399',
  otros:           '#94a3b8',
};

// Obtener emoji de una categoría
export const getCatEmoji = (cat) =>
  CATEGORIAS.find(c => c.value === cat)?.emoji || '📦';

// Obtener label de una categoría
export const getCatLabel = (cat) =>
  CATEGORIAS.find(c => c.value === cat)?.label || cat;
