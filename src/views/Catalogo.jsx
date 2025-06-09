import React, { useState, useEffect } from "react";
import { Container, Row, Form, Col } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import TarjetaProducto from "../components/catalogo/TarjetaProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Catalogo = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
    const [showEditModal, setShowEditModal] = useState(false);
    const [productoEditado, setProductoEditado] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 6;

    const productosCollection = collection(db, "productos");
    const categoriasCollection = collection(db, "categorias");

    const fetchData = async () => {
        try {
            const productosData = await getDocs(productosCollection);
            const fetchedProductos = productosData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setProductos(fetchedProductos);

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

    useEffect(() => {
        fetchData();
    }, []);

    const openEditModal = (producto) => {
        setProductoEditado({ ...producto });
        setShowEditModal(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setProductoEditado((prev) => ({ ...prev, [name]: value }));
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

    const handleEditProducto = async () => {
        if (!productoEditado.nombre || !productoEditado.precio) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }

        try {
            const productoRef = doc(db, "productos", productoEditado.id);
            await updateDoc(productoRef, { ...productoEditado });
            setShowEditModal(false);
            fetchData();
        } catch (error) {
            console.error("Error al actualizar producto:", error);
        }
    };

    const productosBusqueda = productos.filter((producto) => {
        const nombre = producto.nombre ? producto.nombre.toLowerCase() : "";
        const descripcion = producto.descripcion ? producto.descripcion.toLowerCase() : "";
        const categoria = producto.categoria ? producto.categoria : "";

        const matchesCategoria = categoriaSeleccionada === "Todas" || categoria === categoriaSeleccionada;
        const matchesBusqueda = nombre.includes(searchText.toLowerCase()) || descripcion.includes(searchText.toLowerCase());

        return matchesCategoria && matchesBusqueda;
    });

    useEffect(() => {
        setPaginaActual(1);
    }, [searchText, categoriaSeleccionada]);

    const indiceUltimoProducto = paginaActual * productosPorPagina;
    const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
    const productosPaginados = productosBusqueda.slice(indicePrimerProducto, indiceUltimoProducto);

    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <Container className="mt-5">
            <h4>Catálogo de Productos</h4>

            <CuadroBusquedas searchText={searchText} handleSearchChange={handleSearchChange} />

            <Row>
                <Col lg={3} md={3} sm={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Filtrar por categoría:</Form.Label>
                        <Form.Select
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        >
                            <option value="Todas">Todas</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.nombre}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

                <Row>
                {productosPaginados.length > 0 ? (
                    productosPaginados.map((producto) => (
                    <TarjetaProducto
                        key={producto.id}
                        producto={producto}
                        openEditModal={openEditModal}
                    />
                    ))
                ) : (
                    <p>No hay productos que coincidan con la búsqueda.</p>
                )}
                </Row>


            <Paginacion
                productosPorPagina={productosPorPagina}
                totalProductos={productosBusqueda.length}
                paginaActual={paginaActual}
                cambiarPagina={cambiarPagina}
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
        </Container>
    );
};

export default Catalogo;
