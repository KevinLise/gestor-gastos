// ============================================
// STORAGE — Persistencia con localStorage
// ============================================

import { STORAGE_KEY, RATES_CACHE_KEY, RATES_TTL_MS } from './constants.js'

// ---------- Gastos ----------

export function loadGastos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveGastos(gastos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gastos))
  } catch (e) {
    console.error('Error saving gastos:', e)
  }
}

// ---------- Exchange rates cache ----------

export function loadRatesCache() {
  try {
    const raw = localStorage.getItem(RATES_CACHE_KEY)
    if (!raw) return null
    const { rates, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > RATES_TTL_MS) return null  // expirado
    return rates
  } catch {
    return null
  }
}

export function saveRatesCache(rates) {
  try {
    localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({
      rates,
      timestamp: Date.now(),
    }))
  } catch {}
}
