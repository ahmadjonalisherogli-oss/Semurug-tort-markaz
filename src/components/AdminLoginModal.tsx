import React, { useState } from 'react';
import { X, Shield, Lock, Mail, ArrowRight, KeyRound, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface AdminLoginModalProps {
  onSuccessOpenDashboard?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccessOpenDashboard }) => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    setIsAuthModalOpen,
    adminLogin,
  } = useAuth();

  const [email, setEmail] = useState('admin@semurug.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await adminLogin(email, password);
      setIsAdminLoginModalOpen(false);
      if (onSuccessOpenDashboard) {
        onSuccessOpenDashboard();
      }
    } catch (err: any) {
      setError(err.message || 'Administrator autentifikatsiyasi muvaffaqiyatsiz bo\'ldi');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@semurug.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#1D1714] text-[#FAF7F2] rounded-3xl border border-[#3D2E26] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAdminLoginModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          aria-label="Close admin modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Header Lockup */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#2C2420] border border-[#C59B62]/30 flex items-center justify-center text-[#C59B62] shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-mono tracking-widest text-[#C59B62] uppercase font-bold block">
            Executive Security Gate
          </span>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
            Administrator Portali
          </h2>
          <p className="text-xs text-stone-300 max-w-xs mx-auto leading-relaxed">
            Semurug Cake Center boshqaruv tizimi va buyurtmalar markaziga xavfsiz kirish.
          </p>
        </div>

        {/* Quick Autofill Alert */}
        <div className="p-3 bg-[#261F1B] rounded-2xl border border-[#3D2E26] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-300">
            <KeyRound className="w-4 h-4 text-[#C59B62] shrink-0" />
            <span>Admin demo kaliti tayyor</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 bg-[#C59B62]/20 hover:bg-[#C59B62]/30 text-[#D4A373] text-[11px] font-semibold rounded-lg border border-[#C59B62]/40 transition-colors"
          >
            Avtoto'ldirish
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-950/70 border border-rose-800 text-rose-200 text-xs rounded-xl flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-stone-300 block mb-1">
              Admin Elektron Pochta
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@semurug.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#140F0D] border border-[#3D2E26] rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-[#C59B62]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-300 block mb-1">
              Admin Maxfiy Paroli
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#140F0D] border border-[#3D2E26] rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-[#C59B62]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-[#C59B62] hover:bg-[#B3874F] text-[#1D1714] text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
          >
            <Shield className="w-4 h-4" />
            <span>{loading ? 'Tekshirilmoqda...' : 'Admin sifatida kirish'}</span>
          </button>
        </form>

        {/* Switch to Customer Portal */}
        <div className="pt-2 border-t border-[#3D2E26] text-center">
          <p className="text-xs text-stone-400">
            Oddiy xaridor kabinetiga kirmoqchimisiz?{' '}
            <button
              type="button"
              onClick={() => {
                setIsAdminLoginModalOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="text-[#D4A373] hover:underline font-semibold ml-1 inline-flex items-center gap-1"
            >
              <span>Xaridor Kirish</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
