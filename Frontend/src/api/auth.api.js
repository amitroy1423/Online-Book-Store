import API from './axios';

export const registerUser = (data) => API.post('/api/auth/register', data);

export const loginUser = (data) => API.post('/api/auth/login', data);

export const getCurrentUser = () => API.get('/api/auth/me');

export const logoutUser = () => API.post('/api/auth/logout');
