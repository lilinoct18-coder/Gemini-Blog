export const portalConfig = {
  content: {
    novis: {
      name: "Novis",
      tagline: "理性與技術之海",
      activePos: 0.6, // 當滑鼠在 Novis 側時，浪潮向右推進的位置
    },
    lilin: {
      name: "Lilin",
      tagline: "靈魂與觀察之火",
      activePos: 0.4, // 當滑鼠在 Lilin 側時，浪潮向左退縮的位置
    },
    defaultPos: 0.5,
  },
  // 物理參數設定
  physics: {
    // 向右移動（推進 Novis 側）時的彈力參數
    moveRight: {
      deepWave: {
        type: "spring" as const,
        stiffness: 12,
        damping: 20,
        mass: 2,
      },
      foamWave: {
        type: "spring" as const,
        stiffness: 15,
        damping: 12,
        mass: 1,
        restDelta: 0.001,
      },
      majestic: {
        type: "spring" as const,
        stiffness: 15,
        damping: 20,
        mass: 1.5,
      },
    },
    // 向左移動（退回 Lilin 側）時的彈力參數
    moveLeft: {
      deepWave: {
        type: "spring" as const,
        stiffness: 15, // 稍微快一點的回彈
        damping: 12,
        mass: 1,
      },
      foamWave: {
        type: "spring" as const,
        stiffness: 12,
        damping: 20,
        mass: 2,
        restDelta: 0.001,
      },
      majestic: {
        type: "spring" as const,
        stiffness: 20,
        damping: 25,
        mass: 1.2,
      },
    },
  },
  // 視覺細節
  visuals: {
    waveOffset: 0.05,
    foamOffset: 0.08,
  }
};

export type PortalConfig = typeof portalConfig;
