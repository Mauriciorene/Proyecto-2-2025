import React, { useState, useEffect } from 'react';
import { Container, Button } from "react-bootstrap";
import ModalInstalacionIOS from "../components/inicio/ModalInstalacionIOS";
import { useNavigate } from "react-router-dom";

const Inicio = () => {
    const navigate = useNavigate();

    const [solicitudInstalacion, setSolicitudInstalacion] = useState(null);
    const [mostrarBotonInstalacion, setMostrarBotonInstalacion] = useState(false);
    const [esDispositivoIOS, setEsDispositivoIOS] = useState(false);
    const [mostrarModalInstrucciones, setMostrarModalInstrucciones] = useState(false);

    // Funciones para mostrar/ocultar el modal en iOS
    const abrirModalInstrucciones = () => {
        setMostrarModalInstrucciones(true);
    };

    const cerrarModalInstrucciones = () => {
        setMostrarModalInstrucciones(false);
    };

    // Detectar si es iOS
    useEffect(() => {
        const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setEsDispositivoIOS(esIOS);
    }, []);

    // Manejar evento 'beforeinstallprompt'
    useEffect(() => {
        const manejarSolicitudInstalacion = (evento) => {
            evento.preventDefault();
            setSolicitudInstalacion(evento);
            setMostrarBotonInstalacion(true);
        };

        window.addEventListener("beforeinstallprompt", manejarSolicitudInstalacion);

        return () => {
            window.removeEventListener("beforeinstallprompt", manejarSolicitudInstalacion);
        };
    }, []);

    const instalacion = async () => {
        if (!solicitudInstalacion) {
            if (esDispositivoIOS) {
                abrirModalInstrucciones();
            }
            return;
        }

        try {
            await solicitudInstalacion.prompt();
            const { outcome } = await solicitudInstalacion.userChoice;
            console.log(outcome === "accepted" ? "Instalación aceptada" : "Instalación rechazada");
        } catch (error) {
            console.error("Error al intentar instalar la PWA:", error);
        } finally {
            setSolicitudInstalacion(null);
            setMostrarBotonInstalacion(false);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <Container className="my-4">
            <h1>Inicio</h1>

            {/* Navegación */}
            <Button className="me-2" onClick={() => handleNavigate("/categorias")}>
            Ir a Categorías
            </Button>
            <Button className="me-2" onClick={() => handleNavigate("/productos")}>
            Ir a Productos
            </Button>
            <Button className="me-2" onClick={() => handleNavigate("/catalogo")}>
            Ir a Catálogo
            </Button>
            <Button onClick={() => handleNavigate("/Libros")}>
            Ir a Libros
            </Button>

            {/* Botón para instalar dependiendo del dispositivo */}
            <br/>
            {!esDispositivoIOS && mostrarBotonInstalacion && (
                <div className="my-4">
                    <Button variant="success" onClick={instalacion}>
                        Instalar app Ferretería
                    </Button>
                </div>
            )}

            {esDispositivoIOS && (
                <div className="my-4">
                    <Button className="sombra" variant="primary" onClick={abrirModalInstrucciones}>
                        Cómo instalar Ferretería en iPhone <i className="bi bi-phone"></i>
                    </Button>
                </div>
            )}

            <ModalInstalacionIOS
                mostrar={mostrarModalInstrucciones}
                cerrar={cerrarModalInstrucciones}
            />
        </Container>
    );
};

export default Inicio;
