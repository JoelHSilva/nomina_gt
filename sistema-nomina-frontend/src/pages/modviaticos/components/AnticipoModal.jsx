import React, { useContext, useState } from 'react';
import { ViaticosContext } from '../context/ViaticosContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../styles/AnticipoModal.css';

const validationSchema = Yup.object().shape({
  solicitudId: Yup.number().required('Solicitud es requerida'),
  monto: Yup.number()
    .required('Monto es requerido')
    .positive('Monto debe ser positivo')
    .max(100000, 'Monto máximo es Q100,000'),
  metodoPago: Yup.string()
    .required('Método es requerido')
    .oneOf(['Efectivo', 'Transferencia', 'Cheque'], 'Método inválido'),
  referencia: Yup.string().when('metodoPago', {
    is: (metodo) => metodo !== 'Efectivo',
    then: Yup.string().required('Referencia es requerida').max(100),
    otherwise: Yup.string(),
  }),
});

const AnticipoModal = ({ solicitud, onClose, onSuccess }) => {
  const { createAnticipo } = useContext(ViaticosContext);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      solicitudId: solicitud?.id_solicitud || '',
      monto: solicitud?.monto_aprobado || '',
      metodoPago: 'Efectivo',
      referencia: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      setError(null);
      try {
        await createAnticipo(values);
        onSuccess && onSuccess();
        onClose();
      } catch (err) {
        console.error('Error al registrar anticipo:', err);
        setError(err.message || 'Error al registrar el anticipo');
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!solicitud) return null;

  return (
    <div className="modal-overlay">
      <div className="anticipo-modal">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2>Registrar Anticipo</h2>
        <p>
          Solicitud #{solicitud.id_solicitud} - {solicitud.destino}
        </p>
        <p>Monto aprobado: Q{solicitud.monto_aprobado?.toFixed(2) || '0.00'}</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>
              Monto a entregar:
              <input
                type="number"
                step="0.01"
                name="monto"
                value={formik.values.monto}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                max={solicitud.monto_aprobado}
              />
              {formik.touched.monto && formik.errors.monto && (
                <div className="error">{formik.errors.monto}</div>
              )}
            </label>
          </div>

          <div className="form-group">
            <label>
              Método de pago:
              <select
                name="metodoPago"
                value={formik.values.metodoPago}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Cheque">Cheque</option>
              </select>
              {formik.touched.metodoPago && formik.errors.metodoPago && (
                <div className="error">{formik.errors.metodoPago}</div>
              )}
            </label>
          </div>

          {formik.values.metodoPago !== 'Efectivo' && (
            <div className="form-group">
              <label>
                Referencia:
                <input
                  type="text"
                  name="referencia"
                  value={formik.values.referencia}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.referencia && formik.errors.referencia && (
                  <div className="error">{formik.errors.referencia}</div>
                )}
              </label>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Registrando...' : 'Registrar Anticipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnticipoModal;