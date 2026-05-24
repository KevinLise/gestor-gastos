// ============================================
// CONSTANTS — Categorías, colores, config API
// ============================================

export const CATEGORIAS = [
  { id: 'comida',          label: 'Comida',          emoji: '', color: '#ff6b6b' },
  { id: 'transporte',      label: 'Transporte',      emoji: '', color: '#ffd43b' },
  { id: 'estudio',         label: 'Estudio',         emoji: '', color: '#74c0fc' },
  { id: 'entretenimiento', label: 'Entretenimiento', emoji: '', color: '#da77f2' },
  { id: 'salud',           label: 'Salud',           emoji: '', color: '#69db7c' },
  { id: 'otros',           label: 'Otros',           emoji: '', color: '#ffa94d' },
]

export const CATEGORIA_MAP = Object.fromEntries(
  CATEGORIAS.map(c => [c.id, c])
)

// ExchangeRate API — clave gratuita demo
// Para producción, obtén tu key gratis en https://www.exchangerate-api.com
export const EXCHANGE_API_KEY = 'e5306abf1d2f9635e79811f5'
export const EXCHANGE_API_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/COP`

export const DIVISAS_TARGET = ['USD', 'EUR']

export const STORAGE_KEY = 'gastosmart_expenses'
export const RATES_CACHE_KEY = 'gastosmart_rates_cache'
export const RATES_TTL_MS = 6 * 60 * 60 * 1000 // 6 horas

export const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
]

export const VIEWS = {
  DASHBOARD: 'dashboard',
  AGREGAR:   'agregar',
  HISTORIAL: 'historial',
  DIVISAS:   'divisas',
}
