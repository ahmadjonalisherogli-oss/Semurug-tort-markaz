import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Sparkles,
  Users,
  Star,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api.js';
import { Product, Order, CustomOrder, Review, User, ShopSettings } from '../types.js';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onProductsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'custom' | 'products' | 'reviews' | 'settings'>('overview');
  
  // Data states
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(false);

  // Order Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Product Edit / New Modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [s, o, c, p, r, cust, sett] = await Promise.all([
        api.getAdminStats(),
        api.getOrders(),
        api.getCustomOrders(),
        api.getProducts(),
        api.getReviews(),
        api.getAdminCustomers(),
        api.getSettings(),
      ]);
      setStats(s);
      setOrders(o);
      setCustomOrders(c);
      setProducts(p);
      setReviews(r);
      setCustomers(cust);
      setSettings(sett);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAllAdminData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handlers
  const handleOrderStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      const updated = await api.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      if (stats) stats.pendingOrders = orders.filter(o => o.status === 'Pending').length;
    } catch (err: any) {
      alert(`Could not update order status: ${err.message}`);
    }
  };

  const handleCustomOrderStatusChange = async (orderId: string, status: CustomOrder['status']) => {
    try {
      const updated = await api.updateCustomOrderStatus(orderId, status);
      setCustomOrders((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (err: any) {
      alert(`Could not update custom order status: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you wish to retire this confection from the boutique?')) return;
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      onProductsUpdated();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.price) return;

    try {
      if (editingProduct.id) {
        const updated = await api.updateProduct(editingProduct.id, editingProduct);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await api.createProduct(editingProduct);
        setProducts((prev) => [created, ...prev]);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      onProductsUpdated();
    } catch (err: any) {
      alert(`Failed to save product: ${err.message}`);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Remove this review?')) return;
    try {
      await api.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      alert('Shop settings and delivery configurations updated successfully.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status.toLowerCase() === orderStatusFilter.toLowerCase();
    const q = orderSearchQuery.toLowerCase();
    const matchesSearch = !q ||
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_phone.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-6xl bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] shadow-2xl overflow-hidden h-[92vh] flex flex-col">
        
        {/* Admin Navigation Bar */}
        <div className="px-6 py-4 border-b border-[#E8DFD5] bg-[#2C2420] text-[#FAF7F2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold tracking-tight text-white">
              SEMURUG ATELIER EXECUTIVE SUITE
            </span>
            <span className="text-[11px] bg-[#895737] text-white font-mono px-2 py-0.5 rounded-md uppercase font-bold">
              Admin Portal
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
            aria-label="Close admin dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls Bar */}
        <div className="px-6 py-2.5 bg-[#F4EFEA] border-b border-[#E8DFD5] flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm'
                : 'text-[#5E4D44] hover:bg-[#EFE8DE]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview & Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm'
                : 'text-[#5E4D44] hover:bg-[#EFE8DE]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'custom'
                ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm'
                : 'text-[#5E4D44] hover:bg-[#EFE8DE]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C59B62]" />
            <span>Custom Requests ({customOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm'
                : 'text-[#5E4D44] hover:bg-[#EFE8DE]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm'
                : 'text-[#5E4D44] hover:bg-[#EFE8DE]'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm'
                : 'text-[#5E4D44] hover:bg-[#EFE8DE]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Shop Settings</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF7F2]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-1">
                  <span className="text-[11px] text-[#8C7A70] uppercase tracking-wider block">Total Revenue</span>
                  <div className="text-2xl font-serif font-bold text-[#2C2420] tabular-nums">
                    ${stats.totalRevenue}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium">+18% this month</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-1">
                  <span className="text-[11px] text-[#8C7A70] uppercase tracking-wider block">Total Orders</span>
                  <div className="text-2xl font-serif font-bold text-[#2C2420] tabular-nums">
                    {stats.totalOrders}
                  </div>
                  <span className="text-[10px] text-[#895737] font-medium">Boutique & online</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-1">
                  <span className="text-[11px] text-[#8C7A70] uppercase tracking-wider block">Active Products</span>
                  <div className="text-2xl font-serif font-bold text-[#2C2420] tabular-nums">
                    {stats.totalProducts}
                  </div>
                  <span className="text-[10px] text-[#8C7A70]">Across 8 categories</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-1">
                  <span className="text-[11px] text-[#8C7A70] uppercase tracking-wider block">Pending Orders</span>
                  <div className="text-2xl font-serif font-bold text-amber-700 tabular-nums">
                    {stats.pendingOrders}
                  </div>
                  <span className="text-[10px] text-amber-800 font-medium">Requires kitchen attention</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-1">
                  <span className="text-[11px] text-[#8C7A70] uppercase tracking-wider block">Patron Accounts</span>
                  <div className="text-2xl font-serif font-bold text-[#2C2420] tabular-nums">
                    {stats.totalCustomers}
                  </div>
                  <span className="text-[10px] text-[#8C7A70]">Registered patrons</span>
                </div>
              </div>

              {/* Monthly Revenue Breakdown Chart */}
              <div className="p-6 bg-white rounded-2xl border border-[#E8DFD5] space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-[#2C2420]">
                    Monthly Confectionery Revenue Velocity
                  </h3>
                  <span className="text-xs text-[#8C7A70]">Live PostgreSQL / Ledger Ledger</span>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 items-end pt-4 h-48 border-b border-[#E8DFD5]">
                  {Object.entries(stats.monthlySales || { Nov: stats.totalRevenue, Oct: 240, Sep: 180 }).map(([month, val]: any) => (
                    <div key={month} className="flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[11px] font-mono font-bold text-[#2C2420] tabular-nums">
                        ${val}
                      </span>
                      <div
                        className="w-full max-w-[48px] bg-[#895737] rounded-t-lg transition-all duration-500"
                        style={{ height: `${Math.min(100, Math.max(25, (val / (stats.totalRevenue || 1)) * 100))}%` }}
                      />
                      <span className="text-[11px] text-[#8C7A70] uppercase font-bold">{month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Queue */}
              <div className="p-6 bg-white rounded-2xl border border-[#E8DFD5] space-y-4 shadow-sm">
                <h3 className="font-serif text-base font-bold text-[#2C2420]">
                  Immediate Kitchen Worklist
                </h3>
                <div className="divide-y divide-[#F4EFEA]">
                  {orders.slice(0, 4).map((o) => (
                    <div key={o.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <strong className="font-mono text-[#2C2420]">#{o.order_number}</strong>
                        <span className="text-[#8C7A70] ml-2">by {o.customer_name}</span>
                        <div className="text-[11px] text-[#5E4D44] mt-0.5">
                          {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-[#2C2420]">${o.total}</span>
                        <select
                          value={o.status}
                          onChange={(e) => handleOrderStatusChange(o.id, e.target.value as any)}
                          className="px-2.5 py-1 bg-[#F4EFEA] border border-[#E8DFD5] rounded-lg text-xs font-semibold text-[#2C2420]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready</option>
                          <option value="Delivering">Delivering</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-[#E8DFD5]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#5E4D44]">Status Filter:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs font-semibold text-[#2C2420]"
                  >
                    <option value="all">All Statuses ({orders.length})</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivering">Delivering</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex-1 max-w-xs">
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by order # or client name..."
                    className="w-full px-3.5 py-1.5 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-[#E8DFD5] overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4EFEA] text-[#8C7A70] uppercase font-bold text-[10px] tracking-wider border-b border-[#E8DFD5]">
                    <tr>
                      <th className="p-3.5">Order Ref</th>
                      <th className="p-3.5">Customer & Contact</th>
                      <th className="p-3.5">Delivery Schedule</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4EFEA]">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="p-3.5 font-mono font-bold text-[#2C2420]">
                          #{o.order_number}
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-[#2C2420]">{o.customer_name}</div>
                          <div className="text-[#8C7A70] text-[11px]">{o.customer_phone}</div>
                          <div className="text-[#8C7A70] text-[11px] truncate max-w-[180px]">{o.delivery_address}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-medium text-[#2C2420]">{o.delivery_date}</div>
                          <div className="text-[11px] text-[#8C7A70]">{o.delivery_time}</div>
                        </td>
                        <td className="p-3.5">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="text-[#5E4D44] text-[11px]">
                              {it.quantity}x {it.name} <span className="text-[#8C7A70]">({it.size_label})</span>
                            </div>
                          ))}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-[#2C2420] tabular-nums">
                          ${o.total}
                        </td>
                        <td className="p-3.5">
                          <select
                            value={o.status}
                            onChange={(e) => handleOrderStatusChange(o.id, e.target.value as any)}
                            className="px-2.5 py-1 bg-[#F4EFEA] border border-[#E8DFD5] rounded-lg text-xs font-semibold text-[#2C2420]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Delivering">Delivering</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM ATELIER REQUESTS */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customOrders.map((cst) => (
                  <div key={cst.id} className="p-5 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-4">
                    <div className="flex items-start justify-between gap-3 border-b border-[#F4EFEA] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#2C2420]">#{cst.order_number}</span>
                          <span className="text-xs font-semibold text-[#895737]">{cst.cake_type}</span>
                        </div>
                        <div className="text-xs text-[#5E4D44] mt-0.5">
                          Client: <strong>{cst.customer_name}</strong> · {cst.customer_phone}
                        </div>
                      </div>

                      <select
                        value={cst.status}
                        onChange={(e) => handleCustomOrderStatusChange(cst.id, e.target.value as any)}
                        className="px-2.5 py-1 bg-[#F4EFEA] border border-[#E8DFD5] rounded-lg text-xs font-semibold text-[#2C2420]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-[#5E4D44]">
                      <div>
                        <span className="text-[#8C7A70] block">Weight & Scale:</span>
                        <strong className="text-[#2C2420]">{cst.weight_kg} kg</strong>
                      </div>
                      <div>
                        <span className="text-[#8C7A70] block">Target Delivery:</span>
                        <strong className="text-[#2C2420]">{cst.delivery_date} ({cst.delivery_time})</strong>
                      </div>
                      <div>
                        <span className="text-[#8C7A70] block">Flavor:</span>
                        <span className="text-[#2C2420] font-medium">{cst.flavor}</span>
                      </div>
                      <div>
                        <span className="text-[#8C7A70] block">Frosting:</span>
                        <span className="text-[#2C2420] font-medium">{cst.cream}</span>
                      </div>
                    </div>

                    {cst.personalized_message && (
                      <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD5] text-xs">
                        <span className="text-[#8C7A70] text-[10px] uppercase font-bold block mb-1">
                          Custom Calligraphy Inscription:
                        </span>
                        <span className="font-serif italic text-[#895737]">"{cst.personalized_message}"</span>
                      </div>
                    )}

                    {cst.reference_image && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#8C7A70] uppercase font-bold block">
                          Client Attached Reference Photo:
                        </span>
                        <img
                          src={cst.reference_image}
                          alt="Customer Reference"
                          className="h-28 object-cover rounded-xl border border-[#E8DFD5]"
                        />
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-[#F4EFEA] text-xs">
                      <span className="text-[#8C7A70]">Estimated Quote:</span>
                      <strong className="font-serif text-lg font-bold text-[#2C2420] tabular-nums">
                        ${cst.estimated_price}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCTS CATALOG MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#2C2420] uppercase tracking-wider">
                  Artisanal Inventory ({products.length} Confections)
                </span>
                <button
                  onClick={() => {
                    setEditingProduct({
                      name: '',
                      price: 80,
                      weight_grams: 1200,
                      category: 'Birthday Cakes',
                      category_slug: 'birthday-cakes',
                      description: '',
                      available: true,
                      pre_order_available: true,
                      preparation_time_hours: 12,
                      featured: false,
                      best_seller: false,
                      is_new: true,
                      ingredients: ['Pure Butter', 'Valrhona Cocoa', 'Bourbon Vanilla'],
                      images: ['/src/assets/images/hero_signature_cake_1793864720413.jpg'],
                      sizes: [
                        { label: 'Standard (6 Servings)', weight_grams: 1200, price: 80 },
                        { label: 'Grand (12 Servings)', weight_grams: 2200, price: 130 }
                      ]
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Cake</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-[#E8DFD5] overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4EFEA] text-[#8C7A70] uppercase font-bold text-[10px] tracking-wider border-b border-[#E8DFD5]">
                    <tr>
                      <th className="p-3.5">Cake</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Base Price</th>
                      <th className="p-3.5">Weight</th>
                      <th className="p-3.5">Availability</th>
                      <th className="p-3.5">Rating</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4EFEA]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={p.images[0] || '/src/assets/images/hero_signature_cake_1793864720413.jpg'}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-bold text-[#2C2420]">{p.name}</div>
                            <div className="text-[10px] text-[#8C7A70] truncate max-w-xs">{p.description}</div>
                          </div>
                        </td>
                        <td className="p-3.5 text-[#5E4D44] font-medium">{p.category}</td>
                        <td className="p-3.5 font-serif font-bold text-[#2C2420] tabular-nums">${p.price}</td>
                        <td className="p-3.5 text-[#5E4D44] tabular-nums">{p.weight_grams}g</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              p.available ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {p.available ? 'In Atelier' : 'Sold Out'}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium tabular-nums">{p.rating}★ ({p.review_count})</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsProductModalOpen(true);
                            }}
                            className="p-1 hover:text-[#895737] text-[#5E4D44] transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1 hover:text-rose-700 text-[#8C7A70] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <h3 className="font-serif text-base font-bold text-[#2C2420]">
                Customer Reviews Ledger ({reviews.length})
              </h3>
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="p-4 bg-white rounded-2xl border border-[#E8DFD5] flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-[#2C2420]">{r.user_name}</strong>
                        <div className="flex items-center text-amber-500 text-xs">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-amber-500' : 'text-stone-300'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-[#8C7A70]">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-[#5E4D44] leading-relaxed">{r.comment}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="p-2 text-[#8C7A70] hover:text-rose-700 transition-colors rounded-lg hover:bg-rose-50"
                      title="Remove review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && settings && (
            <form onSubmit={handleSaveSettings} className="max-w-2xl bg-white p-6 rounded-2xl border border-[#E8DFD5] space-y-4 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#2C2420]">
                Boutique Identity & Dispatch Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">Bakery Name</label>
                  <input
                    type="text"
                    value={settings.shop_name}
                    onChange={(e) => setSettings({ ...settings, shop_name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">Concierge Phone</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">Standard Delivery Fee ($)</label>
                  <input
                    type="number"
                    value={settings.delivery_fee}
                    onChange={(e) => setSettings({ ...settings, delivery_fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">Free Delivery Threshold ($)</label>
                  <input
                    type="number"
                    value={settings.free_delivery_threshold}
                    onChange={(e) => setSettings({ ...settings, free_delivery_threshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5E4D44] block mb-1">Top Announcement Ribbon</label>
                <input
                  type="text"
                  value={settings.banner_text}
                  onChange={(e) => setSettings({ ...settings, banner_text: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={settings.banner_active}
                  onChange={(e) => setSettings({ ...settings, banner_active: e.target.checked })}
                  className="w-4 h-4 accent-[#895737]"
                />
                <label htmlFor="bannerActive" className="text-xs font-medium text-[#2C2420]">
                  Display announcement ribbon on storefront
                </label>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
              >
                Save Settings
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Product Edit / Creation Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8DFD5] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                {editingProduct.id ? 'Edit Confection' : 'Create New Boutique Cake'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-[#8C7A70] hover:text-[#2C2420]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-[#5E4D44] block mb-1">Cake Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-[#2C2420]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-[#5E4D44] block mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'Birthday Cakes'}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingProduct({
                        ...editingProduct,
                        category: val,
                        category_slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-[#2C2420]"
                  >
                    <option value="Birthday Cakes">Birthday Cakes</option>
                    <option value="Wedding Cakes">Wedding Cakes</option>
                    <option value="Chocolate Cakes">Chocolate Cakes</option>
                    <option value="Fruit Cakes">Fruit Cakes</option>
                    <option value="Cream Cakes">Cream Cakes</option>
                    <option value="Custom Cakes">Custom Cakes</option>
                    <option value="Children's Cakes">Children's Cakes</option>
                    <option value="Special Occasion Cakes">Special Occasion Cakes</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-[#5E4D44] block mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-[#2C2420]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-[#5E4D44] block mb-1">Weight (grams)</label>
                  <input
                    type="number"
                    value={editingProduct.weight_grams || 1200}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight_grams: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-[#2C2420]"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#5E4D44] block mb-1">Prep Time (hours)</label>
                  <input
                    type="number"
                    value={editingProduct.preparation_time_hours || 12}
                    onChange={(e) => setEditingProduct({ ...editingProduct, preparation_time_hours: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-[#2C2420]"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-[#5E4D44] block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-[#2C2420]"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingProduct.available !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, available: e.target.checked })}
                    className="accent-[#895737]"
                  />
                  <span>Available for order</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="accent-[#895737]"
                  />
                  <span>Feature on homepage</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#E8DFD5] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#E8DFD5] rounded-xl text-[#5E4D44] hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C2420] hover:bg-[#895737] text-white rounded-xl font-semibold"
                >
                  Save Confection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
