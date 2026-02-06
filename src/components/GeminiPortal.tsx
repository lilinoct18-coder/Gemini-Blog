import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WaveDivider from './WaveDivider';

const GeminiPortal: React.FC = () => {
  const [hoverState, setHoverState] = useState<'novis' | 'liling' | null>(null);

  const [targetPos, setTargetPos] = useState(0.5);
  
  const basePos = targetPos; 

  const getWavePath = (x: number, offset: number) => {
    const x1 = x;
    const x2 = x + offset;
    const x3 = x - offset;
    return `M 0,0 L ${x1},0 C ${x2},0.2 ${x3},0.4 ${x1},0.6 C ${x2},0.8 ${x3},1 ${x1},1 L 0,1 Z`;
  };

  // Entrance paths starting from the far left (x=0)
  const startPath = getWavePath(0, 0.05);
  const startPathFoam = getWavePath(0, 0.08);

  const pathNormal = getWavePath(basePos, 0.05);
  const pathWide = getWavePath(basePos, 0.08);

  // Majestic slow spring for initial entrance and transitions
  const majesticSpring: any = {
    type: "spring",
    stiffness: 15, // Majestic slowness
    damping: 20,
    mass: 1.5
  };

  return (
    <div className="relative w-screen h-screen flex overflow-hidden bg-liling-primary">
      {/* 
        Approach 3: Masking Effect (Enhanced with slow majestic entrance from left)
      */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
            <motion.path
              initial={{ d: startPath }}
              animate={{
                d: pathNormal
              }}
              transition={majesticSpring}
            />
          </clipPath>
          <clipPath id="foam-clip" clipPathUnits="objectBoundingBox">
            <motion.path
              initial={{ d: startPathFoam }}
              animate={{
                d: pathWide
              }}
              transition={{ ...majesticSpring, stiffness: 10, mass: 2 }}
            />
          </clipPath>
        </defs>
      </svg>

      {/* Liling Side (Static Background) */}
      <div className="absolute inset-0 bg-liling-primary flex flex-col justify-center items-center p-12 text-center z-0">
        <div className="z-10 ml-[25%] w-[50%]"> 
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
        <div className="z-10 mr-[25%] w-[50%]"> 
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
        onMouseEnter={() => {
          setHoverState('novis');
          setTargetPos(0.6);
        }}
      />
      <div 
        className="absolute top-0 right-0 h-full z-30 cursor-pointer" 
        style={{ width: `${(1 - basePos) * 100}%` }}
        onMouseEnter={() => {
          setHoverState('liling');
          setTargetPos(0.4);
        }}
      />

      <WaveDivider 
        leftPosition={`${basePos * 100}%`}
      />
    </div>
  );
};

export default GeminiPortal;
