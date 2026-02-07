import React from 'react';
import { motion, motionValue, MotionValue, useTransform } from 'framer-motion';

interface WaveDividerProps {
  leftPosition: MotionValue<number>;
  springConfig: any;
  oscillation?: MotionValue<number>;
}

const WaveDivider: React.FC<WaveDividerProps> = ({ leftPosition, springConfig: _springConfig, oscillation }) => {
  // 結合平滑的基礎位置與波動偏移
  const combinedLeft = useTransform([leftPosition, oscillation || motionValue(0)], ([pos, osc]) => {
    return `calc(${(pos as number) * 100}% + ${(osc as number) * 100}vw)`;
  });

  return (
    <motion.div 
      className="absolute top-0 h-full w-[200px] pointer-events-none z-20 flex items-center justify-center"
      style={{ 
        left: combinedLeft,
        x: 'calc(-50% + 13px)' 
      }}
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
