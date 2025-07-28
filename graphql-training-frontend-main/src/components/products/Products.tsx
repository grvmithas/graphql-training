import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { products, loading, error } = useProducts();
  const { categories } = useCategories();

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category.id === selectedCategory);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          Error loading products: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="products-header">
        <h1>Products</h1>
        <Link to="/create-product" className="add-button">
          Add New Product
        </Link>
      </div>

      <div className="filter-section">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              {product.imageUrl && (
                <div className="product-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
              )}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-category">
                  Category: {product.category.name}
                </div>
                <div className="product-price">
                  ${product.price.toFixed(2)}
                </div>
                <div className="product-stock">
                  Stock: {product.stockQuantity}
                </div>
                <Link 
                  to={`/products/${product.id}`} 
                  className="view-product-button"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products; 