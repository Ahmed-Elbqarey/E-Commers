import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  ShoppingBag,
  Cancel,
  Visibility,
  Phone,
  LocationOn,
  Receipt,
  Payment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/orders/myorders', {
        headers: { 'x-auth-token': token }
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`, {}, {
        headers: { 'x-auth-token': token }
      });
      
      fetchOrders();
      alert('Order cancelled successfully!');
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(err.response?.data?.msg || 'Order cancellation failed. Please try again later.');
    } finally {
      setCancelling(false);
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
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
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

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const filteredOrders = orders.filter(order => {
    const orderNumber = order._id.slice(-8).toUpperCase();
    return (
      orderNumber.includes(searchTerm.trim().toUpperCase()) ||
      order.phone.includes(searchTerm.trim()) ||
      order.shippingAddress.address.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      order.shippingAddress.city.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      getStatusText(order.status).toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      order.paymentMethod.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  });

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ textAlign: 'center', mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
        Orders
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <input
          type="text"
          placeholder="Search orders by number, phone, address, status, or payment method..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 400,
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: '1rem',
            outline: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {filteredOrders.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" color="textSecondary" gutterBottom>
            No orders found
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={3}>
            It seems you haven't placed any orders yet or no orders match your search.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredOrders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Order Number #{order._id.slice(-8).toUpperCase()}
                    </Typography>
                    <Chip
                      label={getStatusText(order.status)}
                      color={getStatusColor(order.status)}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" color="textSecondary">
                          Order Date: {formatDate(order.createdAt)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Payment sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" color="textSecondary">
                          Payment Method: {order.paymentMethod}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" color="textSecondary">
                          Phone: {order.phone}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" color="textSecondary">
                          Shipping Address: {order.shippingAddress.address}, {order.shippingAddress.city}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                          Total: ${order.totalPrice.toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Items: {order.items.length}
                    </Typography>
                    <Box>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewOrder(order)}
                        sx={{ mr: 1 }}
                      >
                        View Details
                      </Button>
                      {order.status === 'pending' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Cancel />}
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancelling}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Order Details #{selectedOrder._id.slice(-8).toUpperCase()}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    <strong>Phone:</strong> {selectedOrder.phone}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    <strong>Shipping Address:</strong><br />
                    {selectedOrder.shippingAddress.address}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    label={getStatusText(selectedOrder.status)}
                    color={getStatusColor(selectedOrder.status)}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="textSecondary" paragraph>
                    <strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Order Items
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                  src={item.image || 'https://via.placeholder.com/50x50?text=No+Image'}
                                  alt={item.name}
                                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, marginRight: 12 }}
                                />
                                <Typography variant="body2">{item.name}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">${item.price}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Total: ${selectedOrder.totalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}

export default MyOrders; 