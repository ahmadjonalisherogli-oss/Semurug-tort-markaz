import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { ShopSettings } from '../types.js';

interface Props {
  settings?: ShopSettings;
}

export const AnnouncementBar: React.FC<Props> = ({ settings }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !settings?.banner_active) return null;

  return (
    <div className="bg-[#2C2420] text-[#FAF7F2] text-xs py-2 px-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center text-[#E8DFD5]">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
          <span className="font-medium tracking-wide">
            {settings.banner_text || '$80 dan yuqori premium buyurtmalar uchun maxsus kuryer orqali yetkazib berish bepul · Soat 14:00 gacha tezkor buyurtmalar'}
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:text-[#D4A373] transition-colors rounded"
          aria-label="E'lonni yopish"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
