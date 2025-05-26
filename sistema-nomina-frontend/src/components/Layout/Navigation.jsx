// src/components/Layout/Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/departamentos', label: 'Departamentos' },
    { to: '/puestos', label: 'Puestos' },
    { to: '/empleados', label: 'Empleados' },
    { to: '/nominas', label: 'Nóminas' },
    { to: '/liquidaciones', label: 'Liquidaciones' },
    { to: '/periodos-pago', label: 'Periodos de Pago' },
    { to: '/conceptos-pago', label: 'Conceptos de Pago' },
    { to: '/configuracion-fiscal', label: 'Configuración Fiscal' },
    { to: '/prestamos', label: 'Préstamos' },
    { to: '/vacaciones', label: 'Vacaciones' },
    { to: '/ausencias', label: 'Ausencias' },
    { to: '/horas-extras', label: 'Horas Extras' },
    { to: '/tipos-viaticos', label: 'Tipos Viáticos' },
    { to: '/destinos-viaticos', label: 'Destinos Viáticos' },
    { to: '/detalles-nomina', label: 'Detalles Nómina' },
    // Puedes añadir enlaces a otras partes de viaticos
    // { to: '/solicitudes-viaticos', label: 'Solicitudes Viáticos' },

    { to: '/usuarios', label: 'Usuarios' }, // <-- Asegúrate de que este enlace está activo
    { to: '/logs', label: 'Logs' },
    // Agrega/descomenta más enlaces según las páginas que implementes
  ];

  return (
    <nav className="app-nav">
      <ul className="app-nav-list">
        {navLinks.map((link) => (
          <li key={link.to}>
            <Link to={link.to}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;