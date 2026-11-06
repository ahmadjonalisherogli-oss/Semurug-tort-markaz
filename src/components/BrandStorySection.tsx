import React from 'react';
import { Award, Wheat, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { ShopSettings } from '../types.js';

interface BrandStoryProps {
  settings?: ShopSettings;
}

export const BrandStorySection: React.FC<BrandStoryProps> = ({ settings }) => {
  return (
    <section id="heritage" className="py-16 sm:py-20 bg-[#F4EFEA] border-y border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (5 cols): Story photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E8DFD5] bg-[#EFE8DE]">
              <img
                src="/src/assets/images/wedding_cake_tiered_1793864721265.jpg"
                alt="Artisanal Patisserie Craftsmanship"
                referrerPolicy="no-referrer"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2420]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white p-4 bg-[#2C2420]/80 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="text-[10px] text-[#D4A373] uppercase tracking-widest font-bold">
                  Butik Merosi
                </span>
                <p className="font-serif text-sm italic mt-1 text-[#FAF7F2]">
                  "{settings?.story_quote || "Mukammal tort faqat shirinlik emas — u hayotingizning eng qadrli va unutilmas lahzalari xotirasidir."}"
                </p>
                <span className="text-[11px] text-stone-300 block mt-2">— Bosh Qandolatchi Chef Semurug</span>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#895737] uppercase">
              <Sparkles className="w-4 h-4 text-[#C59B62]" />
              <span>Semurug Falsafasi</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2420] [text-wrap:balance]">
              Har Bir Qavatda Betakror Mahorat va Mukammal Sifat
            </h2>

            <p className="text-sm sm:text-base text-[#5E4D44] leading-relaxed">
              Har bir bayram torti nafis haykaltaroshlik asari va betakror lazzat uyg'unligi bo'lishi kerak degan falsafaga asoslanib, Semurug Cake Center har bir tortni shaxsiy buyurtma asosida o'z qandolatchilik ustaxonasida tayyorlaydi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-[#2C2420] font-bold text-xs uppercase tracking-wider">
                  <Wheat className="w-4 h-4 text-[#895737]" />
                  <span>AOP Normandiya Sarayog'i</span>
                </div>
                <p className="text-xs text-[#5E4D44] leading-relaxed">
                  Maxsus an'ana bilan yetiltirilgan fransuz sarayog'i tortga ipakdek mayinlik va nozik baxmal ta'm bag'ishlaydi.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-[#2C2420] font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4 text-[#895737]" />
                  <span>Grand Cru Valrhona Shokoladi</span>
                </div>
                <p className="text-xs text-[#5E4D44] leading-relaxed">
                  Chuqur xushbo'y hidli toza shokolad, qovurilgan kakao parchalari va oynadek yaltiroq muzlama.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-[#2C2420] font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#895737]" />
                  <span>Sun'iy Konservantlardan Xoli</span>
                </div>
                <p className="text-xs text-[#5E4D44] leading-relaxed">
                  Faqat tabiiy xomashyo, toza tuxum va to'g'ridan-to'g'ri Madagaskardan keltirilgan haqiqiy vanil urug'lari.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-[#2C2420] font-bold text-xs uppercase tracking-wider">
                  <Heart className="w-4 h-4 text-[#895737]" />
                  <span>Ehtiyotkor Yetkazib Berish</span>
                </div>
                <p className="text-xs text-[#5E4D44] leading-relaxed">
                  Harorat nazorat qilinadigan maxsus transport vositasida tort butunligi va nafisligini saqlagan holda yetkazish.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
