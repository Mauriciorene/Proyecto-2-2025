import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas, NavDropdown } from "react-bootstrap";
import { useAuth } from "../database/authcontext";
import { useTranslation } from "react-i18next";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";

const Encabezado = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { t, i18n } = useTranslation();

    const cambiarIdioma = (lang) => {
        i18n.changeLanguage(lang);
    };

    const handleLogout = async () => {
        try {
        setIsCollapsed(false);
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("adminPassword");
        await logout();
        navigate("/");
        } catch (error) {
        console.error("Error al cerrar sesión:", error);
        }
    };

    const handleToggle = () => setIsCollapsed(!isCollapsed);
    const handleNavigate = (path) => {
        navigate(path);
        setIsCollapsed(false);
    };

    return (
        <Navbar expand="sm" fixed="top" className="color-navbar">
        <Container>
            <Navbar.Brand onClick={() => handleNavigate("/inicio")} className="text-white" style={{ cursor: "pointer" }}>
            <img alt="Logo" src="/icons/icon-512x512.png" width="30" height="30" className="d-inline-block align-top" />{" "}
            <strong>Ferretería Luna</strong>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar-expand-sm" onClick={handleToggle} />
            <Navbar.Offcanvas
            id="offcanvasNavbar-expand-sm"
            aria-labelledby="offcanvasNavbarLabel-expand-sm"
            placement="end"
            show={isCollapsed}
            onHide={() => setIsCollapsed(false)}
            >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title
                id="offcanvasNavbarLabel-expand-sm"
                className={isCollapsed ? "color-texto-marca" : "text-white"}
                >
                {t('menu.idioma')}
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link onClick={() => handleNavigate("/inicio")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi-house-door-fill me-2"></i>}
                    <strong>{t("menu.inicio")}</strong>
                </Nav.Link>

                <Nav.Link onClick={() => handleNavigate("/productos")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-box-seam-fill me-2"></i>}
                    <strong>{t("menu.productos")}</strong>
                </Nav.Link>

                <Nav.Link onClick={() => handleNavigate("/categorias")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-card-checklist me-2"></i>}
                    <strong>{t("menu.categorias")}</strong>
                </Nav.Link>

                <Nav.Link onClick={() => handleNavigate("/catalogo")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-book-fill me-2"></i>}
                    <strong>{t("menu.catalogo")}</strong>
                </Nav.Link>

                <Nav.Link onClick={() => handleNavigate("/libros")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-book-fill me-2"></i>}
                    <strong>{t("menu.libros")}</strong>
                </Nav.Link>

                <Nav.Link onClick={() => handleNavigate("/clima")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-cloud-sun-fill me-2"></i>}
                    <strong>{t("menu.clima")}</strong>
                </Nav.Link>

                <Nav.Link onClick={() => handleNavigate("/pronunciacion")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-mic-fill me-2"></i>}
                    <strong>{t("menu.pronunciacion")}</strong>
                </Nav.Link>

                <Nav.Link onClick={() => handleNavigate("/estadisticas")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-bar-chart-line-fill me-2"></i>}
                    <strong>{t("menu.estadisticas")}</strong>
                </Nav.Link>

                <Nav.Link onClick={() => handleNavigate("/empleados")} className={isCollapsed ? "color-texto-marca" : "text-white"}>
                    {isCollapsed && <i className="bi bi-bar-chart-line-fill me-2"></i>}
                    <strong>{t("menu.empleados")}</strong>
                </Nav.Link>

                {isLoggedIn ? (
                    <Nav.Link onClick={handleLogout} className={isCollapsed ? "text-black" : "text-white"}>
                    {t("menu.cerrarSesion")}
                    </Nav.Link>
                ) : location.pathname === "/" && (
                    <Nav.Link onClick={() => handleNavigate("/")} className={isCollapsed ? "text-black" : "text-white"}>
                    {t("menu.iniciarSesion")}
                    </Nav.Link>
                )}

                {/* Dropdown de idioma */}
                <NavDropdown
                    title={
                    <span>
                        <i className="bi-translate me-2 icono-blanco"></i>

                        {isCollapsed && <span>{t("menu.idioma")}</span>}
                    </span>
                    }
                    id="basic-nav-dropdown"
                    className={isCollapsed ? "color-texto-marca" : "text-white"}
                >
                    <NavDropdown.Item onClick={() => cambiarIdioma('es')} className="text-black">
                    <strong>{t("menu.español")}</strong>
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => cambiarIdioma('en')} className="text-black">
                    <strong>{t("menu.ingles")}</strong>
                    </NavDropdown.Item>
                </NavDropdown>
                </Nav>
            </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Container>
        </Navbar>
    );
};

export default Encabezado;
