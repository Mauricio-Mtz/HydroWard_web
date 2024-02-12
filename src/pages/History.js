import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import QRCode from 'qrcode.react';
import axios from 'axios';
import GlobalContext from '../context/GlobalContext';

export default function History() {
    const { API_URL } = useContext(GlobalContext);
    const sesion = JSON.parse(localStorage.getItem('userData'));
    const [selectedCategory, setSelectedCategory] = useState('Productos comprados');
    const [historial, setHistorial] = useState([]);

    useEffect(() => {
        obtenerHistorial();
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const obtenerHistorial = () => {
        axios
            .get(`${API_URL}/History/obtenerHistorial/${sesion.id}`)
            .then(response => {
                if (response.data.success) {
                    setHistorial(response.data.historial);
                } else {
                    console.error(response.data.message);
                }
            })
            .catch(error => {
                console.error('Error al obtener productos:', error);
            });
    };

    const historialFiltrado = selectedCategory === 'Productos comprados' ? historial : historial.filter(venta => venta.productos.some(producto => producto.tipo === 'estanques'));

    return (
        <>
            <Navbar />
            <section className="container mb-4" style={{ marginTop: "90px" }}>
                <div className='text-center'>
                    <h2>HISTORIAL</h2>
                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col m-1">
                        <button type="button" className={`btn btn-primary w-100 ${selectedCategory === 'Productos comprados' ? 'active' : ''}`} onClick={() => handleCategoryChange('Productos comprados')}>PRODUCTOS COMPRADOS</button>
                    </div>

                    <div className="col m-1">
                        <button type="button" className={`btn btn-primary w-100 ${selectedCategory === 'Suscripciones' ? 'active' : ''}`} onClick={() => handleCategoryChange('Suscripciones')}>SUSCRIPCIONES</button>
                    </div>
                </div>
            </section>
            <section className="container">
                <div className="row row-cols-2">
                    {historialFiltrado.map(venta => {
                        const monto = typeof venta.monto === 'number' ? venta.monto : parseFloat(venta.monto);
                        const iva = monto * 0.16;
                        const subtotal = monto - iva;
                        return (
                            <div key={venta.venta_id} className="col mb-2">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title text-warning">Venta ID: {venta.venta_id}</h5>
                                        <p className="card-text text-end">Fecha: {venta.fecha}</p>
                                        <div className="list-group">
                                            {venta.productos.map(producto => (
                                                <div className='list-group-item ' key={producto.nombre}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6 className="mb-1">{producto.nombre}</h6>
                                                            <p className="mb-1"><strong>Cantidad: </strong>{producto.cantidad}</p>
                                                            <p className="mb-0"><strong>Precio: </strong>${producto.precio}</p>
                                                        </div>
                                                        <span className="badge bg-info text-dark rounded-pill">{producto.tipo.toUpperCase()}</span>
                                                    </div>
                                                    {selectedCategory === 'Suscripciones' && producto.tipo === 'estanques' && producto.qr && (
                                                        <div className='d-grid alint-items-center justify-content-center text-center'>
                                                            <QRCode value={producto.qr} className='p-1 bg-white rounded' />
                                                            <p className='container border rounded mt-1'>{producto.qr}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p className="mb-0"><strong>Subtotal: </strong>${subtotal.toFixed(2)}</p>
                                            <p className="mb-0"><strong>IVA (16%): </strong>${iva.toFixed(2)}</p>
                                            <p className="mb-0 text-info">Total: ${monto.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
}
