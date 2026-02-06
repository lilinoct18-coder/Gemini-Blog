import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import WaveDivider from './WaveDivider';
import { portalConfig } from './portal-config';

const GeminiPortal: React.FC = () => {
  const [targetPos, setTargetPos] = useState(portalConfig.content.defaultPos);
  const [moveDirection, setMoveDirection] = useState<'right' | 'left'>('right');

  const basePos = targetPos; 

  const getWavePath = (x: number, offset: number) => {
    const x1 = x;
    const x2 = x + offset;
    const x3 = x - offset;
    return `M 0,0 L ${x1},0 C ${x2},0.2 ${x3},0.4 ${x1},0.6 C ${x2},0.8 ${x3},1 ${x1},1 L 0,1 Z`;
  };

  const { physics, visuals, content } = portalConfig;

  // 根據當前移動方向選擇對應的彈力配置
  const currentSprings = useMemo(() => {
    return moveDirection === 'right' ? physics.moveRight : physics.moveLeft;
  }, [moveDirection, physics]);

  // Entrance paths starting from the far left (x=0)
  const startPath = getWavePath(0, visuals.waveOffset);
  const startPathFoam = getWavePath(0, visuals.foamOffset);

  const pathNormal = getWavePath(basePos, visuals.waveOffset);
  const pathWide = getWavePath(basePos, visuals.foamOffset);

  return (
    <div className="relative w-screen h-screen flex overflow-hidden bg-lilin-primary">
      {/* 
        Approach 3: Masking Effect (Enhanced with Wave Physics)
      */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
            <motion.path
              initial={{ d: startPath }}
              animate={{
                d: pathNormal
              }}
              transition={currentSprings.deepWave}
            />
          </clipPath>
          <clipPath id="foam-clip" clipPathUnits="objectBoundingBox">
            <motion.path
              initial={{ d: startPathFoam }}
              animate={{
                d: pathWide
              }}
              transition={currentSprings.foamWave}
            />
          </clipPath>
        </defs>
      </svg>

      {/* Lilin Side (Static Background) */}
      <div className="absolute inset-0 bg-lilin-primary flex flex-col justify-center items-center p-12 text-center z-0">
        <motion.div 
          className="z-10 ml-[25%] w-[50%]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3, delay: 1, ease: "easeOut" }}
        > 
          <h2 className="text-6xl font-bold text-lilin-text mb-4 tracking-tighter font-serif uppercase text-shadow-sm">
            {content.lilin.name}
          </h2>
          <p className="text-lilin-accent uppercase tracking-[0.3em] text-sm">
            {content.lilin.tagline}
          </p>
        </motion.div>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_75%_center,_var(--color-lilin-accent)_0%,_transparent_70%)]" />
      </div>

      {/* Foam Overlay (Clipped from Full Screen - FAST & OVERSHOOTING) */}
      <motion.div
        className="absolute inset-0 bg-novis-accent opacity-10 z-10 pointer-events-none"
        style={{ clipPath: 'url(#foam-clip)' }}
      />

      {/* Novis Side (Clipped from Full Screen - STEADY & MAJESTIC) */}
      <motion.div
        className="absolute inset-0 bg-novis-primary flex flex-col justify-center items-center p-12 text-center z-20 pointer-events-none"
        style={{ clipPath: 'url(#wave-clip)' }}
      >
        <motion.div 
          className="z-10 mr-[25%] w-[50%]"
          initial={{ x: '-100vw' }}
          animate={{ x: '0vw' }}
          transition={currentSprings.deepWave}
        > 
          <h2 className="text-6xl font-bold text-novis-text mb-4 tracking-tighter uppercase">
            {content.novis.name}
          </h2>
          <p className="text-novis-accent uppercase tracking-[0.3em] text-sm">
            {content.novis.tagline}
          </p>
        </motion.div>
        <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-novis-primary via-novis-secondary to-novis-accent" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_25%_center,_var(--color-novis-accent)_0%,_transparent_70%)]" />
      </motion.div>

      {/* Hover Detectors (Invisible divs to capture mouse) */}
      <div 
        className="absolute top-0 left-0 h-full z-30 cursor-pointer" 
        style={{ width: `${basePos * 100}%` }}
        onMouseEnter={() => {
          setMoveDirection('right');
          setTargetPos(content.novis.activePos);
        }}
      />
      <div 
        className="absolute top-0 right-0 h-full z-30 cursor-pointer" 
        style={{ width: `${(1 - basePos) * 100}%` }}
        onMouseEnter={() => {
          setMoveDirection('left');
          setTargetPos(content.lilin.activePos);
        }}
      />

      <WaveDivider 
        leftPosition={`${basePos * 100}%`}
        springConfig={currentSprings.majestic}
      />
    </div>
  );
};

export default GeminiPortal;
