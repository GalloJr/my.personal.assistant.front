// src/pages/Accounts.js
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, CardActions,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, IconButton, Grid
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../api';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    amount: '',
    dueDate: '',
    status: 'pending'
  });

  // Filtros do topo da tela
  const [filter, setFilter] = useState({ status: '', month: '', year: '', title: '' });

  // Pega token do usuário logado
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line
  }, []);

  // Função para buscar contas com filtros
  const fetchAccounts = async () => {
    let params = {};
    Object.keys(filter).forEach(key => {
      if (filter[key]) params[key] = filter[key];
    });

    try {
      const res = await api.get('/api/accounts', {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Handlers para abrir/fechar dialogo de cadastro/edição
  const handleOpenNew = () => {
    setEditingAccount(null);
    setForm({
      title: '',
      description: '',
      amount: '',
      dueDate: '',
      status: 'pending'
    });
    setOpen(true);
  };

  const handleOpenEdit = (account) => {
    setEditingAccount(account);
    setForm({
      title: account.title,
      description: account.description || '',
      amount: account.amount,
      dueDate: account.dueDate,
      status: account.status
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAccount(null);
    setForm({
      title: '',
      description: '',
      amount: '',
      dueDate: '',
      status: 'pending'
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Salva (cria ou atualiza) conta
  const handleSubmit = async () => {
    try {
      if (editingAccount) {
        await api.put(`/api/accounts/${editingAccount.id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/api/accounts', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchAccounts();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  // Exclui conta
  const handleDelete = async (accountId) => {
    if (window.confirm('Confirma excluir esta conta?')) {
      try {
        await api.delete(`/api/accounts/${accountId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAccounts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Marcar como paga
  const handleMarkAsPaid = async (id) => {
    try {
      await api.put(`/api/accounts/${id}`, { status: 'paid' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAccounts();
    } catch (err) {
      console.error(err);
    }
  };

  // Atualiza filtro na tela
  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  // Botão de filtrar
  const handleFilter = () => {
    setLoading(true);
    fetchAccounts();
  };

  if (loading) return <Container><Typography>Carregando...</Typography></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Contas</Typography>
      
      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <TextField
            label="Buscar por título"
            name="title"
            value={filter.title}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            label="Status"
            name="status"
            select
            value={filter.status}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="pending">Pendente</MenuItem>
            <MenuItem value="paid">Pago</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={3} md={2}>
          <TextField
            label="Mês"
            name="month"
            type="number"
            InputProps={{ inputProps: { min: 1, max: 12 } }}
            value={filter.month}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={3} md={2}>
          <TextField
            label="Ano"
            name="year"
            type="number"
            value={filter.year}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button variant="contained" onClick={handleFilter} fullWidth>Filtrar</Button>
        </Grid>
      </Grid>

      <Button variant="contained" sx={{ mb: 2 }} onClick={handleOpenNew}>Nova Conta</Button>

      {accounts.length === 0 && <Typography>Nenhuma conta cadastrada.</Typography>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {accounts.map(acc => (
          <Card key={acc.id}>
            <CardContent>
              <Typography variant="h6">{acc.title}</Typography>
              <Typography>{acc.description}</Typography>
              <Typography>Valor: R$ {acc.amount}</Typography>
              <Typography>Vencimento: {acc.dueDate}</Typography>
              <Typography>Status: {acc.status === 'pending' ? 'Pendente' : 'Pago'}</Typography>
            </CardContent>
            <CardActions>
              {acc.status === 'pending' && (
                <Button variant="outlined" size="small" color="success" onClick={() => handleMarkAsPaid(acc.id)}>
                  Marcar como paga
                </Button>
              )}
              <IconButton color="primary" onClick={() => handleOpenEdit(acc)} aria-label="editar">
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(acc.id)} aria-label="excluir">
                <Delete />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingAccount ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Título"
            name="title"
            fullWidth
            variant="outlined"
            value={form.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Descrição"
            name="description"
            fullWidth
            variant="outlined"
            value={form.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Valor"
            name="amount"
            type="number"
            fullWidth
            variant="outlined"
            value={form.amount}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Data de Vencimento"
            name="dueDate"
            type="date"
            fullWidth
            variant="outlined"
            value={form.dueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Status"
            name="status"
            select
            fullWidth
            variant="outlined"
            value={form.status}
            onChange={handleChange}
          >
            <MenuItem value="pending">Pendente</MenuItem>
            <MenuItem value="paid">Pago</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingAccount ? 'Salvar Alterações' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}