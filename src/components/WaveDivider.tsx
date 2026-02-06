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
      {/* Glassmorphism Button */}
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl font-light cursor-pointer pointer-events-auto backdrop-blur-md bg-white/10 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ 
          scale: 1.1, 
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderColor: "rgba(255, 255, 255, 0.4)",
          boxShadow: "0_0_30px_rgba(255,255,255,0.2)"
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <span className="opacity-80">&</span>
      </motion.div>
    </motion.div>
  );
};

export default WaveDivider;
