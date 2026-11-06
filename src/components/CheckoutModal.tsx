import React, { useState } from 'react';
import { X, CheckCircle, Clock, ShieldCheck, ArrowRight, CreditCard, Truck, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Order } from '../types.js';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('14:00 - 16:00');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card_on_delivery' | 'cash_on_delivery' | 'online_card'>('card_on_delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !deliveryAddress || !deliveryDate) {
      alert('Please fill in your name, phone number, delivery address, and date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        price: item.size.price,
        quantity: item.quantity,
        size_label: item.size.label,
        weight_grams: item.size.weight_grams,
        image: item.product.images[0] || '/src/assets/images/hero_signature_cake_1793864720413.jpg',
      }));

      const created = await api.createOrder({
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        delivery_address: deliveryAddress,
        delivery_date: deliveryDate,
        delivery_time: deliveryTime,
        order_notes: orderNotes,
        items: orderItems,
        payment_method: paymentMethod,
      });

      // Clear cart
      clearCart();
      setConfirmedOrder(created);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4A373', '#895737', '#2C2420', '#C59B62'],
        });
      } catch (err) {
        // Confetti optional
      }

      onOrderSuccess(created);
    } catch (err: any) {
      alert(`Could not place order: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8DFD5] flex items-center justify-between bg-[#FAF7F2] shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-bold text-[#2C2420]">
              {confirmedOrder ? 'Buyurtma Tasdig\'i' : 'Buyurtmani Rasmiylashtirish'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EFE8DE] text-[#5E4D44] hover:text-[#2C2420] transition-colors"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">
          {confirmedOrder ? (
            /* Confirmation View */
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-semibold text-[#895737] uppercase tracking-widest block">
                  Ishonchingiz Uchun Rahmat
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#2C2420] mt-1">
                  Buyurtmangiz Muvaffaqiyatli Qabul Qilindi
                </h3>
                <div className="mt-3 inline-block px-4 py-1.5 bg-[#2C2420] text-[#D4A373] text-sm font-mono font-bold rounded-xl tracking-wider">
                  Buyurtma #{confirmedOrder.order_number}
                </div>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border border-[#E8DFD5] text-left text-xs space-y-2 text-[#5E4D44]">
                <div className="flex justify-between py-1 border-b border-[#F4EFEA]">
                  <span>Qabul qiluvchi:</span>
                  <strong className="text-[#2C2420]">{confirmedOrder.customer_name}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F4EFEA]">
                  <span>Yetkazish sanasi:</span>
                  <strong className="text-[#2C2420]">{confirmedOrder.delivery_date} ({confirmedOrder.delivery_time})</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F4EFEA]">
                  <span>Yetkazish manzili:</span>
                  <strong className="text-[#2C2420]">{confirmedOrder.delivery_address}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F4EFEA]">
                  <span>Jami to'lov:</span>
                  <strong className="text-[#2C2420] font-serif text-sm">${confirmedOrder.total}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Hozirgi holat:</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold text-[11px]">
                    {confirmedOrder.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#5E4D44] max-w-sm mx-auto">
                Qandolatchilarimiz buyurtmangizni qabul qilib, tayyorgarlikni boshladi. Buyurtma raqamingiz orqali holatni istalgan paytda kuzatishingiz mumkin.
              </p>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
                >
                  Bosh Sahifaga Qaytish
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Order Items Snapshot */}
              <div className="p-4 bg-[#F4EFEA] rounded-2xl border border-[#E8DFD5] space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#2C2420] uppercase tracking-wider">
                  <span>Buyurtma Mahsulotlari ({items.length})</span>
                  <span>${subtotal}</span>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs text-[#5E4D44]">
                      <span>
                        {item.quantity}x {item.product.name} ({item.size.label})
                      </span>
                      <span className="tabular-nums font-mono text-[#2C2420]">
                        ${item.size.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="space-y-4">
                <h3 className="font-serif text-base font-bold text-[#2C2420] flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#895737]" />
                  <span>Yetkazib Berish Manzili & Qabul Qiluvchi</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">
                      To'liq Ism Sharifingiz *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Malika Ziyo"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">
                      Telefon Raqami (Kuryer bog'lanishi uchun) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">
                      Elektron Pochta (Chek uchun)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mijoz@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1">
                      Aniq Yetkazish Manzili *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Toshkent sh., Navoiy ko'chasi 45-uy, 4-xonadon"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#895737]" />
                      <span>Yetkazish Sanasi *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#5E4D44] block mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#895737]" />
                      <span>Yetkazish Vaqti Oralig'i</span>
                    </label>
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                    >
                      <option value="10:00 - 12:00">10:00 - 12:00 (Ertalab)</option>
                      <option value="12:00 - 14:00">12:00 - 14:00 (Tushda)</option>
                      <option value="14:00 - 16:00">14:00 - 16:00 (Tushdan keyin)</option>
                      <option value="16:00 - 18:00">16:00 - 18:00 (Kechki payt)</option>
                      <option value="18:00 - 20:00">18:00 - 20:00 (Kechqurun)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#5E4D44] block mb-1">
                    Kuryer Uchun Maxsus Izohlar
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Domofon kodi, eshik qo'ng'irog'i yoki tabrik qutlov yozuvi..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2">
                <h3 className="font-serif text-base font-bold text-[#2C2420] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#895737]" />
                  <span>To'lov Usulini Tanlang</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card_on_delivery')}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      paymentMethod === 'card_on_delivery'
                        ? 'border-[#2C2420] bg-white ring-1 ring-[#2C2420] shadow-sm'
                        : 'border-[#E8DFD5] bg-[#F4EFEA] hover:bg-white'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#2C2420]">Yetkazilganda Karta orqali</div>
                    <div className="text-[10px] text-[#8C7A70] mt-0.5">Eshik oldida POS terminal</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-[#2C2420] bg-white ring-1 ring-[#2C2420] shadow-sm'
                        : 'border-[#E8DFD5] bg-[#F4EFEA] hover:bg-white'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#2C2420]">Yetkazilganda Naqd pulda</div>
                    <div className="text-[10px] text-[#8C7A70] mt-0.5">Tortni ko'rib to'lash</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online_card')}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      paymentMethod === 'online_card'
                        ? 'border-[#2C2420] bg-white ring-1 ring-[#2C2420] shadow-sm'
                        : 'border-[#E8DFD5] bg-[#F4EFEA] hover:bg-white'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#2C2420]">Onlayn Karta / Payme</div>
                    <div className="text-[10px] text-[#8C7A70] mt-0.5">Tezkor xavfsiz to'lov</div>
                  </button>
                </div>
              </div>

              {/* Price Breakdown & Submission */}
              <div className="pt-4 border-t border-[#E8DFD5] space-y-3">
                <div className="space-y-1.5 text-xs text-[#5E4D44]">
                  <div className="flex justify-between">
                    <span>Oraliq summa:</span>
                    <span className="font-bold text-[#2C2420] tabular-nums font-mono">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ehtiyotkor yetkazib berish:</span>
                    <span className="tabular-nums font-mono">
                      {deliveryFee === 0 ? <span className="text-emerald-800 font-semibold">Bepul ($0)</span> : `$${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-serif font-bold text-[#2C2420] pt-2 border-t border-[#E8DFD5]">
                    <span>Jami to'lanadigan summa:</span>
                    <span className="tabular-nums">${total}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full py-4 px-6 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
                  <span>{isSubmitting ? 'Buyurtma rasmiylashtirilmoqda...' : `Buyurtmani Tasdiqlash · $${total}`}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
