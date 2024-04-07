import React, { useState, useEffect, useContext } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Navbar from './../components/Navbar';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import GlobalContext from '../config/GlobalContext';
import Product from './Product';

export default function Pago() {
    const { API_URL } = useContext(GlobalContext);
    const navigate = useNavigate();
    const sesion = JSON.parse(localStorage.getItem('userData'));
    const { tipoCompra, objeto, cantidad } = useParams();
    const object = JSON.parse(decodeURIComponent(objeto));
    const [direccion, setDireccion] = useState(null);
    const [totales, setTotales] = useState({
        totalProductos: 0,
        subtotal: 0,
        iva: 0,
        total: 0
    });
    const [isPayPalScriptLoaded, setPayPalScriptLoaded] = useState(false);

    // console.log(objeto)
    useEffect(() => {
        selectDir();
        calcularTotales();
        loadPayPalScript();
        if (sesion) {
            if (sesion.tipo === "administrador") {
                navigate("/")
            }
        } else{
            navigate('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const insertDir = () => {
        const formData = new FormData();
        formData.append('id', sesion.id);
        for (let key in direccion) {
            formData.append(key, direccion[key]);
        }
        axios.post(`${API_URL}/pago/insertar_direccion`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                if (response.data.success) {
                    alert("Dirección insertada correctamente.");
                    setDireccion(response.data.direccion);
                } else {
                    console.error('Error al agregar al usuario:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Informacion no enviada:', error);
            });
    };

    const selectDir = () => {
        axios.get(`${API_URL}/pago/obtener_direccion/${sesion.id}`)
            .then((response) => {
                setDireccion(response.data.direccion);
            })
            .catch(error => {
                console.error("Error al obtener la dirección:", error);
            });
    };

    const calcularTotales = () => {
        if (tipoCompra === "carrito") {
            let totalProductos = 0;
            let subtotal = 0;

            object.forEach(item => {
                totalProductos += item.cantidad;
                subtotal += item.cantidad * item.precio;
            });

            const iva = subtotal * 0.16;
            const total = subtotal;
            subtotal = subtotal - iva;
            setTotales({ totalProductos, subtotal, iva, total });
        } else if (tipoCompra === "producto" || tipoCompra === "renovacion") {
            if (object.descuento !== null) {
                let subtotal = cantidad * (object.precio - ((object.precio / 100) * object.descuento)).toFixed(2);
                const iva = subtotal * 0.16;
                const total = subtotal;
                subtotal = subtotal - iva
                setTotales({ totalProductos: 1, subtotal, iva, total });
            } else {
                let subtotal = cantidad * (object.precio);
                const iva = subtotal * 0.16;
                const total = subtotal;
                subtotal = subtotal - iva
                setTotales({ totalProductos: 1, subtotal, iva, total });
            }
        }
    };

    const handlePagar = () => {
        let ruta = "";
        let formData = new FormData();

        if (tipoCompra === "carrito") {
            ruta = `${API_URL}/Pago/comprarCart`;
            formData.append('usuario_id', sesion.id);
            console.log(formData)
        } else if (tipoCompra === "producto") {
            ruta = `${API_URL}/Pago/comprarProd`;
            formData.append('usuario_id', sesion.id);
            formData.append('producto_id', object.id);
            formData.append('cantidad', cantidad);
            formData.append('monto', totales.total);
        } else if (tipoCompra === "renovacion") {
            ruta = `${API_URL}/Pago/renovar`;
            formData.append('usuario_id', sesion.id);
            formData.append('producto_id', object.id);
            formData.append('cantidad', cantidad);
            formData.append('detalle_venta', object.detalle_venta_id);
            formData.append('monto', totales.total);
        }

        axios({
            method: 'post',
            url: ruta,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                if (response.data.success) {
                    navigate("/")
                } else {
                    alert(response.data.message);
                }
            })
            .catch(error => {
                console.error('Error al procesar el pago:', error);
                alert("error");
            });
    };

    const loadPayPalScript = () => {
        try {
            const script = document.createElement("script");
            script.src = `https://www.paypal.com/sdk/js?client-id=Adg2w8GVLBfeD8yfOpHi_EVcEVhtJxDVtM4PH7Zj6nsePkUyzLSmFGr2VBp2yQh6-CmaggA3jjuOUhsj`;
            script.async = true;
            script.onload = () => setPayPalScriptLoaded(true);

            document.body.appendChild(script);
        } catch (error) {
            console.error("Error al cargar el script de PayPal:", error);
        }
    };

    return (
        <>
            <Navbar />
            <section className="py-5 mt-5">
                <div className="container">
                    <div className="row bg-black bg-opacity-50 rounded">
                        <div className="col-md-6 p-3">
                            <form className="container text-primary mt-5 mb-5">
                                <div className="inputBox">
                                    <input className="form-control mb-3" type="text" onChange={(event) => setDireccion({ ...direccion, direccion: event.target.value })} value={direccion?.direccion || ''} required></input>
                                    <span>Direccion</span>
                                </div>
                                <div className="inputBox">
                                    <input type="text" className="form-control mb-3" onChange={(event) => setDireccion({ ...direccion, ciudad: event.target.value, })} value={direccion?.ciudad || ''} required></input>
                                    <span>Ciudad</span>
                                </div>
                                <div className="inputBox">
                                    <input type="text" className="form-control mb-3" onChange={(event) => setDireccion({ ...direccion, estado: event.target.value, })} value={direccion?.estado || ''} required></input>
                                    <span>Estado</span>
                                </div>
                                <div className="inputBox">
                                    <input type="number" className="form-control mb-3" min={1} onChange={(event) => setDireccion({ ...direccion, cp: event.target.value, })} value={direccion?.cp || ''} required></input>
                                    <span>Código Postal</span>
                                </div>
                                <div className="text-center">
                                    <button className='btn btn-success' type="button" onClick={insertDir}>Insertar dirección</button>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-6 p-3">
                            <div className="py-1 text-center">
                                <h1 className="text-primary">Datos de compra</h1>
                            </div>
                            <ul className="list-group mb-3">
                                {tipoCompra === "carrito" ? (
                                    object.map((item, index) => (
                                        <li className="list-group-item d-flex justify-content-between lh-sm" key={index}>
                                            <p>{`${item.cantidad} uds.`}</p>
                                            <p className="my-0">{item.nombre}</p>
                                            <div className='d-grid'>
                                                <span className="text-body-secondary">${item.precio}</span>
                                                <span className="text-body-secondary">${item.cantidad * item.precio}</span>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item d-flex justify-content-between lh-sm">
                                        <p>{`${cantidad} uds.`}</p>
                                        <p className="my-0">{object.nombre}</p>
                                        <div className='d-grid'>
                                            <span className="text-body-secondary">${totales.total}</span>
                                            <span className="text-body-secondary">${totales.subtotal.toFixed(2)}</span>
                                        </div>
                                    </li>
                                )}

                                <li className="list-group-item d-grid justify-content-between">
                                    <div>
                                        <strong>Subtotal (MX):</strong>
                                        <span>${totales.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <strong>IVA (16%):</strong>
                                        <span>${totales.iva.toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <strong>Total (MX):</strong>
                                        <span>${totales.total.toFixed(2)}</span>
                                    </div>
                                </li>
                            </ul>
                            <div className="py-1 text-center">
                                <PayPalScriptProvider options={{ "client-id": "Adg2w8GVLBfeD8yfOpHi_EVcEVhtJxDVtM4PH7Zj6nsePkUyzLSmFGr2VBp2yQh6-CmaggA3jjuOUhsj" }}>
                                    {isPayPalScriptLoaded && (
                                        <PayPalButtons
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [{
                                                        amount: {
                                                            value: totales.total.toFixed(2),
                                                        }
                                                    }]
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                handlePagar();
                                            }}
                                            onCancel={(data) => {
                                                console.log('Pago cancelado');
                                            }}
                                        />
                                    )}
                                </PayPalScriptProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
