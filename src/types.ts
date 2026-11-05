export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  category_slug: string;
  price: number;
  weight_grams: number;
  available: boolean;
  pre_order_available: boolean;
  preparation_time_hours: number;
  featured: boolean;
  best_seller: boolean;
  is_new: boolean;
  images: string[];
  ingredients: string[];
  sizes: { label: string; weight_grams: number; price: number }[];
  rating: number;
  review_count: number;
  sales_count: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  display_order: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  is_verified_purchase: boolean;
  status: 'Approved' | 'Pending';
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  size_label: string;
  weight_grams: number;
  image: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_date: string;
  delivery_time: string;
  order_notes?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_cost: number;
  total: number;
  payment_method: 'cash_on_delivery' | 'card_on_delivery' | 'online_card';
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Delivering' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface CustomOrder {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  cake_type: string;
  weight_kg: number;
  flavor: string;
  cream: string;
  decoration: string;
  personalized_message?: string;
  reference_image?: string;
  delivery_date: string;
  delivery_time: string;
  estimated_price: number;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone: string;
  role: 'admin' | 'customer';
  address?: string;
  created_at: string;
}

export interface ShopSettings {
  shop_name: string;
  phone: string;
  email: string;
  telegram_url: string;
  instagram_url: string;
  address: string;
  working_hours: string;
  delivery_fee: number;
  free_delivery_threshold: number;
  banner_text: string;
  banner_active: boolean;
  telegram_bot_enabled: boolean;
}

export interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  reviews: Review[];
  orders: Order[];
  custom_orders: CustomOrder[];
  users: User[];
  settings: ShopSettings;
}
