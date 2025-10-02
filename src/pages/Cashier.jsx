import React, { useEffect, useState } from 'react';
import { fetchProducts, createSale } from '../api';

export default function Cashier() {
  const [catalog, setCatalog] = useState([]);
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(()=> {
    (async ()=> {
      const res = await fetchProducts(token);
      setCatalog(res);
    })();
  },[]);

  const addToCart = (sku) => {
    const p = catalog.find(x=>x.sku===sku);
    const existing = cart.find(c=>c.sku===sku);
    if (existing) {
      setCart(cart.map(c=> c.sku===sku ? {...c, qty: c.qty+1} : c));
    } else {
      setCart([...cart, { sku: p.sku, name: p.name, price: p.price, qty:1 }]);
    }
  };

  const total = cart.reduce((s,i)=> s + i.qty * i.price, 0);

  const finish = async () => {
    // construir items [{ sku, quantity }]
    const items = cart.map(i=> ({ sku: i.sku, quantity: i.qty }));
    const res = await createSale(token, items);
    if (res.sale) {
      alert('Venta registrada: ' + res.sale.transactionNumber);
      setCart([]);
    } else {
      alert(res.msg || 'Error');
    }
  }

  return (
    <div className="container mt-3">
      <h3>Caja</h3>
      <div className="row">
        <div className="col-6">
          <h5>Productos</h5>
          <ul className="list-group">
            {catalog.map(p=>(
              <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <b>{p.name}</b> <small>({p.sku})</small>
                  <div><small>Stock: {p.stock}</small></div>
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-primary" onClick={()=>addToCart(p.sku)}>Agregar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-6">
          <h5>Compra actual</h5>
          <ul className="list-group mb-2">
            {cart.map((c,i)=>(
              <li key={i} className="list-group-item">{c.name} x {c.qty} — { (c.qty * c.price).toFixed(2) }</li>
            ))}
          </ul>
          <div><b>Total: {total.toFixed(2)}</b></div>
          <button className="btn btn-success mt-2" onClick={finish} disabled={cart.length===0}>Finalizar venta</button>
        </div>
      </div>
    </div>
  );
}