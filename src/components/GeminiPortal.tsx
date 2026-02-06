import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WaveDivider from './WaveDivider';

const GeminiPortal: React.FC = () => {
  const [hoverState, setHoverState] = useState<'novis' | 'liling' | null>(null);

  return (
    <div className="relative w-screen h-screen flex overflow-hidden bg-liling-primary">
      {/* Novis Side (Dark Blue) */}
      <motion.div
        className="h-full relative overflow-hidden bg-novis-primary flex flex-col justify-center items-center p-12 text-center z-10"
        animate={{ 
          width: hoverState === 'novis' ? '60%' : hoverState === 'liling' ? '40%' : '50%',
        }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        onMouseEnter={() => setHoverState('novis')}
      >
        <div className="z-10">
          <h2 className="text-6xl font-bold text-novis-text mb-4 tracking-tighter uppercase">Novis</h2>
          <p className="text-novis-accent uppercase tracking-[0.3em] text-sm">理性與技術之海</p>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-novis-accent)_0%,_transparent_70%)]" />
      </motion.div>

      {/* Liling Side (Cream White - Background is also Cream White) */}
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

      <WaveDivider 
        leftPosition={hoverState === 'novis' ? '60%' : hoverState === 'liling' ? '40%' : '50%'}
      />
    </div>
  );
};

export default GeminiPortal;
