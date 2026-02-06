import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WaveDivider from './WaveDivider';

const GeminiPortal: React.FC = () => {
  const [hoverState, setHoverState] = useState<'novis' | 'liling' | null>(null);

  return (
    <div className="relative w-screen h-screen flex overflow-hidden bg-black">
      {/* Novis Side */}
      <motion.div
        className="h-full relative overflow-hidden bg-novis-primary flex flex-col justify-center items-center p-12 text-center"
        animate={{ width: hoverState === 'novis' ? '60%' : hoverState === 'liling' ? '40%' : '50%' }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        onMouseEnter={() => setHoverState('novis')}
      >
        <div className="z-10">
          <h2 className="text-6xl font-bold text-novis-text mb-4 tracking-tighter">NOVIS</h2>
          <p className="text-novis-accent uppercase tracking-[0.3em] text-sm">理性與技術之海</p>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-novis-accent)_0%,_transparent_70%)]" />
      </motion.div>

      {/* Liling Side */}
      <motion.div
        className="h-full relative overflow-hidden bg-liling-primary flex flex-col justify-center items-center p-12 text-center"
        animate={{ width: hoverState === 'liling' ? '60%' : hoverState === 'novis' ? '40%' : '50%' }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        onMouseEnter={() => setHoverState('liling')}
      >
        <div className="z-10">
          <h2 className="text-6xl font-bold text-liling-text mb-4 tracking-tighter font-serif">LILING</h2>
          <p className="text-liling-accent uppercase tracking-[0.3em] text-sm">靈魂與觀察之火</p>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-liling-accent)_0%,_transparent_70%)]" />
      </motion.div>

      <WaveDivider 
        hoverState={hoverState} 
        leftPosition={hoverState === 'novis' ? '60%' : hoverState === 'liling' ? '40%' : '50%'}
      />
    </div>
  );
};

export default GeminiPortal;
