import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AddSale from "./AddSale";
import AddProductToSale from "./AddProductToSale";
import SaleDetailsModal from "./SaleDetailsModal";

function SalesManagement() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]); // Estado para las ventas filtradas
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [totalSale, setTotalSale] = useState(0); // Estado para almacenar el total de la venta
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el término de búsqueda

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const salesPerPage = 10; // Número de ventas por página

  // Función para obtener las ventas del backend
  const fetchSales = () => {
    axios
      .get("http://localhost:8080/api/sales")
      .then((response) => {
        const salesData = response.data;
        // Verificar si cada venta tiene un pago asociado
        const salesWithPaymentStatusPromises = salesData.map(sale =>
          axios.get(`http://localhost:8080/api/payments/sale/${sale.id}`)
            .then(response => ({
              ...sale,
              hasPayment: response.data // Agregar el estado de pago a la venta
            }))
            .catch(() => ({
              ...sale,
              hasPayment: false // Si hay un error, asumir que no hay pago
            }))
        );

        // Esperar a que todas las promesas se resuelvan
        Promise.all(salesWithPaymentStatusPromises).then((salesWithPaymentStatus) => {
          setSales(salesWithPaymentStatus);
          setFilteredSales(salesWithPaymentStatus); // Establecer las ventas filtradas al cargar
        });
      })
      .catch((error) => {
        console.error("Error fetching sales data:", error);
      });
  };

  useEffect(() => {
    fetchSales();
  }, []);
  useEffect(() => {
    // Filtrar las ventas según la consulta de búsqueda
    if (searchQuery) {
      setFilteredSales(
        sales.filter((sale) =>
          sale.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (sale.user && sale.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    } else {
      setFilteredSales(sales); // Si no hay consulta, mostrar todas las ventas
    }
  }, [searchQuery, sales]); // Ejecutar cuando la búsqueda o las ventas cambien

  // Obtener las ventas que se deben mostrar en la página actual
  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openAddProductModal = (sale) => {
    setSelectedSale(sale);
    setShowProductModal(true);
  };

  const openDetailsModal = (sale) => {
    setSelectedSale(sale);
    setShowDetailsModal(true);
  };

  const updateTotalSale = (total) => {
    setTotalSale(total);
  };

  const deleteSale = (saleId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
      axios
        .delete(`http://localhost:8080/api/sales/${saleId}`) // Asegúrate de que el endpoint sea correcto
        .then(() => {
          alert("Venta eliminada exitosamente.");
          // Aquí puedes actualizar el estado o recargar los datos según sea necesario
          setSales((prevSales) => prevSales.filter((sale) => sale.id !== saleId));
        })
        .catch((error) => {
          console.error("Error al eliminar la venta:", error);
          alert("Error al eliminar la venta. Por favor, inténtalo de nuevo.");
        });
    }
  };

  // Determinar el número de páginas
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredSales.length / salesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container">
      <h1 className="text-center mb-4">Sales Management</h1>

      {/* Campo de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by client or user name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Actualiza el término de búsqueda
        />
      </div>

      <div className="mb-3 text-end">
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowSaleModal(true)}
        >
          <i className="bi bi-plus-circle"></i> New Sale
        </button>
      </div>

      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>User Name</th>
            <th>Client</th>
            <th>Email</th>
            <th>Sale Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.user ? sale.user.fullName : "Unknown"}</td>
              <td>{sale.client}</td>
              <td>{sale.email}</td>
              <td>
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(sale.saleDate))}
              </td>
              <td>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => openDetailsModal(sale)}
                >
                  <i className="bi bi-book"></i> {/* Ícono del libro */}
                </button>
                {/* Condicional para mostrar candado si tiene pago asociado */}
                {sale.hasPayment ? (
                  <>
                    <button className="btn btn-secondary btn-sm me-2" disabled>
                      <i className="bi bi-lock"></i> {/* Ícono de candado */}
                    </button>
                    <button className="btn btn-secondary btn-sm me-2" disabled>
                      <i className="bi bi-lock"></i> {/* Ícono de candado */}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => openAddProductModal(sale)}
                    >
                      <i className="bi bi-plus-circle"></i> {/* Ícono de "+" */}
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => deleteSale(sale.id)}
                    >
                      <i className="bi bi-trash"></i> {/* Ícono del tacho */}
                    </button>
                  </>
                )}
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

      {showSaleModal && (
        <AddSale
          setShowSaleModal={setShowSaleModal}
          updateSalesList={(newSale) => setSales((prev) => [...prev, newSale])}
        />
      )}

      {showProductModal && selectedSale && (
        <AddProductToSale
          sale={selectedSale}
          setShowAddProductModal={setShowProductModal}
        />
      )}

      {showDetailsModal && selectedSale && (
        <SaleDetailsModal
          sale={selectedSale}
          setShowDetailsModal={setShowDetailsModal}
          updateTotalSale={updateTotalSale} // Pasar la función aquí
        />
      )}
    </div>
  );
}

export default SalesManagement;
