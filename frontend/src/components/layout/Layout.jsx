// =============================================
// components/layout/Layout.jsx
// =============================================
import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import '../../styles/Layout.css';

const NAV_ITEMS = [
  { path: '/',         label: 'Dashboard',  icon: '' },
  { path: '/historial',label: 'Historial',  icon: '' },
  { path: '/nuevo',    label: 'Nuevo gasto',icon: '' },
];

const PAGE_TITLES = {
  '/':          'Dashboard',
  '/historial': 'Historial de Gastos',
  '/nuevo':     'Registrar Gasto',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle = Object.entries(PAGE_TITLES).find(
    ([path]) => location.pathname === path || location.pathname.startsWith('/editar')
  )?.[1] || (location.pathname.startsWith('/editar') ? 'Editar Gasto' : 'Página');

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout">
      {/* ─── Sidebar ─────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"></div>
          <div className="sidebar-logo-title">Gestor de Gastos</div>
          <div className="sidebar-logo-sub">Finanzas personales</div>
        </div>

        <nav className="sidebar-nav" aria-label="Navegación principal">
          <span className="nav-label">Menú</span>

          {NAV_ITEMS.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>v1.0.0 · COP → USD, EUR</p>
        </div>
      </aside>

      {/* Overlay móvil */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* ─── Contenido principal ──────────── */}
      <div className="main-wrapper">
        {/* Navbar */}
        <header className="navbar">
          <div className="navbar-left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <span className="navbar-page-title">{pageTitle}</span>
          </div>

          <div className="navbar-right">
            <Link to="/nuevo" className="btn btn-primary" style={{ fontSize: '0.8125rem' }}>
              + Nuevo gasto
            </Link>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
