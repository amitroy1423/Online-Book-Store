import API from './axios';

export const getAllBooks = () => API.get('/api/books');

export const getBookById = (id) => API.get(`/api/books/${id}`);
