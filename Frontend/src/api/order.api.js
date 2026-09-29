import API from './axios';

export const createOrder = (data) => API.post('/api/orders', data);

export const getMyOrders = () => API.get('/api/orders/my-orders');

export const getOrderById = (id) => API.get(`/api/orders/${id}`);
