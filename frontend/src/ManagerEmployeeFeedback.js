import React, { useEffect, useState } from 'react';
import axios from './axiosConfig';
import { useParams } from 'react-router-dom';

import {
  Typography,
  List,
  Paper,
  Button,
  Box,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';

export default function ManagerEmployeeFeedback() {
  const { employeeId } = useParams();

  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    strengths: '',
    improvements: '',
    sentiment: 'positive',
  });
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    async function fetchFeedbackHistory() {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/manager/employee/${employeeId}/feedback-history`);
        setFeedbackHistory(res.data);
      } catch (err) {
        setError('Failed to load feedback history.');
      } finally {
        setLoading(false);
      }
    }
    fetchFeedbackHistory();
  }, [employeeId]);

  const handleEditClick = (fb) => {
    setEditId(fb.id);
    setEditData({
      strengths: fb.strengths,
      improvements: fb.improvements,
      sentiment: fb.sentiment,
    });
    setUpdateMsg('');
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setUpdateMsg('');
  };

  const handleChange = (field) => (e) => {
    setEditData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/feedback/${editId}`, editData);
      setUpdateMsg('Feedback updated successfully.');

      const res = await axios.get(`/manager/employee/${employeeId}/feedback-history`);
      setFeedbackHistory(res.data);

      setEditId(null);
    } catch (err) {
      setUpdateMsg(err.response?.data?.error || 'Failed to update feedback.');
    }
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 900, margin: '40px auto', p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Feedback History for Employee #{employeeId}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
          {error}
        </Alert>
      )}
      {updateMsg && (
        <Alert
          severity={updateMsg.includes('successfully') ? 'success' : 'error'}
          sx={{ mb: 3, borderRadius: 1 }}
        >
          {updateMsg}
        </Alert>
      )}

      {feedbackHistory.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
          No feedback history for this employee.
        </Typography>
      ) : (
        <List disablePadding>
          {feedbackHistory.map((fb) => (
            <Paper
              key={fb.id}
              elevation={3}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                bgcolor: '#f9f9f9',
                position: 'relative',
                minHeight: 180, // ensure enough height for absolute text
              }}
            >
              {editId === fb.id ? (
                <Box>
                  <TextField
                    label="Strengths"
                    multiline
                    rows={3}
                    fullWidth
                    value={editData.strengths}
                    onChange={handleChange('strengths')}
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    label="Improvements"
                    multiline
                    rows={3}
                    fullWidth
                    value={editData.improvements}
                    onChange={handleChange('improvements')}
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    select
                    label="Sentiment"
                    fullWidth
                    value={editData.sentiment}
                    onChange={handleChange('sentiment')}
                    margin="normal"
                    variant="outlined"
                  >
                    <MenuItem value="positive">Positive</MenuItem>
                    <MenuItem value="neutral">Neutral</MenuItem>
                    <MenuItem value="negative">Negative</MenuItem>
                  </TextField>

                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ minWidth: 100 }}>
                      Save
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancelEdit} sx={{ minWidth: 100 }}>
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
                      Sentiment:{' '}
                      <Box
                        component="span"
                        sx={{
                          color:
                            fb.sentiment === 'positive'
                              ? 'green'
                              : fb.sentiment === 'neutral'
                              ? 'orange'
                              : 'red',
                          fontWeight: 'bold',
                        }}
                      >
                        {fb.sentiment.charAt(0).toUpperCase() + fb.sentiment.slice(1)}
                      </Box>
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Strengths:</strong> {fb.strengths}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Improvements:</strong> {fb.improvements}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Date: {new Date(fb.timestamp).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Acknowledged: {fb.acknowledged ? 'Yes' : 'No'}
                    </Typography>

                    <Button variant="outlined" size="small" onClick={() => handleEditClick(fb)}>
                      Edit
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
}
