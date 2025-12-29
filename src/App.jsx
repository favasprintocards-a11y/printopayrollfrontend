// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeeIncrementHistory from "./pages/Employees/EmployeeIncrementHistory";



import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import EmployeeList from "./pages/Employees/EmployeeList";
import EmployeeForm from "./pages/Employees/EmployeeForm";

import PayrollList from "./pages/Payroll/PayrollList";
import GeneratePayroll from "./pages/Payroll/GeneratePayroll";
import PayrollDetails from "./pages/Payroll/PayrollDetails";
import EditPayroll from "./pages/Payroll/EditPayroll";
import EmployeeDetails from "./pages/Employees/EmployeeDetails";
import EmployeeView from "./pages/Employees/EmployeeView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE SHOULD BE FIRST */}
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD AFTER LOGIN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEES */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Layout>
                <EmployeeList />
              </Layout>
            </ProtectedRoute>
          }
        />
<Route
  path="/employees/view/:id"
  element={
    <ProtectedRoute>
      <Layout>
        <EmployeeView />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/employees/:id/increment-history"
  element={<EmployeeIncrementHistory />}
/>

        <Route
          path="/employees/add"
          element={
            <ProtectedRoute>
              <Layout>
                <EmployeeForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EmployeeForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* PAYROLL */}
        <Route
          path="/payroll"
          element={
            <ProtectedRoute>
              <Layout>
                <PayrollList />
              </Layout>
            </ProtectedRoute>
          }
        />
<Route
  path="/employees/view/:id"
  element={
    <ProtectedRoute>
      <Layout>
        <EmployeeDetails />
      </Layout>
    </ProtectedRoute>
  }
/>

        <Route
          path="/payroll/generate"
          element={
            <ProtectedRoute>
              <Layout>
                <GeneratePayroll />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payroll/details/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <PayrollDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payroll/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditPayroll />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* DEFAULT ROUTE — redirect to LOGIN */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
