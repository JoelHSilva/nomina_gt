// src/pages/DetalleNominaPage.jsx
import React, { useState, useEffect, useMemo } from 'react'; // useMemo es opcional si columns ya no depende de estado
import { useParams, useNavigate } from 'react-router-dom';
// CORREGIDO: Ajustar rutas de importación si es necesario
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import Button from '../components/Common/Button.jsx';


function DetalleNominaPage() {
  const { id } = useParams(); // Obtiene el parámetro 'id' de la URL
  const navigate = useNavigate(); // Para navegar de regreso

  const [nomina, setNomina] = useState(null);
  const [detalleEmpleados, setDetalleEmpleados] = useState([]); // Los items de detalle_nomina

  // REMOVIDO: Estado para almacenar los datos de los empleados (ya no es necesario fetchearlos aparte)
  // const [employees, setEmployees] = useState({});

  // REMOVIDO: Estado para manejar la carga de empleados (ya no es necesario)
  // const [loadingEmpleados, setLoadingEmpleados] = useState(false);

  // CORREGIDO: Volvemos a un solo estado de carga general
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);


  // Columnas para la tabla de Detalle por Empleado
  // **SIMPLIFICADO:** La columna 'Empleado' ahora accede directamente a item.empleado.nombre
  // Mantenemos useMemo, aunque ya no depende de 'employees', es buena práctica si las columnas son complejas
  const detalleColumns = useMemo(() => [
    // { key: 'id_detalle', title: 'ID Detalle' }, // Puedes mostrarlo si es útil
    { key: 'id_empleado', title: 'ID Empleado' }, // Mostrar el ID para referencia
    // COLUMNA EMPLEADO: Accede DIRECTAMENTE al objeto 'empleado' anidado que ahora envia el backend
    {
       key: 'empleado', // La clave puede ser el nombre del objeto anidado para claridad
       title: 'Empleado',
       // ACCEDE DIRECTAMENTE a item.empleado.nombre y item.empleado.apellido
       render: (empleadoObj, item) => { // El primer argumento 'empleadoObj' es el valor de item[key] (el objeto empleado)
           // Verifica si el objeto empleado existe y tiene nombre/apellido antes de mostrarlos
           return (empleadoObj && (empleadoObj.nombre || empleadoObj.apellido)) ?
               `${empleadoObj.nombre || ''} ${empleadoObj.apellido || ''}`.trim() :
               `ID: ${item.id_empleado || 'N/A'}`; // Si no hay objeto empleado o no tiene nombre, muestra el ID del detalle
       }
    },
    { key: 'salario_base', title: 'Salario Base (Q)', render: (value) => `Q ${parseFloat(value || 0).toFixed(2)}` },
    { key: 'dias_trabajados', title: 'Días Trab.', render: (value) => parseFloat(value || 0).toFixed(1) },
    { key: 'horas_extra', title: 'Horas Extra', render: (value) => parseFloat(value || 0).toFixed(2) },
    { key: 'monto_horas_extra', title: 'Monto Horas Extra', render: (value) => `Q ${parseFloat(value || 0).toFixed(2)}` },
    { key: 'bonificacion_incentivo', title: 'Bonif. Incentivo', render: (value) => `Q ${parseFloat(value || 0).toFixed(2)}` },
    { key: 'otros_ingresos', title: 'Otros Ingresos', render: (value) => `Q ${parseFloat(value || 0).toFixed(2)}` },
    { key: 'total_ingresos', title: 'Total Ingresos', render: (value) => `Q ${parseFloat(value || 0).toFixed(2)}` },
    { key: 'igss_laboral', title: 'IGSS', render: (value) => `Q ${parseFloat(value || 0).toFixed(2)}` },
    { key: 'isr', title: 'ISR', render: (value) => `Q ${parseFloat(value || 0).toFixed(2)}` },
    { key: 'otros_descuentos', title: 'Otros Descuentos', render: (value) => `Q ${parseFloat(value || 0).toFixed(2)}` },
    { key: 'total_descuentos', title: 'Total Descuentos', render: (value) => `Q ${parseFloat(value || 0).toFixed(2)}` },
    { key: 'liquido_recibir', title: 'Líquido a Recibir', render: (value) => `Q ${parseFloat(value || 0).toFixed(2)}` },
     { key: 'observaciones', title: 'Observaciones', render: (value) => value || 'N/A' }, // Añadido según tu estructura
      // Añadir columnas para campos directamente en el detalle si son útiles (ej: id_nomina, fecha_creacion del detalle)
      { key: 'id_detalle', title: 'ID Detalle' },
      { key: 'fecha_creacion', title: 'Fecha Creación Detalle', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
      { key: 'activo', title: 'Detalle Activo?', render: (value) => (value ? 'Sí' : 'No') },

    // { // Columna de acciones - Opcional si permites editar detalle por empleado
    //   key: 'detalleActions',
    //   title: 'Acciones',
    //   render: (value, item) => (
    //      // Mostrar botón de editar solo si la nómina está en estado 'Borrador'
    //      {/* nomina?.estado === 'Borrador' && (
    //          <Button onClick={() => handleEditDetalle(item)}>Editar Detalle</Button>
    //      ) */}
    //      // Botón para ver Conceptos Aplicados de este empleado en esta nómina?
    //   ),
    // },
  ], []); // No depende de estados del componente


  // --- Efecto Único: Cargar datos de la Nómina principal y su Detalle ---
  useEffect(() => {
    const fetchNominaAndDetalle = async () => {
      try {
        setLoading(true); // Inicia carga general
        setError(null); // Limpia errores

        // Obtener los datos de la nómina principal por ID
        // Asume que getById para NOMINAS devuelve el objeto Nomina principal.
        const nominaData = await api.getById('NOMINAS', id); // O api.getOne si usas ese nombre
        setNomina(nominaData); // Guarda el objeto nómina principal

        // Obtener el detalle de nómina para esta nómina específica
        // Asumimos que GET /api/v1/detalle-nomina?id_nomina=:id funciona
        // Y que cada ítem de detalle AHORA INCLUYE el objeto 'empleado' anidado.
        const detalleData = await api.getAll('DETALLE_NOMINA', { params: { id_nomina: id } });

        // Verificar que los datos recibidos son válidos y limpiar nulos
        if (Array.isArray(detalleData)) {
          setDetalleEmpleados(detalleData.filter(item => item != null)); // Guarda el array de detalles, limpiando nulos
        } else {
           console.warn(`API devolvió datos de detalle inesperados para nómina ${id}:`, detalleData);
           setDetalleEmpleados([]); // Si no es un array, trata como vacío
        }

        // REMOVIDO: Lógica para extraer IDs de empleados y fetchear empleados por separado
        // Esto ya no es necesario porque el backend anida los datos del empleado.

      } catch (err) {
        setError(`Error al cargar el detalle de la nómina con ID ${id}.`);
        console.error(`Error fetching nomina ${id} details:`, err);
         alert(`Error al cargar el detalle de la nómina: ` + (err.response?.data?.error || err.message));
        setNomina(null); // Limpiar estado si hay error
        setDetalleEmpleados([]); // Limpiar estado si hay error
      } finally {
        setLoading(false); // Finaliza carga general
      }
    };

    if (id) { // Asegurarse de tener un ID antes de intentar cargar
      fetchNominaAndDetalle();
    } else {
        // Si no hay ID en la URL, muestra un error inmediatamente
        setError("ID de nómina no proporcionado en la URL.");
        setLoading(false);
        console.warn("DetalleNominaPage: No se encontró ID de nómina en los parámetros de URL.");
    }

  }, [id]); // Dependencia: re-ejecuta si el ID de la URL cambia


  // --- Renderizado ---
  if (loading) {
    return <LoadingSpinner />; // Muestra spinner mientras carga
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>; // Muestra error si existe
  }

  // Si no se cargó la nómina principal
  if (!nomina) {
      return (
          <div style={{ textAlign: 'center', padding: '20px' }}>
             <h2>Detalle de Nómina</h2>
             <p>No se pudo cargar la información de la nómina.</p>
             <Button onClick={() => navigate('/nominas')} style={{ marginTop: '10px' }}>Volver a Nóminas</Button>
          </div>
      );
  }

  // Si la nómina principal se cargó pero no tiene detalles válidos (array vacío o no array)
  // Ya limpiamos los detalles al setDetalleEmpleados, solo verificamos si el array final está vacío
  if (detalleEmpleados.length === 0) {
      return (
          <div style={{ textAlign: 'center', padding: '20px' }}>
             <h2>Detalle de Nómina ID: {nomina.id_nomina}</h2>
             {/* Mostrar otros detalles de la nómina principal si existen en el objeto nomina */}
             <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px', textAlign: 'left' }}>
                 <h3>Información General</h3>
                 {/* Muestra nombre del período si tu backend lo anida en la respuesta de Nomina ID */}
                 {/* Si tu backend incluye el objeto periodo_pago anidado, usa: */}
                 {nomina.periodo_pago && (
                     <p><strong>Período:</strong> {nomina.periodo_pago.nombre} ({nomina.periodo_pago.fecha_inicio} a {nomina.periodo_pago.fecha_fin})</p>
                 )}
                  {/* Mostrar otros campos de la nómina principal */}
                 <p><strong>Fecha Generación:</strong> {nomina.fecha_generacion ? new Date(nomina.fecha_generacion).toLocaleString() : 'N/A'}</p>
                 <p><strong>Estado:</strong> {nomina.estado || 'N/A'}</p>
                 <p><strong>Total Ingresos:</strong> Q {parseFloat(nomina.total_ingresos || 0).toFixed(2)}</p>
                 <p><strong>Total Descuentos:</strong> Q {parseFloat(nomina.total_descuentos || 0).toFixed(2)}</p>
                 <p><strong>Total a Pagar (Neto):</strong> Q {parseFloat(nomina.total_neto || 0).toFixed(2)}</p>
                  {/* Añadir otros campos si los necesitas (ej: descripción, usuarios) */}
                 <p><strong>Descripción:</strong> {nomina.descripcion || 'N/A'}</p>
                 <p><strong>Generada Por:</strong> {nomina.usuario_generacion || 'N/A'}</p>
                 <p><strong>Aprobada Por:</strong> {nomina.usuario_aprobacion || 'N/A'}</p>
                 {nomina.fecha_aprobacion && <p><strong>Fecha Aprobación:</strong> {new Date(nomina.fecha_aprobacion).toLocaleString()}</p>}
             </div>

             <h3>Detalles por Empleado</h3>
             <p>No hay detalles de empleados disponibles para esta nómina.</p> {/* Mensaje específico */}

              <Button onClick={() => navigate('/nominas')} style={{ marginTop: '10px' }}>Volver a Nóminas</Button>
          </div>
      );
  }


  // Renderiza la página con los detalles de la nómina y la tabla de ítems de detalle
  return (
    <div style={{ padding: '20px', textAlign: 'left' }}> {/* Ajustar alineación */}
      <h2>Detalle de Nómina ID: {nomina.id_nomina}</h2>

      {/* Mostrar información general de la nómina */}
      {/* Asume que estos datos están directamente en el objeto 'nomina' */}
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
         <h3>Información General</h3>
          {/* Muestra nombre del período si tu backend lo anida en la respuesta de Nomina ID */}
          {/* Si tu backend incluye el objeto periodo_pago anidado, usa: */}
          {nomina.periodo_pago && (
             <p><strong>Período:</strong> {nomina.periodo_pago.nombre} ({nomina.periodo_pago.fecha_inicio} a {nomina.periodo_pago.fecha_fin})</p>
          )}
          {/* Mostrar otros campos de la nómina principal */}
         <p><strong>Fecha Generación:</strong> {nomina.fecha_generacion ? new Date(nomina.fecha_generacion).toLocaleString() : 'N/A'}</p>
         <p><strong>Estado:</strong> {nomina.estado || 'N/A'}</p>
         <p><strong>Total Ingresos:</strong> Q {parseFloat(nomina.total_ingresos || 0).toFixed(2)}</p>
         <p><strong>Total Descuentos:</strong> Q {parseFloat(nomina.total_descuentos || 0).toFixed(2)}</p>
         <p><strong>Total a Pagar (Neto):</strong> Q {parseFloat(nomina.total_neto || 0).toFixed(2)}</p>
          {/* Añadir otros campos si los necesitas (ej: descripción, usuarios) */}
         <p><strong>Descripción:</strong> {nomina.descripcion || 'N/A'}</p>
         <p><strong>Generada Por:</strong> {nomina.usuario_generacion || 'N/A'}</p>
         <p><strong>Aprobada Por:</strong> {nomina.usuario_aprobacion || 'N/A'}</p>
         {nomina.fecha_aprobacion && <p><strong>Fecha Aprobación:</strong> {new Date(nomina.fecha_aprobacion).toLocaleString()}</p>}

      </div>


      <h3>Detalles por Empleado</h3>

      {/* Tabla para mostrar los ítems de detalle de nómina */}
      <Table data={detalleEmpleados} columns={detalleColumns} /> {/* Usa el array de detalles y las columnas de detalle */}

      {/* Botón para volver */}
      <Button onClick={() => navigate('/nominas')} style={{ marginTop: '20px' }}>Volver a Nóminas</Button>

      {/* Modal para editar detalle por empleado (Opcional y Complejo) */}
      {/* <Modal isOpen={isDetalleModalOpen} onClose={closeDetalleModal} title="Editar Detalle Empleado">
           <DetalleEmpleadoNominaForm initialData={editingDetalleItem} onSubmit={handleSaveDetalle} />
       </Modal> */}
    </div>
  );
}

export default DetalleNominaPage;