import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, } from "firebase/firestore";

import TablaProductos from "../components/productos/TablaProductos";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

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
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    const productosCollection = collection(db, "productos");
    const categoriasCollection = collection(db, "categorias");

    // Detectar cambios de conexión
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    useEffect(() => {
        // Escuchar productos
        const unsubscribeProductos = onSnapshot(productosCollection, (snapshot) => {
            const fetched = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setProductos(fetched);
            setProductosFiltrados(filtrarProductos(searchText, fetched));

            if (isOffline) console.log("Datos de productos obtenidos desde caché.");
        });

        // Escuchar categorías
        const unsubscribeCategorias = onSnapshot(categoriasCollection, (snapshot) => {
            const fetched = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setCategorias(fetched);

            if (isOffline) console.log("Datos de categorías obtenidos desde caché.");
        });

        return () => {
            unsubscribeProductos();
            unsubscribeCategorias();
        };
    }, [isOffline, searchText]);

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

    // Metodo para copiar datos al portapapeles
    const handleCopy = (producto) => {
    const rowData = `Nombre: ${producto.nombre} \nPrecio: C$${producto.precio} \nCategoría: ${producto.categoria}`;

    navigator.clipboard
        .writeText(rowData)
        .then(() => {
            console.log("Datos de la fila copiados al portapapeles:\n" + rowData);
        })
        .catch((err) => {
            console.error("Error al copiar al portapapeles:", err);
        });
    };

    return (
        <Container className="mt-5">
            <br />
            <h4>Gestión de Productos</h4>
            <Button className="mb-3" onClick={() => setShowModal(true)}>
                Agregar producto
            </Button>

            <CuadroBusquedas
                searchText={searchText}
                handleSearchChange={handleSearchChange}
            />

            <TablaProductos
                openEditModal={openEditModal}
                openDeleteModal={openDeleteModal}
                productos={paginatedProductos}
                totalItems={productos.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                handleCopy={handleCopy}
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
