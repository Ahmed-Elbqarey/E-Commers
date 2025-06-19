import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Box,
  Badge,
  Container,
} from '@mui/material';
import { Menu, ShoppingCart, Dashboard, Receipt, Store } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [isBlocked, setIsBlocked] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const isAdmin = token ? jwtDecode(token).user.role === 'admin' : false;

  useEffect(() => {
    if (isAuthenticated) {
      checkUserStatus();
    }
    updateCartItemsCount();
    
    // Listen for cart changes
    window.addEventListener('storage', updateCartItemsCount);
    // Listen for custom cart update event
    window.addEventListener('cartUpdated', updateCartItemsCount);
    
    return () => {
      window.removeEventListener('storage', updateCartItemsCount);
      window.removeEventListener('cartUpdated', updateCartItemsCount);
    };
  }, [isAuthenticated]);

  const updateCartItemsCount = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemsCount(count);
    } else {
      setCartItemsCount(0);
    }
  };

  const checkUserStatus = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { 'x-auth-token': token }
      });
      if (res.data.isBlocked) {
        setIsBlocked(true);
        alert('Your account has been blocked by the administration');
        handleLogout();
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setIsBlocked(true);
        alert('Your account has been blocked by the administration');
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navItems = [
    { text: 'Products', path: '/products', icon: <Store />, show: isAuthenticated },
    { text: 'Cart', path: '/cart', icon: <ShoppingCart />, show: isAuthenticated, badge: cartItemsCount },
    { text: 'My Orders', path: '/my-orders', icon: <Receipt />, show: isAuthenticated },
    { text: 'Admin', path: '/admin', icon: <Dashboard />, show: isAuthenticated && isAdmin },
  ];

  const drawer = (
    <Box sx={{ width: 280, height: '100%' }}>
      <Box sx={{ 
        p: 3, 
        textAlign: 'center', 
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
        color: 'white'
      }}>
        <Store sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          E-Commerce Store
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        {navItems.map((item) => (
          item.show && (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
              sx={{ 
                p: 2, 
                mx: 1, 
                mb: 1, 
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  transform: 'translateX(4px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}>
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </Box>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: 'medium',
                  fontSize: '1rem'
                }}
              />
            </ListItem>
          )
        ))}
        {isAuthenticated && (
          <ListItem 
            button 
            onClick={handleLogout} 
            sx={{ 
              p: 2, 
              mx: 1, 
              mt: 2,
              borderRadius: 2,
              backgroundColor: 'error.light',
              color: 'error.contrastText',
              '&:hover': {
                backgroundColor: 'error.main',
                transform: 'translateX(4px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ 
                fontWeight: 'medium',
                fontSize: '1rem'
              }}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 1, sm: 2 }, py: 1 }}>
            {isMobile && (
              <IconButton
                edge="start"
                sx={{ 
                  mr: 2, 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
              >
                <Menu />
              </IconButton>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Store sx={{ mr: 1, fontSize: { xs: 24, sm: 28 } }} />
              <Typography 
                variant={isSmallMobile ? "h6" : "h5"} 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }
                }}
              >
                <RouterLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
                  E-Commerce Store
                </RouterLink>
              </Typography>
            </Box>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isAuthenticated ? (
                  <>
                    {navItems.map((item) => (
                      item.show && (
                        <Button
                          key={item.text}
                          color="inherit"
                          component={RouterLink}
                          to={item.path}
                          sx={{
                            color: 'white',
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'medium',
                            fontSize: '0.9rem',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.15)',
                              transform: 'translateY(-1px)',
                              transition: 'all 0.3s ease'
                            },
                          }}
                          startIcon={
                            item.badge ? (
                              <Badge 
                                badgeContent={item.badge} 
                                color="error"
                                sx={{ 
                                  '& .MuiBadge-badge': { 
                                    fontSize: '0.7rem',
                                    minWidth: '18px',
                                    height: '18px'
                                  } 
                                }}
                              >
                                {item.icon}
                              </Badge>
                            ) : (
                              item.icon
                            )
                          }
                        >
                          {item.text}
                        </Button>
                      )
                    ))}
                    <Button 
                      color="inherit" 
                      onClick={handleLogout}
                      sx={{
                        color: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium',
                        fontSize: '0.9rem',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          transform: 'translateY(-1px)',
                          transition: 'all 0.3s ease'
                        },
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/login"
                      sx={{
                        color: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium',
                        fontSize: '0.9rem',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          transform: 'translateY(-1px)',
                          transition: 'all 0.3s ease'
                        },
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/register"
                      sx={{
                        ml: 1,
                        color: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium',
                        fontSize: '0.9rem',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          transform: 'translateY(-1px)',
                          transition: 'all 0.3s ease'
                        },
                      }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 280,
            boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Navbar; 