import React from 'react';
import { Category } from '../types.js';

interface CategoryFilterBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

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
          All Collections
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat.slug;
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
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
