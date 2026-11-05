import React, { useState, useEffect } from 'react';
import { X, Search, Star, ArrowRight } from 'lucide-react';
import { Product } from '../types.js';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-20 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#E8DFD5] flex items-center gap-3 bg-[#FAF7F2]">
          <Search className="w-5 h-5 text-[#895737] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by flavor, occasion, ingredient (e.g. Pistachio, Valrhona, Wedding)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#2C2420] placeholder-[#8C7A70] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EFE8DE] text-[#5E4D44] hover:text-[#2C2420] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {query.trim() === '' ? (
            <div className="py-8 text-center space-y-3 text-xs text-[#8C7A70]">
              <span className="font-semibold text-[#2C2420] block">Popular Searches in the Boutique:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {['Valrhona Chocolate', 'Birthday Crown', 'Ivory Wedding', 'Passionfruit Tier', 'Bronte Pistachio'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 bg-white hover:bg-[#EFE8DE] rounded-xl border border-[#E8DFD5] text-[#895737] font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8C7A70]">
              No confectionery matched "{query}". Try searching for 'chocolate', 'vanilla', or 'wedding'.
            </div>
          ) : (
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-[#8C7A70] uppercase tracking-wider block">
                Found {results.length} Creations
              </span>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="p-3 bg-white rounded-2xl border border-[#E8DFD5] hover:border-[#895737] hover:shadow-md cursor-pointer transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={product.images[0] || '/src/assets/images/hero_signature_cake_1793864720413.jpg'}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 text-[10px] text-[#895737] font-semibold uppercase">
                        <span>{product.category}</span>
                        <span>·</span>
                        <span>{product.weight_grams}g</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#2C2420] group-hover:text-[#895737] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-[#5E4D44] line-clamp-1 mt-0.5">
                        {product.ingredients.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-serif font-bold text-sm text-[#2C2420] tabular-nums block">
                      ${product.price}
                    </span>
                    <span className="text-[10px] text-amber-700 flex items-center gap-0.5 justify-end">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{product.rating.toFixed(1)}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
