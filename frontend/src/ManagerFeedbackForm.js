import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { useLocation } from 'react-router-dom';

import {
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Box,
  Alert,
  Container,
} from '@mui/material';

export default function ManagerFeedbackForm() {
  const location = useLocation();
  const passedEmployee = location.state?.employee || null;

  const [team, setTeam] = useState([]);
  const [employeeEmail, setEmployeeEmail] = useState(passedEmployee?.email || '');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [sentiment, setSentiment] = useState('positive');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await axios.get('/manager/team');
        setTeam(res.data || []);
        if (!employeeEmail && res.data.length > 0) {
          setEmployeeEmail(res.data[0].email);
        }
      } catch (err) {
        console.error('Failed to fetch team:', err);
        setMessage('Failed to load team members');
      }
    }
    fetchTeam();
  }, [employeeEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('/feedback/ab', {
        employee_email: employeeEmail,
        strengths,
        improvements,
        sentiment,
      });
      setMessage('Feedback submitted successfully');
      setStrengths('');
      setImprovements('');
      setSentiment('positive');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Submission failed');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={8}
        sx={{
          p: 6,
          borderRadius: 4,
          boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
          backgroundColor: '#fafafa',
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: 'primary.main', mb: 5, letterSpacing: 1 }}
        >
          Submit Feedback
        </Typography>

        {message && (
          <Alert
            severity={message.toLowerCase().includes('success') ? 'success' : 'error'}
            sx={{ mb: 4, borderRadius: 2, fontWeight: 600 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            select
            label="Employee"
            value={employeeEmail}
            onChange={(e) => setEmployeeEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
            sx={{
              mb: 4,
              backgroundColor: '#fff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                boxShadow: 'inset 0 0 8px rgb(0 0 0 / 0.05)',
              },
            }}
          >
            {team.map((member) => (
              <MenuItem key={member.id} value={member.email}>
                {member.name} ({member.email})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Strengths"
            multiline
            rows={4}
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            fullWidth
            required
            margin="normal"
            placeholder="Describe the employee's strengths..."
            sx={{
              mb: 4,
              backgroundColor: '#fff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                boxShadow: 'inset 0 0 8px rgb(0 0 0 / 0.05)',
              },
            }}
          />

          <TextField
            label="Improvements"
            multiline
            rows={4}
            value={improvements}
            onChange={(e) => setImprovements(e.target.value)}
            fullWidth
            required
            margin="normal"
            placeholder="Areas where the employee can improve..."
            sx={{
              mb: 4,
              backgroundColor: '#fff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                boxShadow: 'inset 0 0 8px rgb(0 0 0 / 0.05)',
              },
            }}
          />

          <TextField
            select
            label="Sentiment"
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
            fullWidth
            required
            margin="normal"
            sx={{
              backgroundColor: '#fff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                boxShadow: 'inset 0 0 8px rgb(0 0 0 / 0.05)',
              },
            }}
          >
            <MenuItem value="positive">Positive</MenuItem>
            <MenuItem value="neutral">Neutral</MenuItem>
            <MenuItem value="negative">Negative</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 5,
              py: 1.8,
              fontWeight: 700,
              fontSize: '1.15rem',
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.dark',
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.5)',
              },
            }}
          >
            Submit Feedback
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
