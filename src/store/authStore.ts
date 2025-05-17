import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { apiUrl } from '../config/constants';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'candidate';
}

interface DecodedToken {
  id: string;
  email: string;
  role: 'admin' | 'candidate';
  exp: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  register: (email: string, password: string, role?: 'admin' | 'candidate') => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  
  register: async (email, password, role = 'candidate') => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${apiUrl}/auth/signup`, {
        email,
        password,
        role,
      });
      
      const { token } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        const decoded = jwtDecode<DecodedToken>(token);
        
        set({
          token,
          user: {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
          },
          isAuthenticated: true,
          loading: false,
        });
        
        toast.success('Registration successful');
        return true;
      }
      
      set({ loading: false });
      return false;
    } catch (error) {
      let message = 'Registration failed';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },
  
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });
      
      const { token } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        const decoded = jwtDecode<DecodedToken>(token);
        
        set({
          token,
          user: {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
          },
          isAuthenticated: true,
          loading: false,
        });
        
        toast.success('Login successful');
        return true;
      }
      
      set({ loading: false });
      return false;
    } catch (error) {
      let message = 'Login failed';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
    toast.info('Logged out successfully');
  },
  
  checkAuth: () => {
    const { token } = get();
    
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return false;
    }
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        // Token expired
        localStorage.removeItem('token');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
        return false;
      }
      
      // Token valid
      set({
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        },
        isAuthenticated: true,
      });
      
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
      return false;
    }
  },
}));