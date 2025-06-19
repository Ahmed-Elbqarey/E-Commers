import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';

function PrivateRoute({ children, adminOnly = false }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        navigate('/login');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setIsLoading(false);
          navigate('/login');
          return;
        }

        setIsAuthenticated(true);
        setIsAdmin(decoded.user.role === 'admin');
        setIsLoading(false);
      } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('token');
        setIsLoading(false);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (adminOnly && !isAdmin) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h4" sx={{ color: 'error.main', mb: 2 }}>
              Access Denied
            </Typography>
            <Typography variant="body1" color="textSecondary">
              You don't have permission to access this page.
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return children;
}

export default PrivateRoute; 