import { useState, useEffect } from 'react';
import axios from 'axios';
import { useViaticos } from './useViaticos';

export const useViaticosForm = (initialValues, validationSchema) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const { loading, error, createSolicitud, updateSolicitud, createAnticipo, createLiquidacion } = useViaticos();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    
    setFormValues(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // Validación en tiempo real para campos tocados
    if (touchedFields[name]) {
      validateField(name, finalValue);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleArrayChange = (arrayName, index, fieldName, value) => {
    setFormValues(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [fieldName]: value };
      return { ...prev, [arrayName]: newArray };
    });

    if (touchedFields[`${arrayName}[${index}].${fieldName}`]) {
      validateField(`${arrayName}[${index}].${fieldName}`, value);
    }
  };

  const handleArrayBlur = (arrayName, index, fieldName, value) => {
    const fullFieldName = `${arrayName}[${index}].${fieldName}`;
    setTouchedFields(prev => ({ ...prev, [fullFieldName]: true }));
    validateField(fullFieldName, value);
  };

  const addArrayItem = (arrayName, newItem) => {
    setFormValues(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormValues(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const validateField = async (fieldName, value) => {
    try {
      await validationSchema.validateAt(fieldName, formValues);
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } catch (err) {
      setFormErrors(prev => ({
        ...prev,
        [fieldName]: err.message
      }));
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      setFormErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setFormErrors(newErrors);
      return false;
    }
  };

  const resetForm = () => {
    setFormValues(initialValues);
    setFormErrors({});
    setTouchedFields({});
  };

  const submitSolicitud = async () => {
    const isValid = await validateForm();
    if (!isValid) return false;

    try {
      const result = formValues.id_solicitud 
        ? await updateSolicitud(formValues.id_solicitud, formValues)
        : await createSolicitud(formValues);
      return result;
    } catch (err) {
      console.error('Error submitting solicitud:', err);
      throw err;
    }
  };

  const submitAnticipo = async () => {
    const isValid = await validateForm();
    if (!isValid) return false;

    try {
      const result = await createAnticipo(formValues);
      return result;
    } catch (err) {
      console.error('Error submitting anticipo:', err);
      throw err;
    }
  };

  const submitLiquidacion = async () => {
    const isValid = await validateForm();
    if (!isValid) return false;

    try {
      const result = await createLiquidacion(formValues);
      return result;
    } catch (err) {
      console.error('Error submitting liquidacion:', err);
      throw err;
    }
  };

  return {
    formValues,
    formErrors,
    touchedFields,
    loading,
    error,
    handleChange,
    handleBlur,
    handleArrayChange,
    handleArrayBlur,
    addArrayItem,
    removeArrayItem,
    setFormValues,
    resetForm,
    submitSolicitud,
    submitAnticipo,
    submitLiquidacion,
    validateField,
  };
};

const useViaticosForm = () => {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const response = await axios.get('/api/empleados');
        setEmpleados(response.data);
      } catch (error) {
        console.error('Error cargando empleados:', error);
      }
    };
    cargarEmpleados();
  }, []);

  const camposFormulario = {
    empleadoId: {
      tipo: 'select',
      opciones: empleados.map(e => ({
        valor: e.id,
        etiqueta: `${e.codigo} - ${e.nombre} ${e.apellido}`
      })),
      reglas: { required: 'Seleccione un empleado' }
    },
    // ... resto de campos ...
  };

  return camposFormulario;
};