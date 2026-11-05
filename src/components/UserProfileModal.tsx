import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Package, LogOut, Save, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Order, CustomOrder } from '../types.js';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (orderNum: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onTrackOrder,
}) => {
  const { user, logout, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFullName(user.full_name);
      setPhone(user.phone || '');
      setAddress(user.address || '');

      setLoadingOrders(true);
      Promise.all([api.getOrders(), api.getCustomOrders()])
        .then(([ord, cst]) => {
          setOrders(ord);
          setCustomOrders(cst);
        })
        .finally(() => setLoadingOrders(false));
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile({ full_name: fullName, phone, address });
      alert('Profile details updated successfully');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8DFD5] flex items-center justify-between bg-[#FAF7F2] shrink-0">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-[#895737]" />
            <h2 className="font-serif text-lg font-bold text-[#2C2420]">
              My Patron Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EFE8DE] text-[#5E4D44] hover:text-[#2C2420] transition-colors"
            aria-label="Close profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* User Badge */}
          <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#895737] text-white flex items-center justify-center text-lg font-bold">
                {user.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#2C2420]">{user.full_name}</h3>
                <span className="text-xs text-[#8C7A70]">{user.email}</span>
                {user.role === 'admin' && (
                  <span className="ml-2 text-[10px] bg-[#2C2420] text-[#D4A373] px-2 py-0.5 rounded font-bold uppercase">
                    Admin Privileges
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-3.5 py-1.5 border border-[#E8DFD5] hover:bg-rose-50 text-rose-700 hover:border-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Profile Editing Form */}
          <form onSubmit={handleUpdate} className="p-5 bg-white rounded-2xl border border-[#E8DFD5] space-y-3.5 shadow-sm text-xs">
            <h4 className="font-serif text-sm font-bold text-[#2C2420] uppercase tracking-wider">
              Contact & Preferred Delivery Details
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-[#5E4D44] block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-[#2C2420]"
                />
              </div>
              <div>
                <label className="font-medium text-[#5E4D44] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-[#2C2420]"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-[#5E4D44] block mb-1">Default Delivery Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-[#2C2420]"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 bg-[#2C2420] hover:bg-[#895737] text-white rounded-xl font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isUpdating ? 'Saving...' : 'Update Details'}</span>
              </button>
            </div>
          </form>

          {/* Past Orders */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#2C2420] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#895737]" />
              <span>Your Orders & Celebrations</span>
            </h4>

            {loadingOrders ? (
              <div className="text-center py-6 text-xs text-[#8C7A70]">Loading your order archive...</div>
            ) : orders.length === 0 && customOrders.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-[#E8DFD5] text-xs text-[#8C7A70]">
                You have not placed any orders yet. Explore our handcrafted collection to reserve your first cake!
              </div>
            ) : (
              <div className="space-y-2.5">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 bg-white rounded-2xl border border-[#E8DFD5] flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-[#2C2420]">#{o.order_number}</strong>
                        <span className="px-2 py-0.5 bg-[#F4EFEA] text-[#895737] rounded font-semibold text-[10px]">
                          {o.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5E4D44] mt-1">
                        {o.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                      </div>
                      <div className="text-[10px] text-[#8C7A70] mt-0.5">
                        Scheduled: {o.delivery_date} ({o.delivery_time})
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-sm text-[#2C2420] tabular-nums">
                        ${o.total}
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          onTrackOrder(o.order_number);
                        }}
                        className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EFE8DE] border border-[#E8DFD5] rounded-xl text-xs font-semibold text-[#895737] transition-colors"
                      >
                        Track Status
                      </button>
                    </div>
                  </div>
                ))}

                {/* Custom Orders */}
                {customOrders.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 bg-white rounded-2xl border border-[#E8DFD5] flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-[#895737]">#{c.order_number}</strong>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold text-[10px]">
                          Bespoke: {c.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5E4D44] mt-1">
                        {c.cake_type} ({c.weight_kg}kg) · {c.flavor}
                      </div>
                    </div>

                    <span className="font-serif font-bold text-sm text-[#2C2420] tabular-nums">
                      ${c.estimated_price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
