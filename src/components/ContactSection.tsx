import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Instagram, CheckCircle2 } from 'lucide-react';
import { ShopSettings } from '../types.js';
import { api } from '../services/api.js';

interface ContactSectionProps {
  settings?: ShopSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setLoading(true);
    try {
      await api.createInquiry({ name, phone, email, message });
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      alert(`Xabar yuborishda xatolik: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-[#F4EFEA] border-t border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold tracking-widest text-[#895737] uppercase block">
            Aloqa & Qandolat Markazi
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2420]">
            Tashrif Buyuring Yoki Qandolatchilarimiz Bilan Bog'laning
          </h2>
          <p className="text-xs sm:text-sm text-[#5E4D44] leading-relaxed">
            To'y tortlari konsultatsiyasi, korporativ buyurtmalar yoki kunlik assortiment bo'yicha biz bilan bog'laning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Contact Details & Map Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white rounded-3xl border border-[#E8DFD5] shadow-sm space-y-6">
              <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                Semurug Markaziy Qandolatxonasi
              </h3>

              <div className="space-y-4 text-xs text-[#5E4D44]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#895737] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2C2420] block">Manzil</strong>
                    <span>{settings?.address || 'Toshkent sh., Mirobod tumani, Royal Pastry xiyoboni, 77-uy'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#895737] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2C2420] block">Aloqa Telefoni</strong>
                    <span>{settings?.phone || '+998 (71) 200-1122'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#895737] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2C2420] block">Elektron Pochta</strong>
                    <span>{settings?.email || 'concierge@semurugcakes.com'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#895737] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2C2420] block">Ish Vaqti & Yetkazib Berish</strong>
                    <span>{settings?.working_hours || 'Dushanba – Yakshanba: 08:00 – 21:00'}</span>
                  </div>
                </div>
              </div>

              {/* Instant Social Channels */}
              <div className="pt-4 border-t border-[#F4EFEA] flex flex-wrap gap-3">
                <a
                  href={settings?.telegram_url || 'https://t.me/semurug_cake_bot'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#2C2420] hover:bg-[#895737] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>Telegram Bot Orqali Buyurtma</span>
                </a>

                <a
                  href={settings?.instagram_url || 'https://instagram.com/semurug_cakes'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white hover:bg-[#EFE8DE] border border-[#E8DFD5] text-[#2C2420] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#895737]" />
                  <span>Instagram Sahifamiz</span>
                </a>
              </div>
            </div>

            {/* Interactive Map Visual Placeholder */}
            <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-[#EFE8DE] border border-[#E8DFD5] relative flex items-center justify-center text-center p-4 shadow-sm group">
              <div className="absolute inset-0 bg-[#E8DFD5]/40 opacity-80" />
              <div className="relative z-10 space-y-1 text-xs text-[#2C2420]">
                <MapPin className="w-8 h-8 text-[#895737] mx-auto animate-bounce" />
                <h4 className="font-serif font-bold text-sm">Semurug Qandolat Markazi</h4>
                <p className="text-[11px] text-[#5E4D44] max-w-xs">
                  Tortlarni olib ketish uchun qulay avtoturargoh mavjud.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD5] shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2C2420]">
                Bosh Qandolatchimizga Xabar Yuboring
              </h3>
              <p className="text-xs text-[#5E4D44] mt-1">
                Biz 2 ish soati ichida degustatsiya sanalari va buyurtma tafsilotlari bo'yicha bog'lanamiz.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <span className="text-emerald-800 font-serif font-bold text-base block">
                  Xabaringiz Muvaffaqiyatli Yuborildi
                </span>
                <p className="text-xs text-emerald-700">
                  Rahmat, hurmatli {name || 'mehmon'}. Bosh qandolatchimiz tez orada {phone || email || 'ko\'rsatilgan raqam'} orqali siz bilan bog'lanadi.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-emerald-900 underline"
                >
                  Yana boshqa xabar yuborish
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="font-medium text-[#5E4D44] block mb-1">To'liq Ismingiz *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Malika Yusupova"
                      className="w-full px-3.5 py-2.5 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#5E4D44] block mb-1">Telefon Raqamingiz *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 (90) 123-4567"
                      className="w-full px-3.5 py-2.5 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-medium text-[#5E4D44] block mb-1">Elektron Pochta</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="malika@domain.uz"
                    className="w-full px-3.5 py-2.5 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#5E4D44] block mb-1">Tantana Tafsilotlari / Istaklaringiz *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tantana sanasi, mehmonlar soni, yoqqan ta'mlar yoki maxsus talablaringiz haqida yozing..."
                    className="w-full px-3.5 py-2.5 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="py-3 px-6 bg-[#2C2420] hover:bg-[#895737] text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Yuborilmoqda...' : 'Xabarni Yuborish'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
