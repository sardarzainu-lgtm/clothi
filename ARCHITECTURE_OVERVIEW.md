# CLOTHI. E-commerce Platform - Architecture Overview

## 🏗️ System Architecture

This is a **full-stack MERN (MongoDB, Express, React, Node.js)** e-commerce application with a modern, component-based frontend and RESTful API backend.

---

## 📁 Project Structure

```
ecommerce/
├── client/          # React Frontend Application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/      # React Context API (State Management)
│   │   ├── pages/        # Page components (Routes)
│   │   ├── assets/       # Static assets (images)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css     # Global styles
│   └── package.json
│
└── server/          # Node.js/Express Backend API
    ├── models/          # Mongoose data models
    ├── routes/          # API route handlers
    ├── middleware/      # Express middleware
    ├── utils/           # Utility functions
    ├── uploads/         # Uploaded files
    └── server.js        # Server entry point
```

---

## 🎨 Frontend Architecture (Client)

### **Technology Stack**
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.2.0
- **Routing**: React Router DOM 6.22.3
- **HTTP Client**: Axios 1.6.8
- **Icons**: React Icons 5.0.1
- **OAuth**: @react-oauth/google 0.12.2
- **Styling**: CSS with CSS Variables (Design Tokens)

### **Architecture Pattern: Component-Based with Context API**

#### **1. Component Hierarchy**
```
App.jsx (Root)
├── Context Providers (State Management)
│   ├── ToastProvider
│   ├── RecentlyViewedProvider
│   ├── WishlistProvider
│   └── CartProvider
├── Router
│   ├── Navbar (Global Navigation)
│   ├── LoadingProgress (Global Progress Bar)
│   ├── Main Content (Routes)
│   │   ├── Home
│   │   ├── Shop
│   │   ├── ProductDetails
│   │   ├── Cart
│   │   ├── Checkout
│   │   ├── Login/Register
│   │   ├── Profile
│   │   ├── Wishlist
│   │   └── Admin Pages
│   └── Footer
└── WhatsAppFloat (Global Widget)
```

#### **2. State Management Strategy**

**React Context API** (No Redux needed for this scale):
- **CartContext**: Shopping cart state (localStorage persistence)
- **WishlistContext**: Wishlist state (localStorage persistence)
- **ToastContext**: Global notification system
- **RecentlyViewedContext**: Product browsing history

**Local State**: Component-level state with `useState` for UI interactions

**Persistence**: 
- Cart & Wishlist → localStorage
- User Info → localStorage (JWT token)
- Recently Viewed → Context (session-based)

#### **3. Component Categories**

**Pages** (`/pages/`):
- Route-level components representing full pages
- 14 pages total (Home, Shop, ProductDetails, Cart, Checkout, Login, Register, Profile, Wishlist, Admin pages)

**Components** (`/components/`):
- **UI Components**: Navbar, Footer, Toast, ScrollToTop
- **Feature Components**: ImageGallery, SearchModal, WhatsAppFloat
- **State Components**: EmptyState, SkeletonLoader, LoadingProgress, TrustBadges

**Context** (`/context/`):
- Global state providers for shared application state

#### **4. Routing Structure**

```javascript
Public Routes:
  / → Home
  /shop → Shop (Product Listing)
  /product/:id → ProductDetails
  /cart → Cart
  /login → Login
  /register → Register

Protected Routes (Requires Auth):
  /profile → User Profile
  /checkout → Checkout
  /wishlist → Wishlist
  /order/:id → OrderDetails

Admin Routes (Requires Admin):
  /admin/dashboard → AdminDashboard
  /admin/products → ProductList
  /admin/product/:id/edit → ProductEdit
  /admin/orders → OrderList
```

#### **5. Design System**

**CSS Variables (Design Tokens)**:
- Colors: Primary, secondary, semantic colors, gradients
- Spacing: 4px base unit system (xs to 5xl)
- Typography: Font sizes, weights, line heights
- Shadows: 5-tier elevation system
- Border Radius: Consistent radius values
- Transitions: Fast, base, slow timing functions

**Component Classes**:
- `.btn`, `.btn-primary`, `.btn-outline` - Button variants
- `.card`, `.product-card` - Card components
- `.form-control`, `.form-label` - Form elements
- `.skeleton`, `.skeleton-*` - Loading states
- `.product-badge` - Product badges
- `.elevation-*` - Shadow system

