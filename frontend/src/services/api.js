import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  addAddress: (data) => api.post('/auth/addresses', data),
  updateAddress: (id, data) => api.put(`/auth/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
  getUsers: (params) => api.get('/auth/users', { params }),
  getUser: (id) => api.get(`/auth/users/${id}`),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getBestSellers: () => api.get('/products/best-sellers'),
  getRelated: (id) => api.get(`/products/${id}/related`),
  getAdmin: (params) => api.get('/products/admin/all', { params }),
  getStockAlerts: () => api.get('/products/admin/stock-alerts'),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
  removeImage: (id, imageUrl) => api.delete(`/products/${id}/image`, { data: { imageUrl } }),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getAdmin: () => api.get('/categories/admin/all'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity) => api.post('/cart/add', { productId, quantity }),
  update: (itemId, quantity) => api.put(`/cart/item/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/item/${itemId}`),
  clear: () => api.delete('/cart/clear'),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
  removeCoupon: () => api.delete('/cart/coupon'),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMy: () => api.get('/orders/my'),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get('/orders/admin/all', { params }),
  update: (id, data) => api.put(`/orders/${id}`, data),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  createStripeIntent: () => api.post('/orders/stripe/intent'),
};

export const reviewAPI = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  create: (productId, data) => api.post(`/reviews/product/${productId}`, data),
  getAll: (params) => api.get('/reviews/admin/all', { params }),
  approve: (id) => api.put(`/reviews/${id}/approve`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const couponAPI = {
  validate: (code) => api.get(`/coupons/validate/${code}`),
  getAll: () => api.get('/coupons'),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  toggle: (productId) => api.put(`/wishlist/toggle/${productId}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: () => api.get('/admin/analytics'),
};

export const contentAPI = {
  getSettings: () => api.get('/content/settings'),
  updateSettings: (data) => api.put('/content/settings', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getBanners: () => api.get('/content/banners'),
  createBanner: (data) => api.post('/content/banners', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBanner: (id, data) => api.put(`/content/banners/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteBanner: (id) => api.delete(`/content/banners/${id}`),
  getTestimonials: () => api.get('/content/testimonials'),
  createTestimonial: (data) => api.post('/content/testimonials', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateTestimonial: (id, data) => api.put(`/content/testimonials/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteTestimonial: (id) => api.delete(`/content/testimonials/${id}`),
  subscribeNewsletter: (email) => api.post('/content/newsletter', { email }),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export default api;
