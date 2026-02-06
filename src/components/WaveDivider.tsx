import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface WaveDividerProps {
  leftPosition: MotionValue<number>;
  springConfig: any;
  oscillation?: MotionValue<number>;
}

const WaveDivider: React.FC<WaveDividerProps> = ({ leftPosition, springConfig, oscillation }) => {
  const combinedLeft = useTransform([leftPosition, oscillation || new motion.Value(0)], ([pos, osc]) => {
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
      {/* Yin-Yang / Dualism Button */}
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold cursor-pointer pointer-events-auto relative overflow-hidden border-2 border-white/10 shadow-2xl"
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        {/* Left Side (Lilin Color) */}
        <div className="absolute inset-y-0 left-0 right-1/2 bg-lilin-primary" />
        {/* Right Side (Novis Color) */}
        <div className="absolute inset-y-0 right-0 left-1/2 bg-novis-primary" />
        
        {/* Symbol with mixed colors */}
        <div className="relative flex w-full h-full items-center justify-center">
             <span className="absolute left-[calc(50%-12px)] text-novis-primary z-10">&</span>
             <span className="absolute right-[calc(50%-12px)] text-lilin-primary z-10">&</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WaveDivider;
