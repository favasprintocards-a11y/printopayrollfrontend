import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";

export default function EmployeeView() {
  const { id } = useParams();
  const [emp, setEmp] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadEmployee();
    loadPayrollHistory();
  }, [id]);

  const loadEmployee = async () => {
    try {
      const r = await api.get(`/employees/${id}`);
      setEmp(r.data);
    } catch (err) {
      console.error("Error loading employee:", err);
    }
  };

  const loadPayrollHistory = async () => {
    try {
      const r = await api.get(`/payroll/employee/${id}`);
      setHistory(r.data);
    } catch (err) {
      console.error("Error loading payroll history:", err);
    }
  };

  if (!emp) return <div className="card">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{emp.name}</h1>
      </div>

      {/* EMPLOYEE DETAILS */}
      <div className="card">
        <h2 className="h2">Employee Details</h2>

        <p><strong>Department:</strong> {emp.department}</p>
        <p><strong>Location:</strong> {emp.location}</p>
        <p><strong>Salary Type:</strong> {emp.salaryType}</p>
        <p><strong>Basic Salary:</strong> ₹ {emp.basicSalary}</p>
        <p><strong>GST Type:</strong> {emp.gstType}</p>
      </div>

      {/* PAYROLL HISTORY */}
      <div className="card" style={{ marginTop: 20 }}>
        <h2 className="h2">Payroll History</h2>

        {history.length === 0 ? (
          <p>No payroll records found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Final Salary</th>
                <th>OT Amount</th>
                <th>Advance</th>
                <th>Note</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {history.map((p) => {
                const empRow = p.employees.find(e => e.employeeId === id);

                return (
                  <tr key={p._id}>
                    <td>{p.month}</td>
                    <td>₹ {empRow?.balanceSalary}</td>
                    <td>₹ {empRow?.otAmount}</td>
                    <td>₹ {empRow?.advanceSalary}</td>
                    <td>{empRow?.note || "—"}</td>

                    <td>
                      <Link className="btn btn-secondary" to={`/payroll/details/${p._id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
