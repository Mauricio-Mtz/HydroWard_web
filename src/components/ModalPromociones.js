import React, { useState, useEffect, useContext } from 'react';
import GlobalContext from '../config/GlobalContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

export default function ModalPromociones({ showModal, setShowModal, productoId, handleCloseModal }) {
    const { API_URL } = useContext(GlobalContext);
    const [show, setShow] = useState(false);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [descuento, setDescuento] = useState('');
    const [status, setStatus] = useState(1);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleSubmit = async (event) => {
        event.preventDefault();

        let formData = new FormData();
        formData.append('fecha_inicio', fechaInicio);
        formData.append('fecha_fin', fechaFin);
        formData.append('descuento', descuento);
        formData.append('producto_id', productoId);
        
        axios({
            method: 'post',
            url: `${API_URL}/Promociones/agregar_promocion`,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                console.log(response)
                if (response.data.success) {
                    console.log(response.data.message)
                    handleClose();
                    handleCloseModal(true); 
                } else {
                    console.error('Error al agregar el registro o cambio:', response.data.message);
                    alert(response.data.message);
                }
            })
            .catch(error => {
                console.error('Informacion no enviada:', error);
            });
    };


    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Agregar promoción
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar promoción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="fechaInicio">
                            <Form.Label>Fecha de inicio</Form.Label>
                            <Form.Control type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} required />
                        </Form.Group>

                        <Form.Group controlId="fechaFin">
                            <Form.Label>Fecha de fin</Form.Label>
                            <Form.Control type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} required />
                        </Form.Group>

                        <Form.Group controlId="descuento">
                            <Form.Label>Descuento (%)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                max="100" // Limitar el valor máximo a 100
                                value={descuento}
                                onChange={e => {
                                    const newValue = Math.min(e.target.value, 100); // Asegurarse de que el nuevo valor no supere 100
                                    setDescuento(newValue);
                                }}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Guardar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
