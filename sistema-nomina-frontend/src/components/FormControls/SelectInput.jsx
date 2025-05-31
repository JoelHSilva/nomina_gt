import { Controller } from 'react-hook-form';

export const SelectInput = ({ name, label, opciones, reglas }) => (
  <Controller
    name={name}
    rules={reglas}
    render={({ field, fieldState }) => (
      <div className="form-control">
        <label>{label}</label>
        <select {...field}>
          <option value="">Seleccione...</option>
          {opciones.map((opt) => (
            <option key={opt.valor} value={opt.valor}>
              {opt.etiqueta}
            </option>
          ))}
        </select>
        {fieldState.error && (
          <span className="error">{fieldState.error.message}</span>
        )}
      </div>
    )}
  />
);