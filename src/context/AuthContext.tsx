import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '../config/axios';
import { User, AuthContextType, AuthResponse } from '../types';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for token
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      // Decode token to get user info (in a real app you might want to validate the token)
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userData: User = {
        _id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/candidate');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: 'admin' | 'candidate'): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/auth/signup', { email, password, role });
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      // Decode token to get user info
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userData: User = {
        _id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/candidate');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;