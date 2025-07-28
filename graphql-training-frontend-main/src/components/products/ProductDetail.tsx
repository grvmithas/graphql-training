import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../providers/AuthProvider';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { product, loading, error } = useProduct(id || '');
  const { user } = useAuth();
  const { addToCart, addLoading } = useCart(user?.id || '');

  const handleAddToCart = async () => {
    if (!product || !user) return;
    
    try {
      await addToCart({
        productId: product.id,
        quantity: quantity
      });
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          Error loading product: {error.message}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="error-message">Product not found</div>
        <Link to="/" className="back-button">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="product-detail">
        <div className="product-detail-header">
          <Link to="/" className="back-button">← Back to Products</Link>
          <h1>{product.name}</h1>
        </div>

        <div className="product-detail-content">
          <div className="product-detail-image">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <div className="no-image">No image available</div>
            )}
          </div>

          <div className="product-detail-info">
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>
            
            <div className="product-meta">
              <div className="product-category">
                <strong>Category:</strong> {product.category.name}
              </div>
              <div className="product-price">
                <strong>Price:</strong> ${product.price.toFixed(2)}
              </div>
              <div className="product-stock">
                <strong>Stock:</strong> {product.stockQuantity} units
              </div>
            </div>

            {product.stockQuantity > 0 ? (
              <div className="add-to-cart-section">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.stockQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="quantity-input"
                  />
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={addLoading || quantity > product.stockQuantity}
                  className="add-to-cart-button"
                >
                  {addLoading ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>
            ) : (
              <div className="out-of-stock">
                <p>This product is currently out of stock</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 