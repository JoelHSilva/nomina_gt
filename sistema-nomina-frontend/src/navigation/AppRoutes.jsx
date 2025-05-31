import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage.jsx';
import DepartamentosPage from '../pages/DepartamentosPage.jsx';
import EmpleadosPage from '../pages/EmpleadosPage.jsx';
import LogsSistemaPage from '../pages/LogsSistemaPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import NominasPage from '../pages/NominasPage.jsx';
import DetalleNominaPage from '../pages/DetalleNominaPage.jsx';
import PuestosPage from '../pages/PuestosPage.jsx';
import PeriodosPagoPage from '../pages/PeriodosPagoPage.jsx';
import ConceptosPagoPage from '../pages/ConceptosPagoPage.jsx';
import ConfiguracionFiscalPage from '../pages/ConfiguracionFiscalPage.jsx';
import PrestamosPage from '../pages/PrestamosPage.jsx';
import VacacionesPage from '../pages/VacacionesPage.jsx';
import AusenciasPage from '../pages/AusenciasPage.jsx';
import HorasExtrasPage from '../pages/HorasExtrasPage.jsx';
import TiposViaticosPage from '../pages/TiposViaticosPage.jsx';
import DestinosViaticosPage from '../pages/DestinosViaticosPage.jsx';
import UsuariosPage from '../pages/UsuariosPage.jsx';
import DetalleNominaDetailPage from '../pages/DetalleNominaDetailPage';
import DetalleNominaListPage from '../pages/DetalleNominaListPage.jsx';
import LiquidacionList from '../components/Forms/LiquidacionList';
import LiquidacionForm from '../components/Forms/LiquidacionForm';
import LiquidacionDetail from '../pages/LiquidacionDetail';
import ModViaticosPage from '../pages/modviaticos/ModViaticosPage'; // Importa la página de viáticos

function AppRoutes() {
  const usuario = JSON.parse(localStorage.getItem('usuario')); // Lee el usuario autenticado

  return (
    <Routes>
      {/* Rutas principales */}
      <Route path="/" element={<HomePage />} />
      <Route path="/departamentos" element={<DepartamentosPage />} />
      <Route path="/empleados" element={<EmpleadosPage />} />
      <Route path="/logs" element={<LogsSistemaPage />} />
      <Route path="/nominas" element={<NominasPage />} />
      <Route path="/nominas/:id" element={<DetalleNominaPage />} />
      <Route path="/puestos" element={<PuestosPage />} />
      <Route path="/periodos-pago" element={<PeriodosPagoPage />} />
      <Route path="/conceptos-pago" element={<ConceptosPagoPage />} />
      <Route path="/configuracion-fiscal" element={<ConfiguracionFiscalPage />} />
      <Route path="/prestamos" element={<PrestamosPage />} />
      <Route path="/vacaciones" element={<VacacionesPage />} />
      <Route path="/ausencias" element={<AusenciasPage />} />
      <Route path="/horas-extras" element={<HorasExtrasPage />} />
      <Route path="/tipos-viaticos" element={<TiposViaticosPage />} />
      <Route path="/destinos-viaticos" element={<DestinosViaticosPage />} />
      <Route path="/usuarios" element={<UsuariosPage />} />
      <Route path="/detalles-nomina" element={<DetalleNominaListPage />} />
      <Route path="/detalles-nomina/:id" element={<DetalleNominaDetailPage />} />
      <Route path="/liquidaciones" element={<LiquidacionList />} />
      <Route path="/liquidaciones/nueva" element={<LiquidacionForm />} />
      <Route path="/liquidaciones/:id" element={<LiquidacionDetail />} />
      
      {/* Nueva ruta para el módulo de viáticos */}
      <Route path="/viaticos/*" element={<ModViaticosPage />} />

      {/* Ruta para 404 - siempre la última */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;