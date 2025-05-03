// src/navigation/AppRoutes.jsx
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
import PeriodosPagoPage from '../pages/PeriodosPagoPage.jsx'; // <-- Importa la página de Periodos de Pago
import ConceptosPagoPage from '../pages/ConceptosPagoPage.jsx'; // <-- Importa la página de Conceptos de Pago
import ConfiguracionFiscalPage from '../pages/ConfiguracionFiscalPage.jsx'; // <-- Importa la página
import PrestamosPage from '../pages/PrestamosPage.jsx'; // <-- Importa la página de Préstamos
import VacacionesPage from '../pages/VacacionesPage.jsx'; // <-- Importa la página
import AusenciasPage from '../pages/AusenciasPage.jsx'; // <-- Importa la página
import HorasExtrasPage from '../pages/HorasExtrasPage.jsx'; // <-- Importa la página
import TiposViaticosPage from '../pages/TiposViaticosPage.jsx'; // <-- Importa
import DestinosViaticosPage from '../pages/DestinosViaticosPage.jsx'; // <-- Importa
import UsuariosPage from '../pages/UsuariosPage.jsx'; // <-- Importa la página
import ReportePagos from '../pages/ReportePagos.jsx';






// Importa los placeholders o futuras páginas
// import PuestosPage from '../pages/PuestosPage';
// import ConfiguracionFiscalPage from '../pages/ConfiguracionFiscalPage';
// import ConceptosPagoPage from '../pages/ConceptosPagoPage';
// import PeriodosPagoPage from '../pages/PeriodosPagoPage';
// import NominasPage from '../pages/NominasPage';
// import DetalleNominaPage from '../pages/DetalleNominaPage';
// import PrestamosPage from '../pages/PrestamosPage';
// import PagosPrestamosPage from '../pages/PagosPrestamosPage';
// import VacacionesPage from '../pages/VacacionesPage';
// import AusenciasPage from '../pages/AusenciasPage';
// import HorasExtrasPage from '../pages/HorasExtrasPage';
// import HistorialSalariosPage from '../pages/HistorialSalariosPage';
// import TiposViaticosPage from '../pages/TiposViaticosPage';
// import DestinosViaticosPage from '../pages/DestinosViaticosPage';
// import TarifasDestinoPage from '../pages/TarifasDestinoPage';
// import PoliticasViaticosPuestoPage from '../pages/PoliticasViaticosPuestoPage';
// import SolicitudesViaticosPage from '../pages/SolicitudesViaticosPage';
// import AnticiposViaticosPage from '../pages/AnticiposViaticosPage';
// import LiquidacionViaticosPage from '../pages/LiquidacionViaticosPage';
// import DetalleSolicitudViaticosPage from '../pages/DetalleSolicitudViaticosPage';
// import DetalleLiquidacionViaticosPage from '../pages/DetalleLiquidacionViaticosPage';
// import UsuariosPage from '../pages/UsuariosPage';


function AppRoutes() {
  const usuario = JSON.parse(localStorage.getItem('usuario')); // Lee el usuario autenticado

  return (
    <Routes>
      {/* Ruta pública para login */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas: solo si hay usuario logueado */}
      {usuario ? (
        <>
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
          <Route path="*" element={<NotFoundPage />} />
        </>
      ) : (
        // Si no está logueado, redirige cualquier otra ruta a login
        <Route path="*" element={<Login />} />
      )}
    </Routes>
  );
}

export default AppRoutes;
