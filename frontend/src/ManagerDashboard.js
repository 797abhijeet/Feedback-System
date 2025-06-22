import React, { useEffect, useState } from 'react';
import axios from './axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';

export default function ManagerDashboard() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await axios.get('/manager/my-employees');
        setTeam(res.data || []);
      } catch (err) {
        console.error('Failed to load team members:', err);
        setSnack({ open: true, message: 'Failed to load team members', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, []);

  const handleGiveFeedback = (employee) => {
    navigate('/give-feedback', { state: { employee } });
  };

  const handleViewFeedback = (employeeId) => {
    navigate(`/manager/employee/${employeeId}/feedback`);
  };

  return (
    <Paper
      elevation={8}
      sx={{
        maxWidth: 850,
        margin: '30px auto',
        p: 4,
        borderRadius: 3,
        boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
        backgroundColor: '#fafafa',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 700, mb: 4, color: 'primary.main', letterSpacing: 1 }}
      >
        Manager Dashboard
      </Typography>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 4, fontSize: '1.2rem' }}>
          Loading team...
        </Typography>
      ) : team.length === 0 ? (
        <Typography sx={{ textAlign: 'center', py: 4, fontSize: '1.1rem', color: 'text.secondary' }}>
          No employees assigned to you yet.
        </Typography>
      ) : (
        <List>
          {team.map((employee, index) => (
            <Box key={employee.id}>
              <ListItem
                sx={{
                  px: 2,
                  py: 1.5,
                  '&:hover': { backgroundColor: '#e3f2fd' },
                  borderRadius: 2,
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleGiveFeedback(employee)}
                      sx={{
                        fontWeight: 600,
                        textTransform: 'none',
                        transition: 'background-color 0.3s ease',
                        '&:hover': { backgroundColor: 'primary.light', borderColor: 'primary.main' },
                      }}
                    >
                      Give Feedback
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewFeedback(employee.id)}
                      sx={{
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                        '&:hover': { boxShadow: '0 6px 20px rgba(25, 118, 210, 0.7)' },
                      }}
                    >
                      View History
                    </Button>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: 'text.primary' }}>
                      {employee.name}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                      {employee.email}
                    </Typography>
                  }
                />
              </ListItem>
              {index < team.length - 1 && (
                <Divider variant="middle" component="li" sx={{ my: 1, borderColor: '#ddd' }} />
              )}
            </Box>
          ))}
        </List>
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} sx={{ fontWeight: 600 }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
