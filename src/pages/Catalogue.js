import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";
import { FaEye, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import GlobalContext from '../config/GlobalContext';

export default function Catalogue() {
    const { API_URL } = useContext(GlobalContext);
    const sesion = JSON.parse(localStorage.getItem('userData'));
    const [selectedCategory, setSelectedCategory] = useState('Estanques');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        obtenerProductos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const obtenerProductos = () => {
        axios
            .get(`${API_URL}/catalogo/productos`)
            .then(response => {
                if (response.data.success) {
                    setProducts(response.data.productos);
                } else {
                    console.error(response.data.message);
                }
            })
            .catch(error => {
                console.error('Error al obtener productos:', error);
            });
    };

    const agregarCarrito = (idProd, idUser) => {
        let formData = new FormData();
        formData.append('idProducto', idProd);
        formData.append('idUsuario', idUser);
        formData.append('cantidad', 1);
        axios({
            method: 'post',
            url: `${API_URL}/catalogo/agregar`,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                alert("producto agregado")
            })
            .catch(error => {
                console.error('Error al agregar producto al carrito:', error);
            });
    }


    return (
        <>
            <Navbar />
            <div className="container mb-4" style={{ marginTop: "90px" }}>
                <div className="row d-flex justify-content-center">
                    <div className="col m-1">
                        <button type="button" alt="Boton categoria estanques" className={`btn btn-primary w-100 ${selectedCategory === 'estanques' ? 'active' : ''}`} onClick={() => handleCategoryChange('Estanques')}>Estanques</button>
                    </div>
                    <div className="col m-1">
                        <button type="button" alt="Boton categoria alimentos" className={`btn btn-primary w-100 ${selectedCategory === 'alimentos' ? 'active' : ''}`} onClick={() => handleCategoryChange('Alimentos')}>Alimentos</button>
                    </div>
                    <div className="col m-1">
                        <button type="button" alt="Boton categoria suplementos" className={`btn btn-primary w-100 ${selectedCategory === 'suplementos' ? 'active' : ''}`} onClick={() => handleCategoryChange('Suplementos')}>Suplementos</button>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    {products
                        .filter(product => selectedCategory.toLowerCase() === 'todos' || product.tipo.toLowerCase() === selectedCategory.toLowerCase())
                        .map(product => (
                            <div key={product.id} className={product.tipo === 'estanques' ? "col-sm-6 col-12 mb-4" : "col-lg-3 col-md-4 col-sm-6 col-12 mb-4"}>
                                <div className="card h-100 border-3 border-primary" alt={"Carta de producto " + product.nombre}>
                                    {product.imagenes.length > 0 ? (
                                        <img
                                            className="card-img-top"
                                            src={`${API_URL}/static/images/${product.imagenes[0].nombre}`}
                                            alt={product.imagenes[0].nombre}
                                            style={product.tipo === 'estanques' ? { maxHeight: "380px" } : { maxHeight: "184.5px" }}
                                        />
                                    ) : (
                                        <img
                                            className="card-img-top"
                                            src={process.env.PUBLIC_URL + "/images/notFound.png"}
                                            alt="Not Found"
                                            style={{ maxHeight: "306.5px" }}
                                        />
                                    )}
                                    <div className="card-body d-grid">
                                        <h5 className="card-title h-50">{product.nombre}</h5>
                                        <p className="card-text h-25">Precio: ${product.precio}</p>
                                        <div className="d-flex">
                                            {product.tipo !== "estanques" && (
                                                <button
                                                    className="btn btn-success m-1 w-100"
                                                    onClick={() => sesion ? agregarCarrito(product.id, sesion.id) : null}
                                                    disabled={!sesion || (sesion && sesion.tipo !== "cliente")} 
                                                    alt="Boton para agregar al carrito"
                                                >
                                                    <FaShoppingCart />
                                                </button>
                                            )}
                                            <Link className="btn btn-info m-1 w-100" to={`/product/${product.id}`} alt="Boton para ver mas sobre el producto"><FaEye /></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}
