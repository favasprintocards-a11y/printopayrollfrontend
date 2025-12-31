import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

// ✅ Format YYYY-MM → Mon YYYY
const formatMonth = (value) => {
  if (!value) return "—";
  const date = new Date(value + "-01");
  return date.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });
};

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    await api.delete(`/employees/${id}`);
    fetchEmployees();
  };

  return (
    <div className="main">
      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">Employees</h1>
        <Link to="/employees/add" className="btn btn-primary">
          + Add Employee
        </Link>
      </div>

      {/* EMPLOYEE TABLE */}
      <div className="table-wrap card">
        <table className="table">
          <thead>
            <tr>
              <th>Employee ID</th> {/* ✅ NEW */}
              <th>Name</th>
              <th>Department</th>
              <th>Location</th>
              <th>Salary Type</th>
              <th>Basic Salary</th>
              <th>Daily Wage</th>
              <th>Salary Increment</th>
              <th>Increment From</th>
              <th>OT Rate</th>
              <th>Accounting</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                {/* ✅ EMPLOYEE ID */}
                <td style={{ fontWeight: 600 }}>
                  {emp.employeeId || "—"}
                </td>

                <td>
                  <Link
                    to={`/employees/view/${emp._id}`}
                    style={{ fontWeight: 600 }}
                  >
                    {emp.name}
                  </Link>
                </td>

                <td>{emp.department || "—"}</td>
                <td>{emp.location}</td>
                <td>{emp.salaryType?.toUpperCase()}</td>

                <td>
                  ₹ {emp.salaryType === "monthly" ? emp.basicSalary : "—"}
                </td>

                <td>
                  {emp.salaryType === "daily" ? `₹ ${emp.dailyWage}` : "—"}
                </td>

                <td>
                  {emp.salaryIncrement ? `₹ ${emp.salaryIncrement}` : "—"}
                </td>

                <td>{formatMonth(emp.salaryIncrementFrom)}</td>

                <td>{emp.otRate ? `₹ ${emp.otRate}` : "—"}</td>

                <td>{emp.gstType === "GST" ? "Tally" : "DCS"}</td>

                <td>{emp.paymentMethod}</td>

                <td style={{ display: "flex", gap: 6 }}>
                  <Link
                    to={`/employees/edit/${emp._id}`}
                    className="btn btn-secondary action-btn"
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/employees/${emp._id}/increment-history`}
                    className="btn btn-secondary action-btn"
                  >
                    Increment History
                  </Link>

                  <button
                    className="btn btn-danger action-btn"
                    onClick={() => deleteEmployee(emp._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan="13" style={{ padding: 20, opacity: 0.6 }}>
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
