# E-Commerce Store
Full-stack e-commerce app with user accounts, cart, checkout and an admin dashboard.

**Stack:** React, Material-UI, React Router, Axios, Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt.

**Highlights**
- Register/login with JWT, admin approval of new users
- Cart saved in localStorage, checkout with Egyptian phone validation, cash on delivery, 15% tax, free shipping over $100
- Order status flow: pending, processing, shipped, delivered; users can cancel pending orders
- Admin: manage users, products and orders, plus a stats dashboard


## Features

### User Features
- **User Authentication**: Register, login, and logout functionality
- **Product Browsing**: View all available products with details
- **Shopping Cart**: Add products to cart, manage quantities, and remove items
- **Order Management**: Complete checkout process with phone number and address validation
- **Order History**: View all your orders and cancel pending orders
- **Order Tracking**: View order status and details with contact information

### Admin Features
- **User Management**: Approve, block, and unblock users
- **Product Management**: Add, edit, and delete products
- **Order Management**: View all orders, update status, and manage deliveries
- **Dashboard**: Comprehensive statistics with order analytics and revenue tracking

## Shopping Cart Features

### Cart Functionality
- Add products to cart from the products page
- View cart items with quantities and prices
- Update item quantities in the cart
- Remove items from the cart
- Real-time cart total calculation
- Cart persistence using localStorage

### Checkout Process
- **Required Information**: Phone number and shipping address validation
- **Phone Validation**: Egyptian phone number format validation
- **Address Details**: Shipping address with city (postal code not required)
- **Payment Method**: Cash on Delivery only
- Review cart items and order summary
- Automatic tax calculation (15%)
- Free shipping for orders over $100
- Order confirmation with order ID
- Stock management (reduces stock when order is placed)

### Order Management
- **Order Status Tracking**: pending → processing → shipped → delivered
- **Order Cancellation**: Users can cancel pending orders, admins can cancel any order
- **Order History**: Complete order history for users
- **Admin Order Management**: Full control over order status updates
- **Contact Information**: Phone numbers and addresses displayed for users and admins
- **Order Details**: Complete order information with items and pricing

## Technical Stack

### Frontend
- React.js
- Material-UI (MUI)
- React Router
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```
3. Set up environment variables:
   - Create `.env` file in the root directory
   - Add `MONGO_URI` for MongoDB connection
   - Add `JWT_SECRET` for JWT token signing

4. Start the development servers:
   ```bash
   # Start backend server
   npm run dev
   
   # Start frontend (in client directory)
   cd client && npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create new order (with phone and address)
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Mark order as paid
- `PUT /api/orders/:id/cancel` - Cancel order (pending only)
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `PUT /api/orders/:id/deliver` - Mark order as delivered (admin only)
- `GET /api/orders` - Get all orders (admin only)

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/pending-users` - Get pending users
- `PUT /api/admin/approve-user/:id` - Approve user
- `PUT /api/admin/users/:id/block` - Block user
- `PUT /api/admin/users/:id/unblock` - Unblock user

## Usage

### For Users
1. **Register/Login**: Create an account or login to access the store
2. **Browse Products**: View available products on the products page
3. **Add to Cart**: Click "Add to Cart" on any product
4. **View Cart**: Click the cart icon in the navigation to view your cart
5. **Checkout**: Review your cart and click "Complete Order"
6. **Enter Details**: Fill in phone number and shipping address (required)
7. **Order Confirmation**: View your order details and confirmation
8. **Track Orders**: View order status in "My Orders" section
9. **Cancel Orders**: Cancel pending orders if needed

### For Admins
1. **Access Admin Dashboard**: Login as an admin user
2. **View Statistics**: See comprehensive order and user statistics
3. **Manage Users**: Approve, block, or unblock users
4. **Manage Products**: Add, edit, or delete products
5. **Manage Orders**: Update order status and track deliveries
6. **Order Analytics**: View revenue, pending orders, and completion rates

## Order Flow

### User Order Process
1. **Add to Cart**: Select products and add to cart
2. **Review Cart**: Check items, quantities, and total
3. **Checkout**: Enter phone number and shipping address
4. **Validation**: Phone number format and required fields validation
5. **Order Creation**: Order is created with pending status
6. **Confirmation**: User receives order confirmation
7. **Tracking**: User can track order status in "My Orders"

### Admin Order Management
1. **View Orders**: See all orders in admin dashboard
2. **Process Orders**: Change status from pending to processing
3. **Ship Orders**: Mark orders as shipped when ready
4. **Deliver Orders**: Mark orders as delivered upon completion
5. **Cancel Orders**: Cancel orders if necessary
6. **Monitor Statistics**: Track revenue and order analytics

## Features Highlights

### Phone Number Validation
- Validates Egyptian phone number format
- Required field for order completion
- Displayed in order details and admin panel

### Order Cancellation
- Users can cancel pending orders only
- Automatic stock restoration when cancelled
- Admin can cancel any order

### Enhanced Admin Dashboard
- **Revenue Tracking**: Total revenue from all orders
- **Order Statistics**: Pending, completed, and cancelled orders
- **User Analytics**: New users in last 7 days
- **Order Management**: Full control over order status
- **Contact Information**: Phone numbers and addresses for delivery 
