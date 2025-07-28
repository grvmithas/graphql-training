import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import type { CreateCategoryInput } from '../../graphql/mutations';

const CreateCategory: React.FC = () => {
  const navigate = useNavigate();
  const { createCategory, createLoading } = useCategories();
  
  const [formData, setFormData] = useState<CreateCategoryInput>({
    name: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.name.trim()) {
      newErrors.push('Category name is required');
    }
    
    if (!formData.description.trim()) {
      newErrors.push('Category description is required');
    }
    
    if (formData.name.length > 255) {
      newErrors.push('Category name must be less than 255 characters');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await createCategory(formData);
      navigate('/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      setErrors(['Failed to create category. Please try again.']);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Create New Category</h1>
        
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={createLoading}
              maxLength={255}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={createLoading}
              rows={4}
            />
          </div>
          
          {errors.length > 0 && (
            <div className="error-message">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
          
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/categories')}
              className="cancel-button"
              disabled={createLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="submit-button"
            >
              {createLoading ? 'Creating Category...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory; 