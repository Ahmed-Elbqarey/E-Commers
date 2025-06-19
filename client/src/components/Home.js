import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ShoppingCart, Security, Speed, Store } from '@mui/icons-material';

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <ShoppingCart sx={{ fontSize: { xs: 50, sm: 60 }, color: 'primary.main', mb: 2 }} />,
      title: 'Easy Shopping',
      description: 'Browse and purchase products with ease through our intuitive interface.',
    },
    {
      icon: <Security sx={{ fontSize: { xs: 50, sm: 60 }, color: 'primary.main', mb: 2 }} />,
      title: 'Secure Transactions',
      description: 'Your data is protected with industry-standard security measures.',
    },
    {
      icon: <Speed sx={{ fontSize: { xs: 50, sm: 60 }, color: 'primary.main', mb: 2 }} />,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery to your doorstep.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #64b5f6 100%)',
          color: 'white',
          py: { xs: 6, sm: 8, md: 10 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            maxWidth: 800, 
            mx: 'auto', 
            p: { xs: 2, sm: 3 },
            position: 'relative',
            zIndex: 1
          }}>
            <Store sx={{ 
              fontSize: { xs: 60, sm: 80, md: 100 }, 
              mb: 3,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }} />
            <Typography 
              component="h1" 
              variant={isMobile ? "h3" : "h2"} 
              sx={{ 
                fontWeight: 'bold',
                mb: 3,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                lineHeight: 1.2
              }}
            >
              Welcome to Our E-Commerce Store
            </Typography>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              sx={{ 
                mb: 4,
                opacity: 0.9,
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Discover amazing products and enjoy a seamless shopping experience with our modern platform
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large" 
                    component={Link} 
                    to="/products"
                    sx={{
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 'bold',
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    Browse Products
                  </Button>
                </Grid>
                <Grid item>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    size="large" 
                    component={Link} 
                    to="/register"
                    sx={{
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 'bold',
                      borderRadius: 3,
                      textTransform: 'none',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6 } }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            sx={{ 
              fontWeight: 'bold',
              mb: 2,
              color: 'primary.main'
            }}
          >
            Why Choose Us?
          </Typography>
          <Typography 
            variant="h6" 
            color="textSecondary"
            sx={{ 
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            We provide the best shopping experience with quality products and excellent service
          </Typography>
        </Box>
        
        <Grid container spacing={{ xs: 3, sm: 4, md: 6 }}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                  },
                }}
                elevation={0}
              >
                <CardContent sx={{ 
                  flexGrow: 1, 
                  textAlign: 'center',
                  p: { xs: 3, sm: 4 }
                }}>
                  <Box display="flex" justifyContent="center" mb={2}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    gutterBottom 
                    variant={isMobile ? "h5" : "h4"} 
                    component="h2" 
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 2,
                      color: 'primary.main'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontSize: '1rem'
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default Home;
