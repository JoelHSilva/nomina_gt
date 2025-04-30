// src/components/Forms/EmpleadoForm.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';

import LoadingSpinner from '../Common/LoadingSpinner.jsx';
import api from '../../api/api.jsx';
import { ENDPOINTS } from '../../api/endpoints.jsx';




// Helper para comparar si dos objetos tienen los mismos valores para ciertas claves
function areObjectsEqual(obj1, obj2, keysToCompare) {
    if (!obj1 || !obj2) return obj1 === obj2;

    for (const key of keysToCompare) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        if (key.startsWith('fecha_')) {
            const date1 = val1 ? new Date(val1).toISOString().split('T')[0] : null;
            const date2 = val2 ? new Date(val2).toISOString().split('T')[0] : null;
            if (date1 !== date2) return false;
        }
        else if (typeof val1 === 'string' && typeof val2 === 'string' && !isNaN(parseFloat(val1)) && !isNaN(parseFloat(val2))) {
             if (parseFloat(val1) !== parseFloat(val2)) return false;
        }
        else if (val1 !== val2) {
             if (val1 === '' && val2 === null) continue;
             if (val1 === null && val2 === '') continue;
             return false;
         }
    }
    return true;
}


function EmpleadoForm({ initialData = { id_empleado: undefined }, onSubmit }) {
  const safeInitialData = initialData || { id_empleado: undefined };

  const [formData, setFormData] = useState({
    codigo_empleado: '', nombre: '', apellido: '', dpi: '', nit: '', numero_igss: '',
    fecha_nacimiento: '', genero: '', direccion: '', telefono: '', correo_electronico: '',
    fecha_contratacion: '', fecha_fin_contrato: '', tipo_contrato: '', salario_actual: '',
    cuenta_bancaria: '', banco: '', activo: true, estado: '',
    id_puesto: '',
    id_departamento: '',
  });

  const [puestos, setPuestos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [loadingRelaciones, setLoadingRelaciones] = useState(true);
  const [errorRelaciones, setErrorRelaciones] = useState(null);


  useEffect(() => {
    const fetchRelaciones = async () => {
      try {
        setLoadingRelaciones(true);
        const puestosData = await api.getAll('PUESTOS');
        const cleanedPuestos = puestosData.filter(p => p != null && p.id_puesto != null);
        setPuestos(cleanedPuestos);

        const departamentosData = await api.getAll('DEPARTAMENTOS');
        const cleanedDepartamentos = departamentosData.filter(dep => dep != null && dep.id_departamento != null);
        setDepartamentos(cleanedDepartamentos);

      } catch (err) {
        setErrorRelaciones('Error al cargar puestos y departamentos.');
        console.error('Error fetching relations:', err);
      } finally {
        setLoadingRelaciones(false);
      }
    };
    fetchRelaciones();
  }, []);

  useEffect(() => {
    if (safeInitialData && safeInitialData.id_empleado !== undefined && safeInitialData.id_empleado !== null) {
      console.log("EmpleadoForm: Inicializando en modo Edición con datos:", safeInitialData);
      setFormData({
        codigo_empleado: safeInitialData.codigo_empleado || '', nombre: safeInitialData.nombre || '', apellido: safeInitialData.apellido || '',
        dpi: safeInitialData.dpi || '', nit: safeInitialData.nit || '', numero_igss: safeInitialData.numero_igss || '',
        fecha_nacimiento: safeInitialData.fecha_nacimiento ? new Date(safeInitialData.fecha_nacimiento).toISOString().split('T')[0] : '',
        genero: safeInitialData.genero || '', direccion: safeInitialData.direccion || '', telefono: safeInitialData.telefono || '',
        correo_electronico: safeInitialData.correo_electronico || '',
        fecha_contratacion: safeInitialData.fecha_contratacion ? new Date(safeInitialData.fecha_contratacion).toISOString().split('T')[0] : '',
        fecha_fin_contrato: safeInitialData.fecha_fin_contrato ? new Date(safeInitialData.fecha_fin_contrato).toISOString().split('T')[0] : '',
        tipo_contrato: safeInitialData.tipo_contrato || '',
        salario_actual: safeInitialData.salario_actual || '',
        cuenta_bancaria: safeInitialData.cuenta_bancaria || '', banco: safeInitialData.banco || '',
        activo: safeInitialData.activo === undefined ? true : safeInitialData.activo,
        estado: safeInitialData.estado || 'Activo',
        id_puesto: safeInitialData.id_puesto || '',
        id_departamento: safeInitialData.id_departamento || '',
      });
    } else {
         console.log("EmpleadoForm: Inicializando en modo Creación.");
         setFormData({
             codigo_empleado: '', nombre: '', apellido: '', dpi: '', nit: '', numero_igss: '',
             fecha_nacimiento: '', genero: '', direccion: '', telefono: '', correo_electronico: '',
             fecha_contratacion: '', fecha_fin_contrato: '', tipo_contrato: '', salario_actual: '',
             cuenta_bancaria: '', banco: '', activo: true, estado: 'Activo',
             id_puesto: '',
             id_departamento: '',
         });
     }
  }, [initialData]);


   const editableKeys = useMemo(() => [
       'codigo_empleado', 'nombre', 'apellido', 'dpi', 'nit', 'numero_igss',
       'fecha_nacimiento', 'genero', 'direccion', 'telefono', 'correo_electronico',
       'fecha_contratacion', 'fecha_fin_contrato', 'tipo_contrato', 'salario_actual',
       'cuenta_bancaria', 'banco', 'activo', 'estado', 'id_puesto', 'id_departamento'
   ], []);

   const isFormDirty = useMemo(() => {
       if (!safeInitialData || (safeInitialData.id_empleado === undefined || safeInitialData.id_empleado === null)) {
           return true;
       }

       const currentDataFormatted = {
           ...Object.fromEntries(editableKeys.map(key => [key, formData[key]])),
           id_puesto: formData.id_puesto === '' ? null : parseInt(formData.id_puesto, 10),
           id_departamento: formData.id_departamento === '' ? null : parseInt(formData.id_departamento, 10),
           salario_actual: parseFloat(formData.salario_actual) || 0,
           fecha_nacimiento: formData.fecha_nacimiento || null,
           fecha_contratacion: formData.fecha_contratacion || null,
           fecha_fin_contrato: formData.fecha_fin_contrato || null,
           genero: formData.genero || null, direccion: formData.direccion || null, telefono: formData.telefono || null,
           correo_electronico: formData.correo_electronico || null, tipo_contrato: formData.tipo_contrato || null,
           cuenta_bancaria: formData.cuenta_bancaria || null, banco: formData.banco || null,
           activo: formData.activo,
           estado: formData.estado,
       };

       const initialDataFiltered = Object.fromEntries(editableKeys.map(key => {
            let initialValue = safeInitialData[key];
             if (key.startsWith('fecha_') && initialValue) initialValue = new Date(initialValue).toISOString().split('T')[0];
             if (key === 'salario_actual' && initialValue) initialValue = parseFloat(initialValue);
             if (key === 'id_puesto' && initialValue === '') initialValue = null;
             if (key === 'id_departamento' && initialValue === '') initialValue = null;

             if ((initialValue === '' || initialValue === null) && (currentDataFormatted[key] === '' || currentDataFormatted[key] === null)) {
                 initialValue = currentDataFormatted[key];
             } else if (key === 'id_puesto' || key === 'id_departamento') {
                  initialValue = initialValue === null || initialValue === undefined || initialValue === '' ? null : parseInt(initialValue, 10);
             }

            return [key, initialValue];
        }));

       const areEqual = areObjectsEqual(currentDataFormatted, initialDataFiltered, editableKeys);

       return !areEqual;

   }, [formData, safeInitialData, editableKeys]);


  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
     let newValue = value;
     if (type === 'number' && value !== '') {
         newValue = parseFloat(value);
         if (isNaN(newValue)) newValue = value;
     }

    setFormData(prevFormData => ({ // Usar updater function para setFormData
      ...prevFormData,
      [id]: type === 'checkbox' ? checked : newValue,
    }));
  };

   const handleSelectChange = (e) => {
       const { id, value } = e.target;
        // No convertir a número aquí, solo para id_puesto/id_departamento
       const rawValue = value;

       setFormData(prevFormData => {
           const newState = {
               ...prevFormData,
               [id]: rawValue // Usar el valor crudo por defecto
           };

           // Lógica específica para ID de Puesto/Departamento
           if (id === 'id_departamento') {
               const processedDeptId = rawValue === '' ? '' : parseInt(rawValue, 10); // Convertir ID depto a número o ''
               newState.id_departamento = processedDeptId;
               newState.id_puesto = ''; // Resetear puesto seleccionado

           } else if (id === 'id_puesto' && rawValue !== '') {
               const processedPuestoId = parseInt(rawValue, 10); // Convertir ID puesto a número
               const selectedPuesto = puestos.find(p => p.id_puesto === processedPuestoId);
               newState.id_puesto = processedPuestoId; // Actualizar el ID de puesto

               if (selectedPuesto) {
                   // Auto-seleccionar el departamento asociado al puesto
                   newState.id_departamento = selectedPuesto.id_departamento || ''; // Usar ID o '' si es nulo
               } else {
                   // Si no encuentra el puesto (debería ser raro con el filtro), resetear depto también
                    newState.id_departamento = '';
               }
           } else {
              // Para otros selectores (genero, tipo_contrato, estado), usamos el valor crudo
              // Asegurarse de que los selectores ENUMs usen el valor string
               newState[id] = rawValue;
           }


           return newState;
       });
   };

   // --- Lógica para selectores dependientes: Lista de puestos filtrados ---
   const filteredPuestos = useMemo(() => {
       console.log("Recalculando filteredPuestos. Depto ID:", formData.id_departamento, "Puestos:", puestos);
       // Si no hay departamento seleccionado (formData.id_departamento es '' o null),
       // o si la lista de puestos aún no está cargada, no mostrar puestos o mostrar todos?
       // Decidimos mostrar todos los puestos válidos si no hay departamento seleccionado,
       // o filtrar si sí hay.
       // ** CORREGIDO: Asegurarse de filtrar correctamente si hay departamento seleccionado **
       if (!formData.id_departamento) {
           // Si no hay depto seleccionado, mostrar todos los puestos válidos
           return puestos.filter(puesto => puesto && puesto.id_puesto != null);
       }
       // Si hay un departamento seleccionado, filtrar puestos por ese id_departamento
       const selectedDeptId = parseInt(formData.id_departamento, 10);
       return puestos.filter(puesto =>
           puesto && puesto.id_puesto != null && puesto.id_departamento === selectedDeptId
       );
   }, [puestos, formData.id_departamento]); // Re-calcular cuando cambian puestos o el id_departamento seleccionado en formData


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("EmpleadoForm: handleSubmit llamado. Datos del formulario:", formData);

    const dataToSend = {
        ...formData,
        // Asegurar que IDs de relación son números o null para la API
        // Usar formData.id_puesto/id_departamento ya que handleSelectChange los procesó a número o ''
        id_puesto: formData.id_puesto === '' ? null : formData.id_puesto,
        id_departamento: formData.id_departamento === '' ? null : formData.id_departamento, // Enviar el departamento seleccionado (que puede ser auto-seleccionado por el puesto)
        salario_actual: parseFloat(formData.salario_actual) || 0,
        fecha_nacimiento: formData.fecha_nacimiento || null,
        fecha_contratacion: formData.fecha_contratacion || null,
        fecha_fin_contrato: formData.fecha_fin_contrato || null,
        genero: formData.genero || null,
        direccion: formData.direccion || null,
        telefono: formData.telefono || null,
        correo_electronico: formData.correo_electronico || null,
        tipo_contrato: formData.tipo_contrato || null,
        cuenta_bancaria: formData.cuenta_bancaria || null,
        banco: formData.banco || null,
        activo: formData.activo,
        estado: formData.estado,
    };

     // --- Validaciones Requeridas Reforzadas ---
     if (!dataToSend.codigo_empleado) { console.warn('Validación: Código de empleado es requerido.'); return; }
     if (!dataToSend.nombre) { console.warn('Validación: Nombre es requerido.'); return; }
     if (!dataToSend.apellido) { console.warn('Validación: Apellido es requerido.'); return; }
     if (!dataToSend.dpi) { console.warn('Validación: DPI es requerido.'); return; }
     if (!dataToSend.nit) { console.warn('Validación: NIT es requerido.'); return; }
     if (!dataToSend.fecha_nacimiento) { console.warn('Validación: Fecha de nacimiento es requerida.'); return; }
     if (!dataToSend.genero) { console.warn('Validación: Género es requerido.'); return; }
     if (!dataToSend.fecha_contratacion) { console.warn('Validación: Fecha de contratación es requerida.'); return; }
     if (!dataToSend.tipo_contrato) { console.warn('Validación: Tipo de contrato es requerido.'); return; }
     if (dataToSend.salario_actual <= 0) {
         console.warn('Validación: El salario actual debe ser mayor a 0.');
         return;
     }
     // Asegurarse de que se haya seleccionado tanto Puesto como Departamento
     if (dataToSend.id_puesto === null) { console.warn('Validación: Puesto es requerido.'); return; }
     if (dataToSend.id_departamento === null) { console.warn('Validación: Departamento es requerido.'); return; }


      // Validación de fechas
     const inicio = dataToSend.fecha_contratacion ? new Date(dataToSend.fecha_contratacion) : null;
     const fin = dataToSend.fecha_fin_contrato ? new Date(dataToSend.fecha_fin_contrato) : null;
      if (inicio && fin && inicio.getTime() > fin.getTime()) {
          console.warn('Validación: La fecha de contratación no puede ser posterior a la fecha de fin de contrato.');
          return;
      }
       if (!dataToSend.estado) { console.warn('Validación: Estado es requerido.'); return; }


     // --- Fin Validaciones ---


    console.log("EmpleadoForm: Llamando a onSubmit con datos para API:", dataToSend);
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
        <h3>{safeInitialData && safeInitialData.id_empleado ? 'Editar' : 'Crear'} Empleado</h3>

        <Input label="Código Empleado:" id="codigo_empleado" value={formData.codigo_empleado} onChange={handleInputChange} required />
        <Input label="Nombre:" id="nombre" value={formData.nombre} onChange={handleInputChange} required />
        <Input label="Apellido:" id="apellido" value={formData.apellido} onChange={handleInputChange} required />
        <Input label="DPI:" id="dpi" value={formData.dpi} onChange={handleInputChange} required minLength="13" maxLength="13" />
        <Input label="NIT:" id="nit" value={formData.nit} onChange={handleInputChange} required />
        <Input label="Número IGSS:" id="numero_igss" value={formData.numero_igss} onChange={handleInputChange} />

        <Input label="Fecha de Nacimiento:" id="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleInputChange} required />
         <div className="app-input-container">
             <label htmlFor="genero" className="app-input-label">Género:</label>
             <select id="genero" value={formData.genero} onChange={handleSelectChange} required className="app-input-field">
                 <option value="">-- Seleccione Género --</option>
                 <option value="M">Masculino</option>
                 <option value="F">Femenino</option>
                 <option value="Otro">Otro</option>
             </select>
         </div>
        <Input label="Dirección:" id="direccion" value={formData.direccion} onChange={handleInputChange} type="textarea" />
        <Input label="Teléfono:" id="telefono" type="tel" value={formData.telefono} onChange={handleInputChange} />
        <Input label="Correo Electrónico:" id="correo_electronico" type="email" value={formData.correo_electronico} onChange={handleInputChange} />

         <Input label="Fecha de Contratación:" id="fecha_contratacion" type="date" value={formData.fecha_contratacion} onChange={handleInputChange} required />
         <Input label="Fecha Fin Contrato:" id="fecha_fin_contrato" type="date" value={formData.fecha_fin_contrato} onChange={handleInputChange} />
          <div className="app-input-container">
             <label htmlFor="tipo_contrato" className="app-input-label">Tipo de Contrato:</label>
             <select id="tipo_contrato" value={formData.tipo_contrato} onChange={handleSelectChange} required className="app-input-field">
                  <option value="">-- Seleccione Tipo --</option>
                 <option value="Indefinido">Indefinido</option>
                 <option value="Plazo Fijo">Plazo Fijo</option>
                 <option value="Por Proyecto">Por Proyecto</option>
             </select>
         </div>
        <Input label="Salario Actual (Q):" id="salario_actual" type="number" value={formData.salario_actual} onChange={handleInputChange} required step="0.01" min="0" />

        <Input label="Cuenta Bancaria:" id="cuenta_bancaria" value={formData.cuenta_bancaria} onChange={handleInputChange} />
        <Input label="Banco:" id="banco" value={formData.banco} onChange={handleInputChange} />

         {/* Selección de Estado (ENUM) */}
         <div className="app-input-container">
             <label htmlFor="estado" className="app-input-label">Estado:</label>
             <select id="estado" value={formData.estado} onChange={handleSelectChange} required className="app-input-field">
                 <option value="">-- Seleccione Estado --</option>
                 <option value="Activo">Activo</option>
                 <option value="Inactivo">Inactivo</option>
                 <option value="Suspendido">Suspendido</option>
                 <option value="Vacaciones">Vacaciones</option>
             </select>
         </div>


         <div className="app-input-container">
              <div>
                 <input type="checkbox" id="activo" checked={formData.activo} onChange={handleInputChange} />
                 <label htmlFor="activo"> Activo (Bandera)</label>
              </div>
         </div>

        {/* Relaciones Puesto y Departamento */}
         <div className="app-input-container">
             <label htmlFor="id_departamento" className="app-input-label">Departamento:</label>
             <select id="id_departamento" value={formData.id_departamento || ''} onChange={handleSelectChange} required className="app-input-field">
                  <option value="">-- Seleccione un Departamento --</option>
                 {departamentos.filter(departamento => departamento && departamento.id_departamento != null).map(departamento => (
                     <option key={departamento.id_departamento} value={departamento.id_departamento}>
                         {departamento.nombre}
                     </option>
                 ))}
             </select>
         </div>

        {/* Selector de Puesto (FILTRADO) */}
         <div className="app-input-container">
             <label htmlFor="id_puesto" className="app-input-label">Puesto:</label>
             <select id="id_puesto" value={formData.id_puesto || ''} onChange={handleSelectChange} required className="app-input-field" disabled={!formData.id_departamento}>
                 <option value="">-- Seleccione un Puesto --</option>
                 {/* CORREGIDO: Mapear la lista de puestos FILTRADOS */}
                 {filteredPuestos.map(puesto => ( // Usar filteredPuestos
                     <option key={puesto.id_puesto} value={puesto.id_puesto}>
                         {puesto.nombre}
                     </option>
                 ))}
             </select>
             {!formData.id_departamento && (
                 <p style={{ fontSize: '0.8em', color: '#555' }}>Seleccione un Departamento primero para ver los puestos disponibles.</p>
             )}
              {/* CORREGIDO: Mensaje si no hay puestos filtrados para el departamento seleccionado */}
              {formData.id_departamento && filteredPuestos.length === 0 && (
                  <p style={{ fontSize: '0.8em', color: '#555' }}>No hay puestos disponibles para el departamento seleccionado.</p>
              )}
         </div>


         <div className="app-input-container">
              <div>
                 <input type="checkbox" id="activo" checked={formData.activo} onChange={handleInputChange} />
                 <label htmlFor="activo"> Activo (Bandera)</label>
              </div>
         </div>


        <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}} disabled={safeInitialData && safeInitialData.id_empleado && !isFormDirty}>
            {safeInitialData && safeInitialData.id_empleado ? 'Actualizar' : 'Crear'} Empleado
        </Button>
         {safeInitialData && safeInitialData.id_empleado && !isFormDirty && (
             <p style={{ color: '#555', marginTop: '10px', fontSize: '0.9em' }}>
                 No hay cambios para guardar.
             </p>
         )}
    </form>
  );
}

export default EmpleadoForm;