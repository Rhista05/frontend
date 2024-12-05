import React, { useEffect, useState } from "react";
import axios from "axios";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Estado para los productos filtrados
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Estado para mostrar el modal de edición
  const [productToEdit, setProductToEdit] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null); // Almacena el usuario autenticado
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el término de búsqueda

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Número de productos por página

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        setProducts(response.data);
        setFilteredProducts(response.data); // Establecer los productos filtrados al cargar
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    // Obtener el usuario autenticado
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setLoggedInUser(storedUser);

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filtrar los productos según la consulta de búsqueda
    if (searchQuery) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products); // Si no hay consulta, mostrar todos los productos
    }
  }, [searchQuery, products]); // Ejecutar cuando la búsqueda o los productos cambien

  // Obtener los productos que se deben mostrar en la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      const filteredProducts = products.filter((product) => product.id !== id);
      setProducts(filteredProducts); // Actualiza el estado después de eliminar
      setFilteredProducts(filteredProducts); // También actualizar los productos filtrados
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const addProductToList = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setFilteredProducts((prevProducts) => [...prevProducts, newProduct]); // Agregar también a los productos filtrados
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setShowEditModal(true);
  };

  // Verificar permisos para eliminar
  const canDelete = loggedInUser && loggedInUser.role.name !== "Employee";

  // Determinar el número de páginas
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container">
      <h1 className="text-center mb-4">Product Management</h1>

      {/* Campo de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by product name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Actualiza el término de búsqueda
        />
      </div>

      <div className="mb-3 text-end">
        <button className="btn btn-outline-primary" onClick={() => setShowProductModal(true)}>
          <i className="bi bi-plus-circle"></i> Add New Product
        </button>
      </div>

      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.amount}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditClick(product)}
                >
                  <i className="bi bi-pencil"></i> {/* Lápiz */}
                </button>
                {canDelete ? (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <i className="bi bi-trash"></i> {/* Tacho */}
                  </button>
                ) : (
                  <button className="btn btn-secondary btn-sm" disabled>
                    <i className="bi bi-lock"></i> {/* Bloqueo */}
                  </button>
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


      {showProductModal && (
        <AddProduct
          setShowProductModal={setShowProductModal}
          addProductToList={addProductToList}
        />
      )}

      {showEditModal && (
        <EditProduct
          product={productToEdit}
          setShowEditModal={setShowEditModal}
          setProducts={setProducts}
        />
      )}
    </div>
  );
}

export default Products;
