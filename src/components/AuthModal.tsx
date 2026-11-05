import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode, setAuthModalMode, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          full_name: fullName,
          phone,
          address,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'customer') => {
    setError(null);
    setLoading(true);
    try {
      if (role === 'admin') {
        await login('admin@semurug.com', 'admin123');
      } else {
        await login('customer@semurug.com', 'cake123');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#EFE8DE] text-[#5E4D44] hover:text-[#2C2420] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold text-[#895737] uppercase tracking-widest block">
            Semurug Patisserie Club
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#2C2420]">
            {authModalMode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-xs text-[#5E4D44]">
            {authModalMode === 'login'
              ? 'Access past celebration orders and bespoke requests'
              : 'Join for priority cake reservations and tasting invites'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3 bg-[#F4EFEA] rounded-2xl border border-[#E8DFD5] space-y-2">
          <span className="text-[10px] text-[#8C7A70] uppercase font-bold tracking-wider block text-center">
            One-Click Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="py-1.5 px-3 bg-[#2C2420] hover:bg-[#43352F] text-[#D4A373] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('customer')}
              className="py-1.5 px-3 bg-white hover:bg-[#EFE8DE] text-[#2C2420] text-xs font-semibold rounded-xl border border-[#E8DFD5] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#895737]" />
              <span>Customer Login</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'register' && (
            <div>
              <label className="text-xs font-medium text-[#5E4D44] block mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Charlotte Vance"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-[#5E4D44] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@luxury.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#5E4D44] block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
              />
            </div>
          </div>

          {authModalMode === 'register' && (
            <>
              <div>
                <label className="text-xs font-medium text-[#5E4D44] block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-8901"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5E4D44] block mb-1">Default Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="45 Kensington Crescent, London"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading
              ? 'Processing...'
              : authModalMode === 'login'
              ? 'Sign In to Account'
              : 'Create My Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2">
          {authModalMode === 'login' ? (
            <p className="text-xs text-[#5E4D44]">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="text-[#895737] font-semibold underline hover:text-[#2C2420]"
              >
                Create one now
              </button>
            </p>
          ) : (
            <p className="text-xs text-[#5E4D44]">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="text-[#895737] font-semibold underline hover:text-[#2C2420]"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
