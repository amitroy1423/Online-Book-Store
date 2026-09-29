import { Route } from 'react-router-dom';
import HomePage from '../pages/shop/HomePage';
import BooksPage from '../pages/shop/BooksPage';
import BookDetailPage from '../pages/shop/BookDetailPage';
import { ROUTES } from '../constants/routes';

export const ShopRoutes = () => (
  <>
    <Route index element={<HomePage />} />
    <Route path={ROUTES.BOOKS} element={<BooksPage />} />
    <Route path={ROUTES.BOOK_DETAILS} element={<BookDetailPage />} />
  </>
);
