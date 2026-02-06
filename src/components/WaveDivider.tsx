import React from 'react';
import { motion } from 'framer-motion';

const WaveDivider: React.FC<{ 
  leftPosition: string 
}> = ({ leftPosition }) => {
  return (
    <motion.div 
      className="absolute top-0 h-full w-[200px] pointer-events-none z-20 flex items-center justify-center"
      animate={{ left: leftPosition }}
      style={{ x: 'calc(-50% + 13px)' }} /* 稍微向右偏移 13px 確保完全遮蓋藍色板子的直邊 */
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Wave deep */}
      <svg
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
      >
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0a1628" />
            <stop offset="100%" stopColor="#1a2744" />
          </linearGradient>
        </defs>
        <path
          d="M50,0 C70,250 30,500 50,750 C70,1000 30,1250 50,1500 L0,1500 L0,0 Z"
          fill="url(#wave-gradient)"
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
