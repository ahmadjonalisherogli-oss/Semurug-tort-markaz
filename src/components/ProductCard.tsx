import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types.js';
import { useCart } from '../context/CartContext.js';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0], 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const imageSrc = product.images && product.images[0] ? product.images[0] : '/src/assets/images/hero_signature_cake_1793864720413.jpg';

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group flex flex-col bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#E8DFD5] hover:border-[#D4C5B9] hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* 65%-75% Visual Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4EFEA]">
        <img
          src={imageSrc}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Quiet Kicker / Status */}
        {product.best_seller && (
          <div className="absolute top-3 left-3 bg-[#2C2420]/80 backdrop-blur-sm text-[#FAF7F2] text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md">
            Hit Mahsulot
          </div>
        )}
        {!product.best_seller && product.is_new && (
          <div className="absolute top-3 left-3 bg-[#895737]/80 backdrop-blur-sm text-[#FAF7F2] text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md">
            Yangi Ijod
          </div>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-[#2C2420]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="px-4 py-2 bg-white/95 text-[#2C2420] text-xs font-semibold rounded-xl shadow-lg hover:bg-white flex items-center gap-1.5 transition-transform scale-95 group-hover:scale-100"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Batafsil Ko'rish</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-2 text-xs text-[#895737] font-medium tracking-wide">
            <span className="uppercase">{product.category}</span>
            <span aria-hidden="true" className="text-[#D4C5B9]">·</span>
            <span>{product.weight_grams} g</span>
            <span aria-hidden="true" className="text-[#D4C5B9]">·</span>
            <div className="flex items-center gap-1 text-[#2C2420]">
              <Star className="w-3 h-3 fill-[#C59B62] text-[#C59B62]" />
              <span className="tabular-nums font-semibold">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="font-serif text-lg font-bold text-[#2C2420] mt-1 line-clamp-1 group-hover:text-[#895737] transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-[#5E4D44] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-[#E8DFD5] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-[#8C7A70] block uppercase tracking-wider">Boshlang'ich narx</span>
            <div className="font-serif text-xl font-bold text-[#2C2420] tabular-nums">
              ${product.price}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!product.available}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
              added
                ? 'bg-emerald-700 text-white'
                : product.available
                ? 'bg-[#2C2420] text-[#FAF7F2] hover:bg-[#895737] shadow-sm'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            title="Savatga qo'shish"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Qo'shildi</span>
              </>
            ) : product.available ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Savatga</span>
              </>
            ) : (
              <span>Tugagan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
