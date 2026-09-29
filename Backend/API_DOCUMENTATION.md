# Online Bookstore — API Documentation

## 1. Overview

This document describes the REST API for the **Online Bookstore** backend.

The backend supports:

- Customer registration and authentication
- Single pre-created admin authentication
- Public book browsing and book details
- Admin book CRUD
- Admin book-cover image upload through ImageKit
- Customer cash-on-delivery order placement
- Customer order history and order details
- Admin order management and status updates
- Admin dashboard statistics

### Base URL

```text
http://localhost:5000
```

All API routes use the `/api` prefix.

### Authentication

Authentication uses a JWT stored in an **HTTP-only cookie** named `token`.

For protected requests, the authenticated cookie must be sent with the request.

The backend also supports a Bearer token in the `Authorization` header where applicable:

```http
Authorization: Bearer <token>
```

### Roles

| Role | Description |
|---|---|
| `customer` | Normal bookstore user who can browse books and manage their own orders |
| `admin` | Single internally-created administrator who manages books and orders |

> There is **no public admin registration endpoint**. The admin account is created internally using the backend admin-creation script and can only log in.

---

# 2. Authentication APIs

These APIs handle registration, login, session restoration, and logout.

## 2.1 Customer Registration

### Endpoint

```http
POST /api/auth/register
```

### Access

Public

### Feature

Customer account registration.

### Description

Creates a new customer account. Public registration always creates a user with the `customer` role. The client cannot create an admin account through this endpoint.

### Request Body

```json
{
  "name": "Rahul Das",
  "email": "rahul@gmail.com",
  "password": "password123"
}
```

### Response — Success

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "USER_ID",
    "name": "Rahul Das",
    "email": "rahul@gmail.com",
    "role": "customer"
  }
}
```

### Common Errors

- `400` — Name, email, or password is missing
- `409` — Email already exists
- `500` — Internal server error

---

## 2.2 Login

### Endpoint

```http
POST /api/auth/login
```

### Access

Public

### Feature

Customer and admin login.

### Description

Authenticates a user using email and password. On successful login, the backend creates a JWT and stores it in the HTTP-only `token` cookie.

### Request Body

```json
{
  "email": "rahul@gmail.com",
  "password": "password123"
}
```

### Response — Success

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "USER_ID",
    "name": "Rahul Das",
    "email": "rahul@gmail.com",
    "role": "customer"
  }
}
```

### Common Errors

- `400` — Email or password is missing
- `401` — Invalid email or password
- `500` — Internal server error

---

## 2.3 Get Current User

### Endpoint

```http
GET /api/auth/me
```

### Access

Authenticated user

### Feature

Session restoration and current-user information.

### Description

Returns the currently authenticated user's account information. The frontend can call this when the application starts to restore the user's session from the HTTP-only authentication cookie.

### Request Body

None.

### Response — Success

