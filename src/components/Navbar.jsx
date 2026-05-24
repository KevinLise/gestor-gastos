// ============================================
// NAVBAR
// ============================================

import React from 'react'
import { useApp } from '../context/AppContext.jsx'
import { VIEWS } from '../utils/constants.js'
import './Navbar.css'

const NAV_ITEMS = [
  { view: VIEWS.DASHBOARD, label: 'Dashboard', icon: '' },
  { view: VIEWS.AGREGAR,   label: 'Agregar',   icon: '' },
  { view: VIEWS.HISTORIAL, label: 'Historial', icon: '' },
  { view: VIEWS.DIVISAS,   label: 'Divisas',   icon: '' },
]

export default function Navbar() {
  const { view, setView } = useApp()

  return (
    <nav className="navbar">
      <div className="navbar__inner container">
        <div className="navbar__brand" onClick={() => setView(VIEWS.DASHBOARD)}>
          <span className="navbar__logo">$</span>
          <span className="navbar__title">GastoSmart</span>
        </div>

        <ul className="navbar__links">
          {NAV_ITEMS.map(item => (
            <li key={item.view}>
              <button
                className={`navbar__link ${view === item.view ? 'active' : ''}`}
                onClick={() => setView(item.view)}
                aria-current={view === item.view ? 'page' : undefined}
              >
                <span className="navbar__link-icon">{item.icon}</span>
                <span className="navbar__link-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
