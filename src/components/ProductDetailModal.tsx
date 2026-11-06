import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Clock, ShieldCheck, Check, Send, ChevronRight } from 'lucide-react';
import { Product, Review } from '../types.js';
import { useCart } from '../context/CartContext.js';
import { api } from '../services/api.js';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
  allProducts: Product[];
  onOrderNow: (product: Product, size: any, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectProduct,
  allProducts,
  onOrderNow,
}) => {
  const { addToCart } = useCart();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes[0] || { label: 'Standard', weight_grams: 1000, price: 80 }
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!product) return;
    setSelectedImageIdx(0);
    setSelectedSize(
      product.sizes[0] || { label: 'Standard', weight_grams: product.weight_grams, price: product.price }
    );
    setQuantity(1);

    async function loadReviews() {
      if (!product) return;
      setLoadingReviews(true);
      try {
        const data = await api.getReviews(product.id);
        setReviews(data);
      } catch (e) {
        console.error('Error fetching reviews:', e);
      } finally {
        setLoadingReviews(false);
      }
    }
    loadReviews();
  }, [product]);

  if (!product) return null;

  const images = product.images && product.images.length ? product.images : ['/src/assets/images/hero_signature_cake_1793864720413.jpg'];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) return;

    setIsSubmittingReview(true);
    try {
      const newRev = await api.createReview({
        product_id: product.id,
        user_name: reviewerName,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviews((prev) => [newRev, ...prev]);
      setReviewName('');
      setReviewComment('');
    } catch (err: any) {
      alert(`Could not submit review: ${err.message}`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const setReviewName = setReviewerName;

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Sticky Header with Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD5] bg-[#FAF7F2] shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#895737] font-medium uppercase tracking-wider">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>Semurug Maxsus Kolleksiyasi</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EFE8DE] text-[#5E4D44] hover:text-[#2C2420] transition-colors"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Gallery Column (5 cols) */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F4EFEA] border border-[#E8DFD5] shadow-sm">
                <img
                  src={images[selectedImageIdx] || images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIdx(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIdx === i ? 'border-[#895737] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quality Trust Card */}
              <div className="p-4 rounded-2xl bg-[#F4EFEA] border border-[#E8DFD5] space-y-2 text-xs text-[#5E4D44]">
                <div className="flex items-center gap-2 text-[#2C2420] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#895737]" />
                  <span>Semurug Soflik Standarti</span>
                </div>
                <p>
                  100% tabiiy fransuz sarayog'i, yangi toza tuxum va sun'iy konservantlarsiz. Har bir buyurtma uchun yangi pishiriladi.
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-[#895737]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Tayyorlash & yetiltirish vaqti: {product.preparation_time_hours} soat</span>
                </div>
              </div>
            </div>

            {/* Product Purchase Module Column (6 cols) */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2420] leading-tight">
                  {product.name}
                </h2>
                
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-[#2C2420] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-[#C59B62] text-[#C59B62]" />
                    <span className="tabular-nums">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[#8C7A70]">({product.review_count || reviews.length} mijozlar sharhi)</span>
                  <span className="text-[#8C7A70]">·</span>
                  <span className="text-[#895737] font-medium">{product.sales_count} bayramona buyurtma</span>
                </div>
              </div>

              {/* Dynamic Price Display */}
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-[#2C2420] tabular-nums">
                  ${selectedSize.price}
                </span>
                <span className="text-xs text-[#8C7A70]">
                  ({selectedSize.weight_grams} gramm)
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#5E4D44] leading-relaxed">
                {product.description}
              </p>

              {/* Size & Weight Options */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#2C2420] uppercase tracking-wider block">
                  O'lcham & Porsiya Miqdorini Tanlang:
                </label>
                <div className="space-y-2">
                  {product.sizes.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(s)}
                      className={`w-full p-3 rounded-xl text-left border flex items-center justify-between text-xs transition-all ${
                        selectedSize.label === s.label
                          ? 'border-[#2C2420] bg-white shadow-sm ring-1 ring-[#2C2420]'
                          : 'border-[#E8DFD5] bg-[#F4EFEA] hover:bg-white'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-[#2C2420]">{s.label}</span>
                        <span className="text-[#8C7A70] ml-2">({s.weight_grams} g)</span>
                      </div>
                      <span className="font-serif font-bold text-sm text-[#2C2420] tabular-nums">
                        ${s.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Buttons */}
              <div className="space-y-3 pt-3 border-t border-[#E8DFD5]">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-[#2C2420]">Miqdor:</span>
                  <div className="flex items-center border border-[#E8DFD5] bg-white rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 hover:bg-[#F4EFEA] text-[#2C2420] transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold tabular-nums">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 hover:bg-[#F4EFEA] text-[#2C2420] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      added
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#2C2420] text-[#FAF7F2] hover:bg-[#43352F] shadow-sm'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Savatga Qo'shildi</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Savatga Qo'shish</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOrderNow(product, selectedSize, quantity);
                    }}
                    className="py-3 px-4 rounded-xl text-xs font-semibold bg-[#895737] hover:bg-[#72452B] text-white shadow-sm transition-all active:scale-95 text-center"
                  >
                    Hoziroq Buyurtma Qilish
                  </button>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="pt-3 border-t border-[#E8DFD5] space-y-2">
                <span className="text-xs font-bold text-[#2C2420] uppercase tracking-wider block">
                  Tabiiy Masalliqlar Tarkibi:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="text-[11px] text-[#5E4D44] bg-[#F4EFEA] px-2.5 py-1 rounded-md border border-[#E8DFD5]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Customer Reviews Section */}
          <div className="pt-8 border-t border-[#E8DFD5] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2C2420]">
                  Mijozlar Fikrlari & Sharhlar
                </h3>
                <p className="text-xs text-[#5E4D44] mt-0.5">
                  Qandolatchilik shirinliklarimizni tatib ko'rgan xaridorlarimiz bahosi
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-600 font-bold text-lg">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="tabular-nums">{product.rating.toFixed(2)}</span>
                </div>
                <span className="text-[11px] text-[#8C7A70]">{reviews.length} ta sharh</span>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {loadingReviews ? (
                <div className="py-6 text-center text-xs text-[#8C7A70]">Sharhlar yuklanmoqda...</div>
              ) : reviews.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#8C7A70] bg-[#F4EFEA] rounded-2xl">
                  Ushbu nafis tortga birinchi bo'lib sharh qoldiring!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-white border border-[#E8DFD5] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#2C2420]">{rev.user_name}</span>
                        {rev.is_verified_purchase && (
                          <span className="text-[10px] text-emerald-800 font-medium">· Tasdiqlangan Xarid</span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#5E4D44] leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-[#8C7A70] block">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Leave a review form */}
            <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-[#F4EFEA] border border-[#E8DFD5] space-y-3">
              <h4 className="text-xs font-bold text-[#2C2420] uppercase tracking-wider">
                Fikr va Sharh Qoldirish
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Ismingiz (masalan: Malika Ziyo)"
                  className="px-3.5 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
                />
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#E8DFD5]">
                  <span className="text-xs text-[#5E4D44]">Baho:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setReviewRating(num)}
                        className="p-0.5"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            num <= reviewRating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <textarea
                required
                rows={2}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Tortning ta'mi, biskvit yumshoqligi va bayram taassurotlaringiz bilan bo'lishing..."
                className="w-full px-3.5 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
              />
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="py-2 px-5 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingReview ? 'Yuborilmoqda...' : 'Sharhni Yuborish'}</span>
              </button>
            </form>
          </div>

          {/* Related Collections */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-[#E8DFD5] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                Tavsiya Etiladigan Boshqa Tortlar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct(rel)}
                    className="p-3 bg-white rounded-2xl border border-[#E8DFD5] hover:border-[#895737] cursor-pointer transition-all flex items-center gap-3 group"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-[#2C2420] truncate group-hover:text-[#895737]">
                        {rel.name}
                      </h4>
                      <span className="text-xs font-serif font-bold text-[#895737] block mt-0.5 tabular-nums">
                        ${rel.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
