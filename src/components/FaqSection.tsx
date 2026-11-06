import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { api } from '../services/api.js';
import { Faq } from '../types.js';

export const FaqSection: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const data = await api.getFaqs();
        setFaqs(data);
      } catch (err) {
        console.error('Failed to load FAQs from backend:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-widest text-[#895737] uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>Ko'p Beriladigan Savollar</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#2C2420]">
            Sizni Qiziqtirgan Barcha Savollarga Javoblar
          </h2>
          <p className="text-xs sm:text-sm text-[#5E4D44]">
            Buyurtma berish, yetkazib berish shartlari va maxsus tortlarni tayyorlash bo'yicha batafsil ma'lumotlar.
          </p>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-[#8C7A70]">Savol-javoblar yuklanmoqda...</div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={faq.id || idx}
                  className="bg-white rounded-2xl border border-[#E8DFD5] overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-sm font-semibold text-[#2C2420] hover:text-[#895737] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8C7A70] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#895737]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#5E4D44] leading-relaxed border-t border-[#F4EFEA] pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
