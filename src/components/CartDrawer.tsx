import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.js';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    total,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const amountUntilFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#E8DFD5] shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#E8DFD5] flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#895737]" />
              <h2 className="font-serif text-lg font-bold text-[#2C2420]">
                Your Patisserie Bag
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#EFE8DE] text-[#5E4D44] hover:text-[#2C2420] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Threshold Progress */}
          <div className="px-6 py-3.5 bg-[#F4EFEA] border-b border-[#E8DFD5] space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-[#2C2420]">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B62]" />
                {amountUntilFreeDelivery === 0 ? (
                  <span className="font-semibold text-emerald-800">
                    Complimentary White-Glove Delivery Unlocked!
                  </span>
                ) : (
                  <span>
                    Add <strong className="tabular-nums text-[#895737]">${amountUntilFreeDelivery}</strong> more for complimentary delivery
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#8C7A70] tabular-nums font-mono">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-[#E8DFD5] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#895737] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#F4EFEA] flex items-center justify-center text-[#8C7A70]">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#2C2420]">Your bag is empty</h3>
                <p className="text-xs text-[#5E4D44] max-w-xs mx-auto">
                  Explore our handcrafted artisanal cakes and bespoke creations to curate your celebration.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-white rounded-2xl border border-[#E8DFD5] flex gap-3.5 shadow-sm"
                >
                  <img
                    src={item.product.images[0] || '/src/assets/images/hero_signature_cake_1793864720413.jpg'}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-xs font-bold text-[#2C2420] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8C7A70] hover:text-rose-700 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#8C7A70] mt-0.5">
                        {item.size.label} · {item.size.weight_grams}g
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#F4EFEA]">
                      <div className="flex items-center border border-[#E8DFD5] rounded-lg overflow-hidden bg-[#FAF7F2]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-xs text-[#2C2420] hover:bg-[#EFE8DE]"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-xs text-[#2C2420] hover:bg-[#EFE8DE]"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-serif text-sm font-bold text-[#2C2420] tabular-nums">
                        ${item.size.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E8DFD5] bg-[#FAF7F2] space-y-3">
              <div className="space-y-1.5 text-xs text-[#5E4D44]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[#2C2420] tabular-nums font-mono">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>White-Glove Hand Delivery:</span>
                  <span className="tabular-nums font-mono">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-800 font-semibold">Complimentary ($0)</span>
                    ) : (
                      `$${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#2C2420] pt-2 border-t border-[#E8DFD5]">
                  <span>Total Amount:</span>
                  <span className="tabular-nums">${total}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-6 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
