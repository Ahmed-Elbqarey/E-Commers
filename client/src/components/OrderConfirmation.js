import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  CheckCircle,
  LocalShipping,
  Payment,
  Home,
  Receipt,
} from '@mui/icons-material';
import axios from 'axios';

function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.response?.data?.msg || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'processing': return 'processing';
      case 'shipped': return 'shipped';
      case 'delivered': return 'delivered';
      case 'cancelled': return 'cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress size={60} />
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

  if (!order) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mt: 4 }}>
          Order not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h3" sx={{ color: 'success.main', fontWeight: 'bold', mb: 2 }}>
          Order Confirmation
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Your order has been confirmed!
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Order Details */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Receipt sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Order Details
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Order ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Order Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {formatDate(order.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={getStatusText(order.status)}
                    color={getStatusColor(order.status)}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Payment Status
                  </Typography>
                  <Chip
                    label={order.isPaid ? 'paid' : 'unpaid'}
                    color={order.isPaid ? 'success' : 'warning'}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Phone
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {order.phone}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Order Items
              </Typography>

              {order.items.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} sm={2}>
                      <img
                        src={item.image || 'https://via.placeholder.com/60x60?text=No+Image'}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '6px'
                        }}
                      />
                    </Grid>
                    <Grid item xs={9} sm={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                  {index < order.items.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ${order.totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Shipping Information */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocalShipping sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Shipping Address
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {order.shippingAddress.address}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Payment sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Payment Method
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {order.paymentMethod}
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={() => navigate('/products')}
              startIcon={<Home />}
              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              Home
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default OrderConfirmation; 