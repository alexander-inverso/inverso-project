import React from 'react';
import { GalleryItem } from '../types';

interface GallerySidebarProps {
  items: GalleryItem[];
  currentItemId: string;
  onSelect: (item: GalleryItem) => void;
}

export const GallerySidebar: React.FC<GallerySidebarProps> = ({ items, currentItemId, onSelect }) => {
  return (
    <div className="w-40 h-full flex-shrink-0 bg-gray-900 border-r border-white/10 flex flex-col overflow-hidden z-20">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Galería</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`w-full group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              item.id === currentItemId 
                ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                : 'border-transparent hover:border-white/20'
            }`}
          >
            <img 
              src={item.src} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors ${item.id === currentItemId ? 'bg-transparent' : ''}`} />
          </button>
        ))}
      </div>
    </div>
  );
};