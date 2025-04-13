import axios from 'axios';
import CryptoJS from "crypto-js";
const api = axios.create({
  baseURL: 'https://dummyjson.com', // Points to Next.js API routes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const secretKey = process.env.SECRET_KEY!;
    const token = localStorage.getItem('token')!;
    CryptoJS.AES.decrypt(token, secretKey).toString(CryptoJS.enc.Utf8);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;