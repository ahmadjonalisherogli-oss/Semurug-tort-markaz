/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { CartProvider, useCart } from './context/CartContext.js';
import { AnnouncementBar } from './components/AnnouncementBar.js';
import { Navbar } from './components/Navbar.js';
import { HeroSection } from './components/HeroSection.js';
import { CategoryFilterBar } from './components/CategoryFilterBar.js';
import { ProductCard } from './components/ProductCard.js';
import { CustomCakeBuilder } from './components/CustomCakeBuilder.js';
import { ProductCatalogView } from './components/ProductCatalogView.js';
import { ProductDetailModal } from './components/ProductDetailModal.js';
import { CartDrawer } from './components/CartDrawer.js';
import { CheckoutModal } from './components/CheckoutModal.js';
import { OrderTrackerModal } from './components/OrderTrackerModal.js';
import { AuthModal } from './components/AuthModal.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { UserProfileModal } from './components/UserProfileModal.js';
import { SearchModal } from './components/SearchModal.js';
import { BrandStorySection } from './components/BrandStorySection.js';
import { CustomerReviewsSection } from './components/CustomerReviewsSection.js';
import { InstagramGallery } from './components/InstagramGallery.js';
import { FaqSection } from './components/FaqSection.js';
import { ContactSection } from './components/ContactSection.js';
import { Footer } from './components/Footer.js';
import { api } from './services/api.js';
import { Product, Category, ShopSettings, Order, CustomOrder } from './types.js';
import { Sparkles, ArrowRight } from 'lucide-react';

function MainApp() {
  const [activeView, setActiveView] = useState<'home' | 'catalog' | 'custom'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<ShopSettings | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Home Featured Category Filter
  const [homeCategoryFilter, setHomeCategoryFilter] = useState('all');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerOrderNumber, setTrackerOrderNumber] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { addToCart } = useCart();

  const loadInitialData = async () => {
    try {
      const [prods, cats, sett] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getSettings().catch(() => undefined),
      ]);
      setProducts(prods);
      setCategories(cats);
      if (sett) setSettings(sett);
    } catch (err) {
      console.error('Failed to load bakery catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleOrderNow = (product: Product, size: any, quantity: number) => {
    addToCart(product, size, quantity);
    setIsCheckoutOpen(true);
  };

  const handleCustomOrderSuccess = (order: CustomOrder) => {
    setTrackerOrderNumber(order.order_number);
    setIsTrackerOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setTrackerOrderNumber(order.order_number);
  };

  // Filtered products on homepage
  const featuredProducts = products
    .filter((p) => {
      if (homeCategoryFilter === 'all') return true;
      return p.category_slug === homeCategoryFilter || p.category.toLowerCase() === homeCategoryFilter.toLowerCase();
    })
    .slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C2420]">
      {/* 1. Announcement Ribbon */}
      <AnnouncementBar settings={settings} />

      {/* 2. Top Bar Navigation (Strict 3-Zone Contract) */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenOrderTracker={() => {
          setTrackerOrderNumber(undefined);
          setIsTrackerOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* MAIN VIEW CONTENT */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            {/* Hero Campaign */}
            <HeroSection
              onExploreCakes={() => {
                setActiveView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDesignCustom={() => {
                setActiveView('custom');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Featured Collection Grid */}
            <section className="py-16 sm:py-20 bg-[#FAF7F2]">
              <div className="max-w-7xl mx-auto px-6 space-y-10">
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-[#895737] uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-[#C59B62]" />
                      <span>Curated Seasonal Confections</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2420]">
                      Signature Patisserie Highlights
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('catalog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#895737] hover:text-[#2C2420] transition-colors whitespace-nowrap self-start sm:self-auto"
                  >
                    <span>View Entire Catalog ({products.length} Confections)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Category Filter Segments */}
                <CategoryFilterBar
                  categories={categories}
                  selectedCategory={homeCategoryFilter}
                  onSelectCategory={setHomeCategoryFilter}
                />

                {/* Products 3-Column Grid */}
                {loading ? (
                  <div className="py-20 text-center text-xs text-[#8C7A70]">
                    Preparing artisanal display...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {featuredProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onOpenDetails={setSelectedProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Bespoke Custom Cake Callout Banner */}
            <section className="py-14 bg-[#F4EFEA] border-y border-[#E8DFD5]">
              <div className="max-w-7xl mx-auto px-6">
                <div className="p-8 sm:p-12 rounded-3xl bg-[#2C2420] text-[#FAF7F2] relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="relative z-10 max-w-xl space-y-4">
                    <span className="text-xs font-semibold tracking-widest text-[#D4A373] uppercase block">
                      The Custom Atelier Studio
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white [text-wrap:balance]">
                      Have a Vision for an Unforgettable Milestone Cake?
                    </h3>
                    <p className="text-xs sm:text-sm text-[#E8DFD5] leading-relaxed">
                      Choose your bespoke silhouette, customize sponge infusions, upload reference moodboards, and have your personalized message hand-piped in French calligraphy.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setActiveView('custom');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3 bg-[#D4A373] hover:bg-[#C59B62] text-[#2C2420] text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
                      >
                        <span>Open Custom Cake Studio</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 w-full lg:w-80 aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src="/src/assets/images/birthday_cake_artisan_1793864721039.jpg"
                      alt="Custom atelier preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Brand Heritage Section */}
            <BrandStorySection />

            {/* Customer Testimonials & Verified Praise */}
            <CustomerReviewsSection />

            {/* Instagram Gallery */}
            <InstagramGallery />

            {/* Frequently Asked Questions */}
            <FaqSection />

            {/* Boutique Location & Contact Inquiry */}
            <ContactSection settings={settings} />
          </>
        )}

        {/* CATALOG FULL VIEW */}
        {activeView === 'catalog' && (
          <ProductCatalogView
            products={products}
            categories={categories}
            onOpenDetails={setSelectedProduct}
          />
        )}

        {/* CUSTOM CAKE BUILDER VIEW */}
        {activeView === 'custom' && (
          <CustomCakeBuilder onSuccess={handleCustomOrderSuccess} />
        )}
      </main>

      {/* FOOTER */}
      <Footer
        onNavigate={(view, hash) => {
          setActiveView(view as any);
          if (hash) {
            setTimeout(() => {
              const el = document.getElementById(hash);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* MODALS & OVERLAYS */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={setSelectedProduct}
        allProducts={products}
        onOrderNow={handleOrderNow}
      />

      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        initialOrderNumber={trackerOrderNumber}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={setSelectedProduct}
      />

      <AuthModal />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductsUpdated={loadInitialData}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onTrackOrder={(num) => {
          setTrackerOrderNumber(num);
          setIsTrackerOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
