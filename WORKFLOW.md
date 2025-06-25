# Uniform Website Studio - Complete Workflow Documentation

## Overview

Uniform Website Studio is a comprehensive e-commerce platform specifically designed for managing and selling uniforms. The platform supports multiple user roles including students, institutions, dealers, and administrators, each with their specific functionalities and access levels.

## Recent Updates

- **Global Error Handling:**
  - Added a global error boundary with a user-friendly error page (`src/app/error.tsx`).
  - Users see a helpful message and can retry or return home if an unhandled error occurs.
- **Sentry Integration:**
  - Sentry is now integrated for error and performance monitoring (client, server, and edge via config files).
  - Errors and performance data are tracked in the Sentry dashboard.
- **Admin Login Separation:**
  - The admin login page is now separate from the admin panel.
  - Admin panel is protected by a client-side check in its layout; only accessible after successful login.
- **Product Reviews:**
  - Users can write reviews with star ratings for products.
  - Reviews are displayed on the product detail page.
- **Mobile Sidebar Improvements:**
  - Mobile sidebar menus now reuse the same logic/components as desktop, ensuring consistency and accessibility.

## User Roles and Authentication

### 1. User Types

- **Students**: Can browse and purchase uniforms
- **Institutions**: Can manage their uniform requirements and student orders
- **Dealers**: Can manage inventory and fulfill orders
- **Administrators**: Have full system access and management capabilities

### 2. Authentication Flow

1. **Registration**

   - Users can register through `/register` route
   - Different registration forms based on user type
   - Email verification for non-student users
   - Roll number verification for students

2. **Login**
   - Multi-role login system
   - JWT-based authentication
   - Secure cookie-based session management
   - Role-based access control
   - **Admin login is now only available at `/admin/login`**

## Core Features

### 1. Product Management

- **Product Catalog**

  - Browse products at `/products`
  - Filter by categories, sizes, and availability
  - Detailed product views with specifications
  - Image gallery and size charts
  - **Product reviews and star ratings**

- **Inventory Management**
  - Real-time stock tracking
  - Size-wise inventory management
  - Low stock alerts
  - Bulk update capabilities

### 2. Shopping Experience

- **Cart System**

  - Add/remove items
  - Update quantities
  - Size selection
  - Price calculation
  - Cart persistence across sessions

- **Checkout Process**
  - Address management
  - Payment integration
  - Order confirmation
  - Email notifications

### 3. Order Management

- **Order Processing**

  - Order creation and tracking
  - Status updates
  - Shipping information
  - Delivery tracking

- **Order History**
  - View past orders
  - Order details and status
  - Download invoices
  - Reorder functionality

## Role-Specific Features

### 1. Student Features

- Browse and purchase uniforms
- View order history
- Track deliveries
- Manage profile and preferences
- Size recommendations

### 2. Institution Features

- Manage student uniform requirements
- Bulk order processing
- Student list management
- Order tracking and management
- Custom uniform requirements

### 3. Dealer Features

- Inventory management
- Order fulfillment
- Sales analytics
- Stock management
- Price management

### 4. Admin Features

- User management
- Product management
- Order oversight
- System configuration
- Analytics and reporting
- **Separate login and protected admin panel**

## Technical Implementation

### 1. Frontend Architecture

- Next.js 13+ with App Router
- React components and hooks
- Responsive design
- Client-side state management
- Form handling and validation
- **Global error boundary and Sentry integration**

### 2. Backend Architecture

- API Routes in Next.js
- MongoDB database integration
- Authentication middleware
- Role-based access control
- Error handling and logging

### 3. API Endpoints

- `/api/auth/*` - Authentication endpoints
- `/api/user/*` - User management
- `/api/orders/*` - Order processing
- `/api/payment/*` - Payment handling
- `/api/products/[id]/reviews` - Product reviews (GET/POST)

### 4. Security Measures

- JWT authentication
- HTTP-only cookies
- Password hashing
- Input validation
- CORS protection
- Rate limiting

## Data Flow

### 1. User Authentication Flow

1. User submits credentials
2. Server validates credentials
3. JWT token generated
4. Token stored in HTTP-only cookie
5. User redirected to appropriate dashboard

### 2. Order Processing Flow

1. User adds items to cart
2. Proceeds to checkout
3. Address and payment details collected
4. Order created in database
5. Payment processed
6. Order confirmation sent
7. Inventory updated

### 3. Inventory Management Flow

1. Dealer updates inventory
2. System updates stock levels
3. Low stock alerts triggered
4. Product availability updated
5. Cart items validated against stock

## Error Handling

### 1. Client-Side Errors

- Form validation errors
- Network request failures
- Authentication errors
- Cart validation errors
- **Global error boundary and Sentry for error tracking**

### 2. Server-Side Errors

- Database operation failures
- Payment processing errors
- Authentication failures
- API validation errors
- **Sentry for error and performance monitoring**

## Performance Considerations

### 1. Optimization Techniques

- Image optimization
- Code splitting
- Lazy loading
- Caching strategies
- Database indexing

### 2. Monitoring

- Error tracking
- Performance metrics
- User analytics
- System health checks

## Future Enhancements

- Mobile app integration
- Advanced analytics
- AI-powered recommendations
- Enhanced payment options
- Multi-language support
- Advanced reporting tools

## Maintenance and Support

- Regular security updates
- Database backups
- Performance monitoring
- User support system
- Documentation updates
