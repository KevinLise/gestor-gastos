// ============================================
// API — ExchangeRate-API (COP → USD, EUR)
// https://www.exchangerate-api.com
// ============================================

import { EXCHANGE_API_URL, DIVISAS_TARGET } from './constants.js'
import { loadRatesCache, saveRatesCache } from './storage.js'

/**
 * Obtiene tasas de cambio COP → otras divisas.
 * Usa caché de 6 horas para no agotar el plan gratuito.
 *
 * @returns {Promise<{USD: number, EUR: number}>}
 */
export async function fetchExchangeRates() {
  // 1. Intentar caché local
  const cached = loadRatesCache()
  if (cached) return cached

  // 2. Llamar a la API
  const response = await fetch(EXCHANGE_API_URL)

  if (!response.ok) {
    throw new Error(`ExchangeRate API error: ${response.status}`)
  }

  const data = await response.json()

  if (data.result !== 'success') {
    throw new Error(`API result: ${data['error-type'] || 'unknown error'}`)
  }

  const rates = {}
  for (const currency of DIVISAS_TARGET) {
    rates[currency] = data.conversion_rates[currency]
  }

  // 3. Cachear el resultado
  saveRatesCache(rates)

  return rates
}

/**
 * Convierte monto COP a la divisa indicada.
 *
 * @param {number} amountCOP
 * @param {number} rate - tasa de cambio (1 COP = rate X)
 * @returns {number}
 */
export function convertCOP(amountCOP, rate) {
  return amountCOP * rate
}
