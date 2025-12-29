// src/pages/Payroll/PayrollList.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

export default function PayrollList() {
  const [payrolls, setPayrolls] = useState([]);

  const loadPayrolls = async () => {
    try {
      const r = await api.get("/payroll");
      setPayrolls(r.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPayrolls();
  }, []);

  // DELETE PAYROLL
  const deletePayroll = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payroll?")) return;

    try {
      await api.delete(`/payroll/${id}`);
      alert("Payroll deleted successfully");
      loadPayrolls(); // refresh table
    } catch (err) {
      console.error(err);
      alert("Failed to delete payroll");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Payroll Summary</h1>

        <Link to="/payroll/generate" className="btn btn-primary add-btn">
          + Generate Payroll
        </Link>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Employees</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {payrolls.map((p) => (
                <tr key={p._id}>
                  <td>{p.month}</td>
                  <td>{p.employees.length}</td>
                  <td>₹ {p.totalPayrollAmount}</td>

                  <td>
                    <Link
                      to={`/payroll/details/${p._id}`}
                      className="btn btn-ghost"
                    >
                      View
                    </Link>

                    <Link
                      to={`/payroll/edit/${p._id}`}
                      className="btn btn-secondary"
                      style={{ marginLeft: "8px" }}
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-danger"
                      style={{ marginLeft: "8px" }}
                      onClick={() => deletePayroll(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {payrolls.length === 0 && (
                <tr>
                  <td colSpan="4">No payroll records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
