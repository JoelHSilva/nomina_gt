// src/components/Forms/NominaForm.jsx
import React, { useState, useEffect } from 'react';
import Button from '../Common/Button.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx'; // La ruta parece incorrecta aquí, debería ser '../Common/LoadingSpinner.jsx'
import Input from '../Common/Input.jsx'; // Asegúrate de importar Input
// Ajustar la ruta de importación (ya la tienes bien en este archivo)
import api from '../../api/api.jsx';
import { ENDPOINTS } from '../../api/endpoints.jsx';

// Ya no necesitamos initialData para crear una nómina, solo para editar (que es diferente)
// En este formulario de creación, solo seleccionamos el período y agregamos descripción
function NominaForm({ onSubmit, onClose }) {

  // Estado para almacenar el ID del período de pago seleccionado
  const [selectedPeriodoId, setSelectedPeriodoId] = useState('');
  // --- NUEVO: Estado para la descripción de la nómina ---
  const [descripcion, setDescripcion] = useState('');
  // ----------------------------------------------------

  // Estado para la lista de Períodos de Pago disponibles (para el selector)
  const [periodosPago, setPeriodosPago] = useState([]);
  const [loadingPeriodos, setLoadingPeriodos] = useState(true);
  const [errorPeriodos, setErrorPeriodos] = useState(null);


  // Efecto para cargar la lista de Períodos de Pago al montar el componente
  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        setLoadingPeriodos(true);
        // Usamos el endpoint correcto para Períodos de Pago
        const data = await api.getAll('PERIODOS_PAGO');

        // Asegurar que solo se incluyan períodos con ID válido
        // Considera filtrar aquí solo los períodos con estado 'Abierto' si es la lógica de tu negocio
        const cleanedData = data.filter(periodo => periodo != null && periodo.id_periodo != null);
        setPeriodosPago(cleanedData);

      } catch (err) {
        setErrorPeriodos('Error al cargar los períodos de pago disponibles.');
        console.error('Error fetching periodos de pago:', err);
        alert('Error al cargar los períodos de pago: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoadingPeriodos(false);
      }
    };
    fetchPeriodos();
  }, []);


  // Maneja el cambio en el selector de Período de Pago
  const handlePeriodoSelectChange = (e) => {
      const value = e.target.value;
      setSelectedPeriodoId(value === '' ? '' : parseInt(value, 10));
  };

  // --- NUEVO: Maneja el cambio en el input de Descripción ---
  const handleDescripcionChange = (e) => {
      setDescripcion(e.target.value);
  };
  // -------------------------------------------------------


  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("NominaForm: handleSubmit llamado. Periodo:", selectedPeriodoId, "Descripción:", descripcion);

    // Validar que se haya seleccionado un período y que la descripción no esté vacía
    if (!selectedPeriodoId) {
        console.warn('Validación: Debe seleccionar un Período de Pago.');
        alert('Por favor, seleccione un Período de Pago.');
        return;
    }
    // --- NUEVO: Validar descripción ---
    if (!descripcion.trim()) { // .trim() quita espacios en blanco al inicio y fin
        console.warn('Validación: La descripción no puede estar vacía.');
        alert('Por favor, ingrese una descripción para la nómina.');
        return;
    }
    // ---------------------------------


    // Preparar los datos para enviar a la API.
    // Usamos los nombres de campo esperados por el modelo/backend (id_periodo, descripcion).
    const dataToSend = {
        idPeriodo: selectedPeriodoId, // <-- Usar id_periodo para coincidir con el modelo y schema SQL
        descripcion: descripcion.trim(), // <-- Incluir la descripción (limpia de espacios extra)
        // usuario_generacion: Obtener del contexto de usuario si lo tienes
    };

    console.log("NominaForm: Llamando a onSubmit con datos para API:", dataToSend);
    onSubmit(dataToSend); // Llama a la función onSubmit de la página principal
     // Puedes cerrar el modal aquí o dejar que la página lo cierre después de un submit exitoso
     // onClose();
  };


  // Mostrar spinner o error si se están cargando los períodos
  if (loadingPeriodos) {
      return <LoadingSpinner />;
  }
   if (errorPeriodos) {
       return <div style={{ color: 'red' }}>{errorPeriodos}</div>;
   }


  // --- Renderizado del Formulario ---
  return (
    <form onSubmit={handleSubmit}>
        <h3>Generar Nueva Nómina</h3>

         {/* Selector de Período de Pago */}
         <div className="app-input-container">
             <label htmlFor="periodo_pago" className="app-input-label">Período de Pago:</label>
             <select
                 id="periodo_pago"
                 value={selectedPeriodoId}
                 onChange={handlePeriodoSelectChange}
                 required
                 className="app-input-field"
             >
                 <option value="">-- Seleccione un Período --</option>
                 {/* Mapear la lista de períodos cargada */}
                 {periodosPago.map(periodo => (
                     <option key={periodo.id_periodo} value={periodo.id_periodo}>
                         {periodo.nombre} ({periodo.fecha_inicio} a {periodo.fecha_fin})
                     </option>
                 ))}
             </select>
         </div>

         {/* --- NUEVO: Input para la Descripción --- */}
         <Input
             label="Descripción de la Nómina:"
             id="descripcion" // Usar el nombre del campo
             value={descripcion}
             onChange={handleDescripcionChange} // Usar el nuevo manejador de cambio
             required // Hacerlo requerido
             type="text" // Asegurar que es tipo texto
             // Puedes añadir un maxLength si es necesario
         />
         {/* ------------------------------------- */}


        {/* Botón para generar la nómina */}
        <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}}>
            Generar Nómina
        </Button>
         {/* Opcional: Botón Cancelar */}
         <Button type="button" className="app-button-secondary" onClick={onClose} style={{marginTop: '15px', marginLeft: '10px'}}>
             Cancelar
         </Button>
    </form>
  );
}

export default NominaForm;