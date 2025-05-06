// routes/nominas.routes.js
const express = require('express');
const router = express.Router();
const nominasController = require('../controllers/nominas.controller');
const db = require('../models');
const CalculosService = require('../services/calculos.service');
const calculosService = new CalculosService();

router.get('/reportes/pagos', async (req, res) => {
  try{
      const { periodo, empleadoId } = req.query;

      const query =  `
      SELECT 
        e.id_empleado,
        CONCAT(e.nombre, ' ', e.apellido) AS nombre_completo,
        p.nombre AS puesto,
        e.salario_base,
        dn.id_detalle,
        dn.fecha_inicio_periodo AS fecha_inicio,
        dn.fecha_fin_periodo AS fecha_fin,
        CONCAT('Periodo ', YEAR(dn.fecha_inicio_periodo), '-', MONTH(dn.fecha_inicio_periodo)) AS periodo,
        DATEDIFF(dn.fecha_fin_periodo, dn.fecha_inicio_periodo) AS dias_periodo,
        DATEDIFF(
          LEAST(dn.fecha_fin_periodo, IFNULL(e.fecha_baja, dn.fecha_fin_periodo)),
          GREATEST(dn.fecha_inicio_periodo, e.fecha_ingreso)
        ) AS dias_trabajados,
        n.id_nomina
      FROM 
        empleados e
      JOIN 
        detalle_nomina dn ON e.id_empleado = dn.id_empleado
      JOIN
        puestos p ON e.id_puesto = p.id_puesto
      JOIN
        nominas n ON dn.id_nomina = n.id_nomina
      WHERE 
        n.estado = 'PROCESADA'
        ${periodo ? `AND CONCAT('Periodo ', YEAR(dn.fecha_inicio_periodo), '-', MONTH(dn.fecha_inicio_periodo)) = :periodo` : ''}
        ${empleadoId ? `AND e.id_empleado = :empleadoId` : ''}
      ORDER BY
        dn.fecha_inicio_periodo DESC, e.nombre ASC
    `;

    const replacements = {};
    if (periodo) replacements.periodo = periodo;
    if (empleadoId) replacements.empleadoId = empleadoId;

    const [results] = await db.sequelize.query(query, { replacements });

    const resultadosConCalculos = await Promise.all(results.map(async (item) => {
      const fechaActual = new Date();
      const anioActual = fechaActual.getFullYear();

      //Calculo Bono 14(solo en Julio)
      let bono14 = 0;
      if(fechaActual.getMonth() === 6){
          const diasTrabajadosAnio = await calcularDiasTrabajadosAnio(item.id_empleado, anioActual);
          bono14 = await calculosService.calcularBono14Proporcional(item.salario_base, diasTrabajadosAnio);
      }

      //Calculo de Aguinaldo (solo en diciembre)
      let aguinaldo = 0;
      if(fechaActual.getMonth() === 11){
          const diasTrabajadosSemestre = await calcularDiasTrabajadosSemestre(item.id_empleado, anioActual);
          aguinaldo = await calculosService.calcularAguinaldoProporcional(item.salario_base, diasTrabajadosSemestre);
      }

      //Calculo de descuentos
      const igss = await calculosService.calcularIGSS(item.salario_base, anioActual);
      const { isrMensual } = await calculosService.calcularISR(item.salario_base, anioActual);

      //Salario Proporcional
      const salarioProporcional = item.salario_base * (item.dias_trabajados / item.dias_periodo);

      //Conceptos aplicados
      const conceptos = await obtenerConceptosAplicados(item.id_detalle);

      return{
          ...item,
          salario_proporcional: salarioProporcional,
          bono14,
          aguinaldo,
          igss,
          isr: isrMensual,
          total_pagar: salarioProporcional + bono14 + aguinaldo - igss -isrMensual,
          coneptos_aplicados: conceptos
      };
    }));

    res.json(resultadosConCalculos);
  }catch(error){
      console.error(error);
      res.status(500).json({ error: "Error al generar el reporte de pagos" });
  }
});