```json
{
  "success": true,
  "data": {
    "_id": "USER_ID",
    "name": "Rahul Das",
    "email": "rahul@gmail.com",
    "role": "customer",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Common Errors

- `401` — Authentication required / invalid or expired token
- `404` — User not found

---

## 2.4 Logout

### Endpoint

```http
POST /api/auth/logout
```

### Access

Public route; normally called by an authenticated user

### Feature

Logout and authentication-cookie removal.

### Description

Clears the authentication cookie on the client by clearing the backend `token` cookie.

### Request Body

None.

### Response — Success

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

# 3. Book APIs

These APIs provide public bookstore browsing and admin book management.

## 3.1 Get All Books

### Endpoint

```http
GET /api/books
```

### Access

Public

### Feature

Browse books / bookstore catalog.

### Description

Returns all books sorted by newest creation first.

### Request Body

None.

### Response — Success

```json
{
  "success": true,
  "data": [
    {
      "_id": "BOOK_ID",
      "title": "The Alchemist",
      "author": "Paulo Coelho",
      "description": "A young shepherd follows his dream.",
      "price": 399,
      "image": "https://ik.imagekit.io/...",
      "category": "Fiction",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## 3.2 Get Book by ID

### Endpoint

```http
GET /api/books/:id
```

### Access

Public

### Feature

View book details.

### Path Parameter

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | MongoDB ID of the book |

### Response — Success

```json
{
  "success": true,
  "data": {
    "_id": "BOOK_ID",
    "title": "The Alchemist",
    "author": "Paulo Coelho",
    "description": "A young shepherd follows his dream.",
    "price": 399,
    "image": "https://ik.imagekit.io/...",
    "category": "Fiction"
  }
}
```

### Common Errors

- `400` — Invalid book ID
- `404` — Book not found

---

# 4. Admin Book Management APIs

All routes in this section require:

```text
Authenticated user + admin role
```

## 4.1 Create Book

### Endpoint

```http
POST /api/admin/books
```

### Access

Admin only

### Feature

Admin book creation.

### Content Type

```http
multipart/form-data
```

### Form Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `title` | String | Yes | Book title |
| `author` | String | Yes | Book author |
| `description` | String | No | Book description |
| `price` | Number | Yes | Book price; must be 0 or greater |
| `category` | String | No | Book category |
| `image` | File | No | Book cover image |

### Supported Image Types

- JPEG
- PNG
- WebP

### Maximum Image Size

```text
5 MB
```

### Example Form Data

```text
 title       = The Alchemist
 author      = Paulo Coelho
 description = A young shepherd follows his dream.
 price       = 399
 category    = Fiction
 image       = <selected image file>
```

### Description

Creates a new book. When an image is supplied, the backend uploads it to ImageKit and stores the returned ImageKit URL in the book's `image` field.

### Response — Success

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "BOOK_ID",
    "title": "The Alchemist",
    "author": "Paulo Coelho",
    "description": "A young shepherd follows his dream.",
    "price": 399,
    "image": "https://ik.imagekit.io/...",
    "category": "Fiction",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Common Errors

- `400` — Required field missing or invalid price
- `401` — Authentication required
- `403` — Admin access required
- `500` — Internal server error / image upload failure

---

## 4.2 Update Book

### Endpoint

```http
PATCH /api/admin/books/:id
```

### Access

Admin only

### Feature

Edit book information and optionally replace the book cover image.

### Content Type

```http
multipart/form-data
```

### Path Parameter

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | MongoDB ID of the book |

### Optional Form Fields

| Field | Type | Description |
|---|---|---|
| `title` | String | Updated title |
| `author` | String | Updated author |
| `description` | String | Updated description |
| `price` | Number | Updated price |
| `category` | String | Updated category |
| `image` | File | Replacement book cover |

### Description

Updates only the fields supplied in the request. If a new image is uploaded, its ImageKit URL replaces the existing `image` value.

### Response — Success

```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "BOOK_ID",
    "title": "The Alchemist",
    "author": "Paulo Coelho",
    "price": 449,
    "image": "https://ik.imagekit.io/...",
    "category": "Fiction"
  }
}
```

### Common Errors

- `400` — Invalid book ID or negative price
- `401` — Authentication required
- `403` — Admin access required
- `404` — Book not found

---

## 4.3 Delete Book

### Endpoint

```http
DELETE /api/admin/books/:id
```

### Access

Admin only

### Feature

Remove a book from the bookstore catalog.

### Path Parameter

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | MongoDB ID of the book |

### Response — Success

```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

### Common Errors

- `400` — Invalid book ID
- `401` — Authentication required
- `403` — Admin access required
- `404` — Book not found

> Note: The current basic implementation does not include a stock/inventory system or a special delete-protection rule for previously ordered books.

---

# 5. Customer Order APIs — Cash on Delivery

The bookstore uses **Cash on Delivery (COD) only**.

There is no Stripe or online payment integration in this project.

The cart itself is planned as frontend state/local storage and is converted into an order through the create-order API.

## 5.1 Create Order

### Endpoint

```http
POST /api/orders
```

### Access

Authenticated customer only

### Feature

Checkout and place a cash-on-delivery order.

### Request Body

```json
{
  "items": [
    {
      "book": "BOOK_ID",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullName": "Rahul Das",
    "phone": "9876543210",
    "address": "123 Main Street",
    "city": "Kolkata",
    "state": "West Bengal",
    "pincode": "700001"
  }
}
```

### Important Pricing Rule

The client sends only the book ID and quantity for each item.

The backend fetches the actual books from MongoDB and calculates the total using the current database prices. The backend does **not** trust a client-supplied price or total amount.

### Order Item Snapshot

When the order is created, the backend stores:

- book reference
- book title at purchase time
- book price at purchase time
- quantity

This preserves the historical order information even if a book's price changes later.

### Payment Method

The order is automatically saved with:

```json
{
  "paymentMethod": "cash_on_delivery"
}
```

### Initial Order Status

```text
pending
```

### Response — Success

```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "ORDER_ID",
    "user": {
      "_id": "USER_ID",
      "name": "Rahul Das",
      "email": "rahul@gmail.com"
    },
    "items": [
      {
        "book": "BOOK_ID",
        "title": "The Alchemist",
        "price": 399,
        "quantity": 2
      }
    ],
    "totalAmount": 798,
    "shippingAddress": {
      "fullName": "Rahul Das",
      "phone": "9876543210",
      "address": "123 Main Street",
      "city": "Kolkata",
      "state": "West Bengal",
      "pincode": "700001"
    },
    "status": "pending",
    "paymentMethod": "cash_on_delivery"
  }
}
```

### Common Errors

- `400` — Empty order, missing shipping information, invalid book ID, or invalid quantity
- `401` — Authentication required
- `403` — Customer access required
- `404` — One or more books not found

---

## 5.2 Get My Orders

### Endpoint

```http
GET /api/orders/my-orders
```

### Access

Authenticated customer only

### Feature

Customer order history.

### Description

Returns only the orders belonging to the currently authenticated customer, sorted newest first.

### Response — Success

```json
{
  "success": true,
  "data": [
    {
      "_id": "ORDER_ID",
      "totalAmount": 798,
      "status": "pending",
      "paymentMethod": "cash_on_delivery",
      "items": [
        {
          "book": {
            "_id": "BOOK_ID",
            "title": "The Alchemist",
            "author": "Paulo Coelho",
            "image": "https://ik.imagekit.io/..."
          },
          "title": "The Alchemist",
          "price": 399,
          "quantity": 2
        }
      ],
      "createdAt": "..."
    }
  ]
}
```

---

## 5.3 Get My Order by ID

### Endpoint

```http
GET /api/orders/:id
```

### Access

Authenticated customer only

### Feature

View a single order's complete details.

### Path Parameter

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | MongoDB ID of the order |

### Description

Returns the requested order only when it belongs to the currently authenticated customer.

### Response — Success

```json
{
  "success": true,
  "data": {
    "_id": "ORDER_ID",
    "user": {
      "_id": "USER_ID",
      "name": "Rahul Das",
      "email": "rahul@gmail.com"
    },
    "items": [
      {
        "book": {
          "_id": "BOOK_ID",
          "title": "The Alchemist",
          "author": "Paulo Coelho",
          "image": "https://ik.imagekit.io/..."
        },
        "title": "The Alchemist",
        "price": 399,
        "quantity": 2
      }
    ],
    "totalAmount": 798,
    "shippingAddress": {
      "fullName": "Rahul Das",
      "phone": "9876543210",
      "address": "123 Main Street",
      "city": "Kolkata",
      "state": "West Bengal",
      "pincode": "700001"
    },
    "status": "pending",
    "paymentMethod": "cash_on_delivery"
  }
}
```

### Common Errors

- `400` — Invalid order ID
- `401` — Authentication required
- `403` — Customer access required
- `404` — Order not found or does not belong to the current customer

---

# 6. Admin Dashboard API

## 6.1 Get Dashboard Statistics

### Endpoint

```http
GET /api/admin/dashboard
```

### Access

Admin only

### Feature

Admin dashboard summary.

### Description

Returns basic bookstore statistics used by the admin dashboard.

### Response — Success

```json
{
  "success": true,
  "data": {
    "totalBooks": 10,
    "totalOrders": 25,
    "totalCustomers": 18,
    "pendingOrders": 4
  }
}
```

### Metrics

| Metric | Description |
|---|---|
| `totalBooks` | Total number of books in the database |
| `totalOrders` | Total number of orders |
| `totalCustomers` | Total users whose role is `customer` |
| `pendingOrders` | Total orders currently in `pending` status |

---

# 7. Admin Order Management APIs

These APIs are available only to the single admin.

## 7.1 Get All Orders

### Endpoint

```http
GET /api/admin/orders
```

### Access

Admin only

### Feature

Admin order management / view all customer orders.

### Description

Returns all orders, newest first, including customer information and book information.

### Response — Success

```json
{
  "success": true,
  "data": [
    {
      "_id": "ORDER_ID",
      "user": {
        "_id": "USER_ID",
        "name": "Rahul Das",
        "email": "rahul@gmail.com"
      },
      "items": [
        {
          "book": {
            "_id": "BOOK_ID",
            "title": "The Alchemist",
            "author": "Paulo Coelho",
            "image": "https://ik.imagekit.io/..."
          },
          "title": "The Alchemist",
          "price": 399,
          "quantity": 2
        }
      ],
      "totalAmount": 798,
      "status": "pending",
      "paymentMethod": "cash_on_delivery",
      "createdAt": "..."
    }
  ]
}
```

### Common Errors

- `401` — Authentication required
- `403` — Admin access required

---

## 7.2 Update Order Status

### Endpoint

```http
PATCH /api/admin/orders/:id/status
```

### Access

Admin only

### Feature

Admin order-status management.

### Path Parameter

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | MongoDB ID of the order |

### Request Body

```json
{
  "status": "confirmed"
}
```

### Allowed Status Values

```text
pending
confirmed
shipped
delivered
cancelled
```

### Typical Status Flow

```text
pending
   ↓
confirmed
   ↓
shipped
   ↓
delivered
```

An order can also be changed to:

```text
cancelled
```

according to the admin's order-management workflow.

### Response — Success

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "ORDER_ID",
    "status": "confirmed"
  }
}
```

### Common Errors

- `400` — Invalid order ID or invalid status
- `401` — Authentication required
- `403` — Admin access required
- `404` — Order not found

---

# 8. Complete API Summary

## Public APIs

| Method | Route | Feature |
|---|---|---|
| `POST` | `/api/auth/register` | Customer registration |
| `POST` | `/api/auth/login` | Customer/admin login |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/books` | Browse books |
| `GET` | `/api/books/:id` | View book details |

## Authenticated Customer APIs

| Method | Route | Feature |
|---|---|---|
| `GET` | `/api/auth/me` | Current authenticated user |
| `POST` | `/api/orders` | Place COD order |
| `GET` | `/api/orders/my-orders` | View own order history |
| `GET` | `/api/orders/:id` | View own order details |

## Admin APIs

| Method | Route | Feature |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Admin dashboard statistics |
| `POST` | `/api/admin/books` | Create book + ImageKit upload |
| `PATCH` | `/api/admin/books/:id` | Update book + optional image replacement |
| `DELETE` | `/api/admin/books/:id` | Delete book |
| `GET` | `/api/admin/orders` | View all orders |
| `PATCH` | `/api/admin/orders/:id/status` | Update order status |

---

# 9. Authorization Matrix

| API | Guest | Customer | Admin |
|---|:---:|:---:|:---:|
| `POST /api/auth/register` | ✅ | ✅ | ✅* |
| `POST /api/auth/login` | ✅ | ✅ | ✅ |
| `GET /api/auth/me` | ❌ | ✅ | ✅ |
| `POST /api/auth/logout` | ✅ | ✅ | ✅ |
| `GET /api/books` | ✅ | ✅ | ✅ |
| `GET /api/books/:id` | ✅ | ✅ | ✅ |
| `POST /api/orders` | ❌ | ✅ | ❌ |
| `GET /api/orders/my-orders` | ❌ | ✅ | ❌ |
| `GET /api/orders/:id` | ❌ | ✅ | ❌ |
| `GET /api/admin/dashboard` | ❌ | ❌ | ✅ |
| `POST /api/admin/books` | ❌ | ❌ | ✅ |
| `PATCH /api/admin/books/:id` | ❌ | ❌ | ✅ |
| `DELETE /api/admin/books/:id` | ❌ | ❌ | ✅ |
| `GET /api/admin/orders` | ❌ | ❌ | ✅ |
| `PATCH /api/admin/orders/:id/status` | ❌ | ❌ | ✅ |

\* The registration endpoint is public but **always creates a `customer` role**. It is not an admin-registration endpoint.

---

# 10. Error Response Format

The backend uses a common error-handler middleware for application and database errors.

Typical error response:

```json
{
  "success": false,
  "message": "Error message"
}
```

Validation errors may also return:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Validation message 1",
    "Validation message 2"
  ]
}
```

Common HTTP status codes used by the API:

| Status | Meaning |
|---|---|
| `200` | Request successful |
| `201` | Resource created successfully |
| `400` | Bad request / validation / invalid ID |
| `401` | Authentication required or invalid credentials |
| `403` | Authenticated but not authorized for the role |
| `404` | Resource not found |
| `409` | Duplicate/conflicting resource |
| `500` | Internal server error |

---

# 11. Main Application Flow

## Customer Flow

```text
Register
   ↓
Login
   ↓
Browse Books
   ↓
View Book Details
   ↓
Add Books to Cart (Frontend)
   ↓
Checkout
   ↓
POST /api/orders
   ↓
Cash on Delivery Order Created
   ↓
View My Orders
```

## Admin Flow

```text
Admin Account Created Internally
   ↓
Admin Login
   ↓
Dashboard
   ├── Manage Books
   │    ├── Create
   │    ├── Update
   │    ├── Delete
   │    └── ImageKit Upload
   │
   └── Manage Orders
        ├── View All Orders
        └── Update Status
```

---

# 12. Project Scope Notes

The current project intentionally keeps the bookstore basic.

Included:

- Customer authentication
- Single admin login
- Book browsing
- Book details
- Frontend cart
- Checkout
- Cash on Delivery
- Order history
- Admin dashboard
- Book CRUD
- ImageKit book-cover upload
- Admin order management

Not included:

- Online payment gateway
- Stripe
- Wishlist
- Reviews/ratings
- Coupons/discount engine
- Inventory/stock management
- Email notifications
- Password reset
- Social login
- Multiple admin roles
- Advanced analytics

---

# 13. API Testing Order

For a clean Postman test, use this order:

```text
1. Customer Registration
2. Customer Login
3. GET /api/auth/me
4. Admin Login
5. Create Book
6. Get All Books
7. Get Book by ID
8. Update Book
9. Customer creates COD Order
10. Customer gets My Orders
11. Customer gets Order by ID
12. Admin gets Dashboard
13. Admin gets All Orders
14. Admin updates Order Status
15. Logout
```

This sequence covers the complete backend functionality required for the Online Bookstore project.
