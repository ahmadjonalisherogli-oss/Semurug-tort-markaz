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
              Purveyors of haute pâtisserie, sculptural celebration tiers, and decadent artisanal gateaux. Handcrafted daily with AOP Normandy cultured butter and grand cru cocoa.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#D4A373]">
              <Sparkles className="w-4 h-4" />
              <span>International Luxury Patisserie Standard</span>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#D4A373] uppercase tracking-widest">
              Confections
            </h4>
            <div className="flex flex-col space-y-2 text-xs text-[#E8DFD5]">
              <button onClick={() => onNavigate('catalog')} className="text-left hover:text-white transition-colors">
                Birthday Cakes
              </button>
              <button onClick={() => onNavigate('catalog')} className="text-left hover:text-white transition-colors">
                Wedding Tiers
              </button>
              <button onClick={() => onNavigate('catalog')} className="text-left hover:text-white transition-colors">
                Valrhona Truffles
              </button>
              <button onClick={() => onNavigate('catalog')} className="text-left hover:text-white transition-colors">
                Fruit & Chantilly
              </button>
              <button onClick={() => onNavigate('custom')} className="text-left hover:text-white transition-colors">
                Bespoke Atelier
              </button>
            </div>
          </div>

          {/* Maison & Heritage (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#D4A373] uppercase tracking-widest">
              The Maison
            </h4>
            <div className="flex flex-col space-y-2 text-xs text-[#E8DFD5]">
              <button onClick={() => onNavigate('home', 'heritage')} className="text-left hover:text-white transition-colors">
                Our Heritage
              </button>
              <button onClick={() => onNavigate('home', 'reviews')} className="text-left hover:text-white transition-colors">
                Guest Reviews
              </button>
              <button onClick={() => onNavigate('home', 'contact')} className="text-left hover:text-white transition-colors">
                Mayfair Boutique
              </button>
              <button onClick={() => onNavigate('catalog')} className="text-left hover:text-white transition-colors">
                Delivery Schedule
              </button>
            </div>
          </div>

          {/* Atelier Portal (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#D4A373] uppercase tracking-widest">
              Concierge & Atelier
            </h4>
            <p className="text-xs text-[#E8DFD5] leading-relaxed">
              Order line: +1 (555) 900-2253<br />
              Email: concierge@semurugcakes.com<br />
              Open daily 08:00 – 21:00
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] font-mono text-[#D4A373] hover:underline"
              >
                Atelier Administration Suite →
              </button>
            </div>
          </div>

        </div>

        {/* Quiet Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} SEMURUG CAKE CENTER. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Patisserie</span>
            <span>·</span>
            <span>Temperature Guarantee</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
