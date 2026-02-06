import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface WaveDividerProps {
  leftPosition: string;
  springConfig: any;
  oscillation?: MotionValue<number>;
}

const WaveDivider: React.FC<WaveDividerProps> = ({ leftPosition, springConfig, oscillation }) => {
  // 將物理位置 (leftPosition) 與 波動偏移 (oscillation) 結合
  // 因為 leftPosition 是字串 "50%"，我們需要處理一下
  const combinedLeft = useTransform(oscillation || new motion.Value(0), (o) => {
    return `calc(${leftPosition} + ${o * 100}vw)`;
  });

  return (
    <motion.div 
      className="absolute top-0 h-full w-[200px] pointer-events-none z-20 flex items-center justify-center"
      initial={{ left: '0%' }}
      style={{ 
        left: oscillation ? combinedLeft : leftPosition,
        x: 'calc(-50% + 13px)' 
      }}
      animate={{ 
        // 當 leftPosition 改變時，Framer Motion 會自動處理 spring
        left: oscillation ? undefined : leftPosition 
      }}
      transition={springConfig}
    >
      {/* Intersection Button */}
      <motion.div
        className="w-16 h-16 rounded-full bg-gradient-to-br from-novis-accent to-lilin-accent flex items-center justify-center text-white text-3xl font-bold shadow-xl cursor-pointer pointer-events-auto"
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
