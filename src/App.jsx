// ============================================
// APP — Root component
// ============================================

import React from 'react'
import { Toaster } from 'react-hot-toast'
import { AppProvider, useApp } from './context/AppContext.jsx'
import { VIEWS } from './utils/constants.js'
import Navbar from './components/Navbar.jsx'
import Dashboard from './components/Dashboard.jsx'
import GastoForm from './components/GastoForm.jsx'
import Historial from './components/Historial.jsx'
import Divisas from './components/Divisas.jsx'

function AppContent() {
  const { view } = useApp()

  const renderView = () => {
    switch (view) {
      case VIEWS.DASHBOARD: return <Dashboard />
      case VIEWS.AGREGAR:   return <GastoForm />
      case VIEWS.HISTORIAL: return <Historial />
      case VIEWS.DIVISAS:   return <Divisas />
      default:              return <Dashboard />
    }
  }

  return (
    <>
      <Navbar />
      <main className="container">
        {renderView()}
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#16163a',
            color: '#f0eeff',
            border: '1px solid #2a2a5c',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
            borderRadius: '12px',
          },
          success: {
            iconTheme: { primary: '#00e5b0', secondary: '#16163a' },
          },
          error: {
            iconTheme: { primary: '#ff6b9d', secondary: '#16163a' },
          },
        }}
      />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