---

## 🔧 Backend Architecture (Server)

### **Technology Stack**
- **Runtime**: Node.js
- **Framework**: Express 4.19.2
- **Database**: MongoDB with Mongoose 8.2.4
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **File Upload**: Multer 1.4.5
- **OAuth**: google-auth-library 10.5.0
- **Error Handling**: express-async-handler 1.2.0

### **Architecture Pattern: RESTful API with MVC-like Structure**

#### **1. Server Entry Point** (`server.js`)
```javascript
Express App Setup
├── Middleware Configuration
│   ├── express.json() - Body parser
│   ├── cors() - Cross-origin requests
│   └── Static file serving (/uploads)
├── Database Connection (MongoDB)
└── Route Registration
    ├── /api/users
    ├── /api/products
    ├── /api/orders
    ├── /api/upload
    └── /api/products (reviews nested)
```

#### **2. Data Models** (`/models/`)

**User Model**:
```javascript
{
  name: String (required)
  email: String (required, unique)
  password: String (hashed, optional for Google users)
  isAdmin: Boolean (default: false)
  googleId: String (for OAuth)
  timestamps: true
}
```

**Product Model**:
```javascript
{
  user: ObjectId (ref: User)
  name: String
  image: String
  brand: String
  category: String
  description: String
  reviews: [ReviewSchema] (embedded)
  rating: Number (default: 0)
  numReviews: Number (default: 0)
  price: Number
  countInStock: Number
  timestamps: true
}
```

**Order Model**:
```javascript
{
  user: ObjectId (ref: User)
  orderItems: [{
    name, qty, image, price,
    product: ObjectId (ref: Product)
  }]
  shippingAddress: { address, city, postalCode, country }
  paymentMethod: String
  paymentResult: { id, status, update_time, email_address }
  taxPrice: Number
  shippingPrice: Number
  totalPrice: Number
  isPaid: Boolean
  paidAt: Date
  isDelivered: Boolean
  deliveredAt: Date
  timestamps: true
}
```

**Review Model** (Embedded in Product):
```javascript
{
  name: String
  rating: Number
  comment: String
  user: ObjectId (ref: User)
  timestamps: true
}
```

#### **3. API Routes** (`/routes/`)

**User Routes** (`/api/users`):
- `POST /login` - User authentication
- `POST /google-login` - Google OAuth
- `POST /register` - User registration
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update profile (protected)
- `GET /` - Get all users (admin)
- `DELETE /:id` - Delete user (admin)

**Product Routes** (`/api/products`):
- `GET /` - Get all products (public)
- `GET /:id` - Get single product (public)
- `GET /:id/rating` - Get product rating (public)
- `GET /:id/reviews` - Get product reviews (public)
- `POST /` - Create product (admin)
- `PUT /:id` - Update product (admin)
- `DELETE /:id` - Delete product (admin)

**Order Routes** (`/api/orders`):
- `POST /` - Create order (protected)
- `GET /myorders` - Get user orders (protected)
- `GET /:id` - Get order by ID (protected)
- `PUT /:id/pay` - Update payment status (protected)
- `PUT /:id/deliver` - Update delivery status (admin)
- `GET /` - Get all orders (admin)

**Upload Routes** (`/api/upload`):
- `POST /` - Upload image file (admin)

**Review Routes** (`/api/products/:id/reviews`):
- `POST /` - Create review (protected)

#### **4. Middleware** (`/middleware/`)

**Authentication Middleware** (`authMiddleware.js`):
- `protect`: JWT token verification
  - Extracts token from Authorization header
  - Verifies token with JWT_SECRET
  - Attaches user to request object
  - Returns 401 if invalid/missing

- `admin`: Admin authorization check
  - Checks if user exists and isAdmin === true
  - Returns 401 if not admin

#### **5. Database Schema Relationships**

```
User (1) ──< (Many) Products
User (1) ──< (Many) Orders
User (1) ──< (Many) Reviews
Product (1) ──< (Many) Reviews (Embedded)
Product (1) ──< (Many) OrderItems
```

---

## 🔄 Data Flow

### **Frontend → Backend Communication**

1. **User Action** (e.g., Add to Cart)
   ↓
2. **Component Handler** (e.g., `addToCart()`)
   ↓
3. **Context Update** (CartContext)
   ↓
4. **localStorage Persistence** (Cart items)
   ↓
