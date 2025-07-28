import { useAuth } from '../providers/AuthProvider';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="nav-link">
            GraphQL Training
          </Link>
        </div>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Products
          </Link>
          <Link to="/categories" className="nav-link">
            Categories
          </Link>
          <Link to="/cart" className="nav-link">
            Cart
          </Link>
          <Link to="/create-product" className="nav-link">
            Add Product
          </Link>
          <Link to="/create-category" className="nav-link">
            Add Category
          </Link>
        </div>
        
        <div className="nav-user">
          {user && (
            <div className="user-info">
              <span className="user-name">
                Welcome, {user.firstName} {user.lastName}
              </span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 