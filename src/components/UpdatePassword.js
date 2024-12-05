import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/login.css"; // Asegúrate de usar el mismo archivo de estilos

const UpdatePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Nuevo estado para confirmar la contraseña
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Obtener el correo desde la URL
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Verificar si las contraseñas coinciden
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    } else {
      setConfirmPasswordError("");
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/update-password", {
        email,
        newPassword,
      });

      setSuccessMessage(response.data);
      setErrorMessage("");
      // Redirigir al login después de 2 segundos
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMessage(error.response.data || "Failed to update password.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="body">
      <div className="login-container">
        <h2>Update Password</h2>
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        
        <form onSubmit={handlePasswordUpdate}>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {passwordError && <div className="alert alert-warning mt-2">{passwordError}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPasswordError && <div className="alert alert-warning mt-2">{confirmPasswordError}</div>}
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;


//4BMJLKD2JN7RYX275XBXNS7Q

//mlsn.65d4a4b2ce8caa17b60e2c2e39111a480168fbc2328238237bdf46362abcf5a3

//LUK55-K4XB9-Q32X3-VR6F9-J4F3H//HotmailCodigo de recuperacion