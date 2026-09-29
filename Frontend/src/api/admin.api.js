import API from './axios';

// Dashboard
export const getDashboard = () => API.get('/api/admin/dashboard');

// Books
export const createBook = (formData) =>
  API.post('/api/admin/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateBook = (id, formData) =>
  API.patch(`/api/admin/books/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteBook = (id) => API.delete(`/api/admin/books/${id}`);

// Orders
export const getAllOrders = () => API.get('/api/admin/orders');

export const updateOrderStatus = (id, status) =>
  API.patch(`/api/admin/orders/${id}/status`, { status });
