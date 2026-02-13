import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize, 
} from 'lucide-react';

interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onReset: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onRotate,
  onReset,
}) => {
  const btnClass = "p-3 hover:bg-white/10 rounded-lg transition-colors text-white/90 hover:text-white active:scale-95";

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-2xl z-50">
      
      <button onClick={onZoomOut} className={btnClass} title="Reducir Zoom">
        <ZoomOut size={20} />
      </button>
      
      <button onClick={onReset} className={btnClass} title="Restablecer Vista">
        <Maximize size={20} />
      </button>

      <button onClick={onZoomIn} className={btnClass} title="Aumentar Zoom">
        <ZoomIn size={20} />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1"></div>

      <button onClick={onRotate} className={btnClass} title="Rotar 90°">
        <RotateCw size={20} />
      </button>

    </div>
  );
};