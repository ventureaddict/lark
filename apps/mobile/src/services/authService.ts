import axios from 'axios';

const BASE_URL = 'http://localhost:3001'; // Change for production

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    preferences?: any;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(email: string, password: string, name: string): Promise<LoginResponse> {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
};