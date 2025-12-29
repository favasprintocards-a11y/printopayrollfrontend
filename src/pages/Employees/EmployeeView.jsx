import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";

export default function EmployeeView() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadEmployee();
    loadPayrollHistory();
  }, [id]);

  // Load basic employee info
  const loadEmployee = async () => {
    try {
      const r = await api.get(`/employees/${id}`);
      setEmployee(r.data);
    } catch (err) {
      console.error("Employee load error:", err);
    }
  };

  // Load payroll history
  const loadPayrollHistory = async () => {
    try {
      const r = await api.get(`/payroll/employee/${id}`);
      setHistory(r.data);
    } catch (err) {
      console.error("Payroll history load error:", err);
    }
  };

  if (!employee) return <div className="card">Loading...</div>;

  return (
    <div>
      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">Employee — {employee.name}</h1>
      </div>

      {/* EMPLOYEE DETAILS */}
      

      {/* PAYROLL HISTORY */}
      <div className="card" style={{ marginTop: 20 }}>
        <h2 className="h2">Payroll History</h2>

        {history.length === 0 ? (
          <p>No payroll generated yet for this employee.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Working Days</th>
                <th>Leave</th>
                <th>Casual</th>
                <th>TA+DA</th>
                <th>OT Hours</th>
                <th>OT Amount</th>
                <th>Festival</th>
                <th>Other</th>
                <th>Advance</th>
                <th>Note</th>
                <th>Final Pay</th>
                
              </tr>
            </thead>

            <tbody>
              {history.map((p) => {
                const empRow = p.employees.find((e) => e._id === id || e.employeeId === id);

                if (!empRow) return null;

                return (
                  <tr key={p._id}>
                    <td>{p.month}</td>
                    <td>{empRow.workingDays || "—"}</td>
                    <td>{empRow.leaveDeducted || "—"}</td>
                    <td>{empRow.casualLeave || "—"}</td>
                    <td>₹ {empRow.taDa || 0}</td>
                    <td>{empRow.overtime || "—"}</td>
                    <td>₹ {empRow.otAmount || 0}</td>
                    <td>₹ {empRow.festivalAllowance || 0}</td>
                    <td>₹ {empRow.otherAllowance || 0}</td>
                    <td>₹ {empRow.advanceSalary || 0}</td>
                    <td>{empRow.note || "—"}</td>
                    <td><strong>₹ {empRow.balanceSalary}</strong></td>

                    
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
