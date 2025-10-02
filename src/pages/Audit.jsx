import React, { useEffect, useState } from "react";
import { fetchAuditLogs } from "../api";

export default function Audit() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      const data = await fetchAuditLogs(token);
      setLogs(data);
    })();
  }, [token]);

  return (
    <div className="container mt-3">
      <h3>Auditoría de Inicios de Sesión</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Evento</th>
            <th>IP</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.username}</td>
              <td>
                {log.event === "login_success" && (
                  <span className="badge bg-success">Exitoso</span>
                )}
                {log.event === "wrong_password" && (
                  <span className="badge bg-warning text-dark">
                    Contraseña incorrecta
                  </span>
                )}
                {log.event === "login_failed" && (
                  <span className="badge bg-danger">Usuario no existe</span>
                )}
              </td>
              <td>{log.ip}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}