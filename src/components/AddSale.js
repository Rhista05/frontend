import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function AddSale({ setShowSaleModal, updateSalesList }) {
  const [client, setClient] = useState("");
  const [email, setEmail] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      console.error("No user found in localStorage");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      console.error("User ID is not available");
      return;
    }

    const newSale = {
      client,
      email,
      saleDate: new Date().toISOString().split('T')[0],
      total: parseFloat(totalAmount),
      user: { id: user.id }
    };

    console.log("Datos de nueva venta:", newSale); // Verifica los datos

    axios
      .post("http://localhost:8080/api/sales", newSale)
      .then((response) => {
        console.log("Venta añadida:", response.data);
        setShowSaleModal(false);
        updateSalesList(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error al añadir venta:", error.response.data);
          console.error("Código de estado:", error.response.status);
        } else if (error.request) {
          console.error("No se recibió respuesta:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      });
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
      <div className="modal fade show" style={{ display: "block", zIndex: 1050 }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Sale</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowSaleModal(false)} />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="user" className="form-label">User</label>
                  <input type="text" className="form-control" id="user" value={user ? `${user.fullName}` : ""} placeholder="User" />
                </div>
                <div className="mb-3">
                  <label htmlFor="client" className="form-label">Client</label>
                  <input type="text" className="form-control" id="client" value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="totalAmount" className="form-label">Total Amount</label>
                  <input type="number" className="form-control" id="totalAmount" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="Total Amount" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="paymentStatus" className="form-label">Payment Status</label>
                  <select className="form-select" id="paymentStatus" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} required>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowSaleModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Add Sale</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddSale;