import React from 'react';
import { ArrowRight, Sparkles, Award, Clock, HeartHandshake } from 'lucide-react';
import { ShopSettings } from '../types.js';

interface HeroProps {
  onExploreCakes: () => void;
  onDesignCustom: () => void;
  settings?: ShopSettings;
}

export const HeroSection: React.FC<HeroProps> = ({ onExploreCakes, onDesignCustom, settings }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#FAF7F2] border-b border-[#E8DFD5]/80">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Text Column (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#895737] uppercase">
              <Sparkles className="w-4 h-4 text-[#C59B62]" />
              <span>{settings?.hero_badge || 'Yuqori Pâtisserie & Mualliflik Qandolatchiligi'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2C2420] leading-[1.12] tracking-tight [text-wrap:balance]">
              {settings?.hero_title || 'Hayotingizning Eng Go\'zal Lahzalari Uchun Mahorat Bilan Yaratilgan Tortlar'}
            </h1>

            <p className="text-base sm:text-lg text-[#5E4D44] max-w-xl leading-relaxed">
              {settings?.hero_subtitle || 'Hashamatli ko\'p qavatli to\'y tortlaridan tortib, nafis qo\'l mehnati bilan tayyorlangan bayram shirinliklarigacha — Semurug an\'anaviy fransuz qandolatchilik san\'atini zamonaviy haykaltaroshlik nafosati bilan uyg\'unlashtiradi.'}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreCakes}
                className="group px-7 py-3.5 bg-[#2C2420] text-[#FAF7F2] text-sm font-semibold rounded-xl hover:bg-[#43352F] transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 active:scale-95"
              >
                <span>Tortlar Katalogi</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onDesignCustom}
                className="px-7 py-3.5 bg-transparent text-[#2C2420] text-sm font-semibold rounded-xl border border-[#2C2420]/30 hover:border-[#2C2420] hover:bg-[#FAF7F2] transition-all active:scale-95"
              >
                Maxsus Tort Buyurtma Qilish
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 border-t border-[#E8DFD5] flex flex-wrap items-center gap-6 text-xs text-[#5E4D44]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#895737]" />
                <span className="font-medium">100% Normandiya Sarayog'i & Valrhona Kakao</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#895737]" />
                <span className="font-medium">Shu Kuning O'zida Ehtiyotkor Yetkazib Berish</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#895737]" />
                <span className="font-medium">Individual Dizayn Maslahatlari</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column (5 cols on desktop) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#EFE8DE] border border-[#E8DFD5] group">
              <img
                src="/src/assets/images/hero_signature_cake_1793864720413.jpg"
                alt="Semurug Signature Double Velvet Truffle Cake"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2420]/80 via-transparent to-transparent opacity-80" />
              
              {/* Floating Caption Overlay */}
              <div className="absolute bottom-5 left-5 right-5 text-[#FAF7F2] p-4 bg-[#2C2420]/85 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-medium tracking-wider uppercase text-[#D4A373]">
                      Oyning Shox Asari
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-white">
                      Double Velvet Truffle Torti
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-white/70 block">Boshlab</span>
                    <span className="text-xl font-bold font-serif text-[#D4A373] tabular-nums">$96</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
