// src/components/Forms/NominaForm.jsx
import React, { useState, useEffect } from 'react';
import Button from '../Common/Button.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';
// Ajustar la ruta de importación
import api from '../../api/api.jsx';
import { ENDPOINTS } from '../../api/endpoints.jsx';

// No necesitamos initialData para crear una nómina, solo para editar (que es diferente)
// En este formulario de creación, solo seleccionamos el período
function NominaForm({ onSubmit, onClose }) { // Añadimos onClose para cerrar el modal si es necesario desde aquí

  // Estado para almacenar el ID del período de pago seleccionado
  const [selectedPeriodoId, setSelectedPeriodoId] = useState('');

  // Estado para la lista de Períodos de Pago disponibles (para el selector)
  const [periodosPago, setPeriodosPago] = useState([]);
  const [loadingPeriodos, setLoadingPeriodos] = useState(true); // Indicador de carga para períodos
  const [errorPeriodos, setErrorPeriodos] = useState(null); // Error para períodos


  // Efecto para cargar la lista de Períodos de Pago al montar el componente
  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        setLoadingPeriodos(true);
        // Usamos el endpoint correcto para Períodos de Pago
        const data = await api.getAll('PERIODOS_PAGO');
         // Filtrar solo períodos Activos si solo se puede generar nómina para períodos activos
         // const activePeriodos = data.filter(periodo => periodo && periodo.id_periodo != null && periodo.activo);
         // setPeriodosPago(activePeriodos);

        // Asegurar que solo se incluyan períodos con ID válido
        const cleanedData = data.filter(periodo => periodo != null && periodo.id_periodo != null); // Usar id_periodo
        setPeriodosPago(cleanedData);

      } catch (err) {
        setErrorPeriodos('Error al cargar los períodos de pago disponibles.');
        console.error('Error fetching periodos de pago:', err);
         alert('Error al cargar los períodos de pago: ' + (err.response?.data?.error || err.message)); // Mostrar alerta al usuario
      } finally {
        setLoadingPeriodos(false);
      }
    };
    fetchPeriodos(); // Ejecuta la carga
  }, []); // Array de dependencias vacío: se ejecuta solo una vez al montar


  // Maneja el cambio en el selector de Período de Pago
  const handlePeriodoSelectChange = (e) => {
      const value = e.target.value;
       // Convertir el valor a número si no está vacío
      setSelectedPeriodoId(value === '' ? '' : parseInt(value, 10));
  };


  // Maneja el envío del formulario (para generar la nómina)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("NominaForm: handleSubmit llamado. Periodo seleccionado:", selectedPeriodoId);

    // Validar que se haya seleccionado un período
    if (!selectedPeriodoId) {
        console.warn('Validación: Debe seleccionar un Período de Pago.');
         alert('Por favor, seleccione un Período de Pago.'); // Notificar al usuario
        return; // Detener el envío
    }

    // Preparar los datos para enviar a la API.
    // Según el error del backend, espera "idPeriodo" (camelCase).
    const dataToSend = {
        idPeriodo: selectedPeriodoId, // <-- Enviar el ID seleccionado con el nombre esperado por el backend
        // Si tu backend espera otros campos iniciales para generar (ej: mes, anio), añádelos aquí.
        // Lo común es solo necesitar el ID del período.
    };

    console.log("NominaForm: Llamando a onSubmit con datos para API:", dataToSend);
    onSubmit(dataToSend); // Llama a la función onSubmit de la página principal
     // Puedes cerrar el modal aquí o dejar que la página lo cierre después de un submit exitoso
     // onClose(); // Descomentar si quieres que el modal se cierre inmediatamente al hacer submit
  };


  // Mostrar spinner si se están cargando los períodos
  if (loadingPeriodos) {
      return <LoadingSpinner />;
  }
   // Mostrar error si falla la carga de períodos
   if (errorPeriodos) {
       return <div style={{ color: 'red' }}>{errorPeriodos}</div>;
   }


  // --- Renderizado del Formulario ---
  return (
    // No necesitamos un <form> si el botón de submit está fuera del form,
    // pero es buena práctica si tienes inputs
    <form onSubmit={handleSubmit}>
        <h3>Generar Nueva Nómina</h3>

         {/* Selector de Período de Pago */}
         <div className="app-input-container">
             <label htmlFor="periodo_pago" className="app-input-label">Período de Pago:</label>
              {/* Usar handlePeriodoSelectChange para este selector */}
             <select
                 id="periodo_pago"
                 value={selectedPeriodoId}
                 onChange={handlePeriodoSelectChange}
                 required // Hacerlo requerido
                 className="app-input-field"
             >
                 <option value="">-- Seleccione un Período --</option>
                 {/* Mapear la lista de períodos cargada */}
                 {periodosPago.map(periodo => (
                     // Usar id_periodo para el value y nombre para el texto visible
                     <option key={periodo.id_periodo} value={periodo.id_periodo}>
                         {periodo.nombre} ({periodo.fecha_inicio} a {periodo.fecha_fin})
                     </option>
                 ))}
             </select>
         </div>

        {/* Botón para generar la nómina */}
         {/* Este botón dispara el handleSubmit del formulario */}
        <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}}>
            Generar Nómina
        </Button>
         {/* Opcional: Botón Cancelar */}
         {/* <Button type="button" className="app-button-secondary" onClick={onClose} style={{marginTop: '15px', marginLeft: '10px'}}>
             Cancelar
         </Button> */}
    </form>
  );
}

export default NominaForm;