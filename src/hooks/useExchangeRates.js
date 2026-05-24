// ============================================
// HOOK — useExchangeRates
// ============================================

import { useState, useEffect } from 'react'
import { fetchExchangeRates } from '../utils/exchangeApi.js'

export function useExchangeRates() {
  const [rates, setRates]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await fetchExchangeRates()
      setRates(r)
      setLastUpdate(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return { rates, loading, error, refetch: load, lastUpdate }
}
