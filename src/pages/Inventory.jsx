import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProductBySku,
} from "../api";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchSku, setSearchSku] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); 
  const role = user?.role; 

  const load = async () => {
    const res = await fetchProducts(token);
    setProducts(res);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };

    if (editingId) {
      await updateProduct(token, editingId, productData);
    } else {
      await createProduct(token, productData);
    }

    setForm({ sku: "", name: "", description: "", price: "", stock: "" });
    setEditingId(null);
    await load();
  };

  const handleSearch = async () => {
    if (!searchSku) {
      await load();
      return;
    }
    try {
      const product = await fetchProductBySku(token, searchSku);
      setProducts([product]);
    } catch (error) {
      alert(error.message);
      setProducts([]);
    }
  };

  const handleEdit = (p) => {
    setForm({
      sku: p.sku,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
    });
    setEditingId(p._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    await deleteProduct(token, id);
    await load();
  };

  return (
    <div className="container mt-3">
      <h3>Inventario</h3>

      {/* Solo los admins pueden crear/editar/eliminar */}
      {role === "admin" && (
        <form className="row g-2" onSubmit={handleSubmit}>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="SKU"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              required
              disabled={!!editingId}
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Nombre"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Descripción"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="Precio"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Stock"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-success">
              {editingId ? "Actualizar" : "Crear"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setForm({
                    sku: "",
                    name: "",
                    description: "",
                    price: "",
                    stock: "",
                  });
                  setEditingId(null);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      {/* Buscar producto */}
      <div className="row mb-3 mt-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por SKU"
            value={searchSku}
            onChange={(e) => setSearchSku(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary" onClick={handleSearch}>
            Buscar
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <table className="table table-striped table-hover mt-4">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            {role === "admin" && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.stock}</td>
              {role === "admin" && (
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
