import React from 'react';
import { Instagram, ExternalLink } from 'lucide-react';

const INSTAGRAM_SHOTS = [
  { img: '/src/assets/images/hero_signature_cake_1793864720413.jpg', tag: '@semurug_cakes', caption: 'The Double Velvet Signature' },
  { img: '/src/assets/images/birthday_cake_artisan_1793864721039.jpg', tag: '@semurug_cakes', caption: 'Bourbon Vanilla & Macarons' },
  { img: '/src/assets/images/wedding_cake_tiered_1793864721265.jpg', tag: '@semurug_cakes', caption: 'Four-Tier Ivory Sugar Petals' },
  { img: '/src/assets/images/chocolate_truffle_cake_1793864721562.jpg', tag: '@semurug_cakes', caption: 'Valrhona Mirror Ganache Slice' },
  { img: '/src/assets/images/fruit_tart_cake_1793864721977.jpg', tag: '@semurug_cakes', caption: 'Passionfruit Soleil Tier' },
];

export const InstagramGallery: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#F4EFEA] border-t border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-[#895737] uppercase">
              <Instagram className="w-4 h-4" />
              <span>@SEMURUG_CAKES ON INSTAGRAM</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#2C2420] mt-1">
              Moments from the Mayfair Atelier
            </h2>
          </div>

          <a
            href="https://instagram.com/semurug_cakes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#895737] hover:text-[#2C2420] transition-colors"
          >
            <span>Follow our Culinary Journey</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {INSTAGRAM_SHOTS.map((shot, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#EFE8DE] border border-[#E8DFD5] shadow-sm cursor-pointer"
            >
              <img
                src={shot.img}
                alt={shot.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2420]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                <span className="text-[10px] text-[#D4A373] uppercase tracking-wider font-bold">
                  {shot.tag}
                </span>
                <p className="font-serif text-xs font-semibold line-clamp-1">{shot.caption}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
