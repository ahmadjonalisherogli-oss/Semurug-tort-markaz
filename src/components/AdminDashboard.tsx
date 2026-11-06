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
  AlertCircle,
  LogOut,
  MessageSquare,
  HelpCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { Product, Order, CustomOrder, Review, User, ShopSettings, Inquiry, Faq, GalleryItem } from '../types.js';

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
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'custom' | 'products' | 'reviews' | 'inquiries' | 'faqs' | 'gallery' | 'settings'
  >('overview');
  
  // Data states
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // FAQ Form State
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Gallery Form State
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const [newGalleryTag, setNewGalleryTag] = useState('#SemurugCake');

  // Order Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Product Edit / New Modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [s, o, c, p, r, cust, sett, inq, f, g] = await Promise.all([
        api.getAdminStats(),
        api.getOrders(),
        api.getCustomOrders(),
        api.getProducts(),
        api.getReviews(),
        api.getAdminCustomers(),
        api.getSettings(),
        api.getInquiries().catch(() => []),
        api.getFaqs().catch(() => []),
        api.getGallery().catch(() => []),
      ]);
      setStats(s);
      setOrders(o);
      setCustomOrders(c);
      setProducts(p);
      setReviews(r);
      setCustomers(cust);
      setSettings(sett);
      setInquiries(inq);
      setFaqs(f);
      setGallery(g);
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
      const numPrice = Number(editingProduct.price);
      let updatedSizes = editingProduct.sizes && editingProduct.sizes.length ? [...editingProduct.sizes] : [];
      if (updatedSizes.length > 0) {
        updatedSizes[0] = { ...updatedSizes[0], price: numPrice };
      } else {
        updatedSizes = [
          { label: 'Standart', weight_grams: Number(editingProduct.weight_grams) || 1200, price: numPrice }
        ];
      }

      const payload = {
        ...editingProduct,
        price: numPrice,
        sizes: updatedSizes,
      };

      if (editingProduct.id) {
        const updated = await api.updateProduct(editingProduct.id, payload);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await api.createProduct(payload);
        setProducts((prev) => [created, ...prev]);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      onProductsUpdated();
    } catch (err: any) {
      alert(`Mahsulotni saqlashda xatolik yuz berdi: ${err.message}`);
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
      onProductsUpdated();
      alert('Boutique identity, hero campaign texts, and dispatch parameters updated successfully.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleInquiryStatusChange = async (inquiryId: string, status: Inquiry['status']) => {
    try {
      const updated = await api.updateInquiryStatus(inquiryId, status);
      setInquiries((prev) => prev.map((inq) => (inq.id === updated.id ? updated : inq)));
    } catch (err: any) {
      alert(`Could not update inquiry status: ${err.message}`);
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!confirm('Ushbu mijoz xabarini o\'chirmoqchimisiz?')) return;
    try {
      await api.deleteInquiry(inquiryId);
      setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    try {
      const created = await api.createFaq({
        question: newFaqQuestion.trim(),
        answer: newFaqAnswer.trim(),
        display_order: faqs.length + 1,
      });
      setFaqs((prev) => [...prev, created]);
      setNewFaqQuestion('');
      setNewFaqAnswer('');
    } catch (err: any) {
      alert(`FAQ qo'shishda xatolik: ${err.message}`);
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!confirm('Ushbu savol-javobni o\'chirmoqchimisiz?')) return;
    try {
      await api.deleteFaq(faqId);
      setFaqs((prev) => prev.filter((f) => f.id !== faqId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryImage.trim()) {
      alert('Iltimos rasm URL havolasini kiriting.');
      return;
    }
    try {
      const created = await api.createGalleryItem({
        image: newGalleryImage.trim(),
        caption: newGalleryCaption.trim() || 'Semurug Bespoke Confectionery',
        tag: newGalleryTag.trim() || '#SemurugCake',
        display_order: gallery.length + 1,
      });
      setGallery((prev) => [...prev, created]);
      setNewGalleryImage('');
      setNewGalleryCaption('');
    } catch (err: any) {
      alert(`Galereyaga rasm qo'shishda xatolik: ${err.message}`);
    }
  };

  const handleDeleteGalleryItem = async (itemId: string) => {
    if (!confirm('Ushbu rasm lavhasini galereyadan o\'chirmoqchimisiz?')) return;
    try {
      await api.deleteGalleryItem(itemId);
      setGallery((prev) => prev.filter((g) => g.id !== itemId));
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-rose-900/60 text-stone-200 hover:text-white transition-colors border border-white/10"
              title="Admin seansini yakunlash"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden sm:inline">Chiqish (Logout)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
              aria-label="Close admin dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
            <span>Umumiy Tahlil</span>
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
            <span>Buyurtmalar ({orders.length})</span>
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
            <span>Maxsus Buyurtmalar ({customOrders.length})</span>
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
            <span>Mahsulotlar ({products.length})</span>
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
            <span>Mijozlar Fikrlari ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm'
                : 'text-[#5E4D44] hover:bg-[#EFE8DE]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Xabarlar ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'faqs'
                ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm'
                : 'text-[#5E4D44] hover:bg-[#EFE8DE]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Savol-Javoblar ({faqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm'
                : 'text-[#5E4D44] hover:bg-[#EFE8DE]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Galereya ({gallery.length})</span>
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
            <span>Boutique Sozlamalari</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF7F2]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-1">
                  <span className="text-[11px] text-[#8C7A70] uppercase tracking-wider block">Umumiy Tushum</span>
                  <div className="text-2xl font-serif font-bold text-[#2C2420] tabular-nums">
                    ${stats.totalRevenue}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium">+18% joriy oyda</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-1">
                  <span className="text-[11px] text-[#8C7A70] uppercase tracking-wider block">Jami Buyurtmalar</span>
                  <div className="text-2xl font-serif font-bold text-[#2C2420] tabular-nums">
                    {stats.totalOrders}
                  </div>
                  <span className="text-[10px] text-[#895737] font-medium">Boutique & onlayn</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-1">
                  <span className="text-[11px] text-[#8C7A70] uppercase tracking-wider block">Faol Mahsulotlar</span>
                  <div className="text-2xl font-serif font-bold text-[#2C2420] tabular-nums">
                    {stats.totalProducts}
                  </div>
                  <span className="text-[10px] text-[#8C7A70]">8 ta toifa bo'yicha</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-1">
                  <span className="text-[11px] text-[#8C7A70] uppercase tracking-wider block">Kutilayotgan Buyurtmalar</span>
                  <div className="text-2xl font-serif font-bold text-amber-700 tabular-nums">
                    {stats.pendingOrders}
                  </div>
                  <span className="text-[10px] text-amber-800 font-medium">Oshpazxona e'tiborini talab qiladi</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-1">
                  <span className="text-[11px] text-[#8C7A70] uppercase tracking-wider block">Mijozlar Akkauntlari</span>
                  <div className="text-2xl font-serif font-bold text-[#2C2420] tabular-nums">
                    {stats.totalCustomers}
                  </div>
                  <span className="text-[10px] text-[#8C7A70]">Ro'yxatdan o'tganlar</span>
                </div>
              </div>

              {/* Monthly Revenue Breakdown Chart */}
              <div className="p-6 bg-white rounded-2xl border border-[#E8DFD5] space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-[#2C2420]">
                    Oylik Savdo Dinamikasi
                  </h3>
                  <span className="text-xs text-[#8C7A70]">Jonli Ma'lumotlar Bazasi</span>
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

          {/* TAB 6: INQUIRIES / CONCIERGE MESSAGES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#2C2420]">
                    Mijoz Murojaatlari va Xabarlar ({inquiries.length})
                  </h3>
                  <p className="text-xs text-[#5E4D44] mt-0.5">
                    Saytdagi aloqa formasidan yuborilgan barcha mijoz so'rovlari va xabarlari.
                  </p>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#E8DFD5] text-xs text-[#8C7A70]">
                  Hozircha yangi xabarlar kelib tushmadi.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFD5] pb-3">
                        <div className="flex items-center gap-3">
                          <strong className="text-sm text-[#2C2420]">{inq.name}</strong>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              inq.status === 'New'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : inq.status === 'Read'
                                ? 'bg-stone-100 text-stone-700 border border-stone-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {inq.status}
                          </span>
                          <span className="text-[11px] text-[#8C7A70]">
                            {new Date(inq.created_at).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {inq.status === 'New' && (
                            <button
                              onClick={() => handleInquiryStatusChange(inq.id, 'Read')}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                            >
                              O'qildi
                            </button>
                          )}
                          {inq.status !== 'Resolved' && (
                            <button
                              onClick={() => handleInquiryStatusChange(inq.id, 'Resolved')}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors"
                            >
                              Hal qilindi
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5E4D44]">
                        <div>
                          <span className="font-semibold text-[#2C2420]">Telefon: </span>
                          <a href={`tel:${inq.phone}`} className="text-[#895737] hover:underline font-mono">
                            {inq.phone}
                          </a>
                        </div>
                        {inq.email && (
                          <div>
                            <span className="font-semibold text-[#2C2420]">Email: </span>
                            <a href={`mailto:${inq.email}`} className="text-[#895737] hover:underline">
                              {inq.email}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD5] text-xs text-[#2C2420] whitespace-pre-wrap leading-relaxed">
                        {inq.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: FAQS MANAGEMENT */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-base font-bold text-[#2C2420]">
                  Savol-Javoblar Boshqaruvi (FAQs - {faqs.length})
                </h3>
                <p className="text-xs text-[#5E4D44] mt-0.5">
                  Saytdagi "Frequently Asked Questions" bo'limida ko'rinadigan barcha savol va javoblarni tahrirlang.
                </p>
              </div>

              {/* Add New FAQ Form */}
              <form onSubmit={handleCreateFaq} className="p-5 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-3">
                <div className="flex items-center gap-2 font-serif text-xs font-bold uppercase tracking-wider text-[#895737]">
                  <Plus className="w-4 h-4" />
                  <span>Yangi Savol-Javob Qo'shish</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">Savol (Question)</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Maxsus buyurtma qancha vaqt oldin berilishi kerak?"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">Javob (Answer)</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Savol bo'yicha batafsil ma'lumot yozing..."
                    value={newFaqAnswer}
                    onChange={(e) => setNewFaqAnswer(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>FAQ Qo'shish</span>
                  </button>
                </div>
              </form>

              {/* Existing FAQs List */}
              <div className="space-y-3">
                {faqs.map((f, idx) => (
                  <div
                    key={f.id}
                    className="p-4 bg-white rounded-2xl border border-[#E8DFD5] flex items-start justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#895737]/10 text-[#895737] text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <strong className="text-xs text-[#2C2420]">{f.question}</strong>
                      </div>
                      <p className="text-xs text-[#5E4D44] leading-relaxed pl-7">{f.answer}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteFaq(f.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors shrink-0"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: GALLERY MANAGEMENT */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-base font-bold text-[#2C2420]">
                  Instagram & Vitrina Galereyasi ({gallery.length})
                </h3>
                <p className="text-xs text-[#5E4D44] mt-0.5">
                  Bosh sahifadagi fotogalereya lavhalarini boshqaring yoki yangi rasmlar qo'shing.
                </p>
              </div>

              {/* Add New Gallery Photo Form */}
              <form onSubmit={handleCreateGalleryItem} className="p-5 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-3">
                <div className="flex items-center gap-2 font-serif text-xs font-bold uppercase tracking-wider text-[#895737]">
                  <Plus className="w-4 h-4" />
                  <span>Galereyaga Yangi Rasm Qo'shish</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">Rasm URL yoki Joylashuvi</label>
                    <input
                      type="text"
                      required
                      placeholder="/src/assets/images/... yoki https://..."
                      value={newGalleryImage}
                      onChange={(e) => setNewGalleryImage(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">Heshteg (Tag)</label>
                    <input
                      type="text"
                      placeholder="#SemurugCake, #WeddingAtelier"
                      value={newGalleryTag}
                      onChange={(e) => setNewGalleryTag(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">Tavsif (Caption)</label>
                  <input
                    type="text"
                    placeholder="Masalan: Double-tiered Parisian mirror glaze confection..."
                    value={newGalleryCaption}
                    onChange={(e) => setNewGalleryCaption(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Galereyaga Qo'shish</span>
                  </button>
                </div>
              </form>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((g) => (
                  <div
                    key={g.id}
                    className="group relative bg-white rounded-2xl border border-[#E8DFD5] overflow-hidden shadow-sm flex flex-col"
                  >
                    <div className="aspect-square bg-[#F4EFEA] relative overflow-hidden">
                      <img
                        src={g.image}
                        alt={g.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        onClick={() => handleDeleteGalleryItem(g.id)}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-rose-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-3 space-y-1 text-xs">
                      <span className="text-[10px] text-[#895737] font-semibold">{g.tag}</span>
                      <p className="text-[#2C2420] line-clamp-2 leading-relaxed">{g.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: BOUTIQUE SETTINGS & CMS CONTENT */}
          {activeTab === 'settings' && settings && (
            <form onSubmit={handleSaveSettings} className="max-w-3xl bg-white p-6 rounded-2xl border border-[#E8DFD5] space-y-6 shadow-sm">
              <div>
                <h3 className="font-serif text-base font-bold text-[#2C2420]">
                  Boutique Identity & Dynamic Content CMS
                </h3>
                <p className="text-xs text-[#5E4D44] mt-0.5">
                  Barcha ma'lumotlar to'g'ridan-to'g'ri backend ma'lumotlar bazasida saqlanadi va saytda jonli aks etadi.
                </p>
              </div>

              {/* Group 1: General Info */}
              <div className="space-y-3 pt-2 border-t border-[#E8DFD5]">
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#895737]">
                  1. Do'kon Rekvizitlari & Aloqa
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">Bakery Nomi</label>
                    <input
                      type="text"
                      value={settings.shop_name}
                      onChange={(e) => setSettings({ ...settings, shop_name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">Aloqa Telefoni</label>
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
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">Rasmiy Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">Ish Tartibi (Working Hours)</label>
                    <input
                      type="text"
                      value={settings.working_hours}
                      onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">Do'kon Manzili (Address)</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">Telegram Havolasi</label>
                    <input
                      type="text"
                      value={settings.telegram_url || ''}
                      onChange={(e) => setSettings({ ...settings, telegram_url: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">Instagram Havolasi</label>
                    <input
                      type="text"
                      value={settings.instagram_url || ''}
                      onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Hero Section Texts */}
              <div className="space-y-3 pt-4 border-t border-[#E8DFD5]">
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#895737]">
                  2. Bosh Sahifa Hero Banner Matnlari
                </h4>
                
                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">Hero Yuqori Lenta Matni (Badge)</label>
                  <input
                    type="text"
                    value={settings.hero_badge || ''}
                    placeholder="Haute Pâtisserie & Bespoke Confectionery"
                    onChange={(e) => setSettings({ ...settings, hero_badge: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">Hero Asosiy Sarlavha (Title)</label>
                  <input
                    type="text"
                    value={settings.hero_title || ''}
                    placeholder="Artisanal Cakes Crafted for Life’s Most Exquisite Moments"
                    onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">Hero Tavsif Matni (Subtitle)</label>
                  <textarea
                    rows={2}
                    value={settings.hero_subtitle || ''}
                    placeholder="From grand multi-tiered wedding centerpieces to intimate hand-piped celebration sponges..."
                    onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                  />
                </div>
              </div>

              {/* Group 3: Story Quote */}
              <div className="space-y-3 pt-4 border-t border-[#E8DFD5]">
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#895737]">
                  3. Brend Merosi (Heritage Story Quote)
                </h4>
                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">Chef Patron Iqtibosi</label>
                  <textarea
                    rows={2}
                    value={settings.story_quote || ''}
                    placeholder="A great cake is never just sugar and flour—it is the focal memory of life's most precious celebrations."
                    onChange={(e) => setSettings({ ...settings, story_quote: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                  />
                </div>
              </div>

              {/* Group 4: Delivery Fees & Announcement */}
              <div className="space-y-3 pt-4 border-t border-[#E8DFD5]">
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#895737]">
                  4. Yetkazib Berish Narxlari & E'lon Lentasi
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">Standard Yetkazib Berish Narxi ($)</label>
                    <input
                      type="number"
                      value={settings.delivery_fee}
                      onChange={(e) => setSettings({ ...settings, delivery_fee: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">Bepul Yetkazish Chegarasi ($)</label>
                    <input
                      type="number"
                      value={settings.free_delivery_threshold}
                      onChange={(e) => setSettings({ ...settings, free_delivery_threshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">Yuqori E'lon Lentasi Matni</label>
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
                    Sayt yuqorisidagi e'lon lentasini faollashtirish
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="py-3 px-8 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
                >
                  Barcha O'zgarishlarni Saqlash
                </button>
              </div>
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
                {editingProduct.id ? 'Tort Ma\'lumotlarini Tahrirlash' : 'Yangi Mualliflik Tortini Qo\'shish'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-[#8C7A70] hover:text-[#2C2420]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-[#5E4D44] block mb-1">Tort Nomi *</label>
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
                  <label className="font-medium text-[#5E4D44] block mb-1">Toifasi</label>
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
                    <option value="Birthday Cakes">Birthday Cakes (Tug'ilgan kun)</option>
                    <option value="Wedding Cakes">Wedding Cakes (To'y tortlari)</option>
                    <option value="Chocolate Cakes">Chocolate Cakes (Shokoladli)</option>
                    <option value="Fruit Cakes">Fruit Cakes (Mevali)</option>
                    <option value="Cream Cakes">Cream Cakes (Qaymoqli)</option>
                    <option value="Custom Cakes">Custom Cakes (Maxsus)</option>
                    <option value="Children's Cakes">Children's Cakes (Bolalar)</option>
                    <option value="Special Occasion Cakes">Special Occasion Cakes (Tantanalar)</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-[#5E4D44] block mb-1">Narxi ($) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-[#2C2420]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-[#5E4D44] block mb-1">Vazni (gramm)</label>
                  <input
                    type="number"
                    value={editingProduct.weight_grams || 1200}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight_grams: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-[#2C2420]"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#5E4D44] block mb-1">Tayyorlanish vaqti (soat)</label>
                  <input
                    type="number"
                    value={editingProduct.preparation_time_hours || 12}
                    onChange={(e) => setEditingProduct({ ...editingProduct, preparation_time_hours: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-[#2C2420]"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-[#5E4D44] block mb-1">Batafsil Tavsifi</label>
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
                  <span>Buyurtma uchun mavjud</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="accent-[#895737]"
                  />
                  <span>Bosh sahifada ko'rsatish</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#E8DFD5] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#E8DFD5] rounded-xl text-[#5E4D44] hover:bg-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C2420] hover:bg-[#895737] text-white rounded-xl font-semibold"
                >
                  Tortni Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
