import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

// Expresiones regulares y listas
const palabrasInapropiadas = ["inapropiado", "ofensivo", "malo"];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const letrasEspaciosRegex = /^[A-Za-z\s]+$/;
const telefonoRegex = /^\d{4}-\d{4}$/;
const cedulaRegex = /^\d{3}-\d{6}-\d{4}[A-Za-z]?$/;
const contraseñaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const contraseñasComunes = ["123456", "password", "admin123", "contraseña"];

const ModalRegistroEmpleado = ({
    showModal,
    setShowModal,
    nuevoEmpleado,
    handleInputChange,
    handleAddEmpleado,
    }) => {
    // Funciones de validación
    const validarNombre = (valor) => {
        if (!valor) return "El nombre es obligatorio.";
        if (!letrasEspaciosRegex.test(valor)) return "El nombre solo debe contener letras y espacios.";
        if (valor.length < 2 || valor.length > 50) return "El nombre debe tener entre 2 y 50 caracteres.";
        if (palabrasInapropiadas.some((palabra) => valor.toLowerCase().includes(palabra)))
        return "El nombre contiene palabras inapropiadas.";
        return "";
    };

    const validarApellido = (valor) => {
        if (!valor) return "El apellido es obligatorio.";
        if (!letrasEspaciosRegex.test(valor)) return "El apellido solo debe contener letras y espacios.";
        if (valor.length < 2 || valor.length > 50) return "El apellido debe tener entre 2 y 50 caracteres.";
        if (palabrasInapropiadas.some((palabra) => valor.toLowerCase().includes(palabra)))
        return "El apellido contiene palabras inapropiadas.";
        return "";
    };

    const validarCorreo = (valor) => {
        if (!valor) return "El correo es obligatorio.";
        if (!emailRegex.test(valor)) return "El correo debe tener un formato válido (usuario@dominio.com).";
        return "";
    };

    const validarTelefono = (valor) => {
        if (!valor) return "El teléfono es obligatorio.";
        if (!telefonoRegex.test(valor)) return "El teléfono debe seguir el formato xxxx-xxxx.";
        return "";
    };

    const validarCedula = (valor) => {
        if (!valor) return "La cédula es obligatoria.";
        if (!cedulaRegex.test(valor))
        return "La cédula debe seguir el formato xxx-xxxxxx-xxxxX (ejemplo: 121-300897-0004Y).";
        return "";
    };

    const validarContraseña = (valor) => {
        if (!valor) return "La contraseña es obligatoria.";
        if (!contraseñaRegex.test(valor))
        return "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.";
        if (contraseñasComunes.includes(valor.toLowerCase()))
        return "La contraseña es demasiado común. Usa una más segura.";
        return "";
    };

    const validarConfirmarContraseña = (valor, contraseña) => {
        if (!valor) return "La confirmación de la contraseña es obligatoria.";
        if (valor !== contraseña) return "Las contraseñas no coinciden.";
        return "";
    };

    const validarFechaNacimiento = (valor) => {
        if (!valor) return "La fecha de nacimiento es obligatoria.";
        const fechaNac = new Date(valor);
        const hoy = new Date();
        if (isNaN(fechaNac.getTime())) return "Fecha inválida.";
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const diffMeses = hoy.getMonth() - fechaNac.getMonth();
        if (diffMeses < 0 || (diffMeses === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
        }
        if (edad < 18) return "El empleado debe tener al menos 18 años.";
        if (fechaNac > hoy) return "La fecha de nacimiento no puede ser futura.";
        return "";
    };

    const validarArchivo = (file) => {
        const maxSize = 2 * 1024 * 1024;
        const formatosPermitidos = ["image/jpeg", "image/png"];
        if (!file) return "La foto del empleado es obligatoria.";
        if (file.size > maxSize) return "El archivo no debe exceder los 2 MB.";
        if (!formatosPermitidos.includes(file.type)) return "Solo se permiten archivos .jpg o .png.";
        return "";
    };

    const isFormValid = () => {
        return (
        validarNombre(nuevoEmpleado.nombre) === "" &&
        validarApellido(nuevoEmpleado.apellido) === "" &&
        validarCorreo(nuevoEmpleado.correo) === "" &&
        validarTelefono(nuevoEmpleado.telefono) === "" &&
        validarCedula(nuevoEmpleado.cedula) === "" &&
        validarContraseña(nuevoEmpleado.contraseña) === "" &&
        validarConfirmarContraseña(nuevoEmpleado.confirmarContraseña, nuevoEmpleado.contraseña) === "" &&
        validarFechaNacimiento(nuevoEmpleado.fechaNacimiento) === "" &&
        validarArchivo(nuevoEmpleado.foto) === ""
        );
    };

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Agregar Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                type="text"
                name="nombre"
                value={nuevoEmpleado.nombre}
                onChange={handleInputChange}
                placeholder="Ingresa el nombre"
                isInvalid={!!validarNombre(nuevoEmpleado.nombre)}
                />
                <Form.Control.Feedback type="invalid">
                {validarNombre(nuevoEmpleado.nombre)}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                type="text"
                name="apellido"
                value={nuevoEmpleado.apellido}
                onChange={handleInputChange}
                placeholder="Ingresa el apellido"
                isInvalid={!!validarApellido(nuevoEmpleado.apellido)}
                />
                <Form.Control.Feedback type="invalid">
                {validarApellido(nuevoEmpleado.apellido)}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                type="email"
                name="correo"
                value={nuevoEmpleado.correo}
                onChange={handleInputChange}
                placeholder="ejemplo@correo.com"
                isInvalid={!!validarCorreo(nuevoEmpleado.correo)}
                />
                <Form.Control.Feedback type="invalid">
                {validarCorreo(nuevoEmpleado.correo)}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                type="text"
                name="telefono"
                value={nuevoEmpleado.telefono}
                onChange={handleInputChange}
                placeholder="0000-0000"
                isInvalid={!!validarTelefono(nuevoEmpleado.telefono)}
                />
                <Form.Control.Feedback type="invalid">
                {validarTelefono(nuevoEmpleado.telefono)}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Cédula</Form.Label>
                <Form.Control
                type="text"
                name="cedula"
                value={nuevoEmpleado.cedula}
                onChange={handleInputChange}
                placeholder="121-300897-0004Y"
                isInvalid={!!validarCedula(nuevoEmpleado.cedula)}
                />
                <Form.Control.Feedback type="invalid">
                {validarCedula(nuevoEmpleado.cedula)}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                type="password"
                name="contraseña"
                value={nuevoEmpleado.contraseña}
                onChange={handleInputChange}
                placeholder="Ingresa la contraseña"
                isInvalid={!!validarContraseña(nuevoEmpleado.contraseña)}
                />
                <Form.Control.Feedback type="invalid">
                {validarContraseña(nuevoEmpleado.contraseña)}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                type="password"
                name="confirmarContraseña"
                value={nuevoEmpleado.confirmarContraseña}
                onChange={handleInputChange}
                placeholder="Repite la contraseña"
                isInvalid={!!validarConfirmarContraseña(nuevoEmpleado.confirmarContraseña, nuevoEmpleado.contraseña)}
                />
                <Form.Control.Feedback type="invalid">
                {validarConfirmarContraseña(nuevoEmpleado.confirmarContraseña, nuevoEmpleado.contraseña)}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                type="date"
                name="fechaNacimiento"
                value={nuevoEmpleado.fechaNacimiento}
                onChange={handleInputChange}
                isInvalid={!!validarFechaNacimiento(nuevoEmpleado.fechaNacimiento)}
                />
                <Form.Control.Feedback type="invalid">
                {validarFechaNacimiento(nuevoEmpleado.fechaNacimiento)}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Foto</Form.Label>
                <Form.Control
                type="file"
                name="foto"
                accept="image/png, image/jpeg"
                onChange={(e) =>
                    handleInputChange({ target: { name: "foto", value: e.target.files[0] } })
                }
                isInvalid={!!validarArchivo(nuevoEmpleado.foto)}
                />
                <Form.Control.Feedback type="invalid">
                {validarArchivo(nuevoEmpleado.foto)}
                </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" onClick={handleAddEmpleado} disabled={!isFormValid()}>
                Guardar
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)} className="ms-2">
                Cancelar
            </Button>
            </Form>
        </Modal.Body>
        </Modal>
    );
};

export default ModalRegistroEmpleado;
