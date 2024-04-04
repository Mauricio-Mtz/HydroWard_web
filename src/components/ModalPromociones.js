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

        try {
            const response = await axios.post(`${API_URL}/Promociones/agregar_promocion`, formData);
            console.log(response.data);
            handleClose();
            handleCloseModal(true); // Llamada a la función de retorno con valor verdadero
        } catch (error) {
            console.error(error);
        }
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
