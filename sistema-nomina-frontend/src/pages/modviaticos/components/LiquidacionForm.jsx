import React, { useContext, useEffect, useState } from 'react';
import { ViaticosContext } from '../context/ViaticosContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../styles/LiquidacionForm.css';

const validationSchema = Yup.object().shape({
  solicitudId: Yup.number().required('Solicitud es requerida'),
  anticipoId: Yup.number().required('Anticipo es requerido'),
  gastos: Yup.array()
    .min(1, 'Debe agregar al menos un gasto')
    .of(
      Yup.object().shape({
        id_tipo_viatico: Yup.number().required('Tipo es requerido'),
        fecha_gasto: Yup.date().required('Fecha es requerida'),
        descripcion: Yup.string().required('Descripción es requerida').max(200),
        monto: Yup.number()
          .required('Monto es requerido')
          .positive('Monto debe ser positivo')
          .max(100000, 'Monto máximo es Q100,000'),
        numero_factura: Yup.string().when('tiene_factura', {
          is: true,
          then: Yup.string().required('Número de factura es requerido').max(50),
        }),
        nombre_proveedor: Yup.string().max(200),
        nit_proveedor: Yup.string().matches(
          /^[0-9]+(-[0-9kK])?$/,
          'Formato de NIT inválido'
        ),
        tiene_factura: Yup.boolean().default(true),
      })
    ),
});

const LiquidacionForm = ({ solicitud, onSuccess }) => {
  const { anticipos, fetchAnticipos, tiposViatico, createLiquidacion } =
    useContext(ViaticosContext);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (solicitud?.id_solicitud) {
      fetchAnticipos(solicitud.id_solicitud);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solicitud]);

  const formik = useFormik({
    initialValues: {
      solicitudId: solicitud?.id_solicitud || '',
      anticipoId: '',
      gastos: [
        {
          id_tipo_viatico: '',
          fecha_gasto: '',
          descripcion: '',
          monto: '',
          numero_factura: '',
          nombre_proveedor: '',
          nit_proveedor: '',
          tiene_factura: true,
        },
      ],
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      setError(null);
      try {
        await createLiquidacion(values);
        onSuccess && onSuccess();
      } catch (err) {
        console.error('Error al liquidar viáticos:', err);
        setError(err.message || 'Error al registrar la liquidación');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const addGasto = () => {
    formik.setFieldValue('gastos', [
      ...formik.values.gastos,
      {
        id_tipo_viatico: '',
        fecha_gasto: '',
        descripcion: '',
        monto: '',
        numero_factura: '',
        nombre_proveedor: '',
        nit_proveedor: '',
        tiene_factura: true,
      },
    ]);
  };

  const removeGasto = (index) => {
    const gastos = [...formik.values.gastos];
    gastos.splice(index, 1);
    formik.setFieldValue('gastos', gastos);
  };

  if (!solicitud) return null;

  return (
    <div className="liquidacion-form-container">
      <h2>Liquidación de Viáticos</h2>
      <p>
        Solicitud #{solicitud.id_solicitud} - {solicitud.destino}
      </p>
      <p>Monto aprobado: Q{solicitud.monto_aprobado?.toFixed(2) || '0.00'}</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label>
            Anticipo a liquidar:
            <select
              name="anticipoId"
              value={formik.values.anticipoId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Seleccionar anticipo...</option>
              {anticipos.map((anticipo) => (
                <option key={anticipo.id_anticipo} value={anticipo.id_anticipo}>
                  Anticipo #{anticipo.id_anticipo} - Q{anticipo.monto?.toFixed(2)} (
                  {new Date(anticipo.fecha_entrega).toLocaleDateString()})
                </option>
              ))}
            </select>
            {formik.touched.anticipoId && formik.errors.anticipoId && (
              <div className="error">{formik.errors.anticipoId}</div>
            )}
          </label>
        </div>

        <h3>Detalle de Gastos</h3>
        {formik.touched.gastos && formik.errors.gastos && typeof formik.errors.gastos === 'string' && (
          <div className="error">{formik.errors.gastos}</div>
        )}

        {formik.values.gastos.map((gasto, index) => (
          <div key={index} className="gasto-row">
            <div className="form-group">
              <label>
                Tipo:
                <select
                  name={`gastos[${index}].id_tipo_viatico`}
                  value={gasto.id_tipo_viatico}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Seleccionar...</option>
                  {tiposViatico.map((tipo) => (
                    <option key={tipo.id_tipo_viatico} value={tipo.id_tipo_viatico}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
                {formik.touched.gastos?.[index]?.id_tipo_viatico &&
                  formik.errors.gastos?.[index]?.id_tipo_viatico && (
                    <div className="error">{formik.errors.gastos[index].id_tipo_viatico}</div>
                  )}
              </label>
            </div>

            <div className="form-group">
              <label>
                Fecha:
                <input
                  type="date"
                  name={`gastos[${index}].fecha_gasto`}
                  value={gasto.fecha_gasto}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.gastos?.[index]?.fecha_gasto &&
                  formik.errors.gastos?.[index]?.fecha_gasto && (
                    <div className="error">{formik.errors.gastos[index].fecha_gasto}</div>
                  )}
              </label>
            </div>

            <div className="form-group">
              <label>
                Descripción:
                <input
                  type="text"
                  name={`gastos[${index}].descripcion`}
                  value={gasto.descripcion}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.gastos?.[index]?.descripcion &&
                  formik.errors.gastos?.[index]?.descripcion && (
                    <div className="error">{formik.errors.gastos[index].descripcion}</div>
                  )}
              </label>
            </div>

            <div className="form-group">
              <label>
                Monto:
                <input
                  type="number"
                  step="0.01"
                  name={`gastos[${index}].monto`}
                  value={gasto.monto}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.gastos?.[index]?.monto &&
                  formik.errors.gastos?.[index]?.monto && (
                    <div className="error">{formik.errors.gastos[index].monto}</div>
                  )}
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name={`gastos[${index}].tiene_factura`}
                  checked={gasto.tiene_factura}
                  onChange={formik.handleChange}
                />
                ¿Tiene factura?
              </label>
            </div>

            {gasto.tiene_factura && (
              <>
                <div className="form-group">
                  <label>
                    N° Factura:
                    <input
                      type="text"
                      name={`gastos[${index}].numero_factura`}
                      value={gasto.numero_factura}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.gastos?.[index]?.numero_factura &&
                      formik.errors.gastos?.[index]?.numero_factura && (
                        <div className="error">{formik.errors.gastos[index].numero_factura}</div>
                      )}
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    Proveedor:
                    <input
                      type="text"
                      name={`gastos[${index}].nombre_proveedor`}
                      value={gasto.nombre_proveedor}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.gastos?.[index]?.nombre_proveedor &&
                      formik.errors.gastos?.[index]?.nombre_proveedor && (
                        <div className="error">{formik.errors.gastos[index].nombre_proveedor}</div>
                      )}
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    NIT Proveedor:
                    <input
                      type="text"
                      name={`gastos[${index}].nit_proveedor`}
                      value={gasto.nit_proveedor}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="12345678-9"
                    />
                    {formik.touched.gastos?.[index]?.nit_proveedor &&
                      formik.errors.gastos?.[index]?.nit_proveedor && (
                        <div className="error">{formik.errors.gastos[index].nit_proveedor}</div>
                      )}
                  </label>
                </div>
              </>
            )}

            {formik.values.gastos.length > 1 && (
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeGasto(index)}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}

        <button type="button" className="btn-add" onClick={addGasto}>
          + Agregar Gasto
        </button>

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Procesando...' : 'Registrar Liquidación'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiquidacionForm;