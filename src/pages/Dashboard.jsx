import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [officeEmployees, setOfficeEmployees] = useState(0);
  const [unitEmployees, setUnitEmployees] = useState(0);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);

    setOfficeEmployees(res.data.filter(e => e.location === "Office").length);
    setUnitEmployees(res.data.filter(e => e.location === "Unit").length);
  };

  return (
    <div className="main">

      {/* TITLE */}
      <h1 className="h1" style={{ fontSize: "26px", marginBottom: "20px" }}>
        Dashboard Overview
      </h1>

      {/* TOP GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          marginBottom: "20px"
        }}
      >

        {/* TOTAL EMPLOYEES */}
        <Link to="/employees?filter=all" className="card dashboard-card">
          <div className="dash-icon total">👥</div>
          <h2 className="dash-title">Total Employees</h2>
          <div className="dash-value">{employees.length}</div>
        </Link>

        {/* OFFICE EMPLOYEES */}
        <Link to="/employees?filter=office" className="card dashboard-card">
          <div className="dash-icon office">🏢</div>
          <h2 className="dash-title">Office Employees</h2>
          <div className="dash-value">{officeEmployees}</div>
        </Link>

        {/* UNIT EMPLOYEES */}
        <Link to="/employees?filter=unit" className="card dashboard-card">
          <div className="dash-icon unit">🏭</div>
          <h2 className="dash-title">Unit Employees</h2>
          <div className="dash-value">{unitEmployees}</div>
        </Link>

      </div>

      {/* QUICK ACTIONS */}
      <div className="card" style={{ marginBottom: "25px" }}>
        <h2 className="h2" style={{ marginBottom: "15px" }}>Quick Actions</h2>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link to="/employees/add" className="btn btn-primary">
            Add Employee
          </Link>

          <Link to="/payroll/generate" className="btn btn-secondary">
            Generate Payroll
          </Link>

          <Link to="/payroll" className="btn btn-grey">
            View Payroll Summary
          </Link>
        </div>
      </div>

    </div>
  );
}
