import React, { useRef, useState } from 'react';
import { TransformState } from '../types';

interface ImageViewerProps {
  imageSrc: string;
  transform: TransformState;
  setTransform: React.Dispatch<React.SetStateAction<TransformState>>;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  imageSrc,
  transform,
  setTransform,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Handle Mouse Wheel (Zoom)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleSensitivity = 0.001;
    const delta = -e.deltaY * scaleSensitivity;
    const newScale = Math.min(Math.max(0.1, transform.scale + delta), 10);

    setTransform((prev) => ({
      ...prev,
      scale: newScale,
    }));
  };

  // Handle Mouse Down (Start Pan)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPan({ x: e.clientX - transform.positionX, y: e.clientY - transform.positionY });
  };

  // Handle Mouse Move (Panning)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - startPan.x;
    const newY = e.clientY - startPan.y;

    setTransform((prev) => ({
      ...prev,
      positionX: newX,
      positionY: newY,
    }));
  };

  // Handle Mouse Up/Leave (End Pan)
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden cursor-${isDragging ? 'grabbing' : 'grab'} checkerboard flex items-center justify-center bg-gray-900/50`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Wrapper for transforms */}
      <div
        style={{
          transform: `translate(${transform.positionX}px, ${transform.positionY}px) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          transformOrigin: 'center',
        }}
        className="will-change-transform"
      >
        <img
          src={imageSrc}
          alt="Visor"
          className="max-w-none shadow-2xl pointer-events-none select-none"
          draggable={false}
        />
      </div>
      
      {/* Zoom Level Indicator */}
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white/80 pointer-events-none select-none z-10">
        {Math.round(transform.scale * 100)}%
      </div>
    </div>
  );
};