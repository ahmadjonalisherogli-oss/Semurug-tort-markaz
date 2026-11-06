import fs from 'fs';
import path from 'path';
import {
  DatabaseSchema,
  Product,
  Category,
  Order,
  CustomOrder,
  Review,
  User,
  ShopSettings,
  Inquiry,
  Faq,
  GalleryItem,
  CustomCakeConfig
} from '../src/types.js';
import { initialDatabase } from './seedData.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class Database {
  private data: DatabaseSchema;
  private isSaving = false;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          categories: parsed.categories || initialDatabase.categories,
          products: parsed.products || initialDatabase.products,
          reviews: parsed.reviews || initialDatabase.reviews,
          orders: parsed.orders || initialDatabase.orders,
          custom_orders: parsed.custom_orders || initialDatabase.custom_orders,
          users: parsed.users || initialDatabase.users,
          settings: parsed.settings || initialDatabase.settings,
          inquiries: parsed.inquiries || initialDatabase.inquiries,
          faqs: parsed.faqs || initialDatabase.faqs,
          gallery: parsed.gallery || initialDatabase.gallery,
          custom_options: parsed.custom_options || initialDatabase.custom_options,
        };
      }
    } catch (err) {
      console.error('Error loading db.json, falling back to seed data:', err);
    }

    this.saveDataDirect(initialDatabase);
    return JSON.parse(JSON.stringify(initialDatabase));
  }

  private saveDataDirect(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing db.json:', err);
    }
  }

  public save() {
    if (this.isSaving) return;
    this.isSaving = true;
    setTimeout(() => {
      this.saveDataDirect(this.data);
      this.isSaving = false;
    }, 100);
  }

  // Categories
  public getCategories(): Category[] {
    return this.data.categories.sort((a, b) => a.display_order - b.display_order);
  }

  public addCategory(cat: Omit<Category, 'id'>): Category {
    const newCat: Category = {
      id: `cat_${Date.now()}`,
      ...cat
    };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  // Products
  public getProducts(filter?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    featured?: boolean;
    availableOnly?: boolean;
  }): Product[] {
    let list = [...this.data.products];

    if (filter?.availableOnly) {
      list = list.filter(p => p.available);
    }

    if (filter?.category && filter.category !== 'all') {
      const catFilter = filter.category;
      list = list.filter(
        p => p.category_slug === catFilter || p.category.toLowerCase() === catFilter.toLowerCase()
      );
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        p => p.name.toLowerCase().includes(q) ||
             p.description.toLowerCase().includes(q) ||
             p.ingredients.some(i => i.toLowerCase().includes(q))
      );
    }

    if (filter?.minPrice !== undefined) {
      list = list.filter(p => p.price >= filter.minPrice!);
    }

    if (filter?.maxPrice !== undefined) {
      list = list.filter(p => p.price <= filter.maxPrice!);
    }

    if (filter?.featured) {
      list = list.filter(p => p.featured);
    }

    if (filter?.sort) {
      switch (filter.sort) {
        case 'price_asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
          list.sort((a, b) => b.sales_count - a.sales_count);
          break;
        case 'newest':
          list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
      }
    }

    return list;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id || p.slug === id);
  }

  public createProduct(item: Omit<Product, 'id' | 'created_at' | 'rating' | 'review_count' | 'sales_count'>): Product {
    const newProduct: Product = {
      ...item,
      id: `prod_${Date.now()}`,
      rating: 5.0,
      review_count: 0,
      sales_count: 0,
      created_at: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.save();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Orders
  public getOrders(userId?: string): Order[] {
    let list = [...this.data.orders];
    if (userId) {
      list = list.filter(o => o.user_id === userId);
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getOrderById(idOrNumber: string): Order | undefined {
    return this.data.orders.find(o => o.id === idOrNumber || o.order_number === idOrNumber);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'status'>): Order {
    const orderNumber = `SMR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      order_number: orderNumber,
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    this.data.orders.unshift(newOrder);

    // Increment sales count for ordered products
    for (const item of newOrder.items) {
      const p = this.data.products.find(prod => prod.id === item.product_id);
      if (p) {
        p.sales_count = (p.sales_count || 0) + item.quantity;
      }
    }

    this.save();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: Order['status']): Order | null {
    const order = this.data.orders.find(o => o.id === id || o.order_number === id);
    if (!order) return null;
    order.status = status;
    this.save();
    return order;
  }

  // Custom Orders
  public getCustomOrders(userId?: string): CustomOrder[] {
    let list = [...this.data.custom_orders];
    if (userId) {
      list = list.filter(o => o.user_id === userId);
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public createCustomOrder(data: Omit<CustomOrder, 'id' | 'order_number' | 'created_at' | 'status'>): CustomOrder {
    const orderNumber = `CST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCustomOrder: CustomOrder = {
      ...data,
      id: `cst_${Date.now()}`,
      order_number: orderNumber,
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    this.data.custom_orders.unshift(newCustomOrder);
    this.save();
    return newCustomOrder;
  }

  public updateCustomOrderStatus(id: string, status: CustomOrder['status']): CustomOrder | null {
    const order = this.data.custom_orders.find(o => o.id === id || o.order_number === id);
    if (!order) return null;
    order.status = status;
    this.save();
    return order;
  }

  // Reviews
  public getReviews(productId?: string): Review[] {
    let list = [...this.data.reviews];
    if (productId) {
      list = list.filter(r => r.product_id === productId);
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public createReview(data: Omit<Review, 'id' | 'created_at' | 'status'>): Review {
    const newReview: Review = {
      ...data,
      id: `rev_${Date.now()}`,
      status: 'Approved', // Auto-approved for realistic responsive experience, modifiable by admin
      created_at: new Date().toISOString()
    };
    this.data.reviews.unshift(newReview);

    // Recalculate product rating
    const prodReviews = this.data.reviews.filter(r => r.product_id === data.product_id && r.status === 'Approved');
    const p = this.data.products.find(prod => prod.id === data.product_id);
    if (p && prodReviews.length > 0) {
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      p.rating = Math.round(avg * 100) / 100;
      p.review_count = prodReviews.length;
    }

    this.save();
    return newReview;
  }

  public deleteReview(id: string): boolean {
    const initialLen = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter(r => r.id !== id);
    if (this.data.reviews.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Users & Auth
  public getUserByEmail(email: string): User | undefined {
    const normalized = email.toLowerCase().trim();
    return this.data.users.find(u => {
      const uEmail = u.email.toLowerCase();
      if (uEmail === normalized) return true;
      if (normalized === 'admin@semurug.uz' && u.role === 'admin') return true;
      return false;
    });
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(userData: Omit<User, 'id' | 'created_at'>): User {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const u = this.data.users.find(user => user.id === id);
    if (!u) return null;
    Object.assign(u, updates);
    this.save();
    return u;
  }

  public getUsers(): User[] {
    return this.data.users.map(({ password_hash, ...rest }) => ({ password_hash: '', ...rest }));
  }

  // Settings
  public getSettings(): ShopSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<ShopSettings>): ShopSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.save();
    return this.data.settings;
  }

  // Inquiries
  public getInquiries(): Inquiry[] {
    return (this.data.inquiries || []).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public createInquiry(data: Omit<Inquiry, 'id' | 'created_at' | 'status'>): Inquiry {
    const newInquiry: Inquiry = {
      ...data,
      id: `inq_${Date.now()}`,
      status: 'New',
      created_at: new Date().toISOString()
    };
    if (!this.data.inquiries) this.data.inquiries = [];
    this.data.inquiries.unshift(newInquiry);
    this.save();
    return newInquiry;
  }

  public updateInquiryStatus(id: string, status: Inquiry['status']): Inquiry | null {
    const item = (this.data.inquiries || []).find(i => i.id === id);
    if (!item) return null;
    item.status = status;
    this.save();
    return item;
  }

  public deleteInquiry(id: string): boolean {
    const initialLen = (this.data.inquiries || []).length;
    this.data.inquiries = (this.data.inquiries || []).filter(i => i.id !== id);
    if (this.data.inquiries.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // FAQs
  public getFaqs(): Faq[] {
    return (this.data.faqs || []).sort((a, b) => a.display_order - b.display_order);
  }

  public createFaq(data: Omit<Faq, 'id'>): Faq {
    const newFaq: Faq = {
      id: `faq_${Date.now()}`,
      ...data
    };
    if (!this.data.faqs) this.data.faqs = [];
    this.data.faqs.push(newFaq);
    this.save();
    return newFaq;
  }

  public updateFaq(id: string, updates: Partial<Faq>): Faq | null {
    const item = (this.data.faqs || []).find(f => f.id === id);
    if (!item) return null;
    Object.assign(item, updates);
    this.save();
    return item;
  }

  public deleteFaq(id: string): boolean {
    const initialLen = (this.data.faqs || []).length;
    this.data.faqs = (this.data.faqs || []).filter(f => f.id !== id);
    if (this.data.faqs.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Gallery
  public getGallery(): GalleryItem[] {
    return (this.data.gallery || []).sort((a, b) => a.display_order - b.display_order);
  }

  public createGalleryItem(data: Omit<GalleryItem, 'id'>): GalleryItem {
    const newItem: GalleryItem = {
      id: `gal_${Date.now()}`,
      ...data
    };
    if (!this.data.gallery) this.data.gallery = [];
    this.data.gallery.push(newItem);
    this.save();
    return newItem;
  }

  public deleteGalleryItem(id: string): boolean {
    const initialLen = (this.data.gallery || []).length;
    this.data.gallery = (this.data.gallery || []).filter(g => g.id !== id);
    if (this.data.gallery.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Custom Options
  public getCustomOptions(): CustomCakeConfig {
    return this.data.custom_options || initialDatabase.custom_options;
  }

  public updateCustomOptions(options: Partial<CustomCakeConfig>): CustomCakeConfig {
    this.data.custom_options = { ...(this.data.custom_options || initialDatabase.custom_options), ...options };
    this.save();
    return this.data.custom_options;
  }

  // Admin Dashboard Statistics
  public getAdminStats() {
    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
    const totalCustomers = this.data.users.filter(u => u.role === 'customer').length;
    const totalProducts = this.data.products.length;
    const pendingOrders = this.data.orders.filter(o => o.status === 'Pending').length +
                          this.data.custom_orders.filter(o => o.status === 'Pending').length;
    const totalInquiries = (this.data.inquiries || []).length;
    const unreadInquiries = (this.data.inquiries || []).filter(i => i.status === 'New').length;

    // Monthly sales calculation
    const monthlySalesMap: Record<string, number> = {};
    for (const order of this.data.orders) {
      if (order.status !== 'Cancelled') {
        const date = new Date(order.created_at);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        monthlySalesMap[monthKey] = (monthlySalesMap[monthKey] || 0) + order.total;
      }
    }

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      totalInquiries,
      unreadInquiries,
      monthlySales: monthlySalesMap,
      recentOrders: this.data.orders.slice(0, 5),
      recentCustomOrders: this.data.custom_orders.slice(0, 5),
      recentInquiries: (this.data.inquiries || []).slice(0, 5)
    };
  }
}

export const db = new Database();
