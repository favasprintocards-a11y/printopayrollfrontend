import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import img from "../assets/Logo.jpeg";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ NEW
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      setToken(res.data.token);
      alert("Login successful!");
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">

        {/* LOGO */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <img src={img} alt="Logo" style={{ width: 120, height: 120 }} />
        </div>

        <h1 className="login-title">Payroll</h1>
        <p className="login-sub">Sign in to continue</p>

        <form onSubmit={submit} className="login-form">

          {/* EMAIL */}
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          {/* PASSWORD */}
          <label className="label" style={{ marginTop: 12 }}>Password</label>

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"} // 👁️ toggle
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              style={{ paddingRight: "42px" }}
            />

            {/* EYE ICON */}
            <span
              onClick={() => !isLoading && setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontSize: 16,
                opacity: 0.7,
                userSelect: "none"
              }}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🚫" : "👁️"}
            </span>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}
