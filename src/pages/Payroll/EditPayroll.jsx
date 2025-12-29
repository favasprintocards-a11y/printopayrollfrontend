// src/pages/Payroll/EditPayroll.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function EditPayroll() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [month, setMonth] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/payroll/id/${id}`);
        setMonth(res.data.month);

        const filled = res.data.employees.map((e) => ({
          name: e.name,
          basicSalary: e.basicSalary,

          workingDays: e.workingDays || "",
          leaveDeducted: e.leaveDeducted || "",
          casualLeave: e.casualLeave || "",

          taDa: e.taDa || "",
          overtime: e.overtime || "",
          otAmount: e.otAmount || "",
          festivalAllowance: e.festivalAllowance || "",
          otherAllowance: e.otherAllowance || "",
          advanceSalary: e.advanceSalary || "",

          // NEW: note
          note: e.note || "",

          balanceSalary: e.balanceSalary || e.basicSalary || 0,
        }));

        setRows(filled);
      } catch (err) {
        console.error("Failed to load payroll", err);
      }
    })();
  }, [id]);

  const updateField = (i, field, val) => {
    const arr = [...rows];
    arr[i][field] = val;

    const r = arr[i];

    r.balanceSalary =
      Number(r.basicSalary || 0) +
      Number(r.taDa || 0) +
      Number(r.otAmount || 0) +
      Number(r.festivalAllowance || 0) +
      Number(r.otherAllowance || 0) -
      Number(r.advanceSalary || 0);

    arr[i] = r;
    setRows(arr);
  };

  const save = async () => {
    try {
      await api.put(`/payroll/${id}`, {
        month,
        employees: rows,
      });

      alert("Payroll Updated Successfully");
      navigate("/payroll");
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Edit Payroll</h1>
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
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Basic</th>
              <th>Working Days</th>
              <th>Leave</th>
              <th>Casual</th>
              <th>TA+DA</th>
              <th>OT Hrs</th>
              <th>OT Amount</th>
              <th>Festival</th>
              <th>Other</th>
              <th>Advance</th>
              <th>Note</th>
              <th>Final</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ textAlign: "left" }}>{r.name}</td>
                <td>₹ {r.basicSalary}</td>

                <td>
                  <input
                    className="input"
                    value={r.workingDays}
                    onChange={(e) =>
                      updateField(i, "workingDays", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    className="input"
                    value={r.leaveDeducted}
                    onChange={(e) =>
                      updateField(i, "leaveDeducted", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    className="input"
                    value={r.casualLeave}
                    onChange={(e) =>
                      updateField(i, "casualLeave", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    className="input"
                    value={r.taDa}
                    onChange={(e) => updateField(i, "taDa", e.target.value)}
                  />
                </td>

                <td>
                  <input
                    className="input"
                    value={r.overtime}
                    onChange={(e) => updateField(i, "overtime", e.target.value)}
                  />
                </td>

                <td>
                  <input
                    className="input"
                    value={r.otAmount}
                    onChange={(e) =>
                      updateField(i, "otAmount", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    className="input"
                    value={r.festivalAllowance}
                    onChange={(e) =>
                      updateField(i, "festivalAllowance", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    className="input"
                    value={r.otherAllowance}
                    onChange={(e) =>
                      updateField(i, "otherAllowance", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    className="input"
                    value={r.advanceSalary}
                    onChange={(e) =>
                      updateField(i, "advanceSalary", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    className="input"
                    value={r.note}
                    onChange={(e) =>
                      updateField(i, "note", e.target.value)
                    }
                    placeholder="Note..."
                  />
                </td>

                <td>₹ {r.balanceSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: 20 }}
        onClick={save}
      >
        Save Changes
      </button>
    </div>
  );
}
