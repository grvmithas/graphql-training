import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../providers/AuthProvider';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { user } = useAuth();
  const { cart, loading, error, removeFromCart, removeLoading } = useCart(user?.id || '');

  const handleRemoveFromCart = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item from cart');
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          Error loading cart: {error.message}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h1>Your Cart</h1>
          <p>Your cart is empty.</p>
          <Link to="/" className="continue-shopping-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-container">
        <h1>Your Cart</h1>
        
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {item.product.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.name} />
                ) : (
                  <div className="no-image">No image</div>
                )}
              </div>
              
              <div className="cart-item-info">
                <h3 className="cart-item-name">
                  <Link to={`/products/${item.product.id}`}>
                    {item.product.name}
                  </Link>
                </h3>
                <p className="cart-item-description">
                  {item.product.description}
                </p>
                <div className="cart-item-category">
                  Category: {item.product.category.name}
                </div>
                <div className="cart-item-price">
                  ${item.product.price.toFixed(2)} each
                </div>
                <div className="cart-item-quantity">
                  Quantity: {item.quantity}
                </div>
                <div className="cart-item-total">
                  Total: ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
              
              <div className="cart-item-actions">
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  disabled={removeLoading}
                  className="remove-item-button"
                >
                  {removeLoading ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <div className="cart-total">
            <h3>Cart Total: ${calculateTotal().toFixed(2)}</h3>
          </div>
          
          <div className="cart-actions">
            <Link to="/" className="continue-shopping-button">
              Continue Shopping
            </Link>
            <button className="checkout-button" disabled>
              Checkout (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 