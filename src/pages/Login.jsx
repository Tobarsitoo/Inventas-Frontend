import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    const res = await login(username,password);
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      navigate('/');
    } else {
      alert(res.msg || 'Error');
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-4">
          <h3>Iniciar sesión</h3>
          <form onSubmit={handle}>
            <div className="mb-2">
              <input className="form-control" placeholder="Usuario" value={username} onChange={e=>setUsername(e.target.value)} />
            </div>
            <div className="mb-2">
              <input type="password" className="form-control" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary w-100">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}