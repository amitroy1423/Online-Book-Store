# 📚 Online Book Store (BookNest) — MERN Stack

A modern, full-stack **Online Bookstore** built with the **MERN** stack (MongoDB, Express, React, Node.js).

---

## 🌟 Key Features

### 👤 Customer
- **Authentication**: Registration, Login, Silent session restoration with HTTP-only cookies, and Logout.
- **Book Browsing**: Explore catalog with real-time search, category filters, and sorting.
- **Book Details**: Detailed overview, synopsis, dynamic price calculator, and Add-to-Cart.
- **Shopping Cart**: Client-side cart persisted in `localStorage` with quantity adjustments and badge notifications.
- **Cash on Delivery (COD) Checkout**: Shipping address validation and immediate order placement.
- **My Orders**: Real-time order tracking, delivery status badges, and itemized invoice breakdown.

### 🛡️ Administrator (Single Pre-configured Admin)
- **Dashboard**: High-level store metrics (Total Books, Total Orders, Pending Orders, Registered Customers).
- **Book Catalog CRUD**: Add, edit, and delete bookstore titles.
- **ImageKit Cover Uploads**: Multipart image uploading via backend to ImageKit.
- **Order Fulfillment**: Track all customer orders, filter by status, and update status (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`).

---

## 🏗️ Project Architecture

```text
Online Book Store/
├── .gitignore                   # Root gitignore protecting .env and build files
├── README.md                    # Setup & documentation
├── Backend/
│   ├── .env.example             # Backend environment template
│   ├── .gitignore
│   ├── API_DOCUMENTATION.md     # Complete REST API reference
│   ├── package.json
│   ├── server.js                # Server entry point
│   ├── scripts/
│   │   └── createAdmin.js       # Admin creation script
│   └── src/
│       ├── app.js               # Express application configuration
│       ├── config/db.js         # MongoDB connection
│       ├── controllers/         # Auth, Book, Order, and Admin controllers
│       ├── middleware/          # Auth, Upload (Multer), Error handlers
│       ├── models/              # User, Book, and Order Mongoose models
│       ├── routes/              # Express API route declarations
│       └── services/            # ImageKit service
│
└── Frontend/
    ├── .env.example             # Frontend environment template
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── api/                 # Axios client & API request services
        ├── components/          # Reusable UI components (book, cart, auth, admin, common)
        ├── constants/           # Roles & route constants
        ├── context/             # AuthContext, CartContext, ToastContext
        ├── hooks/               # useAuth, useCart, useToast
        ├── layouts/             # StoreLayout, AuthLayout, AdminLayout
        ├── pages/               # Customer & Admin pages
        ├── routes/              # React Router config & ProtectedRoute
        ├── styles/              # Global design tokens & CSS resets
        ├── utils/               # Currency & date formatters
        ├── App.jsx
        └── main.jsx
```

---

## 🚀 Step-by-Step Setup Guide

### 1️⃣ Prerequisites
- **Node.js**: v18 or newer
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster URI
- **ImageKit Account**: (Free tier) For book cover image storage

---

### 2️⃣ Backend Configuration & Startup

1. Open a terminal and navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `Backend/` based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bookstore?retryWrites=true&w=majority
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your_super_secret_jwt_key_here
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key_here

   ADMIN_NAME=Admin User
   ADMIN_EMAIL=admin@booknest.com
   ADMIN_PASSWORD=adminpassword123
   ```

4. **Initialize the Admin Account**:
   Run the admin creation script to seed the single administrator in MongoDB:
   ```bash
   npm run create-admin
   ```
   *(Output: `Admin account created successfully`)*

5. **Start the Backend Server**:
   ```bash
   npm run dev
   # or
   npm start
   ```
   *(Backend starts on `http://localhost:5000`)*

---

### 3️⃣ Frontend Configuration & Startup

1. Open a second terminal and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `Frontend/` based on `.env.example`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   *(Frontend opens at `http://localhost:5173`)*

---

## 🔒 Security & Git Safety Checklist

Before committing or pushing to GitHub:

1. **Verify `.env` is ignored**:
   Ensure `.env` files are never tracked or committed.
2. **Verify `.gitignore`**:
   The root `.gitignore`, `Backend/.gitignore`, and `Frontend/.gitignore` protect:
   - `node_modules/`
   - `.env`, `.env.*` (while preserving `.env.example`)
   - `dist/`, `build/`
   - Log files
3. **No hardcoded credentials**:
   All tokens, secrets, MongoDB connection strings, and ImageKit keys are loaded exclusively from environment variables.
