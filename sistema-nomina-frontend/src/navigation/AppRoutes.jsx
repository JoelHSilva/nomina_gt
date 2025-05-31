import React from 'react';
import RutaPrivada from './Rutaprivada';


import { Routes, Route, Navigate } from 'react-router-dom';



import Login from '../pages/Login.jsx'; // Importa el componente de Login

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
import ReporteDetalleNomina from '../pages/ReporteDetalleNomina.jsx';







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

import ModViaticosPage from '../pages/modviaticos/ModViaticosPage'; // Importa la página de viáticos

function AppRoutes() {
  const usuario = JSON.parse(localStorage.getItem('usuario')); // Lee el usuario autenticado

  return (
    <Routes>

      {/* Ruta pública para login */}
      <Route path="/login" element={<Login />} />


      {/* Rutas principales */}
      {/* Rutas principales */}
      <Route path="/" element={usuario ? <HomePage /> : <Navigate to="/login" replace />} />
      <Route path="/departamentos" element={<RutaPrivada><DepartamentosPage /></RutaPrivada>} />
      <Route path="/empleados" element={<RutaPrivada><EmpleadosPage /></RutaPrivada>} />
      <Route path="/logs" element={<RutaPrivada><LogsSistemaPage /></RutaPrivada>} />

       {/* Rutas de Nómina */}
<<<<<<< HEAD
       <Route path="/nominas" element={<RutaPrivada><NominasPage /></RutaPrivada>} />
       <Route path="/nominas/:id" element={<RutaPrivada><DetalleNominaPage /></RutaPrivada>} />

=======
       <Route path="/nominas" element={<NominasPage />} />
       <Route path="/nominas/:id" element={<DetalleNominaPage />} />
       <Route path="/reportes/nomina/:id" element={<ReporteDetalleNomina />} />
>>>>>>> 84e9421a18003556d595363d5bcfdd710689d463

       {/* Ruta de Puestos */}
       <Route path="/puestos" element={<RutaPrivada><PuestosPage /></RutaPrivada>} /> {/* <-- Ruta para la gestión de Puestos */}

      {/* Ruta de Periodos de Pago */}
       <Route path="/periodos-pago" element={<RutaPrivada><PeriodosPagoPage /></RutaPrivada>} /> {/* <-- Ruta para la gestión */}

       {/* Ruta de Conceptos de Pago */}
       <Route path="/conceptos-pago" element={<RutaPrivada><ConceptosPagoPage /></RutaPrivada>} /> {/* <-- Ruta para la gestión */}

        {/* Ruta de Configuración Fiscal */}
        <Route path="/configuracion-fiscal" element={<RutaPrivada><ConfiguracionFiscalPage /></RutaPrivada>} /> {/* <-- Ruta para la gestión */}

        {/* Ruta de Préstamos */}
        <Route path="/prestamos" element={<RutaPrivada><PrestamosPage /></RutaPrivada>} /> {/* <-- Ruta para la gestión */}

        {/* Ruta de Vacaciones */}
        <Route path="/vacaciones" element={<RutaPrivada><VacacionesPage /></RutaPrivada>} /> {/* <-- Ruta para la gestión */}

        {/* Ruta de Ausencias */}
        <Route path="/ausencias" element={<RutaPrivada><AusenciasPage /></RutaPrivada>} /> {/* <-- Ruta para la gestión */}


        {/* Ruta de Horas Extras */}
        <Route path="/horas-extras" element={<RutaPrivada><HorasExtrasPage /></RutaPrivada>} /> {/* <-- Ruta para la gestión */}

       {/* Rutas de Viáticos - Catálogos */}
       <Route path="/tipos-viaticos" element={<RutaPrivada><TiposViaticosPage /></RutaPrivada>} /> {/* <-- Ruta */}
       <Route path="/destinos-viaticos" element={<RutaPrivada><DestinosViaticosPage /></RutaPrivada>} /> {/* <-- Ruta */}

        {/* Ruta de Usuarios */}
        <Route path="/usuarios" element={<RutaPrivada><UsuariosPage /></RutaPrivada>} /> {/* <-- Ruta para la gestión */}


              {/* Ejemplo de ruta para la página de lista de detalles de nómina */}
       <Route path="/detalles-nomina" element={<RutaPrivada><DetalleNominaListPage /></RutaPrivada>} /> 

      {/* Ruta para la página de detalle de un DetalleNomina específico */}
      {/* El :id indica que esta parte de la URL es un parámetro */}
      <Route path="/detalles-nomina/:id" element={<RutaPrivada><DetalleNominaDetailPage /></RutaPrivada>} />
      <Route path="/liquidaciones" element={<RutaPrivada><LiquidacionList /></RutaPrivada>} />
      <Route path="/liquidaciones/nueva" element={<RutaPrivada><LiquidacionForm /></RutaPrivada>} />
      <Route path="/liquidaciones/:id" element={<RutaPrivada><LiquidacionDetail /></RutaPrivada>} />
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