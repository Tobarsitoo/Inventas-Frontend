const API = process.env.REACT_APP_API_URL;

// Auth ================================================
export const login = (username, password) =>
  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then((r) => r.json());

// Usuarios (solo admin) ==================================
export const fetchUsers = (token) =>
  fetch(`${API}/users/`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

export const createUser = (token, user) =>
  fetch(`${API}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  }).then((r) => r.json());

  export const updateUser = (token, id, user) =>
  fetch(`${API}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  }).then((r) => r.json());

export const deleteUser = (token, id) =>
  fetch(`${API}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

// Productos ==========================================
export const fetchProducts = (token) =>
  fetch(`${API}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

export const createProduct = (token, product) =>
  fetch(`${API}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  }).then((r) => r.json());

export const updateProduct = (token, id, product) =>
  fetch(`${API}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  }).then((r) => r.json());

export const deleteProduct = (token, id) =>
  fetch(`${API}/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

export const fetchProductBySku = (token, sku) =>
  fetch(`${API}/products/sku/${sku}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => {
    if (!r.ok) throw new Error("Producto no encontrado");
    return r.json();
  });

// Ventas ==============================================
export const createSale = (token, items) =>
  fetch(`${API}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  }).then((r) => r.json());

export const fetchReport = (token, date) =>
  fetch(`${API}/sales/report?date=${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

export const exportReport = (token, date, format = "csv") =>
  fetch(`${API}/sales/report/export?date=${date}&format=${format}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Auditoría (Solo admin) ==============================================
export const fetchAuditLogs = (token) =>
  fetch(`${API}/audit`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
