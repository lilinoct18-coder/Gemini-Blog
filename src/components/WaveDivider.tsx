import React from 'react';
import { motion } from 'framer-motion';

const WaveDivider: React.FC<{ 
  hoverState: 'novis' | 'liling' | null,
  leftPosition: string 
}> = ({ hoverState, leftPosition }) => {
  return (
    <motion.div 
      className="absolute top-0 h-full w-[200px] pointer-events-none z-20 flex items-center justify-center"
      animate={{ left: leftPosition }}
      style={{ x: '-50%' }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Wave deep */}
      <svg
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
      >
        <motion.path
          d="M50,0 C60,250 40,500 50,750 C60,1000 40,1250 50,1500 L0,1500 L0,0 Z"
          fill="#0a1628"
          animate={{
            d: hoverState === 'novis' 
              ? "M70,0 C80,250 60,500 70,750 C80,1000 60,1250 70,1500 L0,1500 L0,0 Z"
              : hoverState === 'liling'
              ? "M30,0 C40,250 20,500 30,750 C40,1000 20,1250 30,1500 L0,1500 L0,0 Z"
              : "M50,0 C60,250 40,500 50,750 C60,1000 40,1250 50,1500 L0,1500 L0,0 Z"
          }}
          transition={{ duration: 1.5, ease: [0.45, 0.05, 0.55, 0.95] }}
        />
      </svg>
      
      {/* Intersection Button */}
      <motion.div
        className="w-16 h-16 rounded-full bg-gradient-to-br from-novis-accent to-liling-accent flex items-center justify-center text-white text-3xl font-bold shadow-xl cursor-pointer pointer-events-auto"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        &
      </motion.div>
    </motion.div>
  );
};

export default WaveDivider;
