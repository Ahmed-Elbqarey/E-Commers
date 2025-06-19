import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Phone, Lock, Login as LoginIcon } from '@mui/icons-material';
import axios from 'axios';

function Login() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^01[0-9]{9}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Egyptian phone number (11 digits starting with 01)';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: { xs: 4, sm: 8 },
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: { xs: 3, sm: 4 },
            width: '100%',
            maxWidth: 400,
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
              }}
            >
              <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography 
              component="h1" 
              variant={isMobile ? "h4" : "h3"} 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 1
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Sign in to your account to continue
            </Typography>
          </Box>

          {error && (
            <Box
              sx={{
                textAlign: 'center',
                mb: 3,
                p: 2,
                borderRadius: 2,
                backgroundColor: 'error.light',
                color: 'error.contrastText',
                border: '1px solid',
                borderColor: 'error.main',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {error}
              </Typography>
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              autoFocus
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: 'primary.main' }} />,
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'primary.main' }} />,
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 'bold',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(25, 118, 210, 0.4)',
                  transition: 'all 0.3s ease'
                },
              }}
            >
              Sign In
            </Button>
            
            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Button 
                  color="primary" 
                  onClick={() => navigate('/register')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Create Account
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 