// =============================================
// components/common/CurrencyWidget.jsx
// Muestra conversión de total en COP a USD y EUR
// =============================================
import React from 'react';
import useCurrency from '../../hooks/useCurrency';
import { formatCOP, formatUSD, formatEUR } from '../../services/utils';

const CurrencyWidget = ({ montoCOP }) => {
  const { rates, loading, error, convertCOP } = useCurrency();

  const converted = convertCOP(montoCOP);

  return (
    <div
      className="card"
      style={{
        background: 'linear-gradient(135deg, #0f2744 0%, #1e293b 100%)',
        border: '1px solid #1d4ed833',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1rem' }}>🌐</span>
        <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Conversión de moneda</span>
        {!loading && !error && rates && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.6875rem',
              background: 'rgba(52,211,153,0.15)',
              color: 'var(--success)',
              padding: '2px 8px',
              borderRadius: 100,
            }}
          >
            En vivo
          </span>
        )}
      </div>

      {/* Monto COP */}
      <div style={{ marginBottom: '1rem', padding: '0.875rem', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
          Total en pesos colombianos
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
          {formatCOP(montoCOP)}
        </div>
      </div>

      {loading && (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>
          Obteniendo tasas...
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ fontSize: '0.8125rem' }}>
          ⚠️ No se pudieron cargar las tasas de cambio
        </div>
      )}

      {!loading && !error && rates && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {/* USD */}
          <div style={{
            padding: '0.875rem',
            background: 'rgba(56,189,248,0.08)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(56,189,248,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
              <span style={{ fontSize: '1rem' }}>🇺🇸</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>USD</span>
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
              {formatUSD(converted.USD)}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              1 COP = {rates.USD?.toFixed(6)} USD
            </div>
          </div>

          {/* EUR */}
          <div style={{
            padding: '0.875rem',
            background: 'rgba(167,139,250,0.08)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(167,139,250,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
              <span style={{ fontSize: '1rem' }}>🇪🇺</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>EUR</span>
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#a78bfa' }}>
              {formatEUR(converted.EUR)}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              1 COP = {rates.EUR?.toFixed(6)} EUR
            </div>
          </div>
        </div>
      )}

      {!loading && rates && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'right' }}>
          Fuente: exchangerate-api.com · {rates.lastUpdate ? new Date(rates.lastUpdate).toLocaleDateString('es-CO') : 'hoy'}
        </div>
      )}
    </div>
  );
};

export default CurrencyWidget;
