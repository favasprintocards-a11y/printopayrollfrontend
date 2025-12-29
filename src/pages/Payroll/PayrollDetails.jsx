// src/pages/Payroll/PayrollDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";

export default function PayrollDetails() {
  const { id } = useParams();
  const [payroll, setPayroll] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/payroll/id/${id}`);
        const data = res.data;

        data.employees = Array.isArray(data.employees) ? data.employees : [];

        // Ensure location exists
        const updated = await Promise.all(
          data.employees.map(async (emp) => {
            if (!emp.location) {
              try {
                const er = await api.get(`/employees/${emp._id}`);
                return { ...emp, location: er.data.location };
              } catch {
                return { ...emp, location: "Unknown" };
              }
            }
            return emp;
          })
        );

        data.employees = updated;
        setPayroll(data);
      } catch (err) {
        console.error("Fetch payroll failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="card">Loading...</div>;
  if (!payroll) return <div className="card">Payroll not found.</div>;

  // ================= FILTER =================
  const filteredEmployees =
    filter === "all"
      ? payroll.employees
      : payroll.employees.filter(
          (e) => (e.location || "").toLowerCase() === filter.toLowerCase()
        );

  // ================= TOTALS =================
  const officeTotal = payroll.employees
    .filter((e) => (e.location || "").toLowerCase() === "office")
    .reduce((sum, e) => sum + Number(e.balanceSalary || 0), 0);

  const unitTotal = payroll.employees
    .filter((e) => (e.location || "").toLowerCase() === "unit")
    .reduce((sum, e) => sum + Number(e.balanceSalary || 0), 0);

  const grandTotal = officeTotal + unitTotal;

  // ================= EXCEL DOWNLOAD =================
  const downloadExcelByLocation = (type) => {
    if (!window.XLSX) {
      alert("Excel library not loaded");
      return;
    }

    const list =
      type === "all"
        ? payroll.employees
        : payroll.employees.filter(
            (e) => (e.location || "").toLowerCase() === type
          );

    if (!list.length) {
      alert("No records found");
      return;
    }

    const rows = list.map((e, i) => ({
      "Sl No": i + 1,
      Name: e.name,
      Location: e.location,
      "Salary Type": e.salaryType,
      "Basic Salary": e.salaryType === "monthly" ? e.basicSalary : "",
      "Daily Wage": e.salaryType === "daily" ? e.dailyWage : "",
      "Salary Increment": e.incrementApplied ? e.salaryIncrement : "",
      "Working Days": e.workingDays || payroll.workingDays,
      "Leave Deducted": e.leaveDeducted,
      "Casual Leave": e.casualLeave,
      "TA + DA": e.taDa,
      "OT Hours": e.overtime,
      "OT Rate": e.otRate,
      "OT Amount": e.otAmount,
      "Festival Allowance": e.festivalAllowance,
      "Other Allowance": e.otherAllowance,
      "Advance Salary": e.advanceSalary,
      "Final Salary": e.balanceSalary,
      Note: e.note,
    }));

    const worksheet = window.XLSX.utils.json_to_sheet(rows);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll");

    window.XLSX.writeFile(
      workbook,
      `Payroll_${payroll.month}_${type.toUpperCase()}.xlsx`
    );
  };

  return (
    <div>
      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">Payroll — {payroll.month}</h1>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn btn-secondary"
            onClick={() => downloadExcelByLocation("office")}
          >
            ⬇ Office Excel
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => downloadExcelByLocation("unit")}
          >
            ⬇ Unit Excel
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => downloadExcelByLocation("all")}
          >
            ⬇ All Excel
          </button>

          <Link to={`/payroll/edit/${payroll._id}`} className="btn btn-primary">
            Edit Payroll
          </Link>
        </div>
      </div>

      {/* FILTER */}
      <div className="card" style={{ marginBottom: 15 }}>
        <label style={{ fontWeight: 600 }}>Filter by Location:</label>
        <select
          className="input"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: 200, marginTop: 8 }}
        >
          <option value="all">All Employees</option>
          <option value="office">Office</option>
          <option value="unit">Unit</option>
        </select>

        <div style={{ marginTop: 10, opacity: 0.7 }}>
          Showing {filteredEmployees.length} of {payroll.employees.length}
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name (Location)</th>
                <th>Basic Salary</th>
                <th>Daily Wage</th>
                
                <th>Working Days</th>
                <th>Leave</th>
                <th>Casual</th>
                <th>TA+DA</th>
                <th>OT Hrs</th>
                <th>OT Rate</th>
                <th>OT Amount</th>
                <th>Festival</th>
                <th>Other</th>
                <th>Advance</th>
                <th>Final</th>
                <th>Note</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((e, i) => (
                <tr key={i}>
                  <td>
                    {e.name}{" "}
                    <span style={{ fontSize: 12, opacity: 0.6 }}>
                      ({e.location})
                    </span>
                  </td>

                  <td>{e.salaryType === "monthly" ? `₹ ${e.basicSalary}` : "-"}</td>
                  <td>{e.salaryType === "daily" ? `₹ ${e.dailyWage}` : "-"}</td>


                  <td>{e.workingDays || payroll.workingDays || "-"}</td>
                  <td>{e.leaveDeducted || "-"}</td>
                  <td>{e.casualLeave || "-"}</td>
                  <td>₹ {e.taDa || 0}</td>
                  <td>{e.overtime || 0}</td>
                  <td>₹ {e.otRate || 0}</td>
                  <td>₹ {e.otAmount || 0}</td>
                  <td>₹ {e.festivalAllowance || 0}</td>
                  <td>₹ {e.otherAllowance || 0}</td>
                  <td>₹ {e.advanceSalary || 0}</td>
                  <td className="h2">₹ {e.balanceSalary}</td>
                  <td>{e.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOTALS */}
      <div className="card" style={{ marginTop: 20 }}>
        <h2>Office Payroll Total: ₹ {officeTotal}</h2>
        <h2>Unit Payroll Total: ₹ {unitTotal}</h2>
        <h2 style={{ marginTop: 10 }}>
          Grand Total Payroll: ₹ {grandTotal}
        </h2>
      </div>
    </div>
  );
}
