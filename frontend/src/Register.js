import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    manager_email: '',
  });

  const [managers, setManagers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/auth/managers')
      .then((res) => setManagers(res.data))
      .catch(() => setError('Failed to fetch managers'));

    // Reset manager_email when role changes
    setForm((prev) => ({ ...prev, manager_email: '' }));
  }, [form.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      manager_email: form.manager_email || null,
    };

    try {
      const res = await axios.post('http://localhost:5000/auth/register', payload);
      setSuccess(res.data.message || 'Registered successfully');

      // Reset form
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        manager_email: '',
      });

      // Navigate to login after success delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          backgroundColor: '#fafafa',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}
        >
          Register
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            required
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            autoFocus
            sx={{
              '& .MuiInputBase-root': { backgroundColor: '#fff' },
              borderRadius: 1,
            }}
          />

          <TextField
            fullWidth
            required
            type="email"
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            sx={{
              '& .MuiInputBase-root': { backgroundColor: '#fff' },
              borderRadius: 1,
            }}
          />

          <TextField
            fullWidth
            required
            type="password"
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            sx={{
              '& .MuiInputBase-root': { backgroundColor: '#fff' },
              borderRadius: 1,
            }}
          />

          <FormControl fullWidth margin="normal" sx={{ mt: 3 }}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
            </Select>
          </FormControl>

          {form.role === 'employee' && (
            <FormControl fullWidth margin="normal" sx={{ mt: 3 }}>
              <InputLabel id="manager-label">Manager</InputLabel>
              <Select
                labelId="manager-label"
                label="Manager"
                name="manager_email"
                value={form.manager_email}
                onChange={handleChange}
                sx={{ backgroundColor: '#fff', borderRadius: 1 }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {managers.map((m) => (
                  <MenuItem key={m.email} value={m.email}>
                    {m.name} ({m.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{
              mt: 4,
              py: 1.8,
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
