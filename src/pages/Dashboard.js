// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
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

  if (!user) return <Container><Typography>Carregando...</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Olá, {user.name}!</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6">Perfil</Typography>
            <Typography>Email: {user.email}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6">Tarefas</Typography>
            <Typography>Você não possui tarefas cadastradas.</Typography>
            {/* Futuro conteúdo */}
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6">Documentos</Typography>
            <Typography>Você não possui documentos cadastrados.</Typography>
            {/* Futuro conteúdo */}
          </CardContent>
        </Card>
      </Box>
      <Button variant="outlined" sx={{ mt: 3 }} onClick={() => {
        localStorage.removeItem('token');
        navigate('/');
      }}>Sair</Button>
    </Container>
  );
}