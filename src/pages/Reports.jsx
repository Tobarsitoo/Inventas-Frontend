import React, { useState } from 'react';
import { fetchReport, exportReport } from '../api';

export default function Reports() {
  const [date,setDate] = useState('');
  const [report,setReport] = useState(null);
  const token = localStorage.getItem('token');

  const getReport = async () => {
    const r = await fetchReport(token, date || new Date().toISOString().slice(0,10));
    setReport(r);
  }

  const download = async (fmt) => {
    const d = date || new Date().toISOString().slice(0,10);
    const res = await exportReport(token, d, fmt);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${d}.${fmt==='csv'?'csv':'pdf'}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container mt-3">
      <h3>Reportes</h3>
      <div className="d-flex gap-2">
        <input type="date" className="form-control w-auto" value={date} onChange={e=>setDate(e.target.value)} />
        <button className="btn btn-primary" onClick={getReport}>Generar</button>
        <button className="btn btn-outline-secondary" onClick={()=>download('csv')}>Exportar CSV</button>
        <button className="btn btn-outline-secondary" onClick={()=>download('pdf')}>Exportar PDF</button>
      </div>
      {report && (
        <div className="mt-3">
          <p>Transacciones: {report.totalTransactions}</p>
          <p>Total ingresos: {report.totalIncome}</p>
          <table className="table">
            <thead><tr><th>SKU</th><th>Producto</th><th>Cantidad</th><th>Ingreso</th></tr></thead>
            <tbody>
              {report.products.map(p=>(
                <tr key={p.sku}><td>{p.sku}</td><td>{p.name}</td><td>{p.qty}</td><td>{p.income}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}