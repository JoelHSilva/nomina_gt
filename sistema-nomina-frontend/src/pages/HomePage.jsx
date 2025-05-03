import React from 'react';
import { useNavigate } from 'react-router-dom'; // Para la redirección

function HomePage() {
  const navigate = useNavigate();  // Usamos useNavigate para redirigir en v6

  const logout = () => {
    localStorage.removeItem('authToken'); // Elimina el token del localStorage
    navigate('/login'); // Redirige a la página de login
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Bienvenido al Sistema de Nómina Guatemalteca</h2>
      <p>Utiliza el menú de navegación para acceder a las diferentes secciones del sistema.</p>
      
      {/* Contenedor con el botón de logout */}
      <div>
        <button onClick={logout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>
    </div>
  );
}

// Estilo para el botón de logout
const logoutButtonStyle = {
  backgroundColor: '#f44336', /* Rojo */
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px', // Agrega un margen superior para separar el botón
};

export default HomePage;
