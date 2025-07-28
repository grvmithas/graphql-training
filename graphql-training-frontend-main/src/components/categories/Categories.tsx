import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';

const Categories: React.FC = () => {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          Error loading categories: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="categories-header">
        <h1>Categories</h1>
        <Link to="/create-category" className="add-button">
          Add New Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="no-categories">
          <p>No categories found.</p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-info">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                <div className="category-products">
                  <strong>Products:</strong> {category.products?.length || 0}
                </div>
                {category.products && category.products.length > 0 && (
                  <div className="category-product-list">
                    <strong>Product List:</strong>
                    <ul>
                      {category.products.slice(0, 3).map(product => (
                        <li key={product.id}>
                          {product.name} - ${product.price.toFixed(2)}
                        </li>
                      ))}
                      {category.products.length > 3 && (
                        <li>... and {category.products.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories; 