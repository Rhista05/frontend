import React, { useState, useEffect } from "react";
import axios from "axios";

function AddProductToOrder({ order, setShowAddProductModal }) {
    const [products, setProducts] = useState([]); // Lista de productos disponibles
    const [selectedProductId, setSelectedProductId] = useState(""); // ID del producto seleccionado
    const [quantity, setQuantity] = useState(1); // Cantidad seleccionada

    // Obtener la lista de productos disponibles al montar el componente
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/products") // Endpoint para obtener productos
            .then((response) => {
                setProducts(response.data); // Guardar productos en el estado
                console.log("Productos cargados:", response.data); // Log para depuración
            })
            .catch((error) => {
                console.error("Error al cargar los productos:", error);
                alert("Error al cargar los productos. Intente nuevamente.");
            });
    }, []);

    // Manejar cambios en la selección de producto
    const handleProductChange = (e) => {
        setSelectedProductId(e.target.value); // Guardar ID del producto seleccionado
    };

    // Manejar cambios en la cantidad
    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1); // Asegurar mínimo de 1
        setQuantity(value);
    };

    // Agregar producto a la orden
    const addProductToOrder = () => {
        if (!selectedProductId) {
            alert("Por favor, selecciona un producto.");
            return;
        }

        // Encontrar el producto seleccionado
        const selectedProduct = products.find((p) => p.id === parseInt(selectedProductId));

        // Validar si el producto fue encontrado
        if (!selectedProduct) {
            alert("Producto seleccionado no encontrado.");
            return;
        }

        const orderDetail = {
            order: { id: order.id }, // Enviar objeto Order con su ID
            product: { id: selectedProduct.id }, // Enviar objeto Product con su ID
            quantity: quantity, // Cantidad seleccionada
        };

        console.log("Datos a enviar al backend:", orderDetail);

        // Enviar los datos al backend
        axios
            .post("http://localhost:8080/api/orderDetails", orderDetail)
            .then(() => {
                alert("Producto agregado exitosamente.");
                setShowAddProductModal(false); // Cerrar modal
            })
            .catch((error) => {
                console.error("Error al agregar producto:", error);
                alert("Error al agregar el producto. Verifica los datos e inténtalo de nuevo.");
            });
    };

    return (
        <div
            className="modal fade show"
            style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semitransparente
            }}
            role="dialog"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Agregar Producto a la Orden</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={() => setShowAddProductModal(false)}
                            style={{
                                backgroundColor: "transparent",
                                border: "none",
                                fontSize: "1.5rem",
                                color: "#000",
                            }}
                        >
                            &times;
                        </button>
                    </div>
                    <div className="modal-body">
                        <h6>Detalles de la Orden</h6>
                        <p>
                            <strong>ID:</strong> {order.id}
                        </p>
                        <p>
                            <strong>Cliente:</strong> {order.client}
                        </p>
                        <p>
                            <strong>Fecha de Pedido:</strong> {order.orderDate}
                        </p>

                        <h6 className="mt-3">Selecciona un Producto</h6>
                        <select
                            id="product"
                            value={selectedProductId}
                            onChange={handleProductChange}
                            className="form-select"
                        >
                            <option value="">-- Selecciona un Producto --</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - ${product.price.toFixed(2)}
                                </option>
                            ))}
                        </select>

                        <div className="mt-3">
                            <label>Cantidad</label>
                            <input
                                type="number"
                                className="form-control"
                                value={quantity}
                                onChange={handleQuantityChange}
                                min="1"
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowAddProductModal(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={addProductToOrder}
                        >
                            Agregar Producto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProductToOrder;
