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
      {/* Wave path removed in Masking approach - the panel itself is clipped */}
      
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
