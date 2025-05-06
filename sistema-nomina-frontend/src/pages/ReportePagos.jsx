// src/views/reportes/ReportePagos.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import { 
  Select, 
  Tag, 
  Spin, 
  Descriptions, 
  Divider, 
  Card, 
  message 
} from 'antd';
import { 
  FilePdfOutlined, 
  FileExcelOutlined, 
  PrinterOutlined 
} from '@ant-design/icons';

const { Option } = Select;

const ReportePagos = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState(null);
  const [filtroEmpleado, setFiltroEmpleado] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);

  useEffect(() => {
    cargarDatos();
    cargarEmpleados();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const params = {
        periodo: filtroPeriodo,
        empleadoId: filtroEmpleado
      };
      const response = await api.get(ENDPOINTS.REPORTE_PAGOS, { params });
      setData(response.data);
      setPeriodos([...new Set(response.data.map(item => item.periodo))]);
    } catch (error) {
      message.error('Error al cargar los datos del reporte');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEmpleados = async () => {
    try {
      const response = await api.get(ENDPOINTS.EMPLEADOS);
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al cargar empleados', error);
    }
  };

  const verDetalle = async (idDetalle) => {
    try {
      const response = await api.get(ENDPOINTS.REPORTE_PAGOS_DETALLE(idDetalle));
      setDetalleSeleccionado(response.data);
    } catch (error) {
      message.error('Error al cargar el detalle');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Empleado',
      dataIndex: 'nombre_completo',
      key: 'nombre',
      fixed: 'left',
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          <div style={{ fontSize: 12, color: '#666' }}>{record.puesto}</div>
        </div>
      ),
    },
    {
      title: 'Salario Base',
      dataIndex: 'salario_base',
      key: 'salario',
      align: 'right',
      render: (value) => `Q${value.toFixed(2)}`,
    },
    {
      title: 'Días Trabajados',
      dataIndex: 'dias_trabajados',
      key: 'dias',
      align: 'center',
      render: (dias, record) => (
        <Tag color={dias === record.dias_periodo ? 'green' : 'orange'}>
          {dias}/{record.dias_periodo}
        </Tag>
      ),
    },
    {
      title: 'Periodo',
      dataIndex: 'periodo',
      key: 'periodo',
      render: (text, record) => (
        <div>
          <Tag color="blue">{text}</Tag>
          <div style={{ fontSize: 12 }}>
            {new Date(record.fecha_inicio).toLocaleDateString()} - {new Date(record.fecha_fin).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      title: 'Bono 14',
      dataIndex: 'bono14',
      key: 'bono14',
      align: 'right',
      render: (value) => value ? (
        <Tag color="green">Q{value.toFixed(2)}</Tag>
      ) : '-',
    },
    {
      title: 'Aguinaldo',
      dataIndex: 'aguinaldo',
      key: 'aguinaldo',
      align: 'right',
      render: (value) => value ? (
        <Tag color="green">Q{value.toFixed(2)}</Tag>
      ) : '-',
    },
    {
      title: 'Total',
      dataIndex: 'total_pagar',
      key: 'total',
      align: 'right',
      render: (value, record) => (
        <Button type="link" onClick={() => verDetalle(record.id_detalle)}>
          <strong style={{ color: '#1890ff' }}>Q{value.toFixed(2)}</strong>
        </Button>
      ),
    },
  ];

  return (
    <div className="content-wrapper">
      <div className="page-title">
        <h1>Reporte de Pagos a Empleados</h1>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <Select
              placeholder="Filtrar por periodo"
              style={{ width: 200, marginRight: 8, marginBottom: 8 }}
              onChange={setFiltroPeriodo}
              allowClear
            >
              {periodos.map(periodo => (
                <Option key={periodo} value={periodo}>{periodo}</Option>
              ))}
            </Select>

            <Select
              placeholder="Filtrar por empleado"
              style={{ width: 250, marginRight: 8, marginBottom: 8 }}
              onChange={setFiltroEmpleado}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {empleados.map(emp => (
                <Option key={emp.id_empleado} value={emp.id_empleado}>
                  {`${emp.nombre} ${emp.apellido}`}
                </Option>
              ))}
            </Select>

            <Button type="primary" onClick={cargarDatos}>Filtrar</Button>
          </div>

          <div>
            <Button key="pdf" icon={<FilePdfOutlined />} style={{ marginRight: 8 }}>PDF</Button>
            <Button key="excel" icon={<FileExcelOutlined />} style={{ marginRight: 8 }}>Excel</Button>
            <Button key="print" icon={<PrinterOutlined />}>Imprimir</Button>
          </div>
        </div>

        <div className="card-body">
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id_detalle"
              bordered
              scroll={{ x: 1200 }}
              pagination={{ pageSize: 10 }}
              summary={pageData => {
                let total = 0;
                let totalBono14 = 0;
                let totalAguinaldo = 0;

                pageData.forEach(({ total_pagar, bono14, aguinaldo }) => {
                  total += total_pagar;
                  totalBono14 += bono14 || 0;
                  totalAguinaldo += aguinaldo || 0;
                });

                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <strong>Total General</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <Tag color="green">Bono 14: Q{totalBono14.toFixed(2)}</Tag>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} align="right">
                      <Tag color="green">Aguinaldo: Q{totalAguinaldo.toFixed(2)}</Tag>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} align="right">
                      <strong>Total: Q{total.toFixed(2)}</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />
          </Spin>

          {detalleSeleccionado && (
            <Card
              title={`Detalle de Pago - ${detalleSeleccionado.nombre_completo}`}
              style={{ marginTop: 20 }}
              extra={<Button onClick={() => setDetalleSeleccionado(null)}>Cerrar</Button>}
            >
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Periodo">{detalleSeleccionado.periodo}</Descriptions.Item>
                <Descriptions.Item label="Días Trabajados">
                  {detalleSeleccionado.dias_trabajados}/{detalleSeleccionado.dias_periodo}
                </Descriptions.Item>
                <Descriptions.Item label="Salario Base">Q{detalleSeleccionado.salario_base.toFixed(2)}</Descriptions.Item>
                <Descriptions.Item label="Salario Proporcional">
                  Q{detalleSeleccionado.salario_proporcional.toFixed(2)}
                </Descriptions.Item>
              </Descriptions>

              <Divider orientation="left">Bonificaciones</Divider>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Bono 14">
                  Q{detalleSeleccionado.bono14?.toFixed(2) || '0.00'}
                </Descriptions.Item>
                <Descriptions.Item label="Aguinaldo">
                  Q{detalleSeleccionado.aguinaldo?.toFixed(2) || '0.00'}
                </Descriptions.Item>
              </Descriptions>

              <Divider orientation="left">Descuentos</Divider>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="IGSS">Q{detalleSeleccionado.igss?.toFixed(2) || '0.00'}</Descriptions.Item>
                <Descriptions.Item label="ISR">Q{detalleSeleccionado.isr?.toFixed(2) || '0.00'}</Descriptions.Item>
              </Descriptions>

              <Divider orientation="left">Total</Divider>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Neto a Pagar">
                  <strong style={{ fontSize: '1.2em' }}>
                    Q{detalleSeleccionado.total_pagar.toFixed(2)}
                  </strong>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportePagos;
