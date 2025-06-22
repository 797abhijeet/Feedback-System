import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import ManagerDashboard from './ManagerDashboard';
import ManagerFeedbackForm from './ManagerFeedbackForm';
import EmployeeFeedbackList from './EmployeeFeedbackList';
import ManagerEmployeeFeedback from './ManagerEmployeeFeedback';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function App() {
  const [user, setUser] = useState(null);

  // On app mount, restore user session if token and user info are stored
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // When login successful, save user data and token
  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Clear user session on logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // If not logged in, only allow login/register routes
  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Feedback Tool
          </Typography>
          <Typography sx={{ mr: 2 }}>
            {user.name} ({user.role}) {user.manager ? `- Manager: ${user.manager.name}` : ''}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 3 }}>
        <Routes>
          {/* Routes available to managers */}
          {user.role === 'manager' && (
            <>
              <Route path="/" element={<ManagerDashboard />} />
              <Route path="/give-feedback" element={<ManagerFeedbackForm />} />
              <Route path="/manager/employee/:employeeId/feedback" element={<ManagerEmployeeFeedback />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}

          {/* Routes available to employees */}
          {user.role === 'employee' && (
            <>
              <Route path="/" element={<EmployeeFeedbackList />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
