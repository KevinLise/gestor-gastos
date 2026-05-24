// =============================================
// App.jsx — Router principal de la aplicación
// =============================================
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Historial from './pages/Historial';
import NuevoGasto from './pages/NuevoGasto';
import EditarGasto from './pages/EditarGasto';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="historial" element={<Historial />} />
        <Route path="nuevo" element={<NuevoGasto />} />
        <Route path="editar/:id" element={<EditarGasto />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
