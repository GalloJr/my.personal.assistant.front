import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, CardActions,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, IconButton
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
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/api/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    try {
      if (editingAccount) {
        // Atualizar conta
        await api.put(`/api/accounts/${editingAccount.id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Criar nova conta
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

  if (loading) return <Container><Typography>Carregando...</Typography></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Contas</Typography>
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
            <option value="pending">Pendente</option>
            <option value="paid">Pago</option>
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