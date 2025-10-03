import React, { useEffect, useState } from "react";
import { fetchUsers, createUser, deleteUser, updateUser } from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "cashier",
  });
  const [editingId, setEditingId] = useState(null); // 👈 saber si estoy editando

  const token = localStorage.getItem("token");

  const load = async () => {
    const res = await fetchUsers(token);
    setUsers(res);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // 👈 actualizar
      await updateUser(token, editingId, form);
    } else {
      // 👈 crear
      await createUser(token, form);
    }

    setForm({ username: "", password: "", role: "cashier" });
    setEditingId(null);
    await load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    await deleteUser(token, id);
    await load();
  };

  const handleEdit = (u) => {
    // llenar el formulario con los datos del usuario
    setForm({
      username: u.username,
      password: "", // 👈 por seguridad no mostramos contraseña, debe escribirse nueva si se quiere cambiar
      role: u.role,
    });
    setEditingId(u._id);
  };

  return (
    <div className="container mt-3">
      <h3>Gestión de Usuarios</h3>

      {/* Formulario */}
      <form className="row g-2 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Usuario"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            name="password"
            value={form.password}
            onChange={handleChange}
            required={!editingId} // si estamos editando, no obligamos a cambiar la contraseña
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="cashier">Cajero</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button type="submit" className="btn btn-success w-100">
            {editingId ? "Actualizar" : "Crear"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={() => {
                setForm({ username: "", password: "", role: "cashier" });
                setEditingId(null);
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEdit(u)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(u._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
