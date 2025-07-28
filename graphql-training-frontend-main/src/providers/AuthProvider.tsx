import { useState, useEffect, createContext, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER, LOGIN_USER } from '../graphql/mutations';
import type { RegisterUserData, LoginUserData, RegisterUserVariables, LoginUserVariables } from '../graphql/mutations';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GraphQL mutations
  const [loginMutation, { loading: loginLoading }] = useMutation<LoginUserData, LoginUserVariables>(LOGIN_USER);
  const [registerMutation, { loading: registerLoading }] = useMutation<RegisterUserData, RegisterUserVariables>(REGISTER_USER);

  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { data } = await loginMutation({
        variables: {
          input: { email, password }
        }
      });

      if (data?.login) {
        const userData = data.login;
        setUser(userData);
        
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', userData.id); // Using user ID as token for demo
        
        // Clear any previous errors
        setError(null);
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setError(null);
      const { data } = await registerMutation({
        variables: {
          input: { firstName, lastName, email, password }
        }
      });

      if (data?.register) {
        const userData = data.register;
        setUser(userData);
        
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', userData.id); // Using user ID as token for demo
        
        // Clear any previous errors
        setError(null);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setError(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading: loading || loginLoading || registerLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 