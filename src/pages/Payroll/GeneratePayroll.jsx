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
    return payrollMonth >= fromMonth; // YYYY-MM comparison
  };

  // ===============================
  // FORMAT MONTH
  // ===============================
  const formatMonthYear = (value) => {
    if (!value) return "";
    const d = new Date(value + "-01");
    return d.toLocaleString("default", { month: "long", year: "numeric" });
  };

  // ===============================
  // GET BASE RATE (WITH INCREMENT)
  // ===============================
  const getBaseRate = (emp) => {
    const applied = isIncrementApplicable(month, emp.salaryIncrementFrom);
    const increment = applied ? Number(emp.salaryIncrement || 0) : 0;

    return emp.salaryType === "daily"
      ? Number(emp.dailyWage || 0) + increment
      : Number(emp.basicSalary || 0) + increment;
  };

  // ===============================
  // INCREMENT LABEL
  // ===============================
  const getIncrementDisplay = (emp) => {
    if (!emp.salaryIncrement || !emp.salaryIncrementFrom) return "—";

    const formattedMonth = formatMonthYear(emp.salaryIncrementFrom);
    const applied = isIncrementApplicable(month, emp.salaryIncrementFrom);

    if (applied) {
      return (
        <span
          style={{
            background: "#fdecea",
            color: "#c62828",
            padding: "4px 8px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Salary increased ₹{emp.salaryIncrement} from {formattedMonth} onwards
        </span>
      );
    }

    return (
      <span style={{ color: "#e65100", fontWeight: 600, fontSize: 12 }}>
        ₹{emp.salaryIncrement} salary increment from {formattedMonth} onwards
      </span>
    );
  };

  // ===============================
  // LOAD EMPLOYEES
  // ===============================
  useEffect(() => {
    (async () => {
      const r = await api.get("/employees");

      const list = r.data.map((e) => ({
        _id: e._id,
        name: e.name,
        location: e.location,
        salaryType: e.salaryType,

        basicSalary: e.basicSalary || 0,
        dailyWage: e.dailyWage || 0,

        salaryIncrement: e.salaryIncrement || 0,
        salaryIncrementFrom: e.salaryIncrementFrom || null,

        otRate: e.otRate || 0,

        leaveDeducted: "",
        casualLeave: "",
        taDa: "",
        overtime: "",
        otAmount: "",
        festivalAllowance: "",
        otherAllowance: "",
        advanceSalary: "",
        note: "", // ✅ NOTE FIELD

        balanceSalary: 0,
      }));

      setEmployees(list);
    })();
  }, []);

  // ===============================
  // LEAVE DEDUCTION
  // ===============================
  const calculateLeaveDeduction = (
    salaryType,
    baseRate,
    leave,
    casualLeave
  ) => {
    const l = Number(leave || 0);
    const c = Number(casualLeave || 0);
    const effectiveLeave = Math.max(l - c, 0);

    if (effectiveLeave === 0) return 0;

    return salaryType === "daily"
      ? baseRate * effectiveLeave
      : (baseRate / 30) * effectiveLeave;
  };

  // ===============================
  // RECALCULATE ONE ROW
  // ===============================
  const recalc = (index, field, value) => {
    const arr = [...employees];
    const emp = arr[index];
    emp[field] = value;

    if (field === "overtime") {
      emp.otAmount = Number(value || 0) * Number(emp.otRate || 0);
    }

    const baseRate = getBaseRate(emp);

    const baseSalary =
      emp.salaryType === "daily"
        ? baseRate * Number(workingDays || 0)
        : baseRate;

    const leaveDeduction = calculateLeaveDeduction(
      emp.salaryType,
      baseRate,
      emp.leaveDeducted,
      emp.casualLeave
    );

    emp.balanceSalary =
      baseSalary -
      leaveDeduction +
      Number(emp.taDa || 0) +
      Number(emp.otAmount || 0) +
      Number(emp.festivalAllowance || 0) +
      Number(emp.otherAllowance || 0) -
      Number(emp.advanceSalary || 0);

    setEmployees(arr);
  };

  // ===============================
  // RECALCULATE ALL
  // ===============================
  const recalcAll = (days = workingDays) => {
    const arr = [...employees];

    arr.forEach((emp) => {
      const baseRate = getBaseRate(emp);

      const baseSalary =
        emp.salaryType === "daily"
          ? baseRate * Number(days || 0)
          : baseRate;

      const leaveDeduction = calculateLeaveDeduction(
        emp.salaryType,
        baseRate,
        emp.leaveDeducted,
        emp.casualLeave
      );

      emp.balanceSalary =
        baseSalary -
        leaveDeduction +
        Number(emp.taDa || 0) +
        Number(emp.otAmount || 0) +
        Number(emp.festivalAllowance || 0) +
        Number(emp.otherAllowance || 0) -
        Number(emp.advanceSalary || 0);
    });

    setEmployees(arr);
  };

  useEffect(() => {
    if (month) recalcAll();
  }, [month]);

  // ===============================
  // SAVE PAYROLL
  // ===============================
  const save = async () => {
    if (!month) return alert("Please select month");

    try {
      await api.post("/payroll", {
        month,
        workingDays,
        employees: employees.map((e) => ({
          ...e,
          incrementApplied:
            isIncrementApplicable(month, e.salaryIncrementFrom) &&
            e.salaryIncrement > 0,
        })),
      });

      alert("Payroll Generated Successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to generate payroll");
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Generate Payroll</h1>
      </div>

      <div className="card">
        <label>Month</label>
        <input
          type="month"
          className="input"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <label style={{ fontWeight: 600 }}>Working Days (Common)</label>
        <input
          type="number"
          className="input"
          value={workingDays}
          onChange={(e) => {
            setWorkingDays(e.target.value);
            recalcAll(e.target.value);
          }}
        />
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Base Salary</th>
              <th>Increment</th>
              <th>OT Rate</th>
              <th>Leave</th>
              <th>Casual</th>
              <th>TA+DA</th>
              <th>OT Hrs</th>
              <th>OT Amount</th>
              <th>Festival</th>
              <th>Other</th>
              <th>Advance</th>
              <th>Note</th> {/* ✅ NEW */}
              <th>Final</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((e, i) => (
              <tr key={i}>
                <td>{e.name} ({e.location})</td>

                <td>₹ {getBaseRate(e)}{e.salaryType === "daily" && " / day"}</td>

                <td>{getIncrementDisplay(e)}</td>

                <td>₹ {e.otRate}</td>

                <td>
                  <input className="input" value={e.leaveDeducted}
                    onChange={(ev) => recalc(i, "leaveDeducted", ev.target.value)} />
                </td>

                <td>
                  <input className="input" value={e.casualLeave}
                    onChange={(ev) => recalc(i, "casualLeave", ev.target.value)} />
                </td>

                <td>
                  <input className="input" value={e.taDa}
                    onChange={(ev) => recalc(i, "taDa", ev.target.value)} />
                </td>

                <td>
                  <input className="input" value={e.overtime}
                    onChange={(ev) => recalc(i, "overtime", ev.target.value)} />
                </td>

                <td>₹ {e.otAmount}</td>

                <td>
                  <input className="input" value={e.festivalAllowance}
                    onChange={(ev) => recalc(i, "festivalAllowance", ev.target.value)} />
                </td>

                <td>
                  <input className="input" value={e.otherAllowance}
                    onChange={(ev) => recalc(i, "otherAllowance", ev.target.value)} />
                </td>

                <td>
                  <input className="input" value={e.advanceSalary}
                    onChange={(ev) => recalc(i, "advanceSalary", ev.target.value)} />
                </td>

                {/* ✅ NOTE INPUT */}
                <td>
                  <input
                    className="input"
                    value={e.note}
                    placeholder="Note..."
                    onChange={(ev) => recalc(i, "note", ev.target.value)}
                  />
                </td>

                <td className="h2">₹ {e.balanceSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={save}>
        Save Payroll
      </button>
    </div>
  );
}
