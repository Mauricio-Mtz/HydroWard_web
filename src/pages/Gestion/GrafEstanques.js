import React, { useState, useEffect, useContext } from 'react';
import SlideBar from '../../components/Slidebar';
import Navbar from '../../components/Navbar';
import GlobalContext from '../../config/GlobalContext';
import { useParams } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsExportData from "highcharts/modules/export-data";
import { getFirestore, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import EnvioFirebase from '../../components/EnvioFirebase';
import '../../config/firebaseConfig';

// Agregar módulos de exportación a Highcharts
HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);

export default function GrafEstanques() {
    const { API_URL } = useContext(GlobalContext);
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);
    const [temperaturaData, setTemperaturaData] = useState([]);
    const [phData, setPhData] = useState([]);
    const [conteoPecesData, setConteoPecesData] = useState([]);
    const { accion } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getFirestore();
                const dataCollection = collection(db, 'sensores');
                const q = query(dataCollection, where("id_estanque", "==", 2));

                // Escucha los cambios en tiempo real
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    let temperaturaList = [];
                    let phList = [];
                    let conteoPecesList = [];

                    querySnapshot.docs.forEach(doc => {
                        const data = doc.data();
                        const fecha = new Date(data.fecha);

                        // Temperatura
                        const temperatura = data.temperatura;
                        temperaturaList.push([fecha, temperatura]);

                        // pH
                        const ph = data.ph;
                        phList.push([fecha, ph]);

                        // Conteo de peces
                        const conteoPeces = data.conteo;
                        conteoPecesList.push([fecha, conteoPeces]);
                    });

                    // Ordena los datos por fecha
                    temperaturaList.sort((a, b) => a[0] - b[0]);
                    phList.sort((a, b) => a[0] - b[0]);
                    conteoPecesList.sort((a, b) => a[0] - b[0]);

                    setTemperaturaData(temperaturaList);
                    setPhData(phList);
                    setConteoPecesData(conteoPecesList);
                });

                // Limpia la escucha cuando el componente se desmonta
                return () => unsubscribe();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarToggled(!isSidebarToggled);
        localStorage.setItem('sb|sidebar-toggle', !isSidebarToggled);
    };

    const getGraficaOptions = (title, data) => {
        return {
            chart: {
                zoomType: 'x',
            },
            title: {
                text: title,
                align: 'left'
            },
            subtitle: {
                text: 'Haz clic y arrastra en el área del gráfico para hacer zoom',
                align: 'left'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Temperatura'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                type: 'area',
                name: 'Temperatura',
                data: data
            }]
        };
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
                                        <div className="mt-2">
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                options={getGraficaOptions("Grafica en funcion de la temperatura", temperaturaData)}
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <HighchartsReact
                                                className="mt-2"
                                                highcharts={Highcharts}
                                                options={getGraficaOptions("Grafica en funcion del ph", phData)}
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <HighchartsReact
                                                className="mt-2"
                                                highcharts={Highcharts}
                                                options={getGraficaOptions("Grafica en funcion de la cantidad de peces", conteoPecesData)}
                                            />
                                        </div>
                                        <EnvioFirebase />
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
