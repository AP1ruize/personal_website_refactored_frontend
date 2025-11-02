import React, { useEffect, useState, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Season = "spring" | "summer" | "autumn" | "winter";

interface Props {
  season: Season;
  setSeason: React.Dispatch<React.SetStateAction<Season>>;
}

//  懒加载季节组件
const SeasonalCanvas: Record<Season, React.LazyExoticComponent<React.FC>> = {
  spring: React.lazy(() => import("./SpringCanvas")),
  summer: React.lazy(() => import("./SummerCanvas")),
  autumn: React.lazy(() => import("./AutumnCanvas")),
  winter: React.lazy(() => import("./WinterCanvas")),
};

export default function OptimizedSeasonalBackground({ season, setSeason }: Props) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const seasons: Season[] = ["spring", "summer", "autumn", "winter"];

  //  初始化季节
  useEffect(() => {
    const m = new Date().getMonth() + 1;
    if (m >= 3 && m <= 5) setSeason("spring");
    else if (m >= 6 && m <= 8) setSeason("summer");
    else if (m >= 9 && m <= 11) setSeason("autumn");
    else setSeason("winter");
  }, [setSeason]);

  //  预加载下一季背景图
  useEffect(() => {
    const next = (seasons.indexOf(season) + 1) % seasons.length;
    const img = new Image();
    img.src = `/${seasons[next]}_bg.jpg`;
  }, [season]);

  //  背景图懒加载 + 模糊过渡
  useEffect(() => {
    const img = new Image();
    img.src = `/${season}_bg.jpg`;
    img.onload = () => setBgLoaded(true);
  }, [season]);

  const handleNext = () => {
    const i = seasons.indexOf(season);
    setSeason(seasons[(i + 1) % seasons.length]);
  };

  const SeasonComp = SeasonalCanvas[season];
  const icon = { spring: "🌸", summer: "☀️", autumn: "🍁", winter: "❄️" }[season];

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={season}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -10,
            backgroundImage: `url(/${season}_bg.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: bgLoaded ? "none" : "blur(15px)",
            transition: "filter 0.6s ease",
          }}
        >
          {/* 延迟启动 Canvas 动画，防止阻塞首屏 */}
          <Suspense fallback={<></>}>
            <SeasonComp />
          </Suspense>
        </motion.div>
      </AnimatePresence>

      <div style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 50 }}>
        <motion.button
          onClick={handleNext}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          style={{
            borderRadius: "9999px",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(6px)",
            padding: "0.75rem",
            fontSize: "1.5rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {icon}
        </motion.button>
      </div>
    </>
  );
}
