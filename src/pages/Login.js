// src/pages/Login.js
import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Link, Alert } from '@mui/material';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/api/auth/login', { email, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        setMsg('');
        navigate('/dashboard');
      })
      .catch(err => {
        setMsg(err.response?.data?.message || 'Erro ao logar');
      });
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Typography variant="h4" component="h1" gutterBottom>Login</Typography>
        {msg && <Alert severity="error" sx={{ mb: 2 }}>{msg}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, mb: 1 }}>
            Entrar
          </Button>
        </Box>
        <Link href="/register" variant="body2">Não tem conta? Cadastre-se</Link>
      </Box>
    </Container>
  );
}