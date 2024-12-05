import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import "bootstrap/dist/css/bootstrap.min.css";

function SaleDetailsModal({ sale, setShowDetailsModal }) {
  const [detailSales, setDetailSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPayment, setHasPayment] = useState(false); // Nuevo estado para verificar si hay un pago

  const fetchDetailSales = () => {
    axios
      .get(`http://localhost:8080/api/detailSales/sale-pro/${sale.id}`)
      .then((response) => {
        setDetailSales(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching detail sales:", error);
        setLoading(false);
      });
  };

  // Verificar si ya hay un pago asociado a la venta
  const checkPaymentStatus = () => {
    axios
      .get(`http://localhost:8080/api/payments/sale/${sale.id}`) // Ajusta esta URL según tu API
      .then((response) => {
        setHasPayment(response.data); // Asigna el estado basado en la respuesta del backend
      })
      .catch((error) => {
        console.error("Error checking payment status:", error);
      });
  };

  useEffect(() => {
    if (sale && sale.id) {
      fetchDetailSales();
      checkPaymentStatus(); // Verificar el estado del pago al cargar el modal
    }
  }, [sale]);


  const removeDetailSale = (detailId) => {
    axios
      .delete(`http://localhost:8080/api/detailSales/${detailId}`)
      .then(() => {
        setDetailSales((prevDetails) => prevDetails.filter((detail) => detail.id !== detailId));
        alert("Product removed successfully.");
      })
      .catch((error) => {
        console.error("Error removing product from sale:", error);
        alert("Error removing the product. Please try again.");
      });
  };

  const calculateTotal = () => {
    return detailSales.reduce((acc, detail) => acc + detail.price, 0).toFixed(2);
  };

  const handleExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Sale Details", 20, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Seller: ${sale.user?.fullName || "Unknown"} ${sale.user?.lastName || "Unknown"}`, 20, 30);
    doc.text(`Client Name: ${sale.client}`, 20, 40);
    doc.text(`Client Email: ${sale.email}`, 20, 50);
    doc.text(`Sale Date: ${new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(sale.saleDate))}`, 20, 60);

    // Línea de separación
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65);

    // Agregar encabezados y datos a la tabla
    const headers = ["ID", "Product", "Price", "Quantity", "Sub Total"];
    const data = detailSales.map(detail => [
      detail.product.id,
      detail.product.name,
      `$${detail.product.price.toFixed(2)}`,
      detail.quantity,
      `$${detail.price.toFixed(2)}`
    ]);

    let startY = 75;
    doc.autoTable({
      head: [headers],
      body: data,
      startY,
      theme: 'grid',
    });

    const lastLineY = startY + data.length * 10 + 10;
    doc.setLineWidth(0.5);
    doc.line(20, lastLineY, 190, lastLineY);

    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${calculateTotal()}`, 20, lastLineY + 10);

    // Guardar el PDF
    doc.save("sale_details.pdf");
  };

  const handlePayment = () => {
    // Verificar si hay detalles de venta antes de proceder con el pago
    if (detailSales.length === 0) {
      alert("No hay productos disponibles para pagar.");
      return; // Salir de la función si no hay productos
    }

    const paymentData = {
      sale: { id: sale.id },
      amount: calculateTotal(),
      payment_date: new Date().toISOString(),
      payment_method: "", // Asegúrate de incluir este campo si es necesario
    };

    axios.post("http://localhost:8080/api/payments", paymentData)
      .then((response) => {
        alert("¡Pago realizado con éxito!");
        setShowDetailsModal(false);
      })
      .catch((error) => {
        console.error("Error procesando el pago:", error);
        alert("Error procesando el pago. Por favor, inténtalo de nuevo.");
      });
  };

  return (
    <>
      <div className="modal-backdrop show"></div>
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Sale Details</h5>
              <button type="button" className="btn btn-success ms-auto" onClick={handlePayment} disabled={hasPayment}>
                Pay
              </button>
            </div>
            <div className="modal-body">
              {loading ? (
                <p>Loading details...</p>
              ) : (
                <>
                  <h6>Sale Information</h6>
                  <p>
                    <strong>User:</strong>{" "}
                    {sale.user?.fullName || "Unknown"}
                    <strong> </strong>{sale.user?.lastName || "Unknown"}<br />
                    <strong>Client:</strong> {sale.client} <br />
                    <strong>Email Client:</strong> {sale.email} <br />
                    <strong>Sale Date:</strong>{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(sale.saleDate))}{" "}<br />
                  </p>

                  <h6>Sale Details</h6>
                  {detailSales.length > 0 ? (
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Sub Total</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailSales.map((detail) => (
                          <tr key={detail.id}>
                            <td>{detail.product.id}</td>
                            <td>{detail.product.name}</td>
                            <td>${detail.product.price.toFixed(2)}</td>
                            <td>{detail.quantity}</td>
                            <td>${detail.price.toFixed(2)}</td>
                            <td>
                              {/* Deshabilitar botón Remove si ya hay un pago */}
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => removeDetailSale(detail.id)}
                                disabled={hasPayment}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No details available for this sale.</p>
                  )}

                  {detailSales.length > 0 && (
                    <h6><strong>Total:</strong> ${calculateTotal()}</h6>
                  )}
                </>
              )}
            </div>
            <div className="modal-footer">
              {/* Close button */}
              <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
              {/* Export PDF button */}
              <button type="button" className="btn btn-primary" onClick={handleExport}>
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SaleDetailsModal;