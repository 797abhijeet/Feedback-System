import React, { useState } from 'react';
import axios from 'axios'; // avoid interceptor on login
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);

      onLogin(
        {
          id: res.data.id,
          name: res.data.name,
          role: res.data.role,
          manager: res.data.manager,
        },
        res.data.token
      );

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 10 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          borderRadius: 3,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
          <LockOutlinedIcon sx={{ fontSize: 32 }} />
        </Avatar>

        <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Sign in
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%', borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
            sx={{
              bgcolor: '#f9f9f9',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ccc' },
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
              },
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            sx={{
              bgcolor: '#f9f9f9',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ccc' },
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 4,
              py: 1.6,
              fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: '0 5px 15px rgba(25, 118, 210, 0.4)',
              transition: 'background-color 0.3s ease',
              '&:hover': { backgroundColor: 'primary.dark', boxShadow: '0 8px 25px rgba(25, 118, 210, 0.6)' },
            }}
          >
            Sign In
          </Button>
        </Box>

        <Link
          component={RouterLink}
          to="/register"
          variant="body2"
          sx={{ mt: 3, color: 'primary.main', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
        >
          Don't have an account? Register here
        </Link>
      </Box>
    </Container>
  );
}
