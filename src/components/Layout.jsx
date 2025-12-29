import React from "react";
import { Link, useLocation } from "react-router-dom";
import img from "../assets/Logo.jpeg";

export default function Layout({ children }) {
  const loc = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <img src={img} alt="Logo" style={{width:180, height:180}} />

        

        <nav className="nav">
          <Link className={`nav-item ${loc.pathname === "/" ? "active" : ""}`} to="/dashboard">Dashboard</Link>
          <Link className={`nav-item ${loc.pathname.startsWith("/employees") ? "active" : ""}`} to="/employees">Employees</Link>
          <Link className={`nav-item ${loc.pathname.startsWith("/payroll") ? "active" : ""}`} to="/payroll">Payroll</Link>
        </nav>

        <button
  className="btn btn-danger"
  style={{
    width: "100%",
    marginTop: "20px",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer"
  }}
  onClick={() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }}
>
  Logout
</button>

      </aside>

      <div style={{flex:1}}>
        <header className="topbar">
          <div className="row">
            
            <div className="text-muted" style={{marginLeft:12}}>Printo Cards And Technologies</div>
          </div>

          <div className="right">
            <div className="text-muted">admin@printocards.com</div>
            <div style={{width:36, height:36, borderRadius:18, background:"#141415", display:"flex", alignItems:"center", justifyContent:"center"}}>A</div>
          </div>
        </header>

        <main className="main">
          {children}
        </main>
      </div>
    </div>
  );
}
