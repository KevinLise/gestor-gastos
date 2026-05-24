// ============================================
// DASHBOARD — Estadísticas + Gráficas
// ============================================

import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import { useApp } from '../context/AppContext.jsx'
import { CATEGORIAS, MESES } from '../utils/constants.js'
import {
  formatCOP,
  gastosDelMes,
  totalGastos,
  groupByCategoria,
  getCategoriaLabel,
  getCategoriaEmoji,
} from '../utils/helpers.js'
import './Dashboard.css'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

// Opciones chart comunes
const chartFont = { family: "'DM Sans', sans-serif" }

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#9898c0',
        font: { ...chartFont, size: 12 },
        padding: 16,
        usePointStyle: true,
        pointStyleWidth: 8,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${formatCOP(ctx.parsed)}`,
      },
    },
  },
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${formatCOP(ctx.parsed.y)}`,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#9898c0', font: chartFont },
      grid: { color: 'rgba(42, 42, 92, 0.5)' },
    },
    y: {
      ticks: {
        color: '#9898c0',
        font: chartFont,
        callback: (v) => `$${(v / 1000).toFixed(0)}k`,
      },
      grid: { color: 'rgba(42, 42, 92, 0.5)' },
      border: { dash: [4, 4] },
    },
  },
}

// Últimos 6 meses
function last6Months() {
  const months = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = `${MESES[d.getMonth()].slice(0, 3)}`
    months.push({ key, label })
  }
  return months
}

export default function Dashboard() {
  const { gastos, setView } = useApp()

  const mes = useMemo(() => gastosDelMes(gastos), [gastos])
  const totalTotal = useMemo(() => totalGastos(gastos), [gastos])
  const totalMes   = useMemo(() => totalGastos(mes), [mes])

  // Datos para doughnut
  const byCategoria = useMemo(() => groupByCategoria(gastos), [gastos])
  const doughnutData = useMemo(() => {
    const labels = CATEGORIAS.filter(c => byCategoria[c.id]).map(c => `${c.emoji} ${c.label}`)
    const data   = CATEGORIAS.filter(c => byCategoria[c.id]).map(c => byCategoria[c.id])
    const colors = CATEGORIAS.filter(c => byCategoria[c.id]).map(c => c.color)
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.map(c => c + 'cc'),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 6,
      }],
    }
  }, [byCategoria])

  // Datos para bar (últimos 6 meses)
  const barData = useMemo(() => {
    const months = last6Months()
    const totals = months.map(m =>
      gastos
        .filter(g => g.fecha.startsWith(m.key))
        .reduce((acc, g) => acc + g.monto, 0)
    )
    return {
      labels: months.map(m => m.label),
      datasets: [{
        data: totals,
        backgroundColor: 'rgba(108, 99, 255, 0.5)',
        borderColor: '#6c63ff',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(108, 99, 255, 0.8)',
      }],
    }
  }, [gastos])

  // Top categoría del mes
  const topCategoria = useMemo(() => {
    const byMes = groupByCategoria(mes)
    return Object.entries(byMes).sort((a, b) => b[1] - a[1])[0] || null
  }, [mes])

  const hasData = gastos.length > 0

  return (
    <div className="dashboard animate-fadeInUp">
      {/* Stats */}
      <section className="dashboard__stats">
        <StatCard
          icon=""
          label="Total Acumulado"
          value={formatCOP(totalTotal)}
          accent="purple"
          sub={`${gastos.length} gastos registrados`}
        />
        <StatCard
          icon=""
          label="Gastos del Mes"
          value={formatCOP(totalMes)}
          accent="cyan"
          sub={`${mes.length} transacciones`}
        />
        <StatCard
          icon=""
          label="Núm. de Gastos"
          value={gastos.length}
          accent="green"
          sub="Total histórico"
        />
        <StatCard
          icon={topCategoria ? getCategoriaEmoji(topCategoria[0]) : ''}
          label="Top Categoría"
          value={topCategoria ? getCategoriaLabel(topCategoria[0]) : '—'}
          accent="pink"
          sub={topCategoria ? formatCOP(topCategoria[1]) + ' este mes' : 'Sin datos'}
        />
      </section>

      {/* Charts */}
      {hasData ? (
        <section className="dashboard__charts">
          <div className="chart-card">
            <h3 className="chart-card__title">Distribución por Categoría</h3>
            <div className="chart-card__canvas" style={{ height: 280 }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>

          <div className="chart-card chart-card--wide">
            <h3 className="chart-card__title">Evolución Mensual</h3>
            <div className="chart-card__canvas" style={{ height: 280 }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </section>
      ) : (
        <div className="dashboard__empty">
          <div className="dashboard__empty-icon"></div>
          <h3>Aún no hay gastos registrados</h3>
          <p>Comienza agregando tu primer gasto para ver las estadísticas</p>
          <button
            className="btn btn--primary"
            onClick={() => setView('agregar')}
          >
            + Agregar primer gasto
          </button>
        </div>
      )}

      {/* Últimos gastos */}
      {gastos.length > 0 && <RecentGastos gastos={gastos} />}
    </div>
  )
}

// ---- Sub-components ----

function StatCard({ icon, label, value, accent, sub }) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__sub">{sub}</span>
      </div>
    </div>
  )
}

function RecentGastos({ gastos }) {
  const { setView, setEditing } = useApp()
  const recent = [...gastos]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 5)

  return (
    <section className="recent-gastos">
      <div className="recent-gastos__header">
        <h3>Gastos Recientes</h3>
        <button className="btn btn--ghost btn--sm" onClick={() => setView('historial')}>
          Ver todos →
        </button>
      </div>
      <ul className="recent-gastos__list">
        {recent.map(g => {
          const cat = CATEGORIAS.find(c => c.id === g.categoria) || CATEGORIAS[5]
          return (
            <li key={g.id} className="recent-item" onClick={() => setEditing(g)}>
              <span className="recent-item__emoji">{cat.emoji}</span>
              <div className="recent-item__info">
                <span className="recent-item__name">{g.nombre}</span>
                <span className="recent-item__meta">{cat.label} · {g.fecha}</span>
              </div>
              <span className="recent-item__monto">{formatCOP(g.monto)}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
