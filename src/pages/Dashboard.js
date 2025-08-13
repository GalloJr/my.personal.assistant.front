import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    api.get('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(() => navigate('/'));
  }, [navigate]);

  if (!user) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Bem-vindo, {user.name}</h2>
      <p>Email: {user.email}</p>
      {/* Aqui você pode expandir para tarefas, contas, etc */}
      <button onClick={()=>{localStorage.removeItem('token');navigate('/')}}>Sair</button>
    </div>
  );
}