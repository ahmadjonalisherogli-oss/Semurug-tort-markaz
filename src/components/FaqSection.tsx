import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How far in advance should I place my cake order?',
    a: 'For our signature catalog cakes, we recommend placing orders at least 12–24 hours in advance to allow our pastry chefs ample tempering and setting time. For multi-tiered wedding cakes and custom bespoke sculpts, we advise reserving your date 2 to 4 weeks prior.'
  },
  {
    q: 'How are cakes protected during delivery?',
    a: 'All Semurug confections travel in custom dual-walled insulated packaging within temperature-controlled luxury refrigerated vans. Our couriers are trained in white-glove transport to ensure delicate sugar flowers, ganache mirror glosses, and structural integrity remain immaculate upon arrival.'
  },
  {
    q: 'Can you accommodate dietary allergies (gluten-free, nut-free, vegan)?',
    a: 'Yes. We offer dedicated gluten-free flourless chocolate cakes and dairy-free options upon request. However, please note that all our cakes are crafted in an artisanal atelier where tree nuts, almonds, and dairy are present.'
  },
  {
    q: 'Do you offer private cake tastings for wedding couples?',
    a: 'Absolutely. We host private tasting sessions at our Mayfair boutique where you and your partner can sample four sponge varieties, signature curds, and buttercreams alongside our Master Pâtissier.'
  },
  {
    q: 'What is your rescheduling and cancellation policy?',
    a: 'Orders may be rescheduled up to 48 hours prior to delivery without penalty. Bespoke custom orders requiring specialized sugar sculpting require at least 5 days notice due to the handcrafting schedule.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-widest text-[#895737] uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#2C2420]">
            Everything You Need to Know
          </h2>
          <p className="text-xs sm:text-sm text-[#5E4D44]">
            Answers to our patrons’ most common inquiries regarding ordering, delivery, and bespoke design.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8DFD5] overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-sm font-semibold text-[#2C2420] hover:text-[#895737] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8C7A70] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#895737]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#5E4D44] leading-relaxed border-t border-[#F4EFEA] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
