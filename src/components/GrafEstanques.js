import React, { useState, useEffect } from 'react';
import { ModalTitle } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsExportData from "highcharts/modules/export-data";
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import EnvioFirebase from './EnvioFirebase';
import '../config/firebaseConfig';

HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);

export default function GrafEstanques(props) {
    const [temperaturaData, setTemperaturaData] = useState([]);
    const [phData, setPhData] = useState([]);
    const [conteoPecesData, setConteoPecesData] = useState([]);
    const [selectedEstanque, setSelectedEstanque] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getFirestore();
                const dataCollection = collection(db, 'sensores');
                const q = query(dataCollection, where("id_estanque", "==", Number(selectedEstanque.id)));

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

        if (selectedEstanque) {
            fetchData();
        }
    }, [selectedEstanque]);

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
            <Modal show={props.show} onHide={props.onHideGrafica} size='xl'>
                <Modal.Header className='bg-info bg-opacity-50' closeButton>
                    <ModalTitle>Estanques de los usuarios</ModalTitle>
                    <p>
                        Muestra información visual sobre los estanques del usuario seleccionado
                    </p>
                </Modal.Header>
                <Modal.Body>
                    <div className="card-body">
                        <div className="d-flex justify-content-around">
                            {props.idEstanques.map(estanque => (
                                <button key={estanque.id} className="btn btn-primary w-100 m-1" onClick={() => setSelectedEstanque(estanque)}>
                                    {estanque.id}.- {estanque.nombre}
                                </button>
                            ))}
                        </div>
                        {selectedEstanque && (
                            <>
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
                            </>
                        )}
                        <EnvioFirebase />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-primary' onClick={props.onHideGrafica}>
                        Continuar
                    </
                    button>
                </Modal.Footer>
            </Modal>

        </>
    );
}
