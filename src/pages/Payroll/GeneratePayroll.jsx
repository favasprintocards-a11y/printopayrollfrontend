import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function GeneratePayroll() {
  const [month, setMonth] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [employees, setEmployees] = useState([]);

  // ===============================
  // CHECK INCREMENT APPLICABLE
  // ===============================
  const isIncrementApplicable = (payrollMonth, fromMonth) => {
    if (!payrollMonth || !fromMonth) return false;
    return payrollMonth >= fromMonth;
  };

  const formatMonthYear = (value) => {
    if (!value) return "";
    const d = new Date(value + "-01");
    return d.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  // ===============================
  // GET BASE RATE
  // ===============================
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
      ? `₹${emp.salaryIncrement} applied from ${fm}`
      : `₹${emp.salaryIncrement} from ${fm}`;
  };

  // ===============================
  // LOAD EMPLOYEES
  // ===============================
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

  // ===============================
  // LEAVE CALC
  // ===============================
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

  // ===============================
  // RECALC
  // ===============================
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

  // ===============================
  // SAVE
  // ===============================
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
        <h1 className="page-title">Generate Payroll</h1>
      </div>

      {/* MONTH */}
      <div className="card">
        <label>Month</label>
        <input
          type="month"
          className="input"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      {/* COMMON DAYS */}
      <div className="card" style={{ marginTop: 15 }}>
        <label>Common Working Days (Monthly)</label>
        <input
          className="input"
          type="number"
          value={workingDays}
          onChange={(e) => setWorkingDays(e.target.value)}
        />
      </div>

      {/* EMPLOYEES */}
      {employees.map((e, i) => (
        <div key={i} className="card" style={{ marginTop: 25 }}>
          <h2>
            {e.name} <small>({e.location})</small>
          </h2>

          <table className="table">
            <tbody>
              <tr>
                <td>Base Salary</td>
                <td>
                  ₹ {getBaseRate(e)} {e.salaryType === "daily" && "/ day"}
                </td>
              </tr>

              <tr>
                <td>Salary Increment</td>
                <td>{getIncrementDisplay(e)}</td>
              </tr>

              <tr>
                <td>OT Rate</td>
                <td>₹ {e.otRate}</td>
              </tr>

              <tr>
                <td>Working Days</td>
                <td>
                  {e.salaryType === "daily" ? (
                    <input
                      className="input"
                      value={e.workingDays}
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
                ["Festival Allowance", "festivalAllowance"],
                ["Other Allowance", "otherAllowance"],
                ["Advance Salary", "advanceSalary"],
              ].map(([label, key]) => (
                <tr key={key}>
                  <td>{label}</td>
                  <td>
                    <input
                      className="input"
                      value={e[key]}
                      onChange={(ev) =>
                        recalc(i, key, ev.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}

              <tr>
                <td>OT Amount</td>
                <td>₹ {e.otAmount}</td>
              </tr>

              <tr>
                <td>Note</td>
                <td>
                  <input
                    className="input"
                    value={e.note}
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
              marginTop: 15,
              fontSize: 22,
              fontWeight: 700,
              color: "#2e7d32",
              textAlign: "right",
            }}
          >
            FINAL SALARY: ₹ {e.balanceSalary}
          </div>
        </div>
      ))}

      <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={save}>
        Save Payroll
      </button>
    </div>
  );
}
