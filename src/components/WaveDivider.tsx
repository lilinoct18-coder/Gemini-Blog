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
      {/* Minimalist Ghost Button */}
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-extralight cursor-pointer pointer-events-auto border border-white/5 text-white/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ 
          scale: 1.2, 
          color: "rgba(212, 165, 116, 1)", // Lilin Accent
          borderColor: "rgba(212, 165, 116, 0.3)",
          textShadow: "0 0 15px rgba(212, 165, 116, 0.5)"
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        &
      </motion.div>
    </motion.div>
  );
};

export default WaveDivider;
