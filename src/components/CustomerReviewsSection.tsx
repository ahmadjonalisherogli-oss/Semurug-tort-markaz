import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Lady Genevieve Dupond',
    role: '21st Birthday Gala Host',
    location: 'Kensington, London',
    comment: 'The Imperial Vanilla & Macaron Crown was an utter masterpiece. Every guest commented on the lightness of the bourbon vanilla sponge and the delicate spun sugar crown.',
    rating: 5,
    event: 'Birthday Celebration'
  },
  {
    name: 'Marcus & Eleanor Sterling',
    role: 'Private Nuptials',
    location: 'Mayfair Ballroom',
    comment: 'Semurug executed our 4-tier ivory wedding showpiece flawlessly. Delivered in refrigerated transit and set up seamlessly before dinner. The passionfruit curd was sublime.',
    rating: 5,
    event: 'Wedding Gala'
  },
  {
    name: 'Julian Montgomery',
    role: 'Creative Director, Atelier Vogue',
    location: 'Soho Studio',
    comment: 'The Valrhona Nocturne mirror cake is the benchmark of dark chocolate patisserie. Flawless mirror gloss, crunchy hazelnut feuilletine, and single-origin cocoa mousse.',
    rating: 5,
    event: 'Corporate Anniversary'
  }
];

export const CustomerReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-16 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-widest text-[#895737] uppercase">
            <span>Client Praise & Acclaim</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2420]">
            Celebrated by Patrons Worldwide
          </h2>
          <p className="text-sm text-[#5E4D44] leading-relaxed">
            Read verified experiences from couples, celebration hosts, and culinary critics who chose Semurug for their life’s momentous occasions.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-3xl border border-[#E8DFD5] shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C59B62] text-[#C59B62]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#E8DFD5]" />
                </div>

                <p className="font-serif italic text-sm text-[#2C2420] leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F4EFEA] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#2C2420]">{t.name}</h4>
                  <div className="text-[11px] text-[#8C7A70] flex items-center gap-1">
                    <span>{t.role}</span>
                    <span>·</span>
                    <span>{t.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-800 text-[10px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
