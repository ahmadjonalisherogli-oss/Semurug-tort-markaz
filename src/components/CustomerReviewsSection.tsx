import React, { useState, useEffect } from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api.js';
import { Review } from '../types.js';

export const CustomerReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await api.getReviews();
        // Show approved reviews
        const approved = data.filter((r) => r.status === 'Approved');
        setReviews(approved.slice(0, 6));
      } catch (err) {
        console.error('Failed to load reviews from backend:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  return (
    <section id="reviews" className="py-16 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-widest text-[#895737] uppercase">
            <span>Mijozlarimiz E'tirofi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2420]">
            Minglab Mamnun Qalblar & Tantanalar
          </h2>
          <p className="text-sm text-[#5E4D44] leading-relaxed">
            Semurug qandolat markazini o'zlarining unutilmas tantanalari uchun tanlagan xaridorlarimiz, to'y sohiblari va qandolat shinavandalarining samimiy fikrlari.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#8C7A70]">Mijozlar fikrlari yuklanmoqda...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 bg-white rounded-3xl border border-[#E8DFD5] shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(Math.round(rev.rating || 5))].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C59B62] text-[#C59B62]" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-[#E8DFD5]" />
                  </div>

                  <p className="font-serif italic text-sm text-[#2C2420] leading-relaxed line-clamp-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4EFEA] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#2C2420]">{rev.user_name}</h4>
                    <div className="text-[11px] text-[#8C7A70] flex items-center gap-1">
                      <span>Hurmatli Xaridor</span>
                      <span>·</span>
                      <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {rev.is_verified_purchase && (
                    <div className="flex items-center gap-1 text-emerald-800 text-[10px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tasdiqlangan xarid</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
