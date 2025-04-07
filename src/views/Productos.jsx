import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

import TablaProductos from "../components/productos/TablaProductos";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Productos = () => {
    // Estados para manejo de datos
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
    
    //Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Número de productos por página

    const [productoEditado, setProductoEditado] = useState(null);
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [productosFiltrados, setProductosFiltrados] = useState([]); // Corregido
    const [searchText, setSearchText] = useState("");

    // Referencia a las colecciones en Firestore
    const productosCollection = collection(db, "productos");
    const categoriasCollection = collection(db, "categorias");

    // Función para obtener todas las categorías y productos de Firestore
    const fetchData = async () => {
        try {
            // Obtener productos
            const productosData = await getDocs(productosCollection);
            const fetchedProductos = productosData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setProductos(fetchedProductos);
            setProductosFiltrados(fetchedProductos); // Inicializar productos filtrados

            // Obtener categorías
            const categoriasData = await getDocs(categoriasCollection);
            const fetchedCategorias = categoriasData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setCategorias(fetchedCategorias);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    // Hook useEffect para carga inicial de datos
    useEffect(() => {
        fetchData();
    }, []);

    // Función para filtrar productos
    const handleSearchChange = (e) => {
        const text = e.target.value.toLowerCase();
        setSearchText(text);
    
        const filtradas = productos.filter((producto) => {
            return (
                (producto.nombre && producto.nombre.toLowerCase().includes(text)) ||
                (producto.descripcion && producto.descripcion.toLowerCase().includes(text))
            );
        });
    
        setProductosFiltrados(filtradas);
    };
    

    // Manejador de cambios en inputs del formulario de nuevo producto
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoProducto((prev) => ({ ...prev, [name]: value }));
    };

    // Manejador de cambios en inputs del formulario de edición
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setProductoEditado((prev) => ({ ...prev, [name]: value }));
    };

    // Manejador para la carga de imágenes
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

    // Función para agregar un nuevo producto (CREATE)
    const handleAddProducto = async () => {
        if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.categoria) {
            alert("Por favor, completa todos los campos requeridos.");
            return;
        }
        try {
            await addDoc(productosCollection, nuevoProducto);
            setShowModal(false);
            setNuevoProducto({ nombre: "", precio: "", categoria: "", imagen: "" });
            await fetchData();
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    };

    // Función para actualizar un producto existente (UPDATE)
    const handleEditProducto = async () => {
        if (!productoEditado.nombre || !productoEditado.precio || !productoEditado.categoria) {
            alert("Por favor, completa todos los campos requeridos.");
            return;
        }
        try {
            const productoRef = doc(db, "productos", productoEditado.id);
            await updateDoc(productoRef, productoEditado);
            setShowEditModal(false);
            await fetchData();
        } catch (error) {
            console.error("Error al actualizar producto:", error);
        }
    };

    // Función para eliminar un producto (DELETE)
    const handleDeleteProducto = async () => {
        if (productoAEliminar) {
            try {
                const productoRef = doc(db, "productos", productoAEliminar.id);
                await deleteDoc(productoRef);
                setShowDeleteModal(false);
                await fetchData();
            } catch (error) {
                console.error("Error al eliminar producto:", error);
            }
        }
    };

    // Función para abrir el modal de edición con datos prellenados
    const openEditModal = (producto) => {
        setProductoEditado({ ...producto });
        setShowEditModal(true);
    };

    // Función para abrir el modal de eliminación
    const openDeleteModal = (producto) => {
        setProductoAEliminar(producto);
        setShowDeleteModal(true);
    };

    // Calcular productos paginados
    const paginatedProductos = productosFiltrados.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Renderizado del componente
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
                productos={paginatedProductos} // Pasar productos paginados
                totalItems={productos.length} // Total de productos
                itemsPerPage={itemsPerPage}   // Elementos por página
                currentPage={currentPage}     // Página actual
                setCurrentPage={setCurrentPage} // Método para cambiar página
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
