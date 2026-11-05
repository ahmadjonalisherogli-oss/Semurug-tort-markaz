import { Product, Category, Order, CustomOrder, Review, User, ShopSettings } from '../types.js';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('semurug_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('semurug_token', token);
  } else {
    localStorage.removeItem('semurug_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    featured?: boolean;
    availableOnly?: boolean;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
    if (params?.sort) query.set('sort', params.sort);
    if (params?.featured) query.set('featured', 'true');
    if (params?.availableOnly) query.set('availableOnly', 'true');

    const qs = query.toString();
    return request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
  },

  async getProductById(id: string): Promise<Product> {
    return request<Product>(`/products/${id}`);
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    return request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return request<Category[]>('/categories');
  },

  // Orders
  async createOrder(orderData: any): Promise<Order> {
    return request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async getOrders(): Promise<Order[]> {
    return request<Order[]>('/orders');
  },

  async getOrderById(id: string): Promise<Order> {
    return request<Order>(`/orders/${id}`);
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    return request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Custom Orders
  async createCustomOrder(data: any): Promise<CustomOrder> {
    return request<CustomOrder>('/custom-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCustomOrders(): Promise<CustomOrder[]> {
    return request<CustomOrder[]>('/custom-orders');
  },

  async updateCustomOrderStatus(id: string, status: CustomOrder['status']): Promise<CustomOrder> {
    return request<CustomOrder>(`/custom-orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Reviews
  async getReviews(productId?: string): Promise<Review[]> {
    return request<Review[]>(`/reviews${productId ? `?product_id=${productId}` : ''}`);
  },

  async createReview(data: { product_id: string; user_name: string; rating: number; comment: string }): Promise<Review> {
    return request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteReview(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  // Auth
  async login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setAuthToken(res.token);
    return res;
  },

  async register(data: { email: string; password: string; full_name: string; phone?: string; address?: string }): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: User }> {
    return request<{ user: User }>('/auth/me');
  },

  async updateProfile(data: { full_name: string; phone?: string; address?: string }): Promise<{ user: User }> {
    return request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Image Upload
  async uploadImage(base64: string): Promise<{ url: string }> {
    return request<{ url: string }>('/upload', {
      method: 'POST',
      body: JSON.stringify({ imageBase64: base64 }),
    });
  },

  // Admin & Settings
  async getAdminStats(): Promise<any> {
    return request<any>('/admin/stats');
  },

  async getAdminCustomers(): Promise<User[]> {
    return request<User[]>('/admin/customers');
  },

  async getSettings(): Promise<ShopSettings> {
    return request<ShopSettings>('/settings');
  },

  async updateSettings(settings: Partial<ShopSettings>): Promise<ShopSettings> {
    return request<ShopSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};
