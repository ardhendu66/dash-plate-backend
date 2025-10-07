# Multi-Vendor Food Delivery Backend

A **Food Marketplace backend** built with **Node.js, TypeScript, Express, PostgreSQL, MongoDB, Redis, and Socket.io**.  
Supports **user authentication, role-based access control, restaurants & menus, cart management, orders, payments (placeholder), and real-time order tracking**.

---

## Features

### User Module
- Signup/Login with JWT + refresh token (stored in HTTP-only cookies)
- Role-based access control: `user | vendor | delivery | admin`
- Profile management

### Restaurant Module
- CRUD operations for restaurants (MongoDB)
- Vendor-specific access

### Menu Module
- CRUD operations for menu items (MongoDB)
- Linked to restaurants

### Cart Module
- Redis-based cart management
- Add/remove/update cart items
- Get cart summary

### Order Module
- Checkout cart → create order (Postgres)
- Vendor/Admin update order status
- Real-time order tracking via Socket.io

### Real-time Features
- Customers join order room to receive live updates
- Vendor/Admin emits order status updates
- Fully extensible for delivery partner live location tracking

### Validation & Error Handling
- Zod validators for requests
- Centralized error handling middleware
- Proper HTTP status codes

### Tech Stack
- **Backend:** Node.js, TypeScript, Express
- **Database:** PostgreSQL (users, orders), MongoDB (restaurants, menus)
- **Cache:** Redis (cart)
- **Real-time:** Socket.io
- **Authentication:** JWT + refresh token (HTTP-only cookie)
- **Validation:** Zod


---

## Getting Started

### Prerequisites
- Node.js v20+
- PostgreSQL
- MongoDB
- Redis

### Install Dependencies
```bash
npm install
```

### Environment Variables
```bash
PORT=3000
NODE_ENV=development
# Postgres
DATABASE_URL=<YOUR_POSTGRES_URL_STRING>
# MongoDB
MONGO_URI=<MONGODB_URL_STRING>
# JWT
ACCESS_TOKEN_SECRET=<YOUR_ACCESS_TOKEN>
REFRESH_TOKEN_SECRET=<YOUR_REFRESH_TOKEN>
# Redis
REDIS_HOST=<YOUR_REDIS_HOST>
REDIS_PORT=<YOUR_REDIS_PORT>
REDIS_PASSWORD=<YOUR_REDIS_PASSWORD>
```

### Run the Server
```bash
docker-compose build
docker-compose up
# OR
npm run dev
```