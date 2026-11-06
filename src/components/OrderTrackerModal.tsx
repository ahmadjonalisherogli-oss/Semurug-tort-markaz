import React, { useState } from 'react';
import { X, Search, Package, CheckCircle, Clock, Truck, ChefHat, Check } from 'lucide-react';
import { api } from '../services/api.js';
import { Order } from '../types.js';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

const STATUS_STEPS = [
  { key: 'Pending', label: 'Qabul qilindi', desc: 'Buyurtma oshxonaga navbatga qo\'yildi', icon: Clock },
  { key: 'Confirmed', label: 'Tasdiqlandi', desc: 'Masalliqlar tayyorlab qo\'yildi', icon: CheckCircle },
  { key: 'Preparing', label: 'Pishirish & Bezatish', desc: 'Qandolatchi tortni tayyorlamoqda', icon: ChefHat },
  { key: 'Ready', label: 'Tayyor & Sovutilmoqda', desc: 'Harorat kamerasida saqlanmoqda', icon: Check },
  { key: 'Delivering', label: 'Yetkazilmoqda', desc: 'Kuryer manzilga yo\'l oldi', icon: Truck },
  { key: 'Completed', label: 'Yetkazib berildi', desc: 'Mijozga ehtiyotkorlik bilan topshirildi', icon: CheckCircle },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber,
}) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const found = await api.getOrderById(orderQuery.trim().toUpperCase());
      setOrder(found);
    } catch (err: any) {
      setError(`Buyurtma #${orderQuery.trim()} topilmadi. Iltimos raqamni tekshirib qayta kiriting (masalan: SMR-8921).`);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const currentStepIdx = order
    ? STATUS_STEPS.findIndex((s) => s.key.toLowerCase() === order.status.toLowerCase())
    : -1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8DFD5] flex items-center justify-between bg-[#FAF7F2] shrink-0">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#895737]" />
            <h2 className="font-serif text-lg font-bold text-[#2C2420]">
              Buyurtmangizni Kuzatish
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Buyurtma raqamini kiriting (masalan: SMR-8921)"
                className="w-full px-4 py-2.5 bg-white border border-[#E8DFD5] rounded-xl text-xs font-mono uppercase text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Qidirilmoqda...' : 'Qidirish'}</span>
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          {/* Quick Demo Shortcuts */}
          {!order && !error && (
            <div className="p-4 rounded-2xl bg-[#F4EFEA] border border-[#E8DFD5] text-xs space-y-2 text-[#5E4D44]">
              <span className="font-semibold text-[#2C2420] block">Kuzatish uchun mavjud test buyurtmalar:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setOrderQuery('SMR-8921');
                    api.getOrderById('SMR-8921').then(setOrder);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-[#EFE8DE] rounded-lg border border-[#E8DFD5] font-mono font-semibold text-[#895737]"
                >
                  SMR-8921 (Tasdiqlangan)
                </button>
                <button
                  onClick={() => {
                    setOrderQuery('SMR-8922');
                    api.getOrderById('SMR-8922').then(setOrder);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-[#EFE8DE] rounded-lg border border-[#E8DFD5] font-mono font-semibold text-[#895737]"
                >
                  SMR-8922 (Pishirilmoqda)
                </button>
              </div>
            </div>
          )}

          {/* Found Order Card */}
          {order && (
            <div className="space-y-6">
              <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-[#8C7A70] uppercase tracking-wider block">Buyurtma Raqami</span>
                  <div className="font-mono text-lg font-bold text-[#2C2420]">
                    #{order.order_number}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#8C7A70] uppercase tracking-wider block">Yetkazish Vaqti</span>
                  <div className="text-xs font-semibold text-[#2C2420]">
                    {order.delivery_date} · {order.delivery_time}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#8C7A70] uppercase tracking-wider block">Hozirgi Holat</span>
                  <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold text-xs">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="p-6 bg-white rounded-2xl border border-[#E8DFD5] space-y-6">
                <h3 className="font-serif text-sm font-bold text-[#2C2420] uppercase tracking-wider">
                  Buyurtma Bajarilish Bosqichlari
                </h3>

                <div className="space-y-6">
                  {STATUS_STEPS.map((step, idx) => {
                    const isDone = currentStepIdx >= idx;
                    const isCurrent = currentStepIdx === idx;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex gap-4 items-start relative">
                        {/* Connecting Line */}
                        {idx < STATUS_STEPS.length - 1 && (
                          <div
                            className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-px ${
                              currentStepIdx > idx ? 'bg-[#895737]' : 'bg-[#E8DFD5]'
                            }`}
                          />
                        )}

                        {/* Dot / Icon */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 z-10 ${
                            isCurrent
                              ? 'bg-[#895737] border-[#895737] text-white shadow-md'
                              : isDone
                              ? 'bg-[#2C2420] border-[#2C2420] text-white'
                              : 'bg-white border-[#E8DFD5] text-[#8C7A70]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold ${
                                isCurrent ? 'text-[#895737]' : isDone ? 'text-[#2C2420]' : 'text-[#8C7A70]'
                              }`}
                            >
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-semibold text-[#895737] uppercase">
                                Hozirgi Bosqich
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5E4D44] mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="p-4 bg-[#F4EFEA] rounded-2xl border border-[#E8DFD5] space-y-2 text-xs">
                <span className="font-bold text-[#2C2420] block uppercase tracking-wider text-[11px]">
                  Buyurtma Qilingan Tortlar:
                </span>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-[#5E4D44]">
                    <span>{item.quantity}x {item.name} ({item.size_label})</span>
                    <span className="tabular-nums font-mono text-[#2C2420]">${item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#E8DFD5] flex justify-between font-bold text-[#2C2420]">
                  <span>Jami To'lov:</span>
                  <span className="tabular-nums font-mono">${order.total}</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
