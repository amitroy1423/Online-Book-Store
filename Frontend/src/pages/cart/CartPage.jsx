import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import EmptyState from '../../components/common/EmptyState';
import { ROUTES } from '../../constants/routes';
import './CartPages.css';

export default function CartPage() {
  const { items, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page container">
        <EmptyState
          icon="🛒"
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any books to your cart yet. Discover bestselling stories and add them to your cart!"
          actionLabel="Explore Books"
          actionLink={ROUTES.BOOKS}
        />
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <div className="page-header">
        <h1>Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h1>
        <p>Review the books in your cart before proceeding to checkout</p>
      </div>

      <div className="cart-layout-grid">
        <div className="cart-items-card card">
          <div className="cart-items-header">
            <h2>Cart Items</h2>
            <Link to={ROUTES.BOOKS} className="continue-shopping-link">
              + Add More Books
            </Link>
          </div>

          <div className="cart-items-list">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>
        </div>

        <div className="cart-sidebar">
          <CartSummary showCheckoutBtn={true} />
        </div>
      </div>
    </div>
  );
}
