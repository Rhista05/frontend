import React, { useState } from "react";
import axios from "axios";

function AddProduct({ setShowProductModal, addProductToList }) {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      name: productName,
      price: price,
      amount: amount,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/products", newProduct);
      setProductName("");
      setPrice("");
      setAmount("");
      setSuccessMessage("Product added successfully!");
      addProductToList(response.data); // Añadir el producto recién creado a la lista
      setShowProductModal(false); // Cerrar el modal
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <>
      {/* Fondo oscuro del modal */}
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
      <div className="modal fade show" style={{ display: "block", zIndex: 1050 }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Product</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowProductModal(false)} // Cerrar el modal
              />
            </div>
            <div className="modal-body">
              {successMessage && (
                <div className="alert alert-success mb-3">
                  {successMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">Add Product</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProduct;
