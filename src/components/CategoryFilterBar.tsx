import React from 'react';
import { Category } from '../types.js';

interface CategoryFilterBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

const UZ_CATEGORY_NAMES: Record<string, string> = {
  'Birthday Cakes': "Tug'ilgan Kun Tortlari",
  'Wedding Cakes': "To'y Tortlari",
  'Chocolate Cakes': "Shokoladli Tortlar",
  'Fruit Cakes': "Mevali Tortlar",
  'Cream Cakes': "Kremli Tortlar",
  'Custom Cakes': "Maxsus Buyurtma Tortlar",
  "Children's Cakes": "Bolalar Tortlari",
  'Special Occasion Cakes': "Tantanali Marosim Tortlari",
};

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 p-1.5 bg-[#F4EFEA] rounded-2xl border border-[#E8DFD5] w-max max-w-full">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm font-semibold'
              : 'text-[#5E4D44] hover:text-[#2C2420] hover:bg-[#EFE8DE]'
          }`}
        >
          Barcha Kolleksiyalar
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          const displayName = UZ_CATEGORY_NAMES[cat.name] || cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm font-semibold'
                  : 'text-[#5E4D44] hover:text-[#2C2420] hover:bg-[#EFE8DE]'
              }`}
            >
              {displayName}
            </button>
          );
        })}
      </div>
    </div>
  );
};
