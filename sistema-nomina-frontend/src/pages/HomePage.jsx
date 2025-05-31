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
      

    </div>
  );
}



export default HomePage;
