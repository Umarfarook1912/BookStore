# BookStore

A modern full-stack web application for browsing, purchasing, and managing books online. Built with React (Vite) for the frontend and Node.js/Express for the backend.

## Features
- User authentication (login/register)
- Browse books by category, best sellers, and search
- Shopping cart and checkout
- Admin dashboard for managing books and orders
- Responsive, modern UI

## Tech Stack
- **Frontend:** React, Vite, Bootstrap, Framer Motion
- **Backend:** Node.js, Express, MongoDB
- **Styling:** CSS Modules, Bootstrap

## Folder Structure
```
BookStore/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── ...project docs
```

## Getting Started

### Backend
1. `cd backend`
2. Install dependencies: `npm install`
3. Configure MongoDB in `config/db.js`
4. Start server: `npm start`

### Frontend
1. `cd frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

## Environment Variables
- Backend: Create a `.env` file for MongoDB URI, JWT secret, etc.
- Frontend: Configure API base URL in `src/services/api.js` if needed.

## Contributing
Pull requests are welcome! For major changes, please open an issue first.

## License
MIT

## API Documentation

### Authentication

#### POST /api/auth/register
- Registers a new user.
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response:**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```
- **Error Response:**
```json
{
  "message": "User already exists"
}
```

#### POST /api/auth/login
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response:**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```
- **Error Response:**
```json
{
  "message": "Invalid credentials"
}
```

#### GET /api/auth/me
- **Headers:** `Authorization: Bearer <token>`
- **Success Response:**
```json
{
  "id": "65a1b2c3d4e5f6a7b8c9d0e1",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

---

### Books

#### GET /api/books
- **Query Params (optional):** `genre`, `author`, `search`, `page`, `limit`, etc.
- **Success Response:**
```json
{
  "items": [
    {
      "_id": "65a1b2c3d4e5f6a7b8c9d0e2",
      "title": "Book Title",
      "author": "Author Name",
      "genre": "Fiction",
      "price": 19.99,
      "rating": 4.5,
      "description": "...",
      "coverImage": "...",
      "stock": 10,
      "createdAt": "2025-12-06T12:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```

#### GET /api/books/:id
- **Success Response:**
```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e2",
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Fiction",
  "price": 19.99,
  "rating": 4.5,
  "description": "...",
  "coverImage": "...",
  "stock": 10,
  "createdAt": "2025-12-06T12:00:00.000Z"
}
```
- **Error Response:**
```json
{
  "message": "Book not found"
}
```

#### POST /api/books (admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Fiction",
  "price": 19.99,
  "description": "...",
  "coverImage": "...",
  "stock": 10
}
```
- **Success Response:**
```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e2",
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Fiction",
  "price": 19.99,
  "rating": 0,
  "description": "...",
  "coverImage": "...",
  "stock": 10,
  "createdAt": "2025-12-06T12:00:00.000Z"
}
```

#### PUT /api/books/:id (admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Body:** (any updatable book fields)
- **Success Response:** Same as POST /api/books
- **Error Response:**
```json
{
  "message": "Book not found"
}
```

#### DELETE /api/books/:id (admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Success Response:**
```json
{
  "message": "Book deleted"
}
```

---

### Orders

#### POST /api/orders (user only)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "items": [
    { "book": "65a1b2c3d4e5f6a7b8c9d0e2", "quantity": 2 }
  ]
}
```
- **Success Response:**
```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e3",
  "user": "65a1b2c3d4e5f6a7b8c9d0e1",
  "items": [
    { "book": "65a1b2c3d4e5f6a7b8c9d0e2", "quantity": 2, "price": 19.99 }
  ],
  "total": 39.98,
  "status": "pending",
  "createdAt": "2025-12-06T12:00:00.000Z",
  "updatedAt": "2025-12-06T12:00:00.000Z"
}
```
- **Error Response:**
```json
{
  "message": "No items"
}
```

#### GET /api/orders/my (user only)
- **Headers:** `Authorization: Bearer <token>`
- **Success Response:**
```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e3",
  "user": "65a1b2c3d4e5f6a7b8c9d0e1",
  "items": [
    { "book": { "_id": "65a1b2c3d4e5f6a7b8c9d0e2", "title": "Book Title", ... }, "quantity": 2, "price": 19.99 }
  ],
  "total": 39.98,
  "status": "pending",
  "createdAt": "2025-12-06T12:00:00.000Z",
  "updatedAt": "2025-12-06T12:00:00.000Z"
}
```

#### GET /api/orders (admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Success Response:** Same as GET /api/orders/my, but for all users.

#### PUT /api/orders/:id/status (admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "status": "shipped"
}
```
- **Success Response:**
```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e3",
  "user": "65a1b2c3d4e5f6a7b8c9d0e1",
  "items": [ ... ],
  "total": 39.98,
  "status": "shipped",
  "createdAt": "2025-12-06T12:00:00.000Z",
  "updatedAt": "2025-12-06T12:10:00.000Z"
}
```
- **Error Response:**
```json
{
  "message": "Order not found"
}
```

---

> All endpoints return JSON. Authentication uses JWT in the Authorization header.

---

## Project Overview

BookStore is a full-stack web application designed to provide a seamless online book shopping experience. It combines a modern, responsive frontend with a robust backend API, allowing users to browse, search, and purchase books, while administrators can manage inventory and orders.

### Key Features
- **User Authentication:** Secure registration, login, and JWT-based session management.
- **Book Browsing:** Users can explore books by category, search by title/author, and view best sellers.
- **Shopping Cart & Checkout:** Add books to cart, review orders, and complete purchases.
- **Order Management:** Users can view their order history; admins can manage all orders and update statuses.
- **Admin Dashboard:** Admins can add, edit, or remove books and oversee all orders.
- **Responsive UI:** Built with React and Bootstrap for a smooth experience on any device.
- **Notifications:** Real-time feedback for actions (login, errors, order status, etc.).

### Technology Stack
- **Frontend:** React (Vite), Bootstrap, Framer Motion, CSS Modules
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **API Communication:** Axios

### Architecture
- **Backend:** RESTful API with separate routes for authentication, books, and orders. Uses middleware for authentication and role-based access control.
- **Frontend:** SPA (Single Page Application) with routing for pages (Home, Login, Register, Cart, Checkout, Orders, Admin Dashboard, etc.). Context API for global state (auth).

### Development & Deployment
- **Local Development:** Run backend and frontend servers separately. Frontend communicates with backend via API endpoints.
- **Environment Variables:** Backend uses `.env` for secrets and DB connection. Frontend can configure API base URL.
- **Extensible:** Easily add new features, pages, or API endpoints.

### Use Cases
- **For Readers:** Discover new books, manage orders, and enjoy a user-friendly shopping experience.
- **For Admins:** Efficiently manage book inventory and order fulfillment.

### Documentation
- **API Documentation:** Detailed in this README, including request/response examples.
- **Folder Structure:** Explained above for easy navigation and contribution.

---

BookStore is ideal for learning, prototyping, or launching a scalable online bookstore. Contributions and feedback are welcome!
