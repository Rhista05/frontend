// src/components/DetailOrder.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function DetailOrder({ setShowDetailsModal, order }) {
    // Asegúrate de que 'order' tenga la información correcta
    const { client, orderDate, total, status } = order; // Desestructura las propiedades correctas
    const handleImport = () => {
        // Lógica para manejar la importación de detalles
        console.log("Importing order details...");
    };

    return (
        <>
            {/* Fondo oscuro del modal */}
            <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
            <div className="modal fade show" style={{ display: "block", zIndex: 1050 }} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Order Details</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setShowDetailsModal(false)}
                            />
                        </div>
                        <div className="modal-body">
                            {/* Mostrar detalles de la orden */}
                            <p><strong>Client:</strong> {client}</p>
                            <p><strong>Order Date:</strong> {orderDate}</p>
                            <p><strong>Total Amount:</strong> ${total.toFixed(2)}</p>
                            <p><strong>Status:</strong> {status}</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleImport}
                            >
                                Import
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DetailOrder;
