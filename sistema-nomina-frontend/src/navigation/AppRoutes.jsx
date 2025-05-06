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
import DetalleNominaDetailPage from '../pages/DetalleNominaDetailPage';
import DetalleNominaListPage from '../pages/DetalleNominaListPage.jsx'; // <-- Importa la página de lista de detalles de nómina;









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
      {/* Rutas principales */}
      {/* Rutas principales */}
      <Route path="/" element={<HomePage />} />
      <Route path="/departamentos" element={<DepartamentosPage />} />
      <Route path="/empleados" element={<EmpleadosPage />} />
      <Route path="/logs" element={<LogsSistemaPage />} />

       {/* Rutas de Nómina */}
       <Route path="/nominas" element={<NominasPage />} />
       <Route path="/nominas/:id" element={<DetalleNominaPage />} />

       {/* Ruta de Puestos */}
       <Route path="/puestos" element={<PuestosPage />} /> {/* <-- Ruta para la gestión de Puestos */}

      {/* Ruta de Periodos de Pago */}
       <Route path="/periodos-pago" element={<PeriodosPagoPage />} /> {/* <-- Ruta para la gestión */}

       {/* Ruta de Conceptos de Pago */}
       <Route path="/conceptos-pago" element={<ConceptosPagoPage />} /> {/* <-- Ruta para la gestión */}

        {/* Ruta de Configuración Fiscal */}
        <Route path="/configuracion-fiscal" element={<ConfiguracionFiscalPage />} /> {/* <-- Ruta para la gestión */}

        {/* Ruta de Préstamos */}
        <Route path="/prestamos" element={<PrestamosPage />} /> {/* <-- Ruta para la gestión */}

        {/* Ruta de Vacaciones */}
        <Route path="/vacaciones" element={<VacacionesPage />} /> {/* <-- Ruta para la gestión */}

        {/* Ruta de Ausencias */}
        <Route path="/ausencias" element={<AusenciasPage />} /> {/* <-- Ruta para la gestión */}


        {/* Ruta de Horas Extras */}
        <Route path="/horas-extras" element={<HorasExtrasPage />} /> {/* <-- Ruta para la gestión */}

       {/* Rutas de Viáticos - Catálogos */}
       <Route path="/tipos-viaticos" element={<TiposViaticosPage />} /> {/* <-- Ruta */}
       <Route path="/destinos-viaticos" element={<DestinosViaticosPage />} /> {/* <-- Ruta */}

        {/* Ruta de Usuarios */}
        <Route path="/usuarios" element={<UsuariosPage />} /> {/* <-- Ruta para la gestión */}


              {/* Ejemplo de ruta para la página de lista de detalles de nómina */}
       <Route path="/detalles-nomina" element={<DetalleNominaListPage />} /> 

      {/* Ruta para la página de detalle de un DetalleNomina específico */}
      {/* El :id indica que esta parte de la URL es un parámetro */}
      <Route path="/detalles-nomina/:id" element={<DetalleNominaDetailPage />} />






      {/* Rutas para páginas no implementadas aún (pueden usar un placeholder genérico o 404 temporal) */}
      {/* Descomenta y reemplaza <HomePage /> con el componente real cuando lo crees */}
      {/* <Route path="/puestos" element={<PuestosPage />} /> */}
      {/* <Route path="/configuracion-fiscal" element={<ConfiguracionFiscalPage />} /> */}
      {/* <Route path="/conceptos-pago" element={<ConceptosPagoPage />} /> */}
      {/* <Route path="/periodos-pago" element={<PeriodosPagoPage />} /> */}
       {/* <Route path="/nominas" element={<NominasPage />} /> */}
       {/* <Route path="/nominas/:id" element={<DetalleNominaPage />} /> {/* Ejemplo de ruta con parámetro */}
       {/* <Route path="/prestamos" element={<PrestamosPage />} /> */}
       {/* <Route path="/pagos-prestamos" element={<PagosPrestamosPage />} /> */}
       {/* <Route path="/vacaciones" element={<VacacionesPage />} /> */}
       {/* <Route path="/ausencias" element={<AusenciasPage />} /> */}
       {/* <Route path="/horas-extras" element={<HorasExtrasPage />} /> */}
       {/* <Route path="/empleados/:id/historial-salarios" element={<HistorialSalariosPage />} /> {/* Ejemplo de ruta anidada */}
       {/* <Route path="/tipos-viaticos" element={<TiposViaticosPage />} /> */}
       {/* <Route path="/destinos-viaticos" element={<DestinosViaticosPage />} /> */}
       {/* <Route path="/tarifas-destino" element={<TarifasDestinoPage />} /> */}
       {/* <Route path="/politicas-viaticos-puesto" element={<PoliticasViaticosPuestoPage />} /> */}
       {/* <Route path="/solicitudes-viaticos" element={<SolicitudesViaticosPage />} /> */}
       {/* <Route path="/solicitudes-viaticos/:id/anticipos" element={<AnticiposViaticosPage />} /> */}
       {/* <Route path="/solicitudes-viaticos/:id/liquidacion" element={<LiquidacionViaticosPage />} /> */}
        {/* Rutas para detalle pueden ir dentro de la página principal o separadas si son complejas */}
       {/* <Route path="/solicitudes-viaticos/:id" element={<DetalleSolicitudViaticosPage />} /> */}
       {/* <Route path="/liquidacion-viaticos/:id" element={<DetalleLiquidacionViaticosPage />} /> */}

       {/* <Route path="/usuarios" element={<UsuariosPage />} /> */}


      {/* Ruta para 404 - siempre la última */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
