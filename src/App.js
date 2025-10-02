import React from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Cashier from "./pages/Cashier";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Audit from "./pages/Audit";

function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      {user?.username && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Inventario & Ventas
            </Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto">
                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/inventory">
                      Inventario
                    </Link>
                  </li>
                )}
                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/users">
                      Usuarios
                    </Link>
                  </li>
                )}
                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/audit">
                      Auditoría
                    </Link>
                  </li>
                )}
                {(user.role === "cashier" || user.role === "admin") && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/cashier">
                      Caja
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/reports">
                    Reportes
                  </Link>
                </li>
              </ul>
              <span className="navbar-text me-3">
                {user.username} ({user.role})
              </span>
              <button className="btn btn-outline-light" onClick={logout}>
                Salir
              </button>
            </div>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Audit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier"
          element={
            <ProtectedRoute roles={["cashier", "admin"]}>
              <Cashier />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={["cashier", "admin"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            user?.username ? (
              <Navigate to="/reports" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}
