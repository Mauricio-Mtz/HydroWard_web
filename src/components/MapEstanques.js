import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import GlobalContext from '../config/GlobalContext';
import { ModalTitle } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export default function MapEstanques(props) {
    const { API_URL } = useContext(GlobalContext);
    const [selectedEstanque, setSelectedEstanque] = useState(null);
    const [map, setMap] = React.useState(null)
    const [center, setCenter] = useState({ lat: 20.588085, lng: -100.387941 });

    useEffect(() => {
        const fetchData = () => {
            axios
                .get(`${API_URL}/Estanques/obtenerUsuariosConEstanques`)
                .then(response => {
                    if (response.data.success) {

                    } else {
                        console.error('Error al obtener usuarios:', response.data.message);
                    }
                })
                .catch(error => {
                    console.error('Error al obtener usuario:', error);
                });
        };

        if (selectedEstanque) {
            fetchData();
        }
    }, []);


    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyAgUMEHsBYpjuQg8SkQcEQl1fDsr9W0Ptw"
    })
    
    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    return (
        <>
            <Modal show={props.show} onHide={props.onHideGrafica} size='xl'>
                <Modal.Header className='bg-warning bg-opacity-75' closeButton>
                    <ModalTitle>Estanques de los usuarios</ModalTitle>
                </Modal.Header>
                <Modal.Body>
                    <div className="card-body">
                        {props.idEstanques.map(estanque => (
                            <button
                                key={estanque.id}
                                className="btn btn-warning w-100 m-1"
                                onClick={() => {
                                    setSelectedEstanque(estanque);
                                    setCenter({ lat: parseFloat(estanque.latitud), lng: parseFloat(estanque.longitud) });
                                }}
                            >
                                {estanque.id}.- {estanque.nombre}
                            </button>
                        ))}
                        <div>
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={{
                                        width: '100%',
                                        height: '400px'
                                    }}
                                    center={center}
                                    zoom={12}
                                    onLoad={onLoad}
                                    onUnmount={onUnmount}
                                >
                                    {props.idEstanques.map(estanque => (
                                        <Marker 
                                            key={estanque.id}
                                            position={{ lat: parseFloat(estanque.latitud), lng: parseFloat(estanque.longitud) }}
                                        />
                                    ))}
                                </GoogleMap>
                            ) : <></>}
                        </div>
                    </div>
                </Modal.Body >
                <Modal.Footer>
                    <button className='btn btn-warning' onClick={props.onHideGrafica}>
                        Continuar
                    </button>
                </Modal.Footer>
            </Modal >

        </>
    );
}
