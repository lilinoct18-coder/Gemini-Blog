import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WaveDivider from './WaveDivider';

const GeminiPortal: React.FC = () => {
  const [hoverState, setHoverState] = useState<'novis' | 'liling' | null>(null);

  // The base split line position (0 to 1)
  const basePos = hoverState === 'novis' ? 0.6 : hoverState === 'liling' ? 0.4 : 0.5;

  // We use 8 points for a smooth, stable wave that won't "fold"
  // Each path must have the same number of points and same command types
  const getWavePath = (x: number, offset: number) => {
    const x1 = x;
    const x2 = x + offset;
    const x3 = x - offset;
    return `M 0,0 L ${x1},0 C ${x2},0.2 ${x3},0.4 ${x1},0.6 C ${x2},0.8 ${x3},1 ${x1},1 L 0,1 Z`;
  };

  // Tidal variants
  const pathNormal = getWavePath(basePos, 0.05);
  const pathWide = getWavePath(basePos, 0.08);
  const pathNarrow = getWavePath(basePos, 0.03);

  return (
    <div className="relative w-screen h-screen flex overflow-hidden bg-liling-primary">
      {/* 
        PRO ARCHITECTURE:
        1. Novis panel is FULL SCREEN but clipped. 
        2. clipPath uses objectBoundingBox relative to the FULL SCREEN.
        3. This prevents aspect ratio distortion when the panel width changes.
      */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
            <motion.path
              animate={{
                d: [pathNormal, pathWide, pathNarrow, pathNormal]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear" // Linear for smoother loop
              }}
            />
          </clipPath>
          <clipPath id="foam-clip" clipPathUnits="objectBoundingBox">
            <motion.path
              animate={{
                d: [pathWide, pathNarrow, pathNormal, pathWide]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </clipPath>
        </defs>
      </svg>

      {/* Liling Side (Static Background) */}
      <div className="absolute inset-0 bg-liling-primary flex flex-col justify-center items-center p-12 text-center z-0">
        <div className="z-10 ml-[25%] w-[50%]"> {/* Shift content right to stay in Liling territory */}
          <h2 className="text-6xl font-bold text-liling-text mb-4 tracking-tighter font-serif uppercase">Liling</h2>
          <p className="text-liling-accent uppercase tracking-[0.3em] text-sm">靈魂與觀察之火</p>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_75%_center,_var(--color-liling-accent)_0%,_transparent_70%)]" />
      </div>

      {/* Foam Overlay (Clipped from Full Screen) */}
      <motion.div
        className="absolute inset-0 bg-novis-accent opacity-10 z-10 pointer-events-none"
        style={{ clipPath: 'url(#foam-clip)' }}
      />

      {/* Novis Side (Clipped from Full Screen) */}
      <motion.div
        className="absolute inset-0 bg-novis-primary flex flex-col justify-center items-center p-12 text-center z-20 pointer-events-none"
        style={{ clipPath: 'url(#wave-clip)' }}
      >
        <div className="z-10 mr-[25%] w-[50%]"> {/* Shift content left to stay in Novis territory */}
          <h2 className="text-6xl font-bold text-novis-text mb-4 tracking-tighter uppercase">Novis</h2>
          <p className="text-novis-accent uppercase tracking-[0.3em] text-sm">理性與技術之海</p>
        </div>
        <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-novis-primary via-novis-secondary to-novis-accent" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_25%_center,_var(--color-novis-accent)_0%,_transparent_70%)]" />
      </motion.div>

      {/* Hover Detectors (Invisible divs to capture mouse) */}
      <div 
        className="absolute top-0 left-0 h-full z-30 cursor-pointer" 
        style={{ width: `${basePos * 100}%` }}
        onMouseEnter={() => setHoverState('novis')}
      />
      <div 
        className="absolute top-0 right-0 h-full z-30 cursor-pointer" 
        style={{ width: `${(1 - basePos) * 100}%` }}
        onMouseEnter={() => setHoverState('liling')}
      />

      <WaveDivider 
        leftPosition={`${basePos * 100}%`}
      />
    </div>
  );
};

export default GeminiPortal;
