import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/login.css";
import axios from "axios";
import ResetPasswordRequest from "./ResetPasswordRequest";


function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", { email, password });
      if (response && response.data) {
        onLogin({
          id: response.data.id,
          fullName: response.data.fullName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role,
        });
        setLoading(false);
      } else {
        setError("Invalid credentials");
        setLoading(false);
      }
    } catch (error) {
      setError("Error during login, please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="body">
      <div className="login-container">
        {showResetPassword ? (
          <ResetPasswordRequest setShowResetPassword={setShowResetPassword} />
        ) : (
          <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>

              <button
                type="button"
                className="btn btn-link forgot-password"
                onClick={() => setShowResetPassword(true)}
              >
                Forgot your password?
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
