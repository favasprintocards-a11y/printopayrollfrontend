import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import img from "../assets/Logo.jpeg";
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      setToken(res.data.token);
      alert("Login successful!");

      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-wrapper">

      <div className="login-container">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
  <img src={img} alt="Logo" style={{ width: 120, height: 120 }} />
</div>

        
        <h1 className="login-title">Payroll</h1>
        <p className="login-sub">Sign in to continue</p>

        <form onSubmit={submit} className="login-form">

          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label" style={{ marginTop: "12px" }}>Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary login-btn">
            Login
          </button>

        </form>
      </div>

    </div>
  );
}
