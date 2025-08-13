// src/pages/Register.js
import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Link, Alert } from '@mui/material';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/api/auth/register', { name, email, password })
      .then(res => {
        setMsg('');
        navigate('/');
      })
      .catch(err => {
        setMsg(err.response?.data?.message || 'Erro ao cadastrar');
      });
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Typography variant="h4" component="h1" gutterBottom>Registrar</Typography>
        {msg && <Alert severity="error" sx={{ mb: 2 }}>{msg}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            label="Nome"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
          />
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
            Cadastrar
          </Button>
        </Box>
        <Link href="/" variant="body2">Já tem conta? Faça login</Link>
      </Box>
    </Container>
  );
}