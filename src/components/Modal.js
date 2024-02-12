// Dentro del componente Modal
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import GlobalContext from '../context/GlobalContext';

const Modal = ({ object, isOpen, closeModal, fieldTypes, name, type, recarga, categoria }) => {
    const { API_URL } = useContext(GlobalContext);
    const [originalObject, setOriginalObject] = useState({});
    const [formData, setFormData] = useState({});
    const [imagen, setImagen] = useState();

    useEffect(() => {
        if (object) {
            setOriginalObject(object);
            setFormData(object);
        } else {
            setOriginalObject({});
            setFormData({});
        }
    }, [object]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImagen(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let url;
        if (categoria === "suplementos" || categoria === "alimentos" || categoria === "estanques") {
            url = type === "editar" ? `${API_URL}/Productos/actualizar_producto` : `${API_URL}/Productos/agregar_producto`;
        } else if (categoria === "usuarios" || categoria === "cliente" || categoria === "administrador") {
            url = type === "editar" || type === "editPerf" ? `${API_URL}/Usuarios/actualizar_usuario` : `${API_URL}/Usuarios/agregar_usuario`;
        }

        let data = new FormData();
        if (type === "editar" || type === "editPerf") {
            data.append('id', object.id);
        } else if (type === "agregar") {
            data.append('tipo', categoria);
        }
        if (imagen) {
            data.append('imagen', imagen);
        }
        for (let key in formData) {
            data.append(key, formData[key]);
        }
        axios({
            method: 'post',
            url: url,
            data: data,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                if (response.data.success) {
                    recarga();
                    closeModal();
                    console.log(response.data.message)
                } else {
                    console.error('Error al agregar al usuario:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Informacion no enviada:', error);
            });
    };

    const handleClose = () => {
        setFormData(originalObject);
        closeModal();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            handleClose();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isOpen) return null;

    return (
        <article className="modal fade show d-block bg-black bg-opacity-25" tabIndex="-1" style={{ display: 'block', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999 }} role="dialog">
            <div className="modal-dialog" role="document">
                <div className={`modal-content p-2 ${type === "editar" || type === "editPerf" ? "border-success" : "border-info"} border-3`} style={{ marginTop: "100px" }}>

                    <div className="modal-header">
                        <h5 className="modal-title">{name}</h5>
                        <button type="button" className="btn btn-danger" onClick={handleClose}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {Object.keys(formData).map(key => {
                                if (key !== 'id' && !(type === "editPerf" && key === "tipo")) {
                                    if (key === "tipo") {
                                        return (
                                            <div className="form-group" key={key}>
                                                <label htmlFor={key}>{key.toUpperCase()}</label>
                                                <select className="form-control" id={key} name={key} value={formData[key]} onChange={handleChange}>
                                                    {categoria === "administrador" || categoria === "cliente" || categoria === "usuarios" ?
                                                        <>
                                                            <option value="administrador">Administrador</option>
                                                            <option value="cliente">Cliente</option>
                                                        </>
                                                        :
                                                        (categoria === "suplementos" || categoria === "estanques" || categoria === "alimentos") &&
                                                        <>
                                                            <option value="suplementos">Suplementos</option>
                                                            <option value="estanques">Estanques</option>
                                                            <option value="alimentos">Alimentos</option>
                                                        </>
                                                    }
                                                </select>
                                            </div>
                                        );
                                    } else if (key === "imagen") {
                                        return (
                                            <div className="form-group" key="imagen">
                                                <label htmlFor="imagen">Imagen</label>
                                                <input type="file" className="form-control" id="imagen" name="imagen" onChange={handleImageChange} />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className="form-group" key={key}>
                                                <label htmlFor={key}>{key.toUpperCase()}</label>
                                                <input type={fieldTypes[key]} className="form-control" id={key} name={key} value={formData[key]} onChange={handleChange} />
                                            </div>
                                        );
                                    }
                                } else {
                                    return null;
                                }
                            })}
                            <div className='text-center'>
                                {type === "editar" || type === "editPerf" ? (
                                    <button type="submit" className="btn btn-success mt-2 w-100">Enviar</button>
                                ) : (
                                    <button type="submit" className="btn btn-info mt-2 w-100">Agregar</button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Modal;
