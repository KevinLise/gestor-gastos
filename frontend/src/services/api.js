// =============================================
// services/api.js — Cliente HTTP centralizado
// =============================================
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Interceptor: loguear errores globalmente
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'Error de red';
    console.error('[API Error]', msg);
    return Promise.reject(new Error(msg));
  }
);

// ─── Gastos ───────────────────────────────────
export const gastosService = {
  getAll: (params = {}) => api.get('/gastos', { params }),
  getOne: (id) => api.get(`/gastos/${id}`),
  create: (data) => api.post('/gastos', data),
  update: (id, data) => api.put(`/gastos/${id}`, data),
  delete: (id) => api.delete(`/gastos/${id}`),
  getStats: () => api.get('/gastos/stats'),
};

// ─── Moneda ───────────────────────────────────
export const currencyService = {
  getRates: () => api.get('/currency/rates'),
  convert: (monto) => api.get('/currency/convert', { params: { monto } }),
};

export default api;
