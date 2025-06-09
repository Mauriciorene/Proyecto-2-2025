// src/components/catalogo/TarjetaProducto.jsx
import { Card, Button, Col } from "react-bootstrap";
import { motion } from "framer-motion"; 

const TarjetaProducto = ({ producto, openEditModal }) => {
    return (
        <Col lg={3} md={4} sm={12} className="mb-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <Card>
                    {producto.imagen && (
                        <Card.Img variant="top" src={producto.imagen} alt={producto.nombre} />
                    )}
                    <Card.Body>
                        <Card.Title>{producto.nombre}</Card.Title>
                        <Card.Text>
                            Precio: C${producto.precio} <br />
                            Categoría: {producto.categoria}
                        </Card.Text>
                        <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => openEditModal(producto)}
                        >
                            Editar <i className="bi bi-pencil"></i>
                        </Button>
                    </Card.Body>
                </Card>
            </motion.div>
        </Col>
    );
};

export default TarjetaProducto;
