import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../Styles/styles.css';

function Navigation() {
  const navigate = useNavigate();

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
    { to: '/viaticos', label: 'Solicitud Viáticos'},
    // Puedes añadir enlaces a otras partes de viaticos
    // { to: '/solicitudes-viaticos', label: 'Solicitudes Viáticos' },

    { to: '/usuarios', label: 'Usuarios' }, // <-- Asegúrate de que este enlace está activo
    { to: '/logs', label: 'Logs' },
  ];

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <nav className="app-nav">
      <ul>
        {navLinks.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="nav-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="logout-container">
        <button onClick={logout} className="logout-button">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
