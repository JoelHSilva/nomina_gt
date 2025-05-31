import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/styles.css'; // Asegúrate de importar el CSS aquí

const Login = () => {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.fontFamily = `'Poppins', sans-serif`;
    document.body.style.background = 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)';
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/v1/usuarios/login', {
        nombre_usuario,
        contrasena
      });
      localStorage.setItem('usuario', JSON.stringify(response.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-header">Bienvenido al Sistema de Nóminas</h1>
        <h2 className="login-title">Iniciar Sesión</h2>
        <p className="login-subtitle">Por favor ingresa tus credenciales</p>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Usuario"
            value={nombre_usuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
