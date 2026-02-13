import React, { useState } from 'react';
import { ImageViewer } from './components/ImageViewer';
import { Toolbar } from './components/Toolbar';
import { DEFAULT_TRANSFORM, TransformState } from './types';

// CONFIGURACIÓN DE LA IMAGEN
// Para cambiar la imagen, simplemente pega la nueva URL aquí.
const IMAGE_URL = "https://github.com/alexander-inverso/inverso-project/blob/479f504f6a0497445f47bb67abaa2d61671c0dfa/RELR/components/Imagen.png";

export default function App() {
  const [transform, setTransform] = useState<TransformState>(DEFAULT_TRANSFORM);

  // Acciones de la barra de herramientas
  const zoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 10) }));
  const zoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale * 0.8, 0.1) }));
  const rotate = () => setTransform(prev => ({ ...prev, rotation: prev.rotation + 90 }));
  const reset = () => setTransform(DEFAULT_TRANSFORM);

  return (
    <div className="w-full h-screen bg-gray-950 overflow-hidden flex flex-col relative font-sans">
      
      {/* Encabezado con toda la información del proyecto */}
      <div className="relative z-30 bg-gray-900 border-b border-white/10 p-4 shadow-lg flex-shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-blue-400 leading-tight">
            El escudo comestible
          </h1>
          <p className="text-sm text-white/80 hidden md:block">
            Cómo la química de tu cocina puede protegerte del sol
          </p>
        </div>
        
        <div className="text-right text-xs text-white/60 space-y-0.5">
          <p className="font-semibold text-white/90 text-sm">Alexander de Toro Todorov</p>
          <p>Tutora: M.ª del Mar Inda Pérez</p>
          <p>IES Radio Exterior, Alicante</p>
          <p className="text-blue-400/80 uppercase tracking-wider font-medium mt-1">
            Reporteros en la red 2026
          </p>
        </div>
      </div>

      {/* Área principal del visor */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 relative h-full bg-gray-950">
          
          <ImageViewer 
            imageSrc={IMAGE_URL} 
            transform={transform} 
            setTransform={setTransform}
          />

          <Toolbar 
            onZoomIn={zoomIn} 
            onZoomOut={zoomOut} 
            onRotate={rotate} 
            onReset={reset}
          />
        </div>
      </div>
    </div>
  );
}
