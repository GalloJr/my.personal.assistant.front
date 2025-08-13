import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    api.post('/api/auth/login', { email, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        setMsg('Login realizado com sucesso!');
        navigate('/dashboard');
      })
      .catch(err => {
        setMsg(err.response?.data?.message || 'Erro ao logar');
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
      <input type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} required/>
      <button type="submit">Entrar</button>
      <p>{msg}</p>
      <a href="/register">Não tem conta? Cadastre-se</a>
    </form>
  );
}