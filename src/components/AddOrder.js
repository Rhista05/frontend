import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function AddOrder({ setShowModal, addOrderToList }) {
  const [client, setClient] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState("Pending");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newOrder = { client, orderDate, total, status };

    try {
      // Enviar la nueva orden al backend
      const response = await axios.post("http://localhost:8080/api/orders", newOrder);

      // Agregar la nueva orden a la lista en OrdersManagement
      addOrderToList(response.data);

      setClient("");
      setOrderDate("");
      setTotal("");
      setStatus("Pending");

      setShowModal(false); // Cerrar el modal
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
      <div className="modal fade show" style={{ display: "block", zIndex: 1050 }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Order</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="client" className="form-label">Client</label>
                  <input
                    type="text"
                    className="form-control"
                    id="client"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="orderDate" className="form-label">Order Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="orderDate"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="total" className="form-label">Total</label>
                  <input
                    type="number"
                    className="form-control"
                    id="total"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    placeholder="Enter total amount"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    className="form-select"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">Save Order</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddOrder;
