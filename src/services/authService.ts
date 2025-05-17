import api from '../config/axios';
import { AuthResponse } from '../types';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const signup = async (
  email: string, 
  password: string, 
  role: 'admin' | 'candidate'
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signup', { email, password, role });
  return response.data;
};