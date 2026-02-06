import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WaveDivider from './WaveDivider';

const GeminiPortal: React.FC = () => {
  const [hoverState, setHoverState] = useState<'novis' | 'liling' | null>(null);

  const leftWidth = hoverState === 'novis' ? '60%' : hoverState === 'liling' ? '40%' : '50%';

  // Wave Path Variants for Tidal Animation
  const wavePathA = "M 0,0 L 0.9,0 C 1,0.2 0.8,0.4 0.9,0.6 C 1,0.8 0.8,1 0.9,1 L 0,1 Z";
  const wavePathB = "M 0,0 L 0.85,0 C 0.95,0.3 0.75,0.7 0.85,1 L 0,1 Z";

  return (
    <div className="relative w-screen h-screen flex overflow-hidden bg-liling-primary">
      {/* 
        Approach 3: Masking Effect (Enhanced with Tidal Animation)
      */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
            <motion.path
              animate={{
                d: [wavePathA, wavePathB, wavePathA]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </clipPath>
          <clipPath id="foam-clip" clipPathUnits="objectBoundingBox">
            <motion.path
              animate={{
                d: [wavePathB, wavePathA, wavePathB]
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </clipPath>
        </defs>
      </svg>

      {/* Foam Layer (Secondary Wave for depth) */}
      <motion.div
        className="h-full absolute top-0 left-0 bg-novis-accent opacity-20 z-10 pointer-events-none"
        animate={{ 
          width: `calc(${leftWidth} + 20px)`,
        }}
        style={{
          clipPath: 'url(#foam-clip)'
        }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Novis Side (Main Panel with Mask) */}
      <motion.div
        className="h-full relative overflow-hidden bg-novis-primary flex flex-col justify-center items-center p-12 text-center z-10"
        animate={{ 
          width: leftWidth,
        }}
        style={{
          clipPath: 'url(#wave-clip)'
        }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        onMouseEnter={() => setHoverState('novis')}
      >
        <div className="z-10">
          <h2 className="text-6xl font-bold text-novis-text mb-4 tracking-tighter uppercase">Novis</h2>
          <p className="text-novis-accent uppercase tracking-[0.3em] text-sm">理性與技術之海</p>
        </div>
        {/* Deep Sea Background Gradient */}
        <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-novis-primary via-novis-secondary to-novis-accent" />
        
        {/* Subtle animated "code rain" or particles could go here */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-novis-accent)_0%,_transparent_70%)]" />
      </motion.div>

      {/* Liling Side (Background Panel) */}
      <motion.div
        className="h-full relative flex flex-col justify-center items-center p-12 text-center flex-1 z-0"
        onMouseEnter={() => setHoverState('liling')}
      >
        <div className="z-10">
          <h2 className="text-6xl font-bold text-liling-text mb-4 tracking-tighter font-serif uppercase">Liling</h2>
          <p className="text-liling-accent uppercase tracking-[0.3em] text-sm">靈魂與觀察之火</p>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-liling-accent)_0%,_transparent_70%)]" />
      </motion.div>

      {/* WaveDivider: Renders the central button & handles the 13px alignment fix */}
      <WaveDivider 
        leftPosition={leftWidth}
      />
    </div>
  );
};

export default GeminiPortal;
