import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function GeneratePayroll() {
  const [month, setMonth] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  const compactCell = {
    padding: "4px 8px",
    fontSize: "13px",
    verticalAlign: "middle"
  };

  const labelCell = {
    padding: "4px 8px",
    fontSize: "13px",
    fontWeight: 600,
    width: "170px",
    whiteSpace: "nowrap"
  };

  const isIncrementApplicable = (payrollMonth, fromMonth) => {
    if (!payrollMonth || !fromMonth) return false;
    return payrollMonth >= fromMonth;
  };

  const formatMonthYear = (value) => {
    if (!value) return "";
    const d = new Date(value + "-01");
    return d.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
  };

  const getBaseRate = (emp) => {
    const applied = isIncrementApplicable(month, emp.salaryIncrementFrom);
    const increment = applied ? Number(emp.salaryIncrement || 0) : 0;

    return emp.salaryType === "daily"
      ? Number(emp.dailyWage || 0) + increment
      : Number(emp.basicSalary || 0) + increment;
  };

  const getIncrementDisplay = (emp) => {
    if (!emp.salaryIncrement || !emp.salaryIncrementFrom) return "—";

    const applied = isIncrementApplicable(month, emp.salaryIncrementFrom);
    const fm = formatMonthYear(emp.salaryIncrementFrom);

    return applied
      ? `₹${emp.salaryIncrement} from ${fm}`
      : `₹${emp.salaryIncrement} (from ${fm})`;
  };

  useEffect(() => {
    (async () => {
      const r = await api.get("/employees");
      setEmployees(
        r.data.map((e) => ({
          ...e,
          leaveDeducted: "",
          casualLeave: "",
          taDa: "",
          overtime: "",
          otAmount: "",
          festivalAllowance: "",
          otherAllowance: "",
          advanceSalary: "",
          note: "",
          balanceSalary: 0,
          workingDays: "",
        }))
      );
    })();
  }, []);

  const calculateLeaveDeduction = (
    salaryType,
    baseRate,
    leave,
    casual
  ) => {
    const eff = Math.max(Number(leave || 0) - Number(casual || 0), 0);
    if (!eff) return 0;

    return salaryType === "daily"
      ? baseRate * eff
      : (baseRate / 30) * eff;
  };

  const recalc = (i, field, value) => {
    const arr = [...employees];
    const e = arr[i];
    e[field] = value;

    if (field === "overtime") {
      e.otAmount = Number(value || 0) * Number(e.otRate || 0);
    }

    const baseRate = getBaseRate(e);
    const days =
      e.salaryType === "daily"
        ? Number(e.workingDays || 0)
        : Number(workingDays || 0);

    const baseSalary =
      e.salaryType === "daily" ? baseRate * days : baseRate;

    const deduction = calculateLeaveDeduction(
      e.salaryType,
      baseRate,
      e.leaveDeducted,
      e.casualLeave
    );

    e.balanceSalary =
      baseSalary -
      deduction +
      Number(e.taDa || 0) +
      Number(e.otAmount || 0) +
      Number(e.festivalAllowance || 0) +
      Number(e.otherAllowance || 0) -
      Number(e.advanceSalary || 0);

    setEmployees(arr);
  };

  const save = async () => {
    if (!month) return alert("Select month");

    await api.post("/payroll", {
      month,
      workingDays,
      employees,
    });

    alert("Payroll Generated");
  };

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title" style={{ fontSize: "20px" }}>
          Generate Payroll
        </h1>
      </div>

      {/* MONTH */}
      <div className="card" style={{ padding: "10px" }}>
        <label>Month</label>
        <input
          type="month"
          className="input"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      {/* COMMON DAYS */}
      <div className="card" style={{ marginTop: 10, padding: "10px" }}>
        <label>Common Working Days (Monthly)</label>
        <input
          className="input"
          type="number"
          value={workingDays}
          onChange={(e) => setWorkingDays(e.target.value)}
        />
      </div>
{/* SEARCH BOX */}
<div className="card" style={{ marginTop: 10, padding: "10px" }}>
  <label>Search Employee</label>
  <input
    type="text"
    className="input"
    placeholder="Search by name or employee ID..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
      {/* EMPLOYEE BOXES */}
      {employees
  .filter((e) => {
    const term = search.toLowerCase();
    return (
      e.name?.toLowerCase().includes(term) ||
      e.employeeId?.toLowerCase().includes(term)
    );
  })
  .map((e, i) => (
        <div
          key={i}
          className="card"
          style={{
            marginTop: 15,
            padding: "10px",
            maxWidth: "650px"
          }}
        >
          <h3 style={{ marginBottom: 6, fontSize: "16px" }}>
            {e.name} <small>({e.location})</small>
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >
            <tbody>
              <tr>
                <td style={labelCell}>Base Salary</td>
                <td style={compactCell}>
                  ₹ {getBaseRate(e)}{" "}
                  {e.salaryType === "daily" && "/ day"}
                </td>
              </tr>

              <tr>
                <td style={labelCell}>Salary Increment</td>
                <td style={compactCell}>{getIncrementDisplay(e)}</td>
              </tr>

              <tr>
                <td style={labelCell}>Working Days</td>
                <td style={compactCell}>
                  {e.salaryType === "daily" ? (
                    <input
                      className="input"
                      value={e.workingDays}
                      style={{ width: 80, fontSize: 12 }}
                      onChange={(ev) =>
                        recalc(i, "workingDays", ev.target.value)
                      }
                    />
                  ) : (
                    <strong>{workingDays || "-"}</strong>
                  )}
                </td>
              </tr>

              {[
                ["Leave", "leaveDeducted"],
                ["Casual Leave", "casualLeave"],
                ["TA + DA", "taDa"],
                ["OT Hours", "overtime"],
                ["Festival", "festivalAllowance"],
                ["Other", "otherAllowance"],
                ["Advance", "advanceSalary"],
              ].map(([label, key]) => (
                <tr key={key}>
                  <td style={labelCell}>{label}</td>
                  <td style={compactCell}>
                    <input
                      className="input"
                      value={e[key]}
                      style={{ width: 100, fontSize: 12 }}
                      onChange={(ev) =>
                        recalc(i, key, ev.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}

              <tr>
                <td style={labelCell}>OT Amount</td>
                <td style={compactCell}>₹ {e.otAmount}</td>
              </tr>

              <tr>
                <td style={labelCell}>Note</td>
                <td style={compactCell}>
                  <input
                    className="input"
                    value={e.note}
                    style={{ width: 150, fontSize: 12 }}
                    onChange={(ev) =>
                      recalc(i, "note", ev.target.value)
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div
            style={{
              marginTop: 10,
              fontSize: 18,
              fontWeight: 700,
              color: "#2e7d32",
              textAlign: "right",
            }}
          >
            ₹ {e.balanceSalary}
          </div>
        </div>
      ))}

      <button
        className="btn btn-primary"
        style={{ marginTop: 20 }}
        onClick={save}
      >
        Save Payroll
      </button>
    </div>
  );
}