// src/pages/NominasPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx'; // Asegúrate de que esta ruta sea correcta
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import NominaForm from '../components/Forms/NominaForm.jsx';
import Input from '../components/Common/Input.jsx';


function NominasPage() {
  const [nominas, setNominas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Columnas para la tabla de Nóminas
  const columns = useMemo(() => [
    { key: 'id_nomina', title: 'ID' },
     {
        key: 'periodo_pago',
        title: 'Período',
        render: (value, item) => item.periodo_pago ? `${item.periodo_pago.nombre} (${item.periodo_pago.fecha_inicio} - ${item.periodo_pago.fecha_fin})` : 'N/A'
    },
    { key: 'descripcion', title: 'Descripción' },
    { key: 'fecha_generacion', title: 'Generada', render: (value) => value ? new Date(value).toLocaleString() : 'N/A' },
    { key: 'estado', title: 'Estado' },
    { key: 'total_ingresos', title: 'Total Ingresos', render: (value) => `Q ${parseFloat(value || 0).toFixed(2)}` },
    { key: 'total_descuentos', title: 'Total Descuentos', render: (value) => `Q ${parseFloat(value || 0).toFixed(2)}` },
    { key: 'total_neto', title: 'Total Neto', render: (value) => `Q ${parseFloat(value || 0).toFixed(2)}` },
    { key: 'usuario_generacion', title: 'Generada Por', render: (value) => value || 'N/A' },
    { key: 'usuario_aprobacion', title: 'Aprobada Por', render: (value) => value || 'N/A' },
    { key: 'fecha_aprobacion', title: 'Fecha Aprobación', render: (value) => value ? new Date(value).toLocaleString() : 'N/A' },
    { // Columna de acciones
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => (
        <>
           {item && item.id_nomina != null && (
               <>
                   {/* Botón para ver detalle */}
                   <Button onClick={() => handleViewDetails(item.id_nomina)} style={{ marginRight: '5px' }}>Ver Detalle</Button>

                    {/* Botones de flujo de trabajo condicionales por estado */}
                    {item.estado === 'Borrador' && (
                        <>
                            <Button onClick={() => handleVerifyNomina(item.id_nomina)} style={{ marginRight: '5px', backgroundColor: '#ffc107' }}>Verificar</Button>
                            {/* Llama al manejador de borrado LÓGICO */}
                            <Button onClick={() => handleLogicalDeleteNomina(item.id_nomina)} style={{ backgroundColor: '#dc3545' }}>Eliminar Borrador</Button>
                        </>
                    )}
                    {item.estado === 'Verificada' && (
                         <Button onClick={() => handleApproveNomina(item.id_nomina)} style={{ marginRight: '5px', backgroundColor: '#28a745' }}>Aprobar</Button>
                    )}
                    {item.estado === 'Aprobada' && (
                         <Button onClick={() => handlePayNomina(item.id_nomina)} style={{ backgroundColor: '#17a2b8' }}>Marcar Pagada</Button>
                    )}
               </>
           )}
        </>
      ),
    },
  ], [navigate]);

  // --- Carga de datos ---
  const fetchNominas = async () => {
    try {
      setLoading(true);
      setError(null);
       // Llama a la API para obtener nóminas, filtrando por activo=true y aplicando el término de búsqueda
      const data = await api.getAll('NOMINAS', { params: { activo: true, search: searchTerm } });
      // console.log("Datos de nóminas recibidas:", data); // Log para depuración
       // Limpieza básica de datos nulos
       const cleanedData = data ? data.filter(nomina => nomina != null && nomina.id_nomina != null) : [];
       setNominas(cleanedData);

    } catch (err) {
      setError('Error al cargar las nóminas.');
      console.error(err);
       alert('Error al cargar las nóminas: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Cargar nóminas al inicio y cuando cambie el término de búsqueda
  useEffect(() => {
    fetchNominas();
  }, [searchTerm]);

  // --- Lógica de Filtrado (Búsqueda) en Frontend ---
   const dataToDisplay = nominas; // Asumimos que el backend filtra por 'search'


  // --- Manejo de Modal de Creación ---
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
     setIsModalOpen(false);
     // Refrescar la lista después de cerrar el modal (generalmente después de una acción exitosa)
     fetchNominas();
  };

  // AÑADIDO: Función para manejar el clic en el botón "Generar Nueva Nómina"
  // Su única función es abrir el modal.
  const handleCreateNomina = () => {
    openModal();
  };


  // Función que se pasa al NominaForm y se llama cuando se envía el formulario
  // RECIBE EL formData CON { idPeriodo: ID_SELECCIONADO } DESDE NominaForm
  const handleSubmitCreate = async (formData) => {
       // formData aquí debe contener { idPeriodo: ... }
    try {
      setLoading(true);
      console.log("Intentando generar nueva nómina con datos:", formData);
       // Llama a la API para crear (generar) la nómina
      await api.create('NOMINAS', formData);

      console.log('Nómina generada exitosamente.');
      alert('Nómina generada con éxito.');
      closeModal();

    } catch (err) {
      console.error('Error al generar nómina:', err);
      const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
      alert(`Error al generar nómina: ` + (backendErrorMessage || 'Ocurrió un error desconocido.'));
    } finally {
       setLoading(false);
    }
  };

   // --- Manejo de Vista de Detalle ---
   const handleViewDetails = (id) => {
       if (id != null) {
           navigate(`/nominas/${id}`);
       } else {
           console.warn("No se puede navegar al detalle, ID de nómina es nulo.");
       }
   };

   // --- Manejo de Acciones de Flujo de Trabajo ---

   // Manejar la acción de 'Verificar'
   const handleVerifyNomina = async (idNomina) => {
       if (idNomina == null) { console.warn("No se puede verificar, ID de nómina es nulo."); return; }
       if (window.confirm(`¿Estás seguro de marcar la nómina ${idNomina} como "Verificada"?`)) {
           try {
               setLoading(true);
               await api.update(`NOMINAS/verificar`, idNomina, {});

               console.log(`Nómina ${idNomina} marcada como verificada.`);
               alert(`Nómina ${idNomina} marcada como Verificada.`);
               fetchNominas();
           } catch (err) {
               console.error('Error al verificar nómina:', err);
               const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
               alert(`Error al verificar la nómina: ` + (backendErrorMessage || 'Ocurrió un error desconocido.'));
           } finally {
               setLoading(false);
           }
       }
   };

   // Manejar la acción de 'Aprobar'
   const handleApproveNomina = async (idNomina) => {
       if (idNomina == null) { console.warn("No se puede aprobar, ID de nómina es nulo."); return; }
       if (window.confirm(`¿Estás seguro de marcar la nómina ${idNomina} como "Aprobada"? Esta acción puede desencadenar otros procesos (ej. aplicación de pagos).`)) {
           try {
               setLoading(true);
               await api.update(`NOMINAS/aprobar`, idNomina, {});

               console.log(`Nómina ${idNomina} marcada como aprobada.`);
               alert(`Nómina ${idNomina} marcada como Aprobada.`);
               fetchNominas();
           } catch (err) {
               console.error('Error al aprobar nómina:', err);
               const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
               alert(`Error al aprobar la nómina: ` + (backendErrorMessage || 'Ocurrió un error desconocido.'));
           } finally {
               setLoading(false);
           }
       }
   };

    const handlePayNomina = async (idNomina) => {
        if (idNomina == null) { console.warn("No se puede marcar como pagada, ID de nómina es nulo."); return; }
        if (window.confirm(`¿Estás seguro de marcar la nómina ${idNomina} como "Pagada"? Esta acción finaliza el proceso.`)) {
           try {
               setLoading(true);
               await api.update(`NOMINAS/pagar`, idNomina, {});

               console.log(`Nómina ${idNomina} marcada como pagada.`);
               alert(`Nómina ${idNomina} marcada como Pagada.`);
               fetchNominas();
           } catch (err) {
               console.error('Error al marcar nómina como pagada:', err);
               const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
               alert(`Error al marcar la nómina como pagada: ` + (backendErrorMessage || 'Ocurrió un error desconocido.'));
           } finally {
               setLoading(false);
           }
       }
    };

   // --- Manejo para el Borrado LÓGICO ---
   const handleLogicalDeleteNomina = async (idNomina) => {
       if (idNomina == null) {
           console.warn("No se puede eliminar lógicamente, ID de nómina es nulo.");
           return;
       }
       if (window.confirm(`¿Estás seguro de eliminar (lógicamente) la nómina borrador con ID ${idNomina}? Ya no aparecerá en la lista principal.`)) {
           try {
               setLoading(true);
               await api.update('NOMINAS', idNomina, { activo: false }); // Usa api.update para borrado lógico

               console.log(`Nómina ${idNomina} eliminada lógicamente.`);
               alert(`Nómina ${idNomina} eliminada lógicamente.`);
               fetchNominas(); // Refrescar la lista para que no aparezca la eliminada lógicamente

           } catch (err) {
               console.error('Error al eliminar lógicamente la nómina:', err);
               const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
               alert('Error al eliminar lógicamente la nómina: ' + (backendErrorMessage || 'Ocurrió un error desconocido.'));
           } finally {
               setLoading(false);
           }
       }
   };


  // --- Renderizado ---
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  }

   // Si no hay nóminas para mostrar (dataToDisplay)
   if (!loading && !error && (!dataToDisplay || dataToDisplay.length === 0)) {
       return (
           <div style={{ textAlign: 'center', padding: '20px' }}>
               <h2>Gestión de Nóminas</h2>
               <p>No hay nóminas disponibles en el listado.</p>
               <Button onClick={handleCreateNomina}>Generar Nueva Nómina</Button>
                {/* Modal para generar nueva nómina */}
                <Modal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  title="Generar Nueva Nómina"
                >
                  <NominaForm onSubmit={handleSubmitCreate} onClose={closeModal} />
                </Modal>
           </div>
       );
   }


  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Gestión de Nóminas</h2>

      <Button onClick={handleCreateNomina} style={{ marginBottom: '15px' }}>Generar Nueva Nómina</Button>

       {/* Campo de búsqueda simple para la tabla */}
       <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
           <div className="app-input-container" style={{ marginBottom: '0', width: '300px' }}>
               <Input
                   id="search-nominas"
                   type="text"
                   placeholder="Buscar nóminas..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   label=""
               />
           </div>
       </div>


      {/* Tabla para mostrar las nóminas */}
      <Table data={dataToDisplay || []} columns={columns} />


      {/* Modal para generar nueva nómina */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Generar Nueva Nómina"
      >
        <NominaForm onSubmit={handleSubmitCreate} onClose={closeModal} />
      </Modal>
    </div>
  );
}

export default NominasPage;