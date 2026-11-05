import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Filter, Sparkles } from 'lucide-react';
import { Product, Category } from '../types.js';
import { ProductCard } from './ProductCard.js';

interface ProductCatalogViewProps {
  products: Product[];
  categories: Category[];
  onOpenDetails: (product: Product) => void;
  initialCategory?: string;
}

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({
  products,
  categories,
  onOpenDetails,
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(400);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'all' ||
          p.category_slug === selectedCategory ||
          p.category.toLowerCase() === selectedCategory.toLowerCase();

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.ingredients.some((i) => i.toLowerCase().includes(q));

        const matchesPrice = p.price <= maxPrice;
        const matchesStock = !inStockOnly || p.available;

        return matchesCategory && matchesSearch && matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'popular':
            return b.sales_count - a.sales_count;
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [products, selectedCategory, searchQuery, maxPrice, sortBy, inStockOnly]);

  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* Title Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#895737] uppercase">
            <Sparkles className="w-4 h-4 text-[#C59B62]" />
            <span>The Complete Patisserie Ledger</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2420]">
            Boutique Cake Catalog
          </h1>
          <p className="text-sm text-[#5E4D44] max-w-xl leading-relaxed">
            Discover artisanal celebration centerpieces, hand-sculpted wedding tiers, and decadent dark chocolate ganaches.
          </p>
        </div>

        {/* Filter Controls Strip */}
        <div className="p-5 bg-white rounded-3xl border border-[#E8DFD5] shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
            
            {/* Search Input (5 cols) */}
            <div className="lg:col-span-5 relative">
              <Search className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flavors, cake names, ingredients..."
                className="w-full pl-10 pr-4 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
              />
            </div>

            {/* Category Select (3 cols) */}
            <div className="lg:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
              >
                <option value="all">All Confectionery Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select (2 cols) */}
            <div className="lg:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4EFEA] border border-[#E8DFD5] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:ring-1 focus:ring-[#895737]"
              >
                <option value="featured">Featured First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Creations</option>
              </select>
            </div>

            {/* Price Max Slider (2 cols) */}
            <div className="lg:col-span-2 flex flex-col justify-center">
              <div className="flex justify-between text-[11px] text-[#5E4D44] mb-1">
                <span>Max:</span>
                <span className="font-bold text-[#2C2420] tabular-nums font-mono">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="650"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#895737] cursor-pointer h-1.5 bg-[#E8DFD5] rounded-lg"
              />
            </div>

          </div>

          {/* Quick Category Chips Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-[#F4EFEA] scrollbar-none">
            <span className="text-[11px] text-[#8C7A70] uppercase font-bold tracking-wider shrink-0 mr-1">
              Category:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#2C2420] text-[#FAF7F2] font-semibold'
                  : 'bg-[#F4EFEA] text-[#5E4D44] hover:bg-[#EFE8DE]'
              }`}
            >
              All ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === c.slug
                    ? 'bg-[#2C2420] text-[#FAF7F2] font-semibold'
                    : 'bg-[#F4EFEA] text-[#5E4D44] hover:bg-[#EFE8DE]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#8C7A70]">
          <span>
            Showing <strong className="text-[#2C2420]">{filteredProducts.length}</strong> cakes
          </span>
          {filteredProducts.length !== products.length && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setMaxPrice(650);
              }}
              className="text-[#895737] underline hover:text-[#2C2420]"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#E8DFD5] space-y-3 p-8">
            <h3 className="font-serif text-xl font-bold text-[#2C2420]">
              No confectionery matched your filter
            </h3>
            <p className="text-xs text-[#5E4D44] max-w-sm mx-auto">
              Try adjusting your price ceiling or selecting another category to view our handcrafted artisanal cakes.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setMaxPrice(650);
              }}
              className="px-6 py-2.5 bg-[#2C2420] hover:bg-[#895737] text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
