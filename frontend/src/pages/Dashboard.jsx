// =============================================
// pages/Dashboard.jsx — Panel principal
// =============================================
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

import StatCard from '../components/common/StatCard';
import CurrencyWidget from '../components/common/CurrencyWidget';
import { gastosService } from '../services/api';
import {
  formatCOP,
  CATEGORIA_COLORS,
  getCatLabel,
  getCatEmoji,
  MESES,
} from '../services/utils';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// ─── Opciones globales de Chart.js ────────────
const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8',
        font: { family: 'DM Sans', size: 12 },
        padding: 16,
        usePointStyle: true,
        pointStyleWidth: 8,
      },
    },
    tooltip: {
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      borderWidth: 1,
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      padding: 12,
    },
  },
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await gastosService.getStats();
        setStats(res.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // ─── Datos gráfica de dona ─────────────────
  const donutData = stats?.porCategoria?.length
    ? {
        labels: stats.porCategoria.map(c => getCatLabel(c._id)),
        datasets: [{
          data: stats.porCategoria.map(c => c.total),
          backgroundColor: stats.porCategoria.map(c => `${CATEGORIA_COLORS[c._id]}cc`),
          borderColor: stats.porCategoria.map(c => CATEGORIA_COLORS[c._id]),
          borderWidth: 2,
          hoverOffset: 6,
        }],
      }
    : null;

  // ─── Datos gráfica de barras por mes ──────
  const barData = stats?.porMes?.length
    ? {
        labels: stats.porMes.map(m => `${MESES[m._id.mes - 1]} ${m._id.año}`),
        datasets: [{
          label: 'Gasto mensual (COP)',
          data: stats.porMes.map(m => m.total),
          backgroundColor: 'rgba(56,189,248,0.3)',
          borderColor: '#38bdf8',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        }],
      }
    : null;

  if (error) {
    return (
      <div className="alert alert-error" style={{ maxWidth: 600 }}>
        ⚠️ Error al cargar el dashboard: {error}
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ─── Encabezado ─────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Resumen financiero 💰
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/nuevo" className="btn btn-primary">+ Registrar gasto</Link>
      </div>

      {/* ─── KPIs ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard
          icon="💸"
          label="Total gastado"
          value={loading ? '—' : formatCOP(stats?.totalGeneral || 0)}
          sub="Histórico acumulado"
          color="var(--accent)"
          loading={loading}
        />
        <StatCard
          icon="📅"
          label="Gasto del mes"
          value={loading ? '—' : formatCOP(stats?.totalMes || 0)}
          sub={new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
          color="#fb923c"
          loading={loading}
        />
        <StatCard
          icon="🧾"
          label="Total gastos"
          value={loading ? '—' : stats?.cantidadGastos?.toLocaleString('es-CO') || '0'}
          sub="Registros en el sistema"
          color="#a78bfa"
          loading={loading}
        />
        <StatCard
          icon="📊"
          label="Categorías activas"
          value={loading ? '—' : stats?.porCategoria?.length || '0'}
          sub="Con al menos un gasto"
          color="#34d399"
          loading={loading}
        />
      </div>

      {/* ─── Gráficas ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>

        {/* Dona por categoría */}
        <div className="card">
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            Gastos por categoría
          </h2>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : donutData ? (
            <div style={{ height: 280 }}>
              <Doughnut
                data={donutData}
                options={{
                  ...CHART_DEFAULTS,
                  cutout: '65%',
                  plugins: {
                    ...CHART_DEFAULTS.plugins,
                    tooltip: {
                      ...CHART_DEFAULTS.plugins.tooltip,
                      callbacks: {
                        label: (ctx) => ` ${formatCOP(ctx.raw)}`,
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📊</span>
              <p>Sin datos de categorías aún</p>
            </div>
          )}
        </div>

        {/* Barras por mes */}
        <div className="card">
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            Evolución mensual (últimos 6 meses)
          </h2>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : barData ? (
            <div style={{ height: 280 }}>
              <Bar
                data={barData}
                options={{
                  ...CHART_DEFAULTS,
                  scales: {
                    x: {
                      grid: { color: '#334155', drawBorder: false },
                      ticks: { color: '#94a3b8', font: { family: 'DM Sans', size: 11 } },
                    },
                    y: {
                      grid: { color: '#334155', drawBorder: false },
                      ticks: {
                        color: '#94a3b8',
                        font: { family: 'DM Sans', size: 11 },
                        callback: (v) => `$${(v / 1000).toFixed(0)}k`,
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📈</span>
              <p>Sin datos mensuales aún</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Detalle por categoría + Conversión ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>

        {/* Tabla de categorías */}
        <div className="card">
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            Detalle por categoría
          </h2>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : stats?.porCategoria?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {stats.porCategoria.map(({ _id, total, cantidad }) => {
                const pct = stats.totalGeneral > 0
                  ? ((total / stats.totalGeneral) * 100).toFixed(1)
                  : 0;
                const color = CATEGORIA_COLORS[_id] || '#94a3b8';
                return (
                  <div key={_id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span>{getCatEmoji(_id)}</span>
                        <span style={{ textTransform: 'capitalize' }}>{getCatLabel(_id)}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          ({cantidad} {cantidad === 1 ? 'gasto' : 'gastos'})
                        </span>
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color }}>
                        {pct}%
                      </span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                      {formatCOP(total)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay gastos registrados aún</p>
              <Link to="/nuevo" className="btn btn-primary">Registrar mi primer gasto</Link>
            </div>
          )}
        </div>

        {/* Widget de conversión */}
        <CurrencyWidget montoCOP={stats?.totalGeneral || 0} />
      </div>
    </div>
  );
}
