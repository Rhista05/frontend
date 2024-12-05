import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AddOrder from "./AddOrder";
import EditOrder from "./EditOrder";
import AddProductToOrder from "./AddProductToOrder";

function OrdersManagement({ onSelectOrder }) {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); // Número de órdenes por página
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false); // Estado para mostrar el modal de agregar productos
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/orders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders data:", error);
      });
  }, []);

  // Función para calcular las páginas
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders
    .filter((order) =>
      order.client.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstOrder, indexOfLastOrder);

  // Función para cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Páginas
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(orders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  const addOrderToList = (newOrder) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  const viewOrderDetails = (order) => {
    onSelectOrder(order);
  };

  const editOrder = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const onUpdateOrder = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4">Orders Management</h1>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by client name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-3 text-end">
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle"></i> New Order
        </button>
      </div>

      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Supplier</th>
            <th>Order Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.client}</td>
              <td>{order.orderDate}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowAddProductModal(true);
                  }}
                >
                  <i className="bi bi-plus-circle"></i> {/* Icono de "+" */}
                </button>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => viewOrderDetails(order)}
                >
                  <i className="bi bi-book"></i>
                </button>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => editOrder(order)}
                >
                  <i className="bi bi-pencil"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <nav>
        <ul className="pagination justify-content-center">
          {/* Flecha Anterior */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; {/* Flecha izquierda */}
            </button>
          </li>

          {/* Números de página */}
          {pageNumbers.map((number) => (
            <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
              <button
                onClick={() => paginate(number)}
                className="page-link"
              >
                {number}
              </button>
            </li>
          ))}

          {/* Flecha Siguiente */}
          <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
            >
              &raquo; {/* Flecha derecha */}
            </button>
          </li>
        </ul>
      </nav>

      {/* Modal de AddOrder */}
      {showModal && (
        <AddOrder
          setShowModal={setShowModal}
          addOrderToList={addOrderToList}
        />
      )}

      {/* Modal de EditOrder */}
      {showEditModal && selectedOrder && (
        <EditOrder
          order={selectedOrder}
          setShowEditModal={setShowEditModal}
          onUpdateOrder={onUpdateOrder}
        />
      )}

      {/* Modal de AddProductToOrder */}
      {showAddProductModal && selectedOrder && (
        <AddProductToOrder
          order={selectedOrder} // Pasar la orden seleccionada al modal
          setShowAddProductModal={setShowAddProductModal} // Función para cerrar el modal
        />
      )}
    </div>
  );
}

export default OrdersManagement;