5. **API Call** (when needed, e.g., Checkout)
   ↓
6. **Axios Request** → Express Route
   ↓
7. **Middleware** (Auth check if needed)
   ↓
8. **Route Handler** (Business logic)
   ↓
9. **Database Operation** (Mongoose)
   ↓
10. **Response** → Frontend
    ↓
11. **State Update** → UI Re-render

### **Authentication Flow**

1. **Login/Register**
   - Frontend sends credentials
   - Backend validates & generates JWT
   - Token stored in localStorage
   - Token sent in Authorization header for protected routes

2. **Protected Route Access**
   - Frontend includes token in request header
   - Backend `protect` middleware verifies token
   - User object attached to request
   - Route handler executes

3. **Google OAuth**
   - Frontend Google OAuth button
   - Google returns ID token
   - Backend verifies with Google Auth Library
   - Creates/finds user, generates JWT
   - Same token flow as regular login

---

## 🗄️ Database Architecture

### **MongoDB Collections**

1. **users**
   - User accounts
   - Indexed on: email (unique)

2. **products**
   - Product catalog
   - Embedded reviews array
   - Indexed on: user (for admin queries)

3. **orders**
   - Order history
   - References: user, products
   - Indexed on: user (for user queries)

### **Data Relationships**

- **One-to-Many**: User → Products, User → Orders, User → Reviews
- **Many-to-One**: Product → User (creator), Order → User
- **Embedded**: Reviews embedded in Products (denormalized for performance)

---

## 🔐 Security Architecture

### **Authentication**
- JWT tokens stored in localStorage
- Token expiration handled by backend
- Protected routes require valid token
- Admin routes require `isAdmin: true`

### **Password Security**
- bcryptjs hashing (salt rounds: 10)
- Passwords never stored in plain text
- Pre-save hook auto-hashes passwords

### **API Security**
- CORS enabled for cross-origin requests
- Express JSON parser for request body
- Input validation in route handlers
- Error handling with express-async-handler

### **File Upload Security**
- Multer middleware for file handling
- Admin-only upload routes
- Files stored in `/uploads` directory

---

## 📦 Key Features & Implementation

### **Shopping Cart**
- **Storage**: localStorage + React Context
- **Persistence**: Survives page refresh
- **Operations**: Add, Remove, Update Quantity
- **Checkout**: Converts cart to order

### **Wishlist**
- **Storage**: localStorage + React Context
- **Operations**: Add, Remove, Check if exists
- **Persistence**: Survives page refresh

### **Product Reviews**
- **Storage**: Embedded in Product document
- **Operations**: Create, Read, Calculate average rating
- **Access**: Public read, Protected write

### **Image Upload**
- **Library**: Multer
- **Storage**: Local filesystem (`/uploads`)
- **Access**: Admin only
- **Serving**: Static file route `/uploads`

### **Search & Filtering**
- **Frontend**: Client-side filtering
- **Backend**: Basic product listing
- **Features**: Category, price range, rating, stock status
- **Sorting**: Price, rating, newest

---

## 🎯 Design Patterns Used

### **Frontend**
1. **Context API Pattern**: Global state management
2. **Component Composition**: Reusable components
3. **Custom Hooks**: Reusable logic (useToast)
4. **Provider Pattern**: Context providers
5. **Container/Presentational**: Pages as containers, components as presentational

### **Backend**
1. **MVC-like Pattern**: Models, Routes (Controllers), Middleware
2. **Middleware Pattern**: Authentication, error handling
3. **Async Handler Pattern**: Error handling for async routes
4. **RESTful API**: Standard HTTP methods and status codes

---

## 🚀 Build & Deployment

### **Frontend Build**
- **Dev**: `npm run dev` (Vite dev server)
- **Build**: `npm run build` (Production bundle)
- **Preview**: `npm run preview` (Preview production build)

### **Backend**
- **Dev**: `npm run dev` (Nodemon - auto-restart)
- **Production**: `npm start` (Node.js)

### **Environment Variables**

**Frontend** (`.env`):
- `VITE_API_URL` (optional, defaults to relative)

**Backend** (`.env`):
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 5000)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID

---

## 📊 Performance Considerations

### **Frontend**
- **Code Splitting**: Route-based (React Router)
- **Lazy Loading**: Images with lazy loading
- **Optimistic Updates**: Cart, wishlist updates
- **localStorage Caching**: Cart, wishlist, user info
- **Skeleton Loaders**: Better perceived performance

