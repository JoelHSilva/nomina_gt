// src/components/Common/Table.jsx
import React from 'react';
// No necesitas importar el CSS aquí

function Table({ data, columns }) {
  if (!data || data.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  return (
    // Usa la clase del CSS para el contenedor con scroll horizontal
    <div className="app-table-container">
      {/* Usa la clase del CSS para la tabla */}
      <table className="app-table">
        <thead>
          <tr>
            {columns.map((col) => (
              // Usa la clase del CSS para los encabezados de tabla
              <th key={col.key}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={item.id || rowIndex}>
              {columns.map((col) => (
                 // Usa la clase del CSS para las celdas de tabla
                <td key={`${item.id || rowIndex}-${col.key}`}>
                  {col.render ? col.render(item[col.key], item) : (item[col.key] instanceof Date ? item[col.key].toLocaleDateString() : String(item[col.key]))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;