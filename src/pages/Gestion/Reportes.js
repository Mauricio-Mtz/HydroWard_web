import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import SlideBar from '../../components/Slidebar';
import Navbar from '../../components/Navbar';
import Tabla from './../../components/Tabla';
import GlobalContext from '../../config/GlobalContext';
import { useParams } from 'react-router-dom';
import ModalPromociones from '../../components/ModalPromociones';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function Reportes() {
    const { API_URL } = useContext(GlobalContext);
    const sesion = JSON.parse(localStorage.getItem('userData'));
    const navigate = useNavigate();
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);
    const [reporteData, setReporteData] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('2024-03-01');
    const [fechaFin, setFechaFin] = useState('2024-05-01');
    const [showModal, setShowModal] = useState(false);
    const [productoId, setProductoId] = useState(null);
    const { accion } = useParams();

    useEffect(() => {
        obtenerReporte();
        if (sesion) {
            if (sesion.tipo === "cliente") {
                navigate("/")
            }
        } else{
            navigate('/')
        }
    }, [API_URL, accion, fechaInicio, fechaFin]);

    const obtenerReporte = async () => {
        try {
            const response = await axios.get(`${API_URL}/Reportes/${accion}/${fechaInicio}/${fechaFin}`);
            // console.log(response.data)
            if (response.data.success) {
                setReporteData(response.data.reporte);
                const columnNames = Object.keys(response.data.reporte[0]).filter(name => name !== 'promocion');
                let columns = columnNames.map(name => ({
                    Header: name.toUpperCase(),
                    accessor: name,
                    Cell: row => {
                        if (name === 'descuento' && row.row.original.promocion === '1') {
                            return `${row.value}%`; // Agrega el símbolo de porcentaje solo si promocion es igual a 1
                        } else {
                            return row.value;
                        }
                    }
                }));

                if (accion === "productos") {
                    columns.push({
                        Header: 'OPCIONES',
                        Cell: row => (
                            <div className='d-flex justify-content-between'>
                                {row.row.original.promocion === '0' ? (
                                    <button className='btn btn-info w-100 ms-1' onClick={() => handlePromociones(row.row.original.id)}>Agregar</button>
                                ) : (
                                    <button className='btn w-100 btn-danger' onClick={() => handleEliminar(row.row.original.id)}>Eliminar</button>
                                )}
                            </div>
                        ),
                    });
                }
                setColumnas(columns);
            } else {
                console.error('Error al obtener el reporte:', response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener el reporte:', error);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarToggled(!isSidebarToggled);
        localStorage.setItem('sb|sidebar-toggle', !isSidebarToggled);
    };

    const handlePromociones = (id) => {
        setShowModal(true);
        setProductoId(id);
    }

    const handleEliminar = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/Promociones/eliminar_promocion/${id}`);
            if (response.data.success) {
                obtenerReporte()
                // console.log(response.data.message)
            } else {
                console.error('Error al modificar la promoción:', response.data.message);
            }
        } catch (error) {
            console.error('Error al modificar la promoción:', error);
        }
    }

    const handleCloseModal = (reloadTable) => {
        setShowModal(false);
        if (reloadTable) {
            obtenerReporte();
        }
    };

    const generarDatosGrafica = () => {
        switch (accion) {
            case 'clientes':
                return reporteData.map(item => ({
                    name: `${item.nombre} ${item.apellido}`,
                    y: parseInt(item.compras)
                }));
            case 'productos':
                return reporteData.map(item => ({
                    name: item.nombre,
                    y: parseFloat(item.total)
                }));
            case 'ventas':
                return reporteData.map(item => ({
                    name: `${item.nombre} ${item.apellido}`,
                    y: parseFloat(item.total)
                }));
            default:
                return [];
        }
    };

    const options = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Distribución de datos'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: 'Compras',
            colorByPoint: true,
            data: generarDatosGrafica()
        }]
    };

    return (
        <>
            <Navbar />
            <div className={`sb-nav-fixed ${isSidebarToggled ? 'sb-sidenav-toggled' : ''}`}>
                <div id="layoutSidenav">
                    <div id="layoutSidenav_nav">
                        <SlideBar onToggleSidebar={toggleSidebar} isSidebarToggled={isSidebarToggled} />
                    </div>
                    <div id="layoutSidenav_content">
                        <main className='p-3'>
                            <div className="container-fluid px-4">
                                <h1 className='mt-4'>{accion === "productos" ? "Reporte de productos" : accion === "clientes" ? "Reporte de clientes" : accion === "ventas" ? "Reporte de ventas" : "Reporte"}</h1>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-table me-1"></i>
                                        {accion === "productos" ? "Productos más vendidos" : accion === "clientes" ? "Clientes que más han comprado" : accion === "ventas" ? "Días con más ventas" : ""}
                                    </div>
                                    <div className="card-body">
                                        <div className='d-flex justify-content-center flex-wrap'>
                                            <div className='p-2'>
                                                <label className="form-label">Fecha de inicio:</label>
                                                <input type="date" className="form-control" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                                            </div>
                                            <div className='p-2'>
                                                <label className="form-label">Fecha de fin:</label>
                                                <input type="date" className="form-control" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                                            </div>
                                        </div>
                                        <Tabla data={reporteData} columns={columnas} />
                                        <ModalPromociones
                                            showModal={showModal}
                                            setShowModal={setShowModal}
                                            productoId={productoId}
                                            handleCloseModal={handleCloseModal}
                                        />
                                        <HighchartsReact
                                            className="mt-3"
                                            highcharts={Highcharts}
                                            options={options}
                                        />
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
