import React, { useContext, useState, useEffect } from 'react';
import { ViaticosContext } from '../context/ViaticosContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../styles/ViaticoForm.css';

// Esquema de validación compatible con el backend
const validationSchema = Yup.object().shape({
  id_empleado: Yup.number().required('Empleado es requerido'),
  fecha_inicio_viaje: Yup.date()
    .required('Fecha inicio es requerida')
    .min(new Date(), 'La fecha debe ser futura'),
  fecha_fin_viaje: Yup.date()
    .required('Fecha fin es requerida')
    .min(Yup.ref('fecha_inicio_viaje'), 'La fecha fin debe ser posterior a inicio'),
  destino: Yup.string().required('Destino es requerido').max(200),
  motivo: Yup.string().required('Motivo es requerido').min(10).max(500),
  detalles: Yup.array()
    .min(1, 'Debe agregar al menos un detalle')
    .of(
      Yup.object().shape({
        id_tipo_viatico: Yup.number().required('Tipo es requerido'),
        descripcion: Yup.string().required('Descripción es requerida').max(200),
        monto: Yup.number()
          .required('Monto es requerido')
          .positive('Monto debe ser positivo')
          .max(100000, 'Monto máximo es Q100,000'),
      })
    ),
});

const ViaticoForm = ({ onSuccess }) => {
  const { createSolicitud, tiposViatico = [], loadingTipos } = useContext(ViaticosContext);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      id_empleado: '',
      fecha_inicio_viaje: '',
      fecha_fin_viaje: '',
      destino: '',
      motivo: '',
      detalles: [{ id_tipo_viatico: '', descripcion: '', monto: '' }],
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      setError(null);
      try {
        await createSolicitud(values);
        onSuccess && onSuccess();
      } catch (err) {
        console.error('Error al crear solicitud:', err);
        setError(err.message || 'Error al guardar la solicitud');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const addDetalle = () => {
    formik.setFieldValue('detalles', [
      ...formik.values.detalles,
      { id_tipo_viatico: '', descripcion: '', monto: '' },
    ]);
  };

  const removeDetalle = (index) => {
    const detalles = [...formik.values.detalles];
    detalles.splice(index, 1);
    formik.setFieldValue('detalles', detalles);
  };

  // Mostrar loading si los tipos aún no están cargados
  if (loadingTipos) {
    return <div className="viatico-form-container">Cargando tipos de viáticos...</div>;
  }

  return (
    <div className="viatico-form-container">
      <h2>{formik.values.id_solicitud ? 'Editar' : 'Nueva'} Solicitud de Viáticos</h2>
      
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label>
            ID Empleado:
            <input
              type="number"
              name="id_empleado"
              value={formik.values.id_empleado}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.id_empleado && formik.errors.id_empleado && (
              <div className="error">{formik.errors.id_empleado}</div>
            )}
          </label>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Fecha Inicio:
              <input
                type="date"
                name="fecha_inicio_viaje"
                value={formik.values.fecha_inicio_viaje}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fecha_inicio_viaje && formik.errors.fecha_inicio_viaje && (
                <div className="error">{formik.errors.fecha_inicio_viaje}</div>
              )}
            </label>
          </div>

          <div className="form-group">
            <label>
              Fecha Fin:
              <input
                type="date"
                name="fecha_fin_viaje"
                value={formik.values.fecha_fin_viaje}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fecha_fin_viaje && formik.errors.fecha_fin_viaje && (
                <div className="error">{formik.errors.fecha_fin_viaje}</div>
              )}
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>
            Destino:
            <input
              type="text"
              name="destino"
              value={formik.values.destino}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.destino && formik.errors.destino && (
              <div className="error">{formik.errors.destino}</div>
            )}
          </label>
        </div>

        <div className="form-group">
          <label>
            Motivo:
            <textarea
              name="motivo"
              value={formik.values.motivo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.motivo && formik.errors.motivo && (
              <div className="error">{formik.errors.motivo}</div>
            )}
          </label>
        </div>

        <h3>Detalles de Viáticos</h3>
        {formik.touched.detalles && formik.errors.detalles && typeof formik.errors.detalles === 'string' && (
          <div className="error">{formik.errors.detalles}</div>
        )}

        {formik.values.detalles.map((detalle, index) => (
          <div key={index} className="detalle-row">
            <div className="form-group">
              <label>
                Tipo:
                <select
                  name={`detalles[${index}].id_tipo_viatico`}
                  value={detalle.id_tipo_viatico}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Seleccionar...</option>
                  {tiposViatico && tiposViatico.map((tipo) => (
                    <option key={tipo.id_tipo_viatico} value={tipo.id_tipo_viatico}>
                      {tipo.nombre} (Max: Q{tipo.monto_maximo?.toFixed(2) || 'Sin límite'})
                    </option>
                  ))}
                </select>
                {formik.touched.detalles?.[index]?.id_tipo_viatico &&
                  formik.errors.detalles?.[index]?.id_tipo_viatico && (
                    <div className="error">{formik.errors.detalles[index].id_tipo_viatico}</div>
                  )}
              </label>
            </div>

            <div className="form-group">
              <label>
                Descripción:
                <input
                  type="text"
                  name={`detalles[${index}].descripcion`}
                  value={detalle.descripcion}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.detalles?.[index]?.descripcion &&
                  formik.errors.detalles?.[index]?.descripcion && (
                    <div className="error">{formik.errors.detalles[index].descripcion}</div>
                  )}
              </label>
            </div>

            <div className="form-group">
              <label>
                Monto:
                <input
                  type="number"
                  step="0.01"
                  name={`detalles[${index}].monto`}
                  value={detalle.monto}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.detalles?.[index]?.monto &&
                  formik.errors.detalles?.[index]?.monto && (
                    <div className="error">{formik.errors.detalles[index].monto}</div>
                  )}
              </label>
            </div>

            {formik.values.detalles.length > 1 && (
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeDetalle(index)}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}

        <button type="button" className="btn-add" onClick={addDetalle}>
          + Agregar Detalle
        </button>

        <div className="form-actions">
          <button type="submit" disabled={submitting || loadingTipos}>
            {submitting ? 'Guardando...' : 'Guardar Solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViaticoForm;