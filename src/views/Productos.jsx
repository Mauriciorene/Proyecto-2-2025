import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
    } from "firebase/firestore";

    import TablaProductos from "../components/productos/TablaProductos";
    import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
    import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
    import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
    import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
    import Paginacion from "../components/ordenamiento/Paginacion";

    import jsPDF from "jspdf";
    import autoTable from "jspdf-autotable";

    import * as XLSX from "xlsx";
    import { saveAs } from "file-saver";

    const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        precio: "",
        categoria: "",
        imagen: ""
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [productoEditado, setProductoEditado] = useState(null);
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [searchText, setSearchText] = useState("");

    const productosCollection = collection(db, "productos");
    const categoriasCollection = collection(db, "categorias");

    useEffect(() => {
        const unsubscribeProductos = onSnapshot(productosCollection, (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }));
        setProductos(fetched);
        setProductosFiltrados(filtrarProductos(searchText, fetched));
        });

        const unsubscribeCategorias = onSnapshot(categoriasCollection, (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }));
        setCategorias(fetched);
        });

        return () => {
        unsubscribeProductos();
        unsubscribeCategorias();
        };
    }, [searchText]);

    const filtrarProductos = (texto, productosLista) => {
        const text = texto.toLowerCase();
        return productosLista.filter((producto) =>
        (producto.nombre && producto.nombre.toLowerCase().includes(text)) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(text))
        );
    };

    const handleSearchChange = (e) => {
        const text = e.target.value;
        setSearchText(text);
        setProductosFiltrados(filtrarProductos(text, productos));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoProducto((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setProductoEditado((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNuevoProducto((prev) => ({ ...prev, imagen: reader.result }));
        };
        reader.readAsDataURL(file);
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProductoEditado((prev) => ({ ...prev, imagen: reader.result }));
        };
        reader.readAsDataURL(file);
        }
    };

    const handleAddProducto = async () => {
        if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.categoria) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
        }
        try {
        await addDoc(productosCollection, nuevoProducto);
        setShowModal(false);
        setNuevoProducto({ nombre: "", precio: "", categoria: "", imagen: "" });
        } catch (error) {
        console.error("Error al agregar producto:", error);
        }
    };

    const handleEditProducto = async () => {
        if (!productoEditado.nombre || !productoEditado.precio || !productoEditado.categoria) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
        }
        try {
        const productoRef = doc(db, "productos", productoEditado.id);
        await updateDoc(productoRef, productoEditado);
        setShowEditModal(false);
        } catch (error) {
        console.error("Error al actualizar producto:", error);
        }
    };

    const handleDeleteProducto = async () => {
        if (productoAEliminar) {
        try {
            const productoRef = doc(db, "productos", productoAEliminar.id);
            await deleteDoc(productoRef);
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
        }
    };

    const openEditModal = (producto) => {
        setProductoEditado({ ...producto });
        setShowEditModal(true);
    };

    const openDeleteModal = (producto) => {
        setProductoAEliminar(producto);
        setShowDeleteModal(true);
    };

    const paginatedProductos = productosFiltrados.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCopy = (producto) => {
        const rowData = `Nombre: ${producto.nombre}\nPrecio: C$${producto.precio}\nCategoría: ${producto.categoria}`;
        navigator.clipboard.writeText(rowData).then(() => {
        console.log("Datos copiados al portapapeles:\n" + rowData);
        });
    };

    const handleExportPDF = () => {
        if (!productosFiltrados.length) {
        alert("No hay productos para exportar.");
        return;
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Listado de Productos", 14, 20);

        const columns = ["Nombre", "Precio (C$)", "Categoría"];
        const rows = productosFiltrados.map((producto) => [
        producto.nombre,
        producto.precio,
        producto.categoria
        ]);

        autoTable(doc, {
        startY: 30,
        head: [columns],
        body: rows,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 10 }
        });

        doc.save("productos.pdf");
    };

    const generarPDFDetalleProducto = (producto) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Detalle del Producto", 14, 15);

        doc.setFontSize(12);
        doc.text(`Nombre: ${producto.nombre}`, 14, 30);
        doc.text(`Precio: C$${producto.precio}`, 14, 40);
        doc.text(`Categoría: ${producto.categoria}`, 14, 50);

        if (producto.imagen) {
        doc.addImage(producto.imagen, "JPEG", 140, 30, 50, 50);
        }

        doc.save(`producto_${producto.nombre}.pdf`);
    };

    const exportarExcelProductos = () => {
        const datos = productosFiltrados.map((producto, index) => ({
        "#": index + 1,
        Nombre: producto.nombre,
        Precio: parseFloat(producto.precio),
        Categoría: producto.categoria
        }));

        const hoja = XLSX.utils.json_to_sheet(datos);
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, "Productos");

        const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });

        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        const nombreArchivo = `Productos_${dia}${mes}${anio}.xlsx`;

        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, nombreArchivo);
    };

    return (
        <Container className="mt-5">
        <h4>Gestión de Productos</h4>

        <Row className="mb-3">
            <Col lg={3} md={4} sm={6} xs={12}>
            <Button onClick={() => setShowModal(true)} style={{ width: "100%" }}>
                Agregar producto
            </Button>
            </Col>
            <Col lg={3} md={4} sm={6} xs={12}>
            <Button variant="success" onClick={handleExportPDF} style={{ width: "100%" }}>
                Exportar PDF
            </Button>
            </Col>
            <Col lg={3} md={4} sm={6} xs={12}>
            <Button variant="secondary" onClick={exportarExcelProductos} style={{ width: "100%" }}>
                Generar Excel
            </Button>
            </Col>
        </Row>

        <CuadroBusquedas searchText={searchText} handleSearchChange={handleSearchChange} />

        <TablaProductos
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
            productos={paginatedProductos}
            totalItems={productos.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleCopy={handleCopy}
            generarPDFDetalleProducto={generarPDFDetalleProducto}
        />

        <ModalRegistroProducto
            showModal={showModal}
            setShowModal={setShowModal}
            nuevoProducto={nuevoProducto}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            handleAddProducto={handleAddProducto}
            categorias={categorias}
        />

        <ModalEdicionProducto
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            productoEditado={productoEditado}
            handleEditInputChange={handleEditInputChange}
            handleEditImageChange={handleEditImageChange}
            handleEditProducto={handleEditProducto}
            categorias={categorias}
        />

        <ModalEliminacionProducto
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            handleDeleteProducto={handleDeleteProducto}
        />

        <Paginacion
            itemsPerPage={itemsPerPage}
            totalItems={productosFiltrados.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
        </Container>
    );
};

export default Productos;
