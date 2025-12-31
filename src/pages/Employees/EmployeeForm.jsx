import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [employee, setEmployee] = useState({
    employeeId: "", // ✅ NEW
    name: "",
    department: "",
    location: "Office",

    salaryType: "monthly",
    basicSalary: "",
    dailyWage: "",

    salaryIncrement: "",
    salaryIncrementFrom: "",

    otRate: "",
    paymentMethod: "Cash",
    gstType: "No GST",
  });

  // LOAD EMPLOYEE FOR EDIT
  useEffect(() => {
    if (isEdit) {
      (async () => {
        const r = await api.get(`/employees/${id}`);
        setEmployee({
          ...r.data,
          salaryIncrement: r.data.salaryIncrement || "",
          salaryIncrementFrom: r.data.salaryIncrementFrom || "",
        });
      })();
    }
  }, [id, isEdit]);

  const update = (field, value) => {
    setEmployee((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...employee,
        basicSalary:
          employee.salaryType === "monthly" ? employee.basicSalary : 0,
        dailyWage:
          employee.salaryType === "daily" ? employee.dailyWage : 0,
      };

      if (isEdit) {
        await api.put(`/employees/${id}`, payload);
        alert("Employee updated successfully");
      } else {
        await api.post("/employees", payload);
        alert("Employee added successfully");
      }

      navigate("/employees");
    } catch (err) {
      console.error(err);
      alert("Error saving employee");
    }
  };

  return (
    <div className="card form-page">
      <h1 className="page-title">
        {isEdit ? "Edit Employee" : "Add Employee"}
      </h1>

      <form onSubmit={submit}>

        {/* ✅ EMPLOYEE ID (READ ONLY) */}
        {isEdit && (
          <>
            <label>Employee ID</label>
            <input
              className="input"
              value={employee.employeeId}
              disabled
              style={{ background: "#f3f3f3", fontWeight: 600 }}
            />
          </>
        )}

        {/* NAME */}
        <label>Name</label>
        <input
          className="input"
          value={employee.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />

        {/* DEPARTMENT */}
        <label>Department</label>
        <input
          className="input"
          value={employee.department}
          onChange={(e) => update("department", e.target.value)}
        />

        {/* LOCATION */}
        <label>Location</label>
        <select
          className="input"
          value={employee.location}
          onChange={(e) => update("location", e.target.value)}
        >
          <option value="Office">Office</option>
          <option value="Unit">Unit</option>
        </select>

        {/* SALARY TYPE */}
        <label>Salary Type</label>
        <select
          className="input"
          value={employee.salaryType}
          onChange={(e) => update("salaryType", e.target.value)}
        >
          <option value="monthly">Monthly</option>
          <option value="daily">Daily</option>
        </select>

        {/* BASIC SALARY */}
        {employee.salaryType === "monthly" && (
          <>
            <label>Basic Salary</label>
            <input
              type="number"
              className="input"
              value={employee.basicSalary}
              onChange={(e) => update("basicSalary", e.target.value)}
            />
          </>
        )}

        {/* DAILY WAGE */}
        {employee.salaryType === "daily" && (
          <>
            <label>Daily Wage</label>
            <input
              type="number"
              className="input"
              value={employee.dailyWage}
              onChange={(e) => update("dailyWage", e.target.value)}
            />
          </>
        )}

        {/* SALARY INCREMENT */}
        <label>Salary Increment Amount</label>
        <input
          type="number"
          className="input"
          value={employee.salaryIncrement}
          onChange={(e) => update("salaryIncrement", e.target.value)}
        />

        <label>Salary Increment Start From</label>
        <input
          type="month"
          className="input"
          value={employee.salaryIncrementFrom}
          onChange={(e) => update("salaryIncrementFrom", e.target.value)}
          min="2020-01"
          max="2035-12"
        />

        <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
          💡 Tip: Use arrow keys ↑ ↓ or type year-month manually
        </p>

        {/* OT RATE */}
        <label>OT Rate (per hour)</label>
        <input
          type="number"
          className="input"
          value={employee.otRate}
          onChange={(e) => update("otRate", e.target.value)}
        />

        {/* PAYMENT METHOD */}
        <label>Payment Method</label>
        <select
          className="input"
          value={employee.paymentMethod}
          onChange={(e) => update("paymentMethod", e.target.value)}
        >
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>

        {/* ACCOUNTING */}
        <label>Accounting</label>
        <select
          className="input"
          value={employee.gstType}
          onChange={(e) => update("gstType", e.target.value)}
        >
          <option value="No GST">DCS</option>
          <option value="GST">Tally</option>
        </select>

        <button className="btn btn-primary" style={{ marginTop: 15 }}>
          Save Employee
        </button>
      </form>
    </div>
  );
}
