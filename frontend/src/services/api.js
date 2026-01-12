// frontend/src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const compareService = {
  async compare(query) {
    try {
      const response = await api.post('/api/compare', { query });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || error.response.data.error);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Servidor no disponible');
    }
  }
};

export default api;