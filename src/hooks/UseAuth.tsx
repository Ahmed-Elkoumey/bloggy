/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { decryptData,encryptData } from '@/utils/crypto';
import api from '@/services/api';

interface User {
  username: string;
  [key: string]: any;
}

interface LoginResponse {
  success: boolean;
  error?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decryptedToken = decryptData(token);
          const payload = JSON.parse(atob(decryptedToken.split('.')[1]));
          setUser(payload);
        } catch (error) {
          console.error('Token validation failed:', error);
          logout();
        }
      }
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const login = async (credentials: { username: string; password: string }): Promise<LoginResponse> => {
    try {
      const response = await api.post('auth/login', credentials);
      const { accessToken, refreshToken } = response.data;
      
      localStorage.setItem('accessToken', encryptData(accessToken));
      localStorage.setItem('refreshToken', encryptData(refreshToken));
      
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      setUser(payload);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    window.location.href = '/login';
  };

  return { user, login, logout };
};