### **Backend**
- **Async Operations**: Non-blocking I/O
- **Database Indexing**: Email (unique), user references
- **Error Handling**: Centralized with async-handler
- **Static File Serving**: Efficient file delivery

---

## 🔄 State Management Flow

### **Global State (Context)**
```
CartContext
├── cartItems (array)
├── shippingAddress (object)
├── paymentMethod (string)
└── Methods: addToCart, removeFromCart, clearCart

WishlistContext
├── wishlistItems (array)
└── Methods: addToWishlist, removeFromWishlist, isInWishlist

ToastContext
├── toasts (array)
└── Methods: showToast, removeToast

RecentlyViewedContext
├── recentlyViewed (array)
└── Methods: addToRecentlyViewed
```

### **Local State (Component)**
- Form inputs
- UI interactions (modals, dropdowns)
- Loading states
- Filter/sort states

---

## 🎨 UI/UX Architecture

### **Design System**
- **Design Tokens**: CSS variables for consistency
- **Component Library**: Reusable UI components
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation

### **Recent Enhancements**
- Skeleton loaders for loading states
- Empty state components
- Image gallery with zoom
- Search modal with suggestions
- Loading progress bar
- Trust badges
- Enhanced product cards
- Hero section animations

---

## 🔌 API Integration

### **API Base URL**
- Development: `http://localhost:5000/api`
- Production: Configured via environment

### **Request/Response Format**
- **Request**: JSON body, JWT in Authorization header
- **Response**: JSON format
- **Error Handling**: Error objects with messages

### **Axios Configuration**
- Base URL: `/api` (relative, proxies in dev)
- Headers: Content-Type, Authorization
- Error handling: Toast notifications

---

## 📝 Code Organization Principles

1. **Separation of Concerns**: Clear separation between UI, logic, and data
2. **DRY (Don't Repeat Yourself)**: Reusable components and utilities
3. **Single Responsibility**: Each component/function has one purpose
4. **Component Reusability**: Shared components across pages
5. **Consistent Naming**: Clear, descriptive names
6. **File Organization**: Logical folder structure

---

## 🛠️ Development Workflow

1. **Frontend Development**
   - Vite dev server (HMR - Hot Module Replacement)
   - React Fast Refresh
   - ESLint for code quality

2. **Backend Development**
   - Nodemon for auto-restart
   - MongoDB connection
   - API testing with Postman/Thunder Client

3. **Full-Stack Integration**
   - Frontend proxies API calls to backend
   - CORS enabled for development
   - Shared data models (frontend expects backend structure)

---

## 📈 Scalability Considerations

### **Current Architecture Supports**:
- ✅ Multiple concurrent users
- ✅ Product catalog expansion
- ✅ Order volume growth
- ✅ User base growth

### **Future Scalability Options**:
- **Database**: MongoDB sharding, read replicas
- **Caching**: Redis for session/cart data
- **CDN**: Static asset delivery
- **Load Balancing**: Multiple server instances
- **Microservices**: Split into smaller services if needed

---

## 🔍 Key Architectural Decisions

1. **MERN Stack**: Full JavaScript stack for consistency
2. **Context API over Redux**: Simpler state management for this scale
3. **localStorage Persistence**: Client-side cart/wishlist persistence
4. **Embedded Reviews**: Denormalized for read performance
5. **JWT Authentication**: Stateless authentication
6. **RESTful API**: Standard HTTP methods and conventions
7. **Component-Based UI**: Reusable, maintainable components
8. **CSS Variables**: Design system with tokens

---

## 📚 Technology Versions

**Frontend**:
- React: 18.2.0
- React Router: 6.22.3
- Vite: 5.2.0
- Axios: 1.6.8

**Backend**:
- Node.js: (Latest LTS)
- Express: 4.19.2
- Mongoose: 8.2.4
- JWT: 9.0.2

**Database**:
- MongoDB: (Latest version)

---

## 🎯 Summary

This is a **modern, full-stack e-commerce application** built with:
- **Frontend**: React with Context API, modern UI/UX
- **Backend**: Express RESTful API
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth
- **Architecture**: Component-based, scalable, maintainable

The architecture follows **best practices** for:
- Code organization
- State management
- API design
- Security
- Performance
- User experience

The codebase is **well-structured**, **maintainable**, and ready for **production deployment** with proper environment configuration.

