import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WaveDivider from './WaveDivider';

const GeminiPortal: React.FC = () => {
  const [hoverState, setHoverState] = useState<'novis' | 'liling' | null>(null);

  const leftWidth = hoverState === 'novis' ? '60%' : hoverState === 'liling' ? '40%' : '50%';

  return (
    <div className="relative w-screen h-screen flex overflow-hidden bg-liling-primary">
      {/* 
        Approach 3: Masking Effect
        The Novis panel is now clipped by an SVG mask that moves with the divider.
      */}
      <svg width="0" height="0">
        <defs>
          <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
            {/* 
              This is a normalized path for objectBoundingBox (0 to 1).
              M 0.5, 0  means the wave starts at 50% width.
              We adjust the horizontal points to match our wave shape.
            */}
            <path d="M 0,0 L 0.9,0 C 1,0.25 0.8,0.5 0.9,0.75 C 1,1 0.8,1 0.9,1 L 0.9,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Novis Side */}
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
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-novis-primary via-novis-secondary to-novis-accent" />
      </motion.div>

      {/* Liling Side */}
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

      {/* In this approach, WaveDivider only renders the button since the panel itself is clipped */}
      <WaveDivider 
        leftPosition={leftWidth}
      />
    </div>
  );
};

export default GeminiPortal;
