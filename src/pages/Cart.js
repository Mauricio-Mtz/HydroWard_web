import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import GlobalContext from '../config/GlobalContext';

export default function Cart() {
    const { API_URL } = useContext(GlobalContext);
    const sesion = JSON.parse(localStorage.getItem('userData'));
    const navigate = useNavigate();
    const [carrito, setCarrito] = useState([]);
    const carritoString = encodeURIComponent(JSON.stringify(carrito));
    const [totales, setTotales] = useState({
        totalProductos: 0,
        totalPrecio: 0,
        iva: 0,
        totalConIVA: 0,
    });

    useEffect(() => {
        if (!sesion) {
            alert('Debes iniciar sesión para acceder al carrito.')
        }
    }, [sesion, navigate]);


    const fetchCarrito = async () => {
        if (sesion) {
            axios.get(`${API_URL}/carrito/obtener_carrito/${sesion.id}`)
                .then((response) => {
                    setCarrito(response.data.carrito);
                    calcularTotales(response.data.carrito);
                })
                .catch(error => {
                    console.error('Error al obtener el carrito:', error);
                });
        }
    };

    useEffect(() => {
        fetchCarrito();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sesion.id]);

    const calcularTotales = (carritoData) => {
        let totalProductos = 0;
        let totalPrecio = 0;

        carritoData.forEach((item) => {
            totalProductos += item.cantidad;
            totalPrecio += item.precio * item.cantidad;
        });

        const iva = totalPrecio * 0.16;
        const totalConIVA = totalPrecio;
        totalPrecio = totalPrecio - iva;

        setTotales({
            totalProductos,
            totalPrecio,
            iva,
            totalConIVA,
        });
    };


    const handleActualizarCantidad = async (idProducto, nuevaCantidad) => {
        // Lógica para actualizar la cantidad en el backend
    };

    const handleEliminarProducto = async (idProducto, idUsuario) => {
        // Lógica para eliminar el producto del carrito en el backend
    };

    const handleEliminarCarrito = async (idUsuario) => {
        // Lógica para eliminar todo el carrito en el backend
    };

    return (
        <>
            <Navbar />
            <section className="py-5 mt-5">
                <div className="container">
                    <div className="row bg-primary bg-opacity-50 rounded p-4">
                        <h2 className="text-center">CARRITO</h2>
                        <div className="col-md-8" style={{ overflowY: 'auto', minHeight: '412px', maxHeight: '412px' }}>
                            {carrito != null ? (
                                carrito.map((val) => (
                                    <div className="card bg-primary hover-card mt-1" key={val.id}>
                                        <div className="row">
                                            <div className="col-md-4">
                                                {val.imagen ? (
                                                    <img src={`${API_URL}/static/images/${val.imagen}`} className="img-fluid rounded-start h-100" alt={val.nombre} />
                                                ) : (
                                                    <img src={process.env.PUBLIC_URL + "/images/notFound.png"} className="img-fluid rounded-start h-100" alt="Not Found" />
                                                )}
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body">
                                                    <h5 className="card-title">{val.nombre}</h5>
                                                    <p className="card-text">Precio: ${val.precio}</p>
                                                    <p className="card-text">Total: ${val.total}</p>
                                                </div>
                                                <div className="card-footer text-end border-top-0 bg-transparent">
                                                    <div className="d-flex align-items-center mb-1 bg-secondary rounded input-group">
                                                        <input type="number" min="1" className="form-control" value={val.cantidad} onChange={(event) => handleActualizarCantidad(val.ca_clave, event.target.value)} />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">Unidades</span>
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-danger w-100" style={{ padding: '10px', width: '80%' }} onClick={() => handleEliminarProducto(val.ca_clave)}>Eliminar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='row text-center d-flex justify-content-center align-items-center text-warning'>
                                    <h3>Agrega un producto al carrito</h3>
                                </div>
                            )}
                        </div>
                        <div className="col-md-4 d-flex flex-column">
                            <h3>Resumen del carrito</h3>
                            <p>Total de productos: {totales.totalProductos}</p>
                            <p>Total: ${totales.totalPrecio.toFixed(2)}</p>
                            <p>IVA: ${totales.iva.toFixed(2)}</p>
                            <p>Total con IVA: ${totales.totalConIVA.toFixed(2)}</p>
                            <div className="mt-auto">
                                <button className="btn btn-danger w-100" onClick={() => handleEliminarCarrito(sesion.id)}>Eliminar carrito</button>
                                <Link to={`/Pago/carrito/${carritoString}/1`} className="btn btn-success mt-2 w-100">Comprar carrito</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}
