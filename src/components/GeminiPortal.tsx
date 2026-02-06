import React, { useState, useMemo } from 'react';
import { motion, useTime, useTransform } from 'framer-motion';
import WaveDivider from './WaveDivider';
import { portalConfig } from './portal-config';

const GeminiPortal: React.FC = () => {
  const [targetPos, setTargetPos] = useState(portalConfig.content.defaultPos);
  const [moveDirection, setMoveDirection] = useState<'right' | 'left'>('right');

  const time = useTime();
  
  // 建立緩慢波動的偏移量 (使用正弦函數)
  // 基礎週期約 4 秒 (4000ms)，振幅約 0.008 (0.8% 的寬度)
  const waveOscillation = useTransform(time, (t) => Math.sin(t / 800) * 0.008);
  const foamOscillation = useTransform(time, (t) => Math.sin(t / 600) * 0.012);

  const { physics, visuals, content } = portalConfig;

  // 根據當前移動方向選擇對應的彈力配置
  const currentSprings = useMemo(() => {
    return moveDirection === 'right' ? physics.moveRight : physics.moveLeft;
  }, [moveDirection, physics]);

  // 動態生成路徑的函數
  const getWavePath = (x: number, offset: number, oscillation: number = 0) => {
    const ox = x + oscillation; // 加入波動偏移
    const x1 = ox;
    const x2 = ox + offset;
    const x3 = ox - offset;
    // 使用 Cubic Bezier 建立 S 型曲線
    return `M 0,0 L ${x1},0 C ${x2},0.2 ${x3},0.4 ${x1},0.6 C ${x2},0.8 ${x3},1 ${x1},1 L 0,1 Z`;
  };

  // Entrance paths starting from the far left (x=0)
  const startPath = getWavePath(0, visuals.waveOffset);
  const startPathFoam = getWavePath(0, visuals.foamOffset);

  // 我們需要將路徑字串也變成動態的，以便隨時間波動
  const pathNormal = useTransform(waveOscillation, (o) => getWavePath(targetPos, visuals.waveOffset, o));
  const pathWide = useTransform(foamOscillation, (o) => getWavePath(targetPos, visuals.foamOffset, o));

  return (
    <div className="relative w-screen h-screen flex overflow-hidden bg-lilin-primary">
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
            <motion.path
              initial={{ d: startPath }}
              animate={{ d: pathNormal.get() }}
              style={{ d: pathNormal }}
              transition={currentSprings.deepWave}
            />
          </clipPath>
          <clipPath id="foam-clip" clipPathUnits="objectBoundingBox">
            <motion.path
              initial={{ d: startPathFoam }}
              animate={{ d: pathWide.get() }}
              style={{ d: pathWide }}
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

      {/* Foam Overlay */}
      <motion.div
        className="absolute inset-0 bg-novis-accent opacity-10 z-10 pointer-events-none"
        style={{ clipPath: 'url(#foam-clip)' }}
      />

      {/* Novis Side */}
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

      {/* Hover Detectors */}
      <div 
        className="absolute top-0 left-0 h-full z-30 cursor-pointer" 
        style={{ width: `${targetPos * 100}%` }}
        onMouseEnter={() => {
          setMoveDirection('right');
          setTargetPos(content.novis.activePos);
        }}
      />
      <div 
        className="absolute top-0 right-0 h-full z-30 cursor-pointer" 
        style={{ width: `${(1 - targetPos) * 100}%` }}
        onMouseEnter={() => {
          setMoveDirection('left');
          setTargetPos(content.lilin.activePos);
        }}
      />

      {/* 傳遞波動值給 Divider 以保持同步 */}
      <WaveDivider 
        leftPosition={`${targetPos * 100}%`}
        springConfig={currentSprings.majestic}
        oscillation={waveOscillation}
      />
    </div>
  );
};

export default GeminiPortal;
