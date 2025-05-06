// src/pages/NominasPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Asegúrate de que api.jsx tiene la función triggerAction que acepta el parámetro method
import api from '../api/api.jsx';
// Asegúrate de que endpoints.jsx tiene las definiciones de acciones (NOMINA_VERIFICAR, etc.)
import { ENDPOINTS } from '../api/endpoints.jsx';
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
 // --- Estado para indicar que se está generando detalles (ajustado el uso) ---
  // Puedes usar este estado si la creación/generación es notablemente larga.
  // Si la generación es muy rápida en el backend POST inicial, quizás puedas eliminar este estado.
  const [isGeneratingDetails, setIsGeneratingDetails] = useState(false);
 // -------------------------------------------------------------
  const navigate = useNavigate();

  // Columnas para la tabla de Nóminas
  const columns = useMemo(() => [
    { key: 'id_nomina', title: 'ID' },
     {
        key: 'periodo_pago',
        title: 'Período',
        // Asegúrate de que tu GET /nominas incluye la relación periodo_pago
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
                   {/* Botón para ver detalle - Navega a la página de detalle de la Nomina principal */}
                   {/* Asumiendo que /nominas/:id es la ruta para ver los detalles de la nomina */}
                   <Button onClick={() => navigate(`/nominas/${item.id_nomina}`)} style={{ marginRight: '5px' }}>Ver Detalle</Button>


                    {/* Botones de flujo de trabajo condicionales por estado */}
                    {item.estado === 'Borrador' && (
                        <>
                             {/* Llama al manejador CORREGIDO usando api.triggerAction con method: 'PUT' */}
                            <Button onClick={() => handleVerifyNomina(item.id_nomina)} style={{ marginRight: '5px', backgroundColor: '#ffc107' }}>Verificar</Button>
                            {/* Llama al manejador de borrado LÓGICO (asumimos que api.update es correcto para esto) */}
                            <Button onClick={() => handleLogicalDeleteNomina(item.id_nomina)} style={{ backgroundColor: '#dc3545' }}>Eliminar Borrador</Button>
                        </>
                    )}
                    {item.estado === 'Verificada' && (
                         //{/* Llama al manejador CORREGIDO usando api.triggerAction con method: 'PUT' */}
                         <Button onClick={() => handleApproveNomina(item.id_nomina)} style={{ marginRight: '5px', backgroundColor: '#28a745' }}>Aprobar</Button>
                    )}
                    {item.estado === 'Aprobada' && (
                         //{/* Llama al manejador CORREGIDO usando api.triggerAction con method: 'PUT' */}
                         <Button onClick={() => handlePayNomina(item.id_nomina)} style={{ backgroundColor: '#17a2b8' }}>Marcar Pagada</Button>
                    )}
                         {/* Opcional: Botón para ver nóminas Pagadas o Eliminadas Lógicamente si no aparecen en la lista principal */}
                         {/* {item.estado === 'Pagada' && (
                             <Button onClick={() => navigate(`/nominas/${item.id_nomina}`)} style={{ backgroundColor: '#6c757d' }}>Ver Resumen</Button>
                         )} */}
               </>
           )}
        </>
      ),
    },
  ], [navigate]); // Dependencia en navigate para handleViewDetails


  // --- Carga de datos ---
  const fetchNominas = async () => {
    try {
      setLoading(true);
      setError(null);
       // Llama a la API para obtener nóminas, filtrando por activo=true y aplicando el término de búsqueda
       // Asegúrate de que tu endpoint GET /nominas en el backend incluye la relación periodo_pago
        // Si quieres ver nóminas en otros estados (Verificada, Aprobada, Pagada) además de Activo,
        // podrías necesitar modificar la consulta del backend o filtrar de manera diferente aquí.
      const data = await api.getAll('NOMINAS', { params: { activo: true, search: searchTerm } });
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
   const dataToDisplay = nominas;


  // --- Manejo de Modal de Creación ---
  const openModal = () => setIsModalOpen(true);
  // Se llama closeModal y luego fetchNominas() después de un submit exitoso
  const closeModal = () => { setIsModalOpen(false); };

  // Función para manejar el clic en el botón "Generar Nueva Nómina"
  const handleCreateNomina = () => {
    openModal();
  };

  // Función que se pasa al NominaForm y se llama cuando se envía el formulario
  // Asumimos que este POST inicial crea la cabecera Y genera los detalles.
  // Redirige al detalle de la nómina recién creada.
  const handleSubmitCreate = async (formData) => {
       try {
           setLoading(true); // Spinner general mientras se crea y genera
           setIsModalOpen(false); // Cerrar el modal

           console.log("Intentando crear nueva nómina con datos:", formData);

           // Llama a la API para crear la cabecera Y (asumimos) generar los detalles.
           // El backend debe devolver el objeto Nomina creado con su id_nomina y detalles anidados si aplica al GET posterior.
           const createdNomina = await api.create('NOMINAS', formData);

           console.log('Nómina creada y detalles generados (asumido):', createdNomina);
           alert('Nómina generada con éxito (estado Borrador).'); // Mensaje de éxito

            // Navegar a la página de detalle de la nómina recién creada.
            // Es en esa página donde se verán los detalles generados.
            // Esto asume que tienes una ruta como /nominas/:id configurada para la página de detalle de Nomina.
            navigate(`/nominas/${createdNomina.id_nomina}`);

        } catch (err) {
           console.error('Error al crear/generar nómina:', err);
           const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
           alert(`Error al generar nómina: ` + (backendErrorMessage || 'Ocurrió un error desconocido.'));
        } finally {
           setLoading(false); // Ocultar spinner general
           setIsGeneratingDetails(false); // Ocultar spinner específico si se usó (probablemente no necesario aquí)
           fetchNominas(); // Refrescar la lista en la página principal
        }
    };


   // --- Manejo de Vista de Detalle (sin cambios) ---
   // Esta función se usa en la columna 'actions' de la tabla.
   const handleViewDetails = (id) => {
       if (id != null) {
           navigate(`/nominas/${id}`); // Navega a la ruta de detalle de la Nomina principal
       } else {
           console.warn("No se puede navegar al detalle, ID de nómina es nulo.");
       }
   };

   // --- Manejo de Acciones de Flujo de Trabajo (CORREGIDOS PARA USAR api.triggerAction CON MÉTODO PUT) ---

   // Manejar la acción de 'Verificar'
   const handleVerifyNomina = async (idNomina) => {
       if (idNomina == null) { console.warn("No se puede verificar, ID de nómina es nulo."); return; }
       if (window.confirm(`¿Estás seguro de marcar la nómina ${idNomina} como "Verificada"?`)) {
           try {
               setLoading(true);
               // --- CORRECCIÓN: Usar api.triggerAction con la clave de acción 'NOMINA_VERIFICAR' y method: 'PUT' ---
               await api.triggerAction('NOMINA_VERIFICAR', idNomina, {}, 'PUT'); // Pasamos data vacía {} y method 'PUT'
               // -------------------------------------------------------------

               console.log(`Nómina ${idNomina} marcada como verificada.`);
               alert(`Nómina ${idNomina} marcada como Verificada.`);
               fetchNominas(); // Refrescar la lista para mostrar el nuevo estado/botones
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
               // --- CORRECCIÓN: Usar api.triggerAction con la clave de acción 'NOMINA_APROBAR' y method: 'PUT' ---
               await api.triggerAction('NOMINA_APROBAR', idNomina, {}, 'PUT'); // Pasamos data vacía {} y method 'PUT'
               // -------------------------------------------------------------

               console.log(`Nómina ${idNomina} marcada como aprobada.`);
               alert(`Nómina ${idNomina} marcada como Aprobada.`);
               fetchNominas(); // Refrescar la lista
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
               // --- CORRECCIÓN: Usar api.triggerAction con la clave de acción 'NOMINA_PAGAR' y method: 'PUT' ---
               await api.triggerAction('NOMINA_PAGAR', idNomina, {}, 'PUT'); // Pasamos data vacía {} y method 'PUT'
               // -------------------------------------------------------------

               console.log(`Nómina ${idNomina} marcada como pagada.`);
               alert(`Nómina ${idNomina} marcada como Pagada.`);
               fetchNominas(); // Refrescar la lista
           } catch (err) {
               console.error('Error al marcar nómina como pagada:', err);
               const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
               alert(`Error al marcar la nómina como pagada: ` + (backendErrorMessage || 'Ocurrió un error desconocido.'));
           } finally {
               setLoading(false);
           }
       }
   };

   // --- Manejo para el Borrado LÓGICO (Usando api.update, asumimos correcto) ---
   const handleLogicalDeleteNomina = async (idNomina) => {
       if (idNomina == null) { console.warn("No se puede eliminar lógicamente, ID de nómina es nulo."); return; }
       if (window.confirm(`¿Estás seguro de eliminar (lógicamente) la nómina borrador con ID ${idNomina}? Ya no aparecerá en la lista principal.`)) {
           try {
               setLoading(true);
               // Esta llamada usa api.update, que es correcta para un PUT /nominas/:id
                // con un cuerpo que actualiza el campo 'activo'.
               await api.update('NOMINAS', idNomina, { activo: false });

               console.log(`Nómina ${idNomina} eliminada lógicamente.`);
               alert(`Nómina ${idNomina} eliminada lógicamente.`);
               fetchNominas(); // Refrescar la lista

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
  // Muestra spinner general o específico de generación
  if (loading || isGeneratingDetails) {
    return <LoadingSpinner message={isGeneratingDetails ? "Generando detalles de nómina..." : "Cargando nóminas..."} />;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  // Si no hay nóminas para mostrar (dataToDisplay) Y no estamos generando
   if (!loading && !isGeneratingDetails && !error && (!dataToDisplay || dataToDisplay.length === 0)) {
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
                   label="" // No necesitas label si usas placeholder
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
        // Deshabilita el modal si la generación de detalles está en curso (opcional)
        // isClosable={!isGeneratingDetails}
      >
        <NominaForm onSubmit={handleSubmitCreate} onClose={closeModal} />
      </Modal>
    </div>
  );
}

export default NominasPage;