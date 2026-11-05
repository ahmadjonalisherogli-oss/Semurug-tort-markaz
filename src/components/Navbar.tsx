import React, { useState } from 'react';
import { ShoppingBag, Search, User as UserIcon, Menu, X, Shield, Package } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenOrderTracker: () => void;
  onOpenAdmin: () => void;
  onOpenProfile: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenOrderTracker,
  onOpenAdmin,
  onOpenProfile,
  activeView,
  setActiveView,
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, setIsAuthModalOpen } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string, hash?: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD5] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="text-2xl font-serif font-bold tracking-tight text-[#2C2420] whitespace-nowrap shrink-0 hover:text-[#895737] transition-colors"
        >
          SEMURUG
        </a>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#5E4D44]">
          <button
            onClick={() => handleNavClick('catalog')}
            className={`whitespace-nowrap shrink-0 hover:text-[#2C2420] transition-colors ${
              activeView === 'catalog' ? 'text-[#2C2420] font-semibold border-b-2 border-[#895737] pb-0.5' : ''
            }`}
          >
            Cakes
          </button>
          <button
            onClick={() => handleNavClick('custom')}
            className={`whitespace-nowrap shrink-0 hover:text-[#2C2420] transition-colors ${
              activeView === 'custom' ? 'text-[#2C2420] font-semibold border-b-2 border-[#895737] pb-0.5' : ''
            }`}
          >
            Custom Atelier
          </button>
          <button
            onClick={() => handleNavClick('home', 'heritage')}
            className="whitespace-nowrap shrink-0 hover:text-[#2C2420] transition-colors"
          >
            Our Heritage
          </button>
          <button
            onClick={() => handleNavClick('home', 'reviews')}
            className="whitespace-nowrap shrink-0 hover:text-[#2C2420] transition-colors"
          >
            Reviews
          </button>
          <button
            onClick={() => handleNavClick('home', 'contact')}
            className="whitespace-nowrap shrink-0 hover:text-[#2C2420] transition-colors"
          >
            Boutique & Location
          </button>
        </nav>

        {/* Zone 3: 1 primary action group */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#5E4D44] hover:text-[#2C2420] hover:bg-[#F0EAE1] rounded-full transition-colors"
            title="Search cakes"
            aria-label="Search cakes"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Track Order */}
          <button
            onClick={onOpenOrderTracker}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5E4D44] hover:text-[#2C2420] hover:bg-[#F0EAE1] rounded-lg transition-colors whitespace-nowrap"
            title="Track my order"
          >
            <Package className="w-4 h-4 text-[#895737]" />
            <span>Track Order</span>
          </button>

          {/* Admin Switch (if admin or demo trigger) */}
          {user?.role === 'admin' ? (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#2C2420] text-[#FAF7F2] rounded-lg hover:bg-[#43352F] transition-colors whitespace-nowrap shadow-sm"
              title="Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Admin</span>
            </button>
          ) : null}

          {/* User Account / Sign In */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 p-2 text-[#5E4D44] hover:text-[#2C2420] hover:bg-[#F0EAE1] rounded-full transition-colors"
              title={user.full_name}
            >
              <div className="w-6 h-6 rounded-full bg-[#895737] text-white flex items-center justify-center text-xs font-bold uppercase">
                {user.full_name.charAt(0)}
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 text-[#5E4D44] hover:text-[#2C2420] hover:bg-[#F0EAE1] rounded-full transition-colors"
              title="Sign In / Register"
              aria-label="Sign In"
            >
              <UserIcon className="w-5 h-5" />
            </button>
          )}

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2.5 bg-[#895737] hover:bg-[#72452B] text-[#FAF7F2] rounded-xl transition-all shadow-sm group active:scale-95"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#2C2420] text-[#FAF7F2] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF7F2] shadow-sm tabular-nums">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#5E4D44] hover:text-[#2C2420] hover:bg-[#F0EAE1] rounded-lg transition-colors ml-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8DFD5] bg-[#FAF7F2] px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3 font-medium text-base text-[#2C2420]">
            <button
              onClick={() => handleNavClick('catalog')}
              className="text-left py-2 hover:text-[#895737] transition-colors border-b border-[#F0EAE1]"
            >
              All Cakes & Catalog
            </button>
            <button
              onClick={() => handleNavClick('custom')}
              className="text-left py-2 hover:text-[#895737] transition-colors border-b border-[#F0EAE1]"
            >
              Custom Atelier Studio
            </button>
            <button
              onClick={() => handleNavClick('home', 'heritage')}
              className="text-left py-2 hover:text-[#895737] transition-colors border-b border-[#F0EAE1]"
            >
              Our Heritage & Quality
            </button>
            <button
              onClick={() => handleNavClick('home', 'reviews')}
              className="text-left py-2 hover:text-[#895737] transition-colors border-b border-[#F0EAE1]"
            >
              Customer Reviews
            </button>
            <button
              onClick={() => handleNavClick('home', 'contact')}
              className="text-left py-2 hover:text-[#895737] transition-colors border-b border-[#F0EAE1]"
            >
              Boutique Location & Hours
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderTracker();
              }}
              className="text-left py-2 hover:text-[#895737] transition-colors flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-[#895737]" />
              <span>Track Your Order</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#E8DFD5]">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#895737] text-white flex items-center justify-center font-bold">
                  {user.full_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2C2420]">{user.full_name}</p>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="text-xs text-[#895737] underline"
                  >
                    View Account
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-[#2C2420] text-[#FAF7F2] text-sm font-medium rounded-xl text-center"
              >
                Sign In / Create Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
