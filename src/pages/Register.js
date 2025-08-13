import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    api.post('/api/auth/register', { name, email, password })
      .then(res => {
        setMsg('Cadastro feito! Faça login.');
        navigate('/');
      })
      .catch(err => {
        setMsg(err.response?.data?.message || 'Erro ao cadastrar');
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar</h2>
      <input type="text" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} required/>
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
      <input type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} required/>
      <button type="submit">Cadastrar</button>
      <p>{msg}</p>
      <a href="/">Já tem conta? Faça login</a>
    </form>
  );
}