// src/components/Forms/PuestoForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';
import api from '../../api/api.jsx';
import { ENDPOINTS } from '../../api/endpoints.jsx';


function PuestoForm({ initialData = { id_puesto: undefined }, onSubmit }) {
  const safeInitialData = initialData || { id_puesto: undefined };

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    salario_base: '', // <-- Añadir salario_base
    activo: true,
    id_departamento: '',
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [loadingRelaciones, setLoadingRelaciones] = useState(true);
  const [errorRelaciones, setErrorRelaciones] = useState(null);


  // Cargar la lista de Departamentos al montar el componente
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        setLoadingRelaciones(true);
        const departamentosData = await api.getAll('DEPARTAMENTOS');
        const cleanedData = departamentosData.filter(dep => dep != null && dep.id_departamento != null);
        setDepartamentos(cleanedData);

      } catch (err) {
        setErrorRelaciones('Error al cargar los departamentos.');
        console.error('Error fetching departments:', err);
      } finally {
        setLoadingRelaciones(false);
      }
    };
    fetchDepartamentos();
  }, []);

  // Efecto para inicializar el formulario cuando initialData cambia
  useEffect(() => {
    if (safeInitialData && safeInitialData.id_puesto !== undefined && safeInitialData.id_puesto !== null) {
      console.log("PuestoForm: Inicializando en modo Edición con datos:", safeInitialData);
      setFormData({
        nombre: safeInitialData.nombre || '',
        descripcion: safeInitialData.descripcion || '',
        salario_base: safeInitialData.salario_base || '', // <-- Cargar salario_base
        activo: safeInitialData.activo === undefined ? true : safeInitialData.activo,
        id_departamento: safeInitialData.id_departamento || '',
      });
    } else {
      console.log("PuestoForm: Inicializando en modo Creación.");
      setFormData({
        nombre: '',
        descripcion: '',
        salario_base: '', // <-- Vacío por defecto
        activo: true,
        id_departamento: '',
      });
    }
  }, [initialData]);


  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
     let newValue = value;
     // Manejar la conversión a número para salario_base también
     if (type === 'number' && value !== '') {
         newValue = parseFloat(value);
         if (isNaN(newValue)) newValue = value; // Si no es un número válido, mantener el string original
     }


    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : newValue,
    });
  };

   const handleSelectChange = (e) => {
       const { id, value } = e.target;
       const processedValue = value === '' ? '' : parseInt(value, 10);

       setFormData({
           ...formData,
           [id]: processedValue
       });
   };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("PuestoForm: handleSubmit llamado. Datos del formulario:", formData);

    const dataToSend = {
        ...formData,
        descripcion: formData.descripcion || null,
         // Asegurar que salario_base sea un número o 0/null si está vacío/NaN
        salario_base: parseFloat(formData.salario_base) || 0, // <-- Incluir y convertir salario_base
        id_departamento: formData.id_departamento === '' ? null : formData.id_departamento,
    };

     // --- Validaciones Básicas ---
     if (!dataToSend.nombre) {
         console.warn('Validación: El nombre del puesto es requerido.');
         return;
     }
      if (dataToSend.id_departamento === null) {
         console.warn('Validación: El departamento del puesto es requerido.');
         return;
     }
     // Opcional: Validar que salario_base sea > 0 si es requerido por tu backend
     if (dataToSend.salario_base <= 0) {
         console.warn('Validación: El salario base debe ser mayor a 0.');
          return;
     }
     // --- Fin Validaciones ---


    console.log("PuestoForm: Llamando a onSubmit con datos para API:", dataToSend);
    onSubmit(dataToSend);
  };


  if (loadingRelaciones) {
      return <LoadingSpinner />;
  }
   if (errorRelaciones) {
       return <div style={{ color: 'red' }}>{errorRelaciones}</div>;
   }


  return (
    <form onSubmit={handleSubmit}>
        <h3>{safeInitialData && safeInitialData.id_puesto ? 'Editar' : 'Crear'} Puesto</h3>

        <Input label="Nombre:" id="nombre" value={formData.nombre} onChange={handleInputChange} required />
        <Input label="Descripción:" id="descripcion" value={formData.descripcion} onChange={handleInputChange} type="textarea" />
        {/* Input para Salario Base */}
        <Input label="Salario Base (Q):" id="salario_base" type="number" value={formData.salario_base} onChange={handleInputChange} required step="0.01" min="0" /> {/* Añadir salario_base */}


         {/* Selector de Departamento */}
         <div className="app-input-container">
             <label htmlFor="id_departamento" className="app-input-label">Departamento:</label>
             <select id="id_departamento" value={formData.id_departamento || ''} onChange={handleSelectChange} required className="app-input-field">
                 <option value="">-- Seleccione un Departamento --</option>
                 {departamentos.filter(dep => dep && dep.id_departamento != null).map(departamento => (
                     <option key={departamento.id_departamento} value={departamento.id_departamento}>
                         {departamento.nombre}
                     </option>
                 ))}
             </select>
         </div>


         <div className="app-input-container">
              <div>
                 <input type="checkbox" id="activo" checked={formData.activo} onChange={handleInputChange} />
                 <label htmlFor="activo"> Activo</label>
              </div>
         </div>


        <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}}>
            {safeInitialData && safeInitialData.id_puesto ? 'Actualizar' : 'Crear'} Puesto
        </Button>
    </form>
  );
}

export default PuestoForm;