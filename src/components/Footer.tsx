import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, hash?: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  return (
    <footer className="bg-[#2C2420] text-[#FAF7F2] border-t border-[#3D2E26] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Col (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
              SEMURUG CAKE CENTER
            </h3>
            <p className="text-xs text-[#E8DFD5] max-w-sm leading-relaxed">
              Yuqori pâtisserie san'ati, muhtasham tantana tortlari va nozik shirinliklar uyi. Har kuni Normandiya AOP sariyog'i va saralangan Grand Cru kakaosi bilan mehr ila tayyorlanadi.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#D4A373]">
              <Sparkles className="w-4 h-4" />
              <span>Xalqaro Qandolatchilikning Oliy Standarti</span>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#D4A373] uppercase tracking-widest">
              Kolleksiyalar
            </h4>
            <div className="flex flex-col space-y-2 text-xs text-[#E8DFD5]">
              <button onClick={() => onNavigate('catalog')} className="text-left hover:text-white transition-colors">
                Tug'ilgan Kun Tortlari
              </button>
              <button onClick={() => onNavigate('catalog')} className="text-left hover:text-white transition-colors">
                To'y Tortlari
              </button>
              <button onClick={() => onNavigate('catalog')} className="text-left hover:text-white transition-colors">
                Valrhona Shokoladi
              </button>
              <button onClick={() => onNavigate('catalog')} className="text-left hover:text-white transition-colors">
                Mevali & Chantilly
              </button>
              <button onClick={() => onNavigate('custom')} className="text-left hover:text-white transition-colors">
                Maxsus Tort Atelesi
              </button>
            </div>
          </div>

          {/* Maison & Heritage (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#D4A373] uppercase tracking-widest">
              Brend Haqida
            </h4>
            <div className="flex flex-col space-y-2 text-xs text-[#E8DFD5]">
              <button onClick={() => onNavigate('home', 'heritage')} className="text-left hover:text-white transition-colors">
                Bizning Merosimiz
              </button>
              <button onClick={() => onNavigate('home', 'reviews')} className="text-left hover:text-white transition-colors">
                Mijozlar Fikrlari
              </button>
              <button onClick={() => onNavigate('home', 'contact')} className="text-left hover:text-white transition-colors">
                Markaziy Qandolatxona
              </button>
              <button onClick={() => onNavigate('catalog')} className="text-left hover:text-white transition-colors">
                Yetkazib Berish Tartibi
              </button>
            </div>
          </div>

          {/* Atelier Portal (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#D4A373] uppercase tracking-widest">
              Aloqa & Konsyerj
            </h4>
            <p className="text-xs text-[#E8DFD5] leading-relaxed">
              Buyurtma uchun: +998 (71) 200-1122<br />
              Elektron pochta: concierge@semurugcakes.com<br />
              Har kuni 08:00 dan 21:00 gacha
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] font-mono text-[#D4A373] hover:underline"
              >
                Administrator Boshqaruv Paneli →
              </button>
            </div>
          </div>

        </div>

        {/* Quiet Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} SEMURUG CAKE CENTER. Barcha huquqlar himoyalangan.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Maxfiylik Siyosati</span>
            <span>·</span>
            <span>Foydalanish Shartlari</span>
            <span>·</span>
            <span>Sovutish & Sifat Kafolati</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