router.get("/reportes/pagos/:id/detalle", async (req, res) => {
  try{
      const{ id } = req.params;

      const query = `
    SELECT 
      dn.*,
      e.*,
      p.nombre AS puesto,
      CONCAT('Periodo ', YEAR(n.fecha_inicio), '-', MONTH(n.fecha_inicio)) AS periodo,
      n.fecha_inicio,
      n.fecha_fin,
      DATEDIFF(dn.fecha_fin_periodo, dn.fecha_inicio_periodo) AS dias_periodo,
      DATEDIFF(
        LEAST(dn.fecha_fin_periodo, IFNULL(e.fecha_baja, dn.fecha_fin_periodo)),
        GREATEST(dn.fecha_inicio_periodo, e.fecha_ingreso)
      ) AS dias_trabajados
    FROM 
      detalle_nomina dn
    JOIN 
      empleados e ON dn.id_empleado = e.id_empleado
    JOIN
      puestos p ON e.id_puesto = p.id_puesto
    JOIN
      nominas n ON dn.id_nomina = n.id_nomina
    WHERE 
      dn.id_detalle = :id
  `;

  const [results] = await db.sequelize.query(query, { replacements: { id } });

  if(results.length === 0){
      return res.status(404).json({ error: "Detalle de pago no encontrado " });
  }
  const detalle = results[0];
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();

  //Calculos adicionales
  const salarioProporcional = detalle.salario_base * (detalle.dias_trabajados / detalle.dias_periodo);
  const igss = await calculosService.calcularIGSS(detalle.salario_base, anioActual);
  const { isrMensual } = await calculosService.calcularISR(detalle.salario_base, anioActual);

  let bono14 = 0;
  let aguinaldo = 0;

  if(fechaActual.getMonth() === 6){
      const diasTrabajadosAnio = await calcularDiasTrabajadosAnio(detalle.id_empleado, anioActual);
      bono14 = await calcularBono14Proporcional(detalle.salario_base, diasTrabajadosAnio);
  }

  if(fechaActual.getMonth() === 11){
      const diasTrabajadosSemestre = await calcularDiasTrabajadosSemestre(detalle.id_empleado, anioActual);
      aguinaldo = await calculosService.calcularAguinaldoProporcional(detalle.salario_base, diasTrabajadosSemestre);
  }

  //Conceptos aplicados
  const conceptos = await obtenerConceptosAplicados(detalle.id_detalle);

  res.json({
      ...detalle,
      nombre_completo: `${detalle.nombre} ${detalle.apellido}`,
      salario_proporcional: salarioProporcional,
      bono14,
      aguinaldo,
      igss,
      isr: isrMensual,
      total_pagar: salarioProporcional + bono14 + aguinaldo - igss -isrMensual,
      coneptos_aplicados: conceptos
  });

  }catch (error){
      console.error(error);
      res.status(500).json({ error: "Error al obtener el detalle de pago " });
  } 
});

async function calcularDiasTrabajadosAnio(idEmpleado, anio){
  const [result] = await db.sequelize.query(`
  SELECT DATEDIFF(
    LEAST(
      IFNULL(fecha_baja, LAST_DAY(CONCAT(:anio, '-12-31'))),
      GREATEST(fecha_ingreso, CONCAT(:anio, '-01-01'))
    )
  ) AS dias
  FROM empleados
  WHERE id_empleado = :idEmpleado
`, { replacements: { anio, idEmpleado } });

return result[0]?.dias || 0;
}

async function calcularDiasTrabajadosSemestre(idEmpleado, anio){
  const [result] = await db.sequelize.query(`
  SELECT DATEDIFF(
    LEAST(
      IFNULL(fecha_baja, LAST_DAY(CONCAT(:anio, '-12-31'))),
      GREATEST(fecha_ingreso, CONCAT(:anio, '-07-01'))
    )
  ) AS dias
  FROM empleados
  WHERE id_empleado = :idEmpleado
`, { replacements: { anio, idEmpleado } });

return result[0]?.dias || 0;
}

async function obtenerConceptosAplicados(idDetalle){
  const [results] = await db.sequelize.query(`
  SELECT 
    cp.nombre,
    ca.monto
  FROM 
    conceptos_aplicados ca
  JOIN 
    conceptos_pago cp ON ca.id_concepto = cp.id_concepto
  WHERE 
    ca.id_detalle = :idDetalle
`, { replacements: { idDetalle }});

return results;
}

router.get('/', nominasController.getAllNominas);
router.get('/:id', nominasController.getNominaById);
router.post('/', nominasController.createNomina);
router.put('/:id', nominasController.updateNomina);
router.delete('/:id', nominasController.deleteNomina);
router.put('/:id/verificar', nominasController.verificarNomina);
router.put('/:id/aprobar', nominasController.aprobarNomina);
router.put('/:id/pagar', nominasController.pagarNomina);

module.exports = router;