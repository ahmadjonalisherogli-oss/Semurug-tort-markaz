import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    setIsAdminLoginModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
  } = useAuth();

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
      setError(err.message || 'Kirish muvaffaqiyatsiz bo\'ldi');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoCustomer = () => {
    setEmail('customer@semurug.com');
    setPassword('cake123');
    setError(null);
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4EFEA] rounded-full text-[11px] font-semibold text-[#895737] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B62]" />
            <span>Xaridor Shaxsiy Kabineti</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2C2420]">
            {authModalMode === 'login' ? 'Kabinetga Kirish' : 'Yangi Xisob Ochish'}
          </h2>
          <p className="text-xs text-[#5E4D44]">
            {authModalMode === 'login'
              ? 'Buyurtmalaringiz holatini kuzatish va manzillarni boshqarish'
              : 'Eksklyuziv tortlar va shaxsiy buyurtmalar uchun ro\'yxatdan o\'ting'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#F4EFEA] rounded-2xl border border-[#E8DFD5]">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-xl transition-all ${
              authModalMode === 'login'
                ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm'
                : 'text-[#5E4D44] hover:text-[#2C2420]'
            }`}
          >
            Kirish (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-xl transition-all ${
              authModalMode === 'register'
                ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm'
                : 'text-[#5E4D44] hover:text-[#2C2420]'
            }`}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {/* Fast Customer Demo Fill */}
        {authModalMode === 'login' && (
          <div className="p-3 bg-white rounded-2xl border border-[#E8DFD5] flex items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-[#5E4D44]">
              <UserIcon className="w-4 h-4 text-[#895737] shrink-0" />
              <span>Demo xaridor akkaunti</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemoCustomer}
              className="px-2.5 py-1 bg-[#F4EFEA] hover:bg-[#EFE8DE] text-[#895737] text-[11px] font-semibold rounded-lg border border-[#E8DFD5] transition-colors"
            >
              Avtoto'ldirish
            </button>
          </div>
        )}

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
              <label className="text-xs font-medium text-[#5E4D44] block mb-1">
                Ism va Familiya *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Shaxzoda Alimova"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-[#5E4D44] block mb-1">
              Elektron Pochta *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="xaridor@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#5E4D44] block mb-1">
              Maxfiy Parol *
            </label>
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
                <label className="text-xs font-medium text-[#5E4D44] block mb-1">
                  Telefon Raqami (Yetkazib berish uchun)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 (90) 123-4567"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5E4D44] block mb-1">
                  Yetkazib berish manzili
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Toshkent sh., Mirobod tumani..."
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
              ? 'Yuklanmoqda...'
              : authModalMode === 'login'
              ? 'Xaridor sifatida kirish'
              : 'Akkaunt yaratish'}
          </button>
        </form>

        {/* DEDICATED SEPARATE ADMIN LOGIN CALLOUT */}
        <div className="pt-4 border-t border-[#E8DFD5] text-center space-y-2">
          <p className="text-xs text-[#5E4D44]">
            Semurug qandolatchilik markazi xodimimisiz?
          </p>
          <button
            type="button"
            onClick={() => {
              setIsAuthModalOpen(false);
              setIsAdminLoginModalOpen(true);
            }}
            className="w-full py-2.5 px-4 bg-[#2C2420]/5 hover:bg-[#2C2420] text-[#2C2420] hover:text-[#D4A373] text-xs font-semibold rounded-xl border border-[#2C2420]/20 hover:border-[#2C2420] transition-all flex items-center justify-center gap-2 group"
          >
            <Shield className="w-3.5 h-3.5 text-[#895737] group-hover:text-[#D4A373]" />
            <span>Administrator Kirish Portali</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
