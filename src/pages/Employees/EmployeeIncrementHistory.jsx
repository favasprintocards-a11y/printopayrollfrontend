import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams, Link } from "react-router-dom";

// ===============================
// Format YYYY-MM → Month Year
// ===============================
const formatMonth = (value) => {
  if (!value) return "—";
  const d = new Date(value + "-01");
  return d.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
};

export default function EmployeeIncrementHistory() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const empRes = await api.get(`/employees/${id}`);
      const hisRes = await api.get(`/employees/${id}/increment-history`);

      setEmployee(empRes.data);
      setHistory(hisRes.data || []);
    } catch (err) {
      console.error(err);
      alert("Unable to load increment history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="card">Loading...</div>;

  // ===============================
  // CALCULATE SALARY SNAPSHOTS
  // ===============================
  const salaryType = employee?.salaryType;
  const currentBaseSalary =
    salaryType === "daily"
      ? employee?.dailyWage
      : employee?.basicSalary;

  // Starting salary calculation
  let startingSalary = currentBaseSalary;
  let startingFrom = "—";

  if (history.length > 0) {
    const totalIncrement = history.reduce(
      (sum, h) => sum + Number(h.amount || 0),
      0
    );
    startingSalary = currentBaseSalary - totalIncrement;
    startingFrom = formatMonth(history[0].fromMonth);
  }

  // Latest salary info
  const latestApplied = history
    .filter((h) => h.applied)
    .slice(-1)[0];

  const latestFrom = latestApplied
    ? formatMonth(latestApplied.fromMonth)
    : "—";

  return (
    <div className="main">
      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">Salary Increment History</h1>

        <Link to="/employees" className="btn btn-secondary">
          ← Back to Employees
        </Link>
      </div>

      {/* EMPLOYEE SUMMARY */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 5 }}>{employee?.name}</h2>

        <p style={{ lineHeight: 1.8 }}>
          <strong>Department:</strong> {employee?.department || "—"} <br />
          <strong>Salary Type:</strong>{" "}
          {employee?.salaryType?.toUpperCase()} <br />

          <strong>Starting Base Salary:</strong>{" "}
          ₹ {startingSalary}{" "}
          {salaryType === "daily" && <span>/ day</span>} <br />

          <strong>Starting From:</strong> {startingFrom} <br />

          <strong>Latest Base Salary:</strong>{" "}
          ₹ {currentBaseSalary}{" "}
          {salaryType === "daily" && <span>/ day</span>} <br />

          <strong>Effective From:</strong> {latestFrom}
        </p>
      </div>

      {/* HISTORY TABLE */}
      <div className="table-wrap card">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Increment Amount</th>
              <th>Increment Start From</th>
              <th>Applied In Payroll</th>
              
            </tr>
          </thead>

          <tbody>
            {history.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", opacity: 0.6 }}>
                  No salary increment history found.
                </td>
              </tr>
            )}

            {history.map((h, i) => (
              <tr key={i}>
                <td>{i + 1}</td>

                <td>
                  ₹ {h.amount}
                  {salaryType === "daily" && " / day"}
                </td>

                <td>{formatMonth(h.fromMonth)}</td>

                <td>
                  {h.applied ? (
                    <span style={{ color: "green", fontWeight: 600 }}>
                      Yes
                    </span>
                  ) : (
                    <span style={{ color: "red", fontWeight: 600 }}>
                      No
                    </span>
                  )}
                </td>

               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
