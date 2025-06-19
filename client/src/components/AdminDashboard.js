import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tabs,
  Tab,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard,
  People,
  ShoppingCart,
  Block,
  CheckCircle,
  Add,
  Edit,
  Delete,
  Search,
  Phone,
  Person,
  Receipt,
  Payment,
} from '@mui/icons-material';
import axios from 'axios';

function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ 
    users: 0, 
    products: 0, 
    newUsers: 0, 
    orders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  });
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', image: '', category: '', stock: '' });
  const [editProductId, setEditProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userDeleteError, setUserDeleteError] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPendingUsers(),
        fetchUsers(),
        fetchProducts(),
        fetchOrders(),
      ]);
      fetchStats();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/pending-users', {
        headers: { 'x-auth-token': token }
      });
      setPendingUsers(res.data);
    } catch (err) {
      console.error('Error fetching pending users:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { 'x-auth-token': token }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { 'x-auth-token': token }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const completedOrders = orders.filter(order => order.status === 'delivered').length;
      const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

      setStats({
        users: users.length,
        products: products.length,
        newUsers: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length,
        orders: orders.length,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders,
        completedOrders: completedOrders,
        cancelledOrders: cancelledOrders
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [users, products]);

  const handleApproveUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/approve-user/${userId}`,
        {},
        {
          headers: { 'x-auth-token': token }
        }
      );
      fetchPendingUsers();
      fetchUsers();
    } catch (err) {
      console.error('Error approving user:', err);
    }
  };

  const handleBlockUser = async (id) => {
    setUserDeleteError('');
    if (window.confirm('Are you sure you want to block this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/admin/users/${id}/block`, {}, {
          headers: { 'x-auth-token': token }
        });
        fetchUsers();
      } catch (err) {
        setUserDeleteError(err.response?.data?.message || err.message || 'An error occurred');
      }
    }
  };

  const handleUnblockUser = async (id) => {
    setUserDeleteError('');
    if (window.confirm('Are you sure you want to unblock this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/admin/users/${id}/unblock`, {}, {
          headers: { 'x-auth-token': token }
        });
        fetchUsers();
      } catch (err) {
        setUserDeleteError(err.response?.data?.message || err.message || 'An error occurred');
      }
    }
  };

  const handleOpenProductDialog = (product = null) => {
    if (product) {
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock
      });
      setEditProductId(product._id);
    } else {
      setProductForm({ name: '', description: '', price: '', image: '', category: '', stock: '' });
      setEditProductId(null);
    }
    setOpenProductDialog(true);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    setProductForm({ name: '', description: '', price: '', image: '', category: '', stock: '' });
    setEditProductId(null);
  };

  const handleProductFormChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleSaveProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editProductId) {
        await axios.put(`http://localhost:5000/api/products/${editProductId}`, productForm, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await axios.post('http://localhost:5000/api/products', productForm, {
          headers: { 'x-auth-token': token }
        });
      }
      fetchProducts();
      handleCloseProductDialog();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { 'x-auth-token': token }
        });
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { 'x-auth-token': token } }
      );
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const filteredOrders = orders.filter(order => {
    if (!orderSearchTerm.trim()) return true;
    const orderNumber = order._id.slice(-8).toUpperCase();
    return (
      orderNumber.includes(orderSearchTerm.trim().toUpperCase()) ||
      (order.user?.name || '').toLowerCase().includes(orderSearchTerm.trim().toLowerCase()) ||
      order.phone.includes(orderSearchTerm.trim()) ||
      (order.shippingAddress?.address || '').toLowerCase().includes(orderSearchTerm.trim().toLowerCase()) ||
      (order.shippingAddress?.city || '').toLowerCase().includes(orderSearchTerm.trim().toLowerCase()) ||
      (order.shippingAddress?.country || '').toLowerCase().includes(orderSearchTerm.trim().toLowerCase()) ||
      order.paymentMethod.toLowerCase().includes(orderSearchTerm.trim().toLowerCase()) ||
      getStatusText(order.status).toLowerCase().includes(orderSearchTerm.trim().toLowerCase()) ||
      order.totalPrice.toString().includes(orderSearchTerm.trim()) ||
      order.items.some(item => (item.name || '').toLowerCase().includes(orderSearchTerm.trim().toLowerCase()))
    );
  });

  const cancelledOrders = orders.filter(order => order.status === 'cancelled');

  const handleDeleteOrder = async (orderId, orderTotal) => {
    if (!window.confirm('Are you sure you want to permanently delete this order?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { 'x-auth-token': token }
      });
      setOrders(prev => prev.filter(o => o._id !== orderId));
      setStats(prev => ({ ...prev, totalRevenue: prev.totalRevenue - orderTotal }));
    } catch (err) {
      alert('Error deleting order.');
    }
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

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ textAlign: 'center', mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 3, overflow: 'hidden' }} elevation={3}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          indicatorColor="primary"
          textColor="primary"
          centered
          variant="fullWidth"
        >
          <Tab label="Dashboard" icon={<Dashboard />} sx={{ fontWeight: 'bold', minHeight: 64 }} />
          <Tab label="Users" icon={<People />} sx={{ fontWeight: 'bold', minHeight: 64 }} />
          <Tab label="Pending Users" icon={<CheckCircle />} sx={{ fontWeight: 'bold', minHeight: 64 }} />
          <Tab label="Products" icon={<ShoppingCart />} sx={{ fontWeight: 'bold', minHeight: 64 }} />
          <Tab label="Orders" icon={<ShoppingCart />} sx={{ fontWeight: 'bold', minHeight: 64 }} />
          <Tab label="Cancelled Orders" icon={<Block />} sx={{ fontWeight: 'bold', minHeight: 64 }} />
          <Tab label="Blocked Users" icon={<Block />} sx={{ fontWeight: 'bold', minHeight: 64 }} />
        </Tabs>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        {tab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <People sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.users}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Users
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <ShoppingCart sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.products}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Products
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Receipt sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.orders}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Orders
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Payment sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ${stats.totalRevenue.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Revenue
                </Typography>
              </Card>
            </Grid>

            {/* Order Statistics */}
            <Grid item xs={12}>
              <Card elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Order Stats
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'warning.dark' }}>
                        {stats.pendingOrders}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Pending Orders
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                        {stats.completedOrders}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Completed Orders
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'error.dark' }}>
                        {stats.cancelledOrders}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Cancelled Orders
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {tab === 1 && (
          <>
            {userDeleteError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {userDeleteError}
              </Alert>
            )}
            <TextField
              variant="outlined"
              fullWidth
              label="Search by name or phone number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Search />,
              }}
            />
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person sx={{ mr: 1 }} />
                          {user.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Phone sx={{ mr: 1 }} />
                          {user.phone}
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleBlockUser(user._id)}
                          disabled={user._id === JSON.parse(atob(localStorage.getItem('token').split('.')[1])).user.id || user.isBlocked}
                          sx={{ mr: 0.5 }}
                          startIcon={<Block />}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        
        {tab === 2 && (
          <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApproveUser(user._id)}
                        startIcon={<CheckCircle />}
                      >
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {tab === 3 && (
          <>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 2 }}
              onClick={() => handleOpenProductDialog()}
              startIcon={<Add />}
            >
              Add Product
            </Button>
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenProductDialog(product)}
                          sx={{ mr: 0.5 }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleDeleteProduct(product._id)}
                          sx={{ mr: 0.5 }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Dialog open={openProductDialog} onClose={handleCloseProductDialog} maxWidth="sm" fullWidth>
              <DialogTitle>{editProductId ? 'Edit Product' : 'Add Product'}</DialogTitle>
              <DialogContent sx={{ minWidth: 400 }}>
                <TextField
                  margin="dense"
                  label="Product Name"
                  name="name"
                  value={productForm.name}
                  onChange={handleProductFormChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Product Description"
                  name="description"
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  fullWidth
                  multiline
                  rows={3}
                />
                <TextField
                  margin="dense"
                  label="Product Price"
                  name="price"
                  type="number"
                  value={productForm.price}
                  onChange={handleProductFormChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Product Image"
                  name="image"
                  value={productForm.image}
                  onChange={handleProductFormChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Product Category"
                  name="category"
                  value={productForm.category}
                  onChange={handleProductFormChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Product Stock"
                  name="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={handleProductFormChange}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseProductDialog} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleSaveProduct} color="primary">
                  {editProductId ? 'Update' : 'Save'}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        
        {tab === 4 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <input
                type="text"
                placeholder="Search orders by number, customer, phone, address, status, payment, or product..."
                value={orderSearchTerm}
                onChange={e => setOrderSearchTerm(e.target.value)}
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
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Products</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>#{order._id.slice(-8).toUpperCase()}</TableCell>
                      <TableCell>{order.user?.name || 'N/A'}</TableCell>
                      <TableCell>{order.phone}</TableCell>
                      <TableCell>{order.shippingAddress?.address || ''}</TableCell>
                      <TableCell>{order.shippingAddress?.city || ''}</TableCell>
                      <TableCell>{order.shippingAddress?.country || ''}</TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(order.status)}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.name} x{item.quantity}
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {order.status === 'pending' && (
                            <Button
                              variant="contained"
                              color="info"
                              size="small"
                              onClick={() => handleUpdateOrderStatus(order._id, 'processing')}
                            >
                              Process
                            </Button>
                          )}
                          {order.status === 'processing' && (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleUpdateOrderStatus(order._id, 'shipped')}
                            >
                              Ship
                            </Button>
                          )}
                          {order.status === 'shipped' && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                            >
                              Deliver
                            </Button>
                          )}
                          {(order.status === 'pending' || order.status === 'processing') && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        
        {tab === 5 && (
          <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order Number</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cancelledOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>#{order._id.slice(-8).toUpperCase()}</TableCell>
                    <TableCell>{order.user?.name || 'N/A'}</TableCell>
                    <TableCell>{order.phone}</TableCell>
                    <TableCell>{order.shippingAddress?.address || ''}</TableCell>
                    <TableCell>{order.shippingAddress?.city || ''}</TableCell>
                    <TableCell>{order.shippingAddress?.country || ''}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {order.items.map((item, idx) => (
                          <li key={idx}>{item.name} x{item.quantity}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteOrder(order._id, order.totalPrice)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {tab === 6 && (
          <>
            {userDeleteError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {userDeleteError}
              </Alert>
            )}
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.filter(u => u.isBlocked).map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleUnblockUser(user._id)}
                          startIcon={<CheckCircle />}
                        >
                          Unblock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Container>
  );
}

export default AdminDashboard; 