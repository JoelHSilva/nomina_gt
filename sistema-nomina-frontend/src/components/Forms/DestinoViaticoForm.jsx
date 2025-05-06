// src/components/Forms/DestinoViaticoForm.jsx
import React, { useState, useEffect, useRef } from 'react'; // Importa useRef
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
// No necesita LoadingSpinner ni api/endpoints para este form si no carga relaciones

function DestinoViaticoForm({ initialData = null, onSubmit }) { // Cambia el default a null
  const [formData, setFormData] = useState({
    // --- CAMPOS DEL ESTADO (SIN 'codigo', incluye nuevos) ---
    // codigo: '', // Campo 'codigo' eliminado según solicitud
    nombre: '',
    descripcion: '', 
    es_internacional: false, 
    activo: true, 
    // --- FIN CAMPOS DEL ESTADO ---
  });

  // --- ESTADO Y REF PARA DETECCIÓN DE CAMBIOS ---
  const originalFormDataRef = useRef(null); // Para almacenar una copia de los datos iniciales
  const [isFormChanged, setIsFormChanged] = useState(false); // Estado para indicar si el formulario ha cambiado
  // --- FIN ESTADO Y REF ---


  // Actualiza el estado del formulario si cambia initialData (para el modo edición)
  useEffect(() => {
    // --- CORRECCIÓN CLAVE 1: Usar 'id_destino' y encadenamiento opcional ---
    if (initialData?.id_destino) { // Verificar si estamos en modo edición de forma segura usando el ID correcto
    // --- FIN CORRECCIÓN CLAVE 1 ---
        const initialFormState = {
            // codigo: initialData.codigo || '', // Campo 'codigo' eliminado según solicitud
            nombre: initialData.nombre || '',
            // --- CARGAR NUEVOS CAMPOS ---
            descripcion: initialData.descripcion || '',
            es_internacional: initialData.es_internacional === undefined ? false : initialData.es_internacional, // Cargar booleano, default false
            // --- FIN CARGAR NUEVOS CAMPOS ---
            activo: initialData.activo === undefined ? true : initialData.activo, 
        };
        setFormData(initialFormState);

        // Almacenar una copia EXACTA de los datos iniciales del formulario en la ref
        originalFormDataRef.current = initialFormState; 
        setIsFormChanged(false); // Inicialmente, no hay cambios
    } else {
        // Si no hay initialData, resetear el formulario para creación (incluye nuevos campos, SIN 'codigo')
        setFormData({
           nombre: '', descripcion: '', es_internacional: false, activo: true, 
        });
        originalFormDataRef.current = null; 
        setIsFormChanged(true); // En creación, el formulario siempre se considera "cambiado"
    }
  }, [initialData]); 


  // --- EFECTO PARA DETECTAR CAMBIOS EN EL FORMULARIO ---
  useEffect(() => {
    // Solo ejecutar si estamos en modo edición (hay datos originales para comparar)
    if (originalFormDataRef.current) {
        // Comparar el objeto formData actual con el objeto original almacenado en la ref
        const areEqual = Object.keys(formData).every(key => {
            // Comparación simple campo por campo para todos los campos en formData
            return formData[key] === originalFormDataRef.current[key];
        });

        // El formulario ha cambiado si no son iguales
        setIsFormChanged(!areEqual);
    }
  }, [formData]); // Este efecto se ejecuta cada vez que formData cambia


  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      // Checkbox usa 'checked', otros usan el valor
      [id]: type === 'checkbox' ? checked : value, 
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // No se necesita transformación compleja (los booleanos ya están bien, texto es texto)
    onSubmit(formData);
  };


  return (
    <form onSubmit={handleSubmit}>
        {/* CORRECCIÓN CLAVE 2: Usar 'id_destino' con encadenamiento opcional en el título */}
        <h3>{initialData?.id_destino ? 'Editar' : 'Crear'} Destino de Viático</h3> 
        {/* FIN CORRECCIÓN CLAVE 2 */}

        {/* Campos de texto/textarea (SIN CAMPO 'codigo') */}
        {/* <Input label="Código:" id="codigo" value={formData.codigo} onChange={handleInputChange} required /> // Campo 'codigo' eliminado */}
        <Input label="Nombre:" id="nombre" value={formData.nombre} onChange={handleInputChange} required />
        {/* --- INPUT PARA NUEVO CAMPO 'descripcion' --- */}
        <Input label="Descripción:" id="descripcion" value={formData.descripcion} onChange={handleInputChange} type="textarea" />
        {/* --- FIN INPUT 'descripcion' --- */}

        {/* Checkboxes (incluye nuevo campo 'es_internacional') */}
        {/* --- CHECKBOX PARA NUEVO CAMPO 'es_internacional' --- */}
          <div className="app-input-container">
            <div>
               <input type="checkbox" id="es_internacional" checked={formData.es_internacional} onChange={handleInputChange} />
               <label htmlFor="es_internacional"> Es Internacional</label>
            </div>
          </div>
        {/* --- FIN CHECKBOX 'es_internacional' --- */}
          <div className="app-input-container">
            <div>
              {/* Checkbox Activo (ya existía) */}
               <input type="checkbox" id="activo" checked={formData.activo} onChange={handleInputChange} />
               <label htmlFor="activo"> Activo</label>
            </div>
          </div>


        {/* Botón de Submit - Deshabilitado si estamos editando Y no hay cambios */}
        <Button 
            type="submit" 
            className="app-button-primary" 
            style={{marginTop: '15px'}}
            // CORRECCIÓN CLAVE 3: Usar 'id_destino' con encadenamiento opcional para deshabilitar
            disabled={initialData?.id_destino && !isFormChanged} 
            // FIN CORRECCIÓN CLAVE 3
        >
            {/* CORRECCIÓN CLAVE 4: Usar 'id_destino' con encadenamiento opcional en el texto del botón */}
            {initialData?.id_destino ? 'Actualizar' : 'Crear'} Destino 
            {/* FIN CORRECCIÓN CLAVE 4 */}
        </Button>
    </form>
  );
}

export default DestinoViaticoForm;