import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import SlideBar from '../../components/Slidebar';
import Navbar from '../../components/Navbar';
import Tabla from './../../components/Tabla';
import GlobalContext from '../../config/GlobalContext';
import { useParams } from 'react-router-dom';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import '../../config/firebaseConfig';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

export default function GrafEstanques() {
    const { API_URL } = useContext(GlobalContext);
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);
    const [reporteData, setReporteData] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const { accion } = useParams();

    const db = getFirestore();

    const [options, setOptions] = useState({
        title: {
            text: 'Temperatura en función del tiempo'
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Fecha'
            }
        },
        yAxis: {
            title: {
                text: 'Temperatura (°C)'
            }
        },
        series: [{
            name: 'Temperatura',
            data: []
        }]
    });

    useEffect(() => {
        const obtenerDatos = async () => {
            const dataCollection = collection(db, 'sensores');
            const dataSnapshot = await getDocs(dataCollection);
            const dataList = dataSnapshot.docs.flatMap(doc => {
                const data = doc.data();
                return data.temperatura.map((temp, index) => {
                    return {
                        temperatura: temp,
                        fecha: data.fecha[index].toDate().getTime()
                    };
                });
            });
            setReporteData(dataList);
    
            setOptions({
                ...options,
                series: [{
                    ...options.series[0],
                    data: dataList.map(item => [item.fecha, item.temperatura])
                }]
            });
        };
    
        obtenerDatos();
    }, [db]);
    

    const toggleSidebar = () => {
        setIsSidebarToggled(!isSidebarToggled);
        localStorage.setItem('sb|sidebar-toggle', !isSidebarToggled);
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
                                <h1>Estanques de los usuarios</h1>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-chart-area me-1"></i>
                                        Muestra información visual sobre los estanques del usuario seleccionado
                                    </div>
                                    <div className="card-body">
                                        <HighchartsReact
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
