import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import GlobalContext from '../config/GlobalContext';
import { ModalTitle } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const center = {
    lat: 20.656,
    lng: -100.39
};

export default function MapEstanques(props) {
    const { API_URL } = useContext(GlobalContext);
    const [selectedEstanque, setSelectedEstanque] = useState(null);
    // console.log(props.idEstanques[0].latitud)
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

    const [map, setMap] = React.useState(null)

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
                        <div className="d-flex justify-content-around">
                            {props.idEstanques.map(estanque => (
                                <button key={estanque.id} className="btn btn-warning w-100 m-1" onClick={() => setSelectedEstanque(estanque)}>
                                    {estanque.id}.- {estanque.nombre}
                                </button>
                            ))}
                        </div>
                        <div>
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={{
                                        width: '100%',
                                        height: '400px'
                                    }}
                                    center={center}
                                    zoom={14}
                                    onLoad={onLoad}
                                    onUnmount={onUnmount}
                                >
                                    <Marker
                                        position={center}
                                    />
                                    <></>
                                </GoogleMap>
                            ) : <></>}
                        </div>
                    </div>
                </Modal.Body >
                <Modal.Footer>
                    <button className='btn btn-warning' onClick={props.onHideGrafica}>
                        Continuar
                    </
                    button>
                </Modal.Footer>
            </Modal >

        </>
    );
}
