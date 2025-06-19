import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Rating,
  IconButton,
  Tooltip,
} from '@mui/material';
import { 
  ShoppingCart, 
  AttachMoney, 
  Inventory, 
  Store, 
  Favorite,
  FavoriteBorder,
  Star,
  LocalShipping,
  Security
} from '@mui/icons-material';
import axios from 'axios';

function Products() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('An error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const savedCart = localStorage.getItem('cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.product._id === product._id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already exists
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new product to cart
      cart.push({
        product: product,
        quantity: 1
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message
    setSuccessMessage('Product added to cart successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'error' };
    if (stock < 10) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  const getRandomRating = () => {
    return (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          gap: 2
        }}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="textSecondary">
            Loading products...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
        <Box
          sx={{
            width: 60,
            height: 60,
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
          <Store sx={{ fontSize: 30, color: 'white' }} />
        </Box>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            color: 'primary.main', 
            fontWeight: 'bold',
            mb: 1
          }}
        >
          Our Products
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 500, mx: 'auto' }}>
          Discover amazing products with great quality and competitive prices
        </Typography>
      </Box>
      
      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            '& .MuiAlert-message': { fontWeight: 'medium' }
          }} 
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}

      {products.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Store sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No products available
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Check back later for new products
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            const rating = getRandomRating();
            const isFavorite = favorites.includes(product._id);
            
            return (
              <Grid item key={product._id} xs={6} sm={4} md={3} lg={2.4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                      '& .product-image': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                  elevation={0}
                >
                  {/* Favorite Button */}
                  <IconButton
                    onClick={() => handleFavorite(product._id)}
                    sx={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      zIndex: 2,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      width: 28,
                      height: 28,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,1)',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {isFavorite ? (
                      <Favorite sx={{ color: 'error.main', fontSize: 16 }} />
                    ) : (
                      <FavoriteBorder sx={{ color: 'grey.600', fontSize: 16 }} />
                    )}
                  </IconButton>

                  {/* Stock Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 6,
                      left: 6,
                      zIndex: 2,
                    }}
                  >
                    <Chip
                      label={stockStatus.label}
                      color={stockStatus.color}
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.6rem',
                        height: 20,
                        backgroundColor: stockStatus.color === 'success' ? 'success.main' : 
                                        stockStatus.color === 'warning' ? 'warning.main' : 'error.main',
                        color: 'white',
                        '& .MuiChip-label': {
                          px: 0.5,
                        },
                      }}
                    />
                  </Box>

                  {/* Product Image */}
                  <Box sx={{ 
                    position: 'relative', 
                    overflow: 'hidden',
                    width: '100%',
                    height: 200,
                    flexShrink: 0
                  }}>
                    <CardMedia
                      className="product-image"
                      sx={{
                        width: '100%',
                        height: '100%',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'transform 0.3s ease-in-out',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)',
                        }
                      }}
                      image={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                      title={product.name}
                    />
                  </Box>

                  <CardContent sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    p: { xs: 1.5, sm: 2 },
                    position: 'relative'
                  }}>
                    {/* Category Badge */}
                    <Chip
                      label={product.category}
                      color="primary"
                      size="small"
                      sx={{ 
                        mb: 1.5,
                        alignSelf: 'flex-start',
                        fontWeight: 'bold',
                        fontSize: '0.65rem',
                        height: 20,
                        backgroundColor: 'primary.main',
                        color: 'white',
                      }}
                    />
                    
                    {/* Product Name */}
                    <Typography 
                      gutterBottom 
                      variant="body2" 
                      component="h2" 
                      sx={{ 
                        fontWeight: 'bold',
                        mb: 1,
                        lineHeight: 1.2,
                        fontSize: '0.85rem',
                        color: 'text.primary',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.4rem',
                      }}
                    >
                      {product.name}
                    </Typography>
                    
                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
                      <Rating 
                        value={parseFloat(rating)} 
                        precision={0.1} 
                        size="small"
                        readOnly
                        sx={{ 
                          '& .MuiRating-iconFilled': { color: 'warning.main' },
                          fontSize: '0.8rem'
                        }}
                      />
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
                        ({rating})
                      </Typography>
                    </Box>
                    
                    {/* Price */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1.5,
                      gap: 0.5
                    }}>
                      <AttachMoney color="primary" sx={{ fontSize: 16 }} />
                      <Typography sx={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold', 
                        color: 'primary.main' 
                      }}>
                        {product.price}
                      </Typography>
                    </Box>

                    {/* Features */}
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<LocalShipping sx={{ fontSize: 12 }} />}
                        label="Free"
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.6rem', height: 20 }}
                      />
                      <Chip
                        icon={<Security sx={{ fontSize: 12 }} />}
                        label="Secure"
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.6rem', height: 20 }}
                      />
                    </Box>
                    
                    {/* Add to Cart Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        py: 0.8,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
                        },
                        '&:disabled': {
                          background: 'linear-gradient(135deg, #9e9e9e 0%, #bdbdbd 100%)',
                          color: 'grey.600',
                          boxShadow: 'none',
                        }
                      }}
                      startIcon={<ShoppingCart sx={{ fontSize: 16 }} />}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

export default Products; 