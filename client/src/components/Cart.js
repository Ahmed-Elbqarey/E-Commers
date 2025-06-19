import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Badge,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  ArrowBack,
  Payment,
  LocationOn,
  Phone,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    phone: '',
    address: '',
    city: '',
    country: 'Egypt',
    paymentMethod: 'Cash on Delivery'
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      item.product._id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    updateCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.product._id !== productId);
    updateCart(updatedCart);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.15; // 15% tax
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 100 ? 0 : 10; // Free shipping over $100
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const validateForm = () => {
    const errors = {};
    if (!checkoutForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^(\+20|0)?1[0125][0-9]{8}$/.test(checkoutForm.phone.replace(/\s/g, ''))) {
      errors.phone = 'Invalid phone number format';
    }
    if (!checkoutForm.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!checkoutForm.city.trim()) {
      errors.city = 'City is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    const orderData = {
      items: cartItems.map(item => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      itemsPrice: calculateSubtotal(),
      taxPrice: calculateTax(),
      shippingPrice: calculateShipping(),
      totalPrice: calculateTotal(),
      shippingAddress: {
        address: checkoutForm.address,
        city: checkoutForm.city,
        country: checkoutForm.country
      },
      phone: checkoutForm.phone,
      paymentMethod: checkoutForm.paymentMethod
    };

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.post('http://localhost:5000/api/orders', orderData, {
      headers: { 'x-auth-token': token }
    })
    .then(response => {
      // Clear cart after successful order
      localStorage.removeItem('cart');
      setCartItems([]);
      setCheckoutDialogOpen(false);
      // Navigate to order confirmation
      navigate(`/order/${response.data._id}`);
    })
    .catch(err => {
      console.error('Checkout error:', err);
      setError(err.response?.data?.msg || 'An error occurred');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleFormChange = (field, value) => {
    setCheckoutForm(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Box textAlign="center" mt={4}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" color="textSecondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            Add items to your cart to proceed with the checkout
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ textAlign: 'center', mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
        Your Cart
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Items
              </Typography>
              
              {cartItems.map((item, index) => (
                <Box key={item.product._id}>
                  <Grid container spacing={2} alignItems="center" sx={{ py: 2 }}>
                    <Grid item xs={12} sm={3}>
                      <img
                        src={item.product.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                        alt={item.product.name}
                        style={{ width: '100%', maxWidth: '100px', height: 'auto', borderRadius: '8px' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.product.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        ${item.product.price}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove />
                        </IconButton>
                        <Typography sx={{ mx: 2, minWidth: '30px', textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.product._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                  {index < cartItems.length - 1 && <Divider />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>${calculateSubtotal().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>${calculateTax().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => setCheckoutDialogOpen(true)}
                sx={{ py: 1.5, fontWeight: 'bold' }}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Checkout Dialog */}
      <Dialog
        open={checkoutDialogOpen}
        onClose={() => setCheckoutDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Checkout
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={checkoutForm.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={checkoutForm.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
                placeholder="Enter your address"
                error={!!formErrors.address}
                helperText={formErrors.address}
                multiline
                rows={3}
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="City"
                value={checkoutForm.city}
                onChange={(e) => handleFormChange('city', e.target.value)}
                error={!!formErrors.city}
                helperText={formErrors.city}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Payment Method
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setCheckoutDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCheckout}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Payment />}
          >
            {loading ? 'Creating Order' : 'Confirm Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Cart; 