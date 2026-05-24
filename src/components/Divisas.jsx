// ============================================
// DIVISAS — Conversión COP → USD / EUR
// Usa ExchangeRate-API (https://www.exchangerate-api.com)
// ============================================

import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useExchangeRates } from '../hooks/useExchangeRates.js'
import { convertCOP, formatCOP, formatCurrency, totalGastos, gastosDelMes } from '../utils/helpers.js'
import { CATEGORIAS } from '../utils/constants.js'
import './Divisas.css'

export default function Divisas() {
  const { gastos } = useApp()
  const { rates, loading, error, refetch, lastUpdate } = useExchangeRates()

  const [montoInput, setMontoInput] = useState('')
  const [divisaTarget, setDivisaTarget] = useState('USD')

  const totalAcum = useMemo(() => totalGastos(gastos), [gastos])
  const totalMes  = useMemo(() => totalGastos(gastosDelMes(gastos)), [gastos])

  const montoNum = parseFloat(montoInput.replace(/\./g, '').replace(',', '.')) || 0

  const convertido = rates && montoNum > 0
    ? formatCurrency(convertCOP(montoNum, rates[divisaTarget]), divisaTarget)
    : null

  const FLAG = { USD: '🇺🇸', EUR: '🇪🇺' }

  return (
    <div className="divisas animate-fadeInUp">
      <div className="divisas__header">
        <h2 className="divisas__title">💱 Conversor de Divisas</h2>
        <p className="divisas__sub">
          Tasas en tiempo real vía{' '}
          <a
            href="https://www.exchangerate-api.com"
            target="_blank"
            rel="noopener noreferrer"
            className="divisas__link"
          >
            ExchangeRate API
          </a>
        </p>
      </div>

      {/* API Status banner */}
      {loading && (
        <div className="api-banner api-banner--loading">
          <span className="loader" />
          Consultando tasas de cambio...
        </div>
      )}
      {error && (
        <div className="api-banner api-banner--error">
           Error al obtener tasas: {error}
          <button className="btn btn--ghost btn--sm" onClick={refetch}>Reintentar</button>
        </div>
      )}
      {!loading && !error && rates && (
        <div className="api-banner api-banner--success">
           Tasas actualizadas
          {lastUpdate && ` · ${lastUpdate.toLocaleTimeString('es-CO')}`}
          <button className="btn btn--ghost btn--sm" onClick={refetch} style={{ marginLeft: 'auto' }}>
             Actualizar
          </button>
        </div>
      )}

      <div className="divisas__grid">
        {/* Conversor manual */}
        <div className="divisas-card">
          <h3 className="divisas-card__title">Convertir Monto</h3>

          <div className="divisas-form">
            <div className="divisas-input-group">
              <label className="divisas-label">Monto en COP</label>
              <div className="input-with-prefix">
                <span className="input-prefix" style={{ color: 'var(--accent-orange)' }}>$</span>
                <input
                  type="number"
                  className="form-input form-input--prefixed"
                  placeholder="50000"
                  value={montoInput}
                  onChange={e => setMontoInput(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <div className="divisas-arrow">→</div>

            <div className="divisas-input-group">
              <label className="divisas-label">Convertir a</label>
              <div className="divisas-target-btns">
                {['USD', 'EUR'].map(div => (
                  <button
                    key={div}
                    className={`target-btn ${divisaTarget === div ? 'active' : ''}`}
                    onClick={() => setDivisaTarget(div)}
                  >
                    {FLAG[div]} {div}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {montoNum > 0 && rates && (
            <div className="conversion-result">
              <div className="conversion-result__from">
                {formatCOP(montoNum)}
              </div>
              <div className="conversion-result__equals">=</div>
              <div className="conversion-result__to">
                {formatCurrency(convertCOP(montoNum, rates[divisaTarget]), divisaTarget)}
                <span className="conversion-result__flag">{FLAG[divisaTarget]}</span>
              </div>
              <div className="conversion-result__rate">
                Tasa: 1 COP = {rates[divisaTarget].toFixed(6)} {divisaTarget}
              </div>
            </div>
          )}

          {!rates && !loading && (
            <div className="conversion-unavailable">
              Tasas no disponibles. Verifica tu conexión.
            </div>
          )}
        </div>

        {/* Tasas actuales */}
        {rates && (
          <div className="divisas-card">
            <h3 className="divisas-card__title">Tasas Actuales (base: COP)</h3>
            <div className="rates-list">
              {Object.entries(rates).map(([currency, rate]) => (
                <div key={currency} className="rate-item">
                  <span className="rate-item__flag">{FLAG[currency] || '🌍'}</span>
                  <div className="rate-item__info">
                    <span className="rate-item__currency">{currency}</span>
                    <span className="rate-item__name">
                      {currency === 'USD' ? 'Dólar Estadounidense' : 'Euro'}
                    </span>
                  </div>
                  <span className="rate-item__value">{rate.toFixed(6)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumen en otras divisas */}
        {rates && gastos.length > 0 && (
          <div className="divisas-card divisas-card--full">
            <h3 className="divisas-card__title">Tus Gastos en Otras Monedas</h3>
            <div className="resumen-divisas">
              <ResumenRow
                label="Total acumulado"
                cop={totalAcum}
                rates={rates}
              />
              <ResumenRow
                label="Gastos este mes"
                cop={totalMes}
                rates={rates}
              />

              {/* Por categoría */}
              {CATEGORIAS.map(cat => {
                const total = gastos
                  .filter(g => g.categoria === cat.id)
                  .reduce((a, g) => a + g.monto, 0)
                if (total === 0) return null
                return (
                  <ResumenRow
                    key={cat.id}
                    label={`${cat.emoji} ${cat.label}`}
                    cop={total}
                    rates={rates}
                    small
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---- ResumenRow ----

function ResumenRow({ label, cop, rates, small }) {
  return (
    <div className={`resumen-row ${small ? 'resumen-row--small' : ''}`}>
      <span className="resumen-row__label">{label}</span>
      <div className="resumen-row__values">
        <span className="resumen-row__cop">{formatCOP(cop)}</span>
        {Object.entries(rates).map(([cur, rate]) => (
          <span key={cur} className={`resumen-row__converted resumen-row__converted--${cur.toLowerCase()}`}>
            {formatCurrency(convertCOP(cop, rate), cur)}
          </span>
        ))}
      </div>
    </div>
  )
}
