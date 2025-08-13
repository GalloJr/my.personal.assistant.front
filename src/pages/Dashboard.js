import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/');

    api.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data))
      .catch(() => navigate('/'));

    api.get('/api/accounts', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setAccounts(res.data))
      .catch(console.error);
  }, [navigate, token]);

  if (!user) return <Container><Typography>Carregando...</Typography></Container>;

  const total = accounts.reduce((acc, cur) => acc + parseFloat(cur.amount), 0);
  const pendente = accounts.filter(acc => acc.status === 'pending').reduce((acc, cur) => acc + parseFloat(cur.amount), 0);
  const pago = accounts.filter(acc => acc.status === 'paid').reduce((acc, cur) => acc + parseFloat(cur.amount), 0);

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
            <Typography variant="h6">Resumo Financeiro</Typography>
            <Typography>Total de Contas: {accounts.length}</Typography>
            <Typography>Total Pendentes: R$ {pendente.toFixed(2)}</Typography>
            <Typography>Total Pago: R$ {pago.toFixed(2)}</Typography>
          </CardContent>
          <Button variant="text" onClick={() => navigate('/accounts')} sx={{ mt: 1 }}>
            Ver Contas
          </Button>
        </Card>
      </Box>
      <Button variant="outlined" sx={{ mt: 3 }} onClick={() => {
        localStorage.removeItem('token');
        navigate('/');
      }}>Sair</Button>
    </Container>
  );
}