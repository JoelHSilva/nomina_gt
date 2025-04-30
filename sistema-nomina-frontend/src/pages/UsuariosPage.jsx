// src/pages/UsuariosPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import UsuarioForm from '../components/Forms/UsuarioForm.jsx'; // Importa el formulario específico

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null); // Usuario seleccionado para editar

  // Columnas para la tabla de Usuarios
  const columns = [
    { key: 'id_usuario', title: 'ID' },
    { key: 'nombre_usuario', title: 'Nombre de Usuario' },
    { key: 'rol', title: 'Rol' },
    // { key: 'id_empleado', title: 'ID Empleado' }, // Mostrar nombre empleado si unes
     // Asumiendo que el backend une el nombre del empleado si está asociado
    { key: 'empleado_nombre_completo', title: 'Empleado Asociado', render: (value) => value || 'N/A' },
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'ultimo_login', title: 'Último Login', render: (value) => value ? new Date(value).toLocaleString() : 'N/A' },
    { // Columna de acciones
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => ( // item es el objeto completo del usuario
        <>
          <Button onClick={() => handleEdit(item)} className="app-button" style={{ marginRight: '5px' }}>Editar</Button>
           {/* Considera si se permite eliminar usuarios o solo desactivarlos */}
          <Button onClick={() => handleDelete(item.id_usuario)} className="app-button-danger">Eliminar</Button>
           {/* Opcional: Botón para cambiar contraseña (requiere funcionalidad backend) */}
           {/* <Button onClick={() => handleChangePassword(item.id_usuario)} style={{ marginLeft: '5px' }}>Cambiar Contraseña</Button> */}
        </>
      ),
    },
  ];

  // --- Carga de datos ---
  useEffect(() => {
    fetchUsuarios();
  }, []); // Se ejecuta solo una vez al montar

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
       // Asegúrate de que tu backend une el nombre completo del empleado si está asociado al usuario
      const data = await api.getAll('USUARIOS'); // Usar la clave string
      setUsuarios(data);
    } catch (err) {
      setError('Error al cargar los usuarios.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Manejo de Modal y Formulario ---
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUsuario(null); // Limpiar el usuario de edición al cerrar
  };

  const handleCreate = () => {
    setEditingUsuario(null); // Asegurarse de que no estamos editando
    openModal();
  };

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario); // Cargar datos en el formulario
    openModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingUsuario) {
        // Actualizar usuario existente
        await api.update('USUARIOS', editingUsuario.id_usuario, formData); // Usar la clave string
        console.log('Usuario actualizado:', formData);
      } else {
        // Crear nuevo usuario
         // La contraseña se maneja en el formulario, se envía si está presente
        await api.create('USUARIOS', formData); // Usar la clave string
        console.log('Usuario creado:', formData);
      }
      closeModal(); // Cerrar modal después de guardar
      fetchUsuarios(); // Recargar la lista de usuarios
    } catch (err) {
      setError('Error al guardar el usuario.'); // Manejo de error básico
      console.error('Error al guardar usuario:', err.response?.data || err.message);
       // Mostrar mensaje de error al usuario (ej: con un estado o librería de notificaciones)
    } finally {
       setLoading(false);
    }
  };

  // --- Manejo de Eliminación ---
  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar el usuario con ID ${id}?`)) {
      try {
        setLoading(true);
        await api.remove('USUARIOS', id); // Usar la clave string
        console.log('Usuario eliminado:', id);
        fetchUsuarios(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el usuario.'); // Manejo de error básico
        console.error('Error al eliminar usuario:', err.response?.data || err.message);
         // Mostrar mensaje de error al usuario
      } finally {
         setLoading(false);
      }
    }
  };

    // --- Manejo de Cambio de Contraseña (Requiere funcionalidad backend) ---
    // Si tu backend tiene un endpoint específico para cambiar contraseña
    /*
    const handleChangePassword = async (userId) => {
         const newPassword = prompt("Ingrese la nueva contraseña:"); // O usar un modal/formulario dedicado
         if (newPassword) {
             try {
                 setLoading(true);
                  // Necesitas una función api.changeUserPassword en api.jsx
                 // await api.changeUserPassword(userId, { newPassword }); // <-- Ejemplo
                 console.log(`Acción: Cambiar contraseña para usuario ${userId}`);
                 // No se necesita recargar la lista, solo confirmar al usuario
                 alert('Contraseña actualizada exitosamente.');
             } catch (err) {
                 setError('Error al cambiar la contraseña.');
                 console.error('Error al cambiar contraseña:', err.response?.data || err.message);
                 alert('Error al cambiar la contraseña: ' + (err.response?.data?.error || err.message));
             } finally {
                 setLoading(false);
             }
         }
    };
    */


  // --- Renderizado ---
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    // La clase 'main-content' ya provee padding gracias a App.jsx
    <div>
      <h2>Gestión de Usuarios</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Crear Nuevo Usuario
      </Button>

      {/* Tabla para mostrar los usuarios */}
      <Table data={usuarios} columns={columns} />

      {/* Modal para crear o editar usuario */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUsuario ? 'Editar Usuario' : 'Crear Usuario'}
      >
        <UsuarioForm
          initialData={editingUsuario} // Pasa los datos para edición
          onSubmit={handleSubmit} // Pasa la función de envío
        />
      </Modal>
    </div>
  );
}

export default UsuariosPage;