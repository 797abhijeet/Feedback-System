import React, { useEffect, useState } from 'react';
import axios from './axiosConfig'; // Use axios instance with auth token

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function EmployeeFeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ackMsg, setAckMsg] = useState('');
  const [manager, setManager] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [feedbackRes, profileRes] = await Promise.all([
          axios.get('/feedback/me'), // backend must support this route and return current user's feedback
          // axios.get('/me'), // return current user profile incl. manager info
        ]);
        setFeedbacks(feedbackRes.data || []);
        setManager(profileRes.data.manager || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const acknowledge = async (id) => {
    setAckMsg('');
    try {
      await axios.put(`/feedback/${id}/ack`); // PUT to acknowledge feedback
      setFeedbacks(
        feedbacks.map((fb) => (fb.id === id ? { ...fb, acknowledged: true } : fb))
      );
      setAckMsg('Feedback acknowledged');
    } catch {
      setAckMsg('Failed to acknowledge');
    }
  };

  if (loading) return <Typography align="center">Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Your Feedback
      </Typography>

      {manager && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            backgroundColor: '#f5f5f5',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Your Manager
          </Typography>
          <Typography>Name: {manager.name}</Typography>
          <Typography>Email: {manager.email}</Typography>
        </Paper>
      )}

      {feedbacks.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ mt: 8, color: 'text.secondary' }}>
          No feedback yet.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {feedbacks.map((fb) => (
            <Paper
              key={fb.id}
              elevation={4}
              sx={{
                p: 3,
                borderLeft:
                  fb.sentiment === 'negative'
                    ? '6px solid #d32f2f'
                    : fb.sentiment === 'positive'
                    ? '6px solid #2e7d32'
                    : '6px solid #ed6c02',
                borderRadius: 2,
                boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
                backgroundColor: '#fff',
              }}
            >
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                From: {fb.managerName}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Strengths:</strong> {fb.strengths}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Improvements:</strong> {fb.improvements}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Sentiment:</strong>{' '}
                <Box
                  component="span"
                  sx={{
                    color:
                      fb.sentiment === 'negative'
                        ? '#d32f2f'
                        : fb.sentiment === 'positive'
                        ? '#2e7d32'
                        : '#ed6c02',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                  }}
                >
                  {fb.sentiment}
                </Box>
              </Typography>
              <Typography sx={{ mb: 2 }}>
                <strong>Acknowledged:</strong> {fb.acknowledged ? 'Yes' : 'No'}
              </Typography>

              {!fb.acknowledged && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => acknowledge(fb.id)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 3px 8px rgba(25, 118, 210, 0.3)',
                    '&:hover': { boxShadow: '0 6px 20px rgba(25, 118, 210, 0.5)' },
                  }}
                >
                  Acknowledge
                </Button>
              )}
            </Paper>
          ))}
        </Stack>
      )}

      {ackMsg && (
        <Alert
          severity={ackMsg.toLowerCase().includes('failed') ? 'error' : 'success'}
          sx={{ mt: 4, borderRadius: 2 }}
          onClose={() => setAckMsg('')}
        >
          {ackMsg}
        </Alert>
      )}
    </Box>
  );
}
