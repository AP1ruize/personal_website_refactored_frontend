import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SpringCanvas from "./SpringCanvas";
import SummerCanvas from "./SummerCanvas";
import AutumnCanvas from "./AutumnCanvas";
import WinterCanvas from "./WinterCanvas";

type Season = "spring" | "summer" | "autumn" | "winter";

interface SeasonalBackgroundProps {
  season: Season;
  setSeason: React.Dispatch<React.SetStateAction<Season>>;
}

export default function SeasonalBackground({ season, setSeason }: SeasonalBackgroundProps) {
  const seasons: Season[] = ["spring", "summer", "autumn", "winter"];

  // 首次加载按月份自动设定季节
  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) setSeason("spring");
    else if (month >= 6 && month <= 8) setSeason("summer");
    else if (month >= 9 && month <= 11) setSeason("autumn");
    else setSeason("winter");
  }, [setSeason]);

  const handleNextSeason = () => {
    const idx = seasons.indexOf(season);
    setSeason(seasons[(idx + 1) % seasons.length]);
  };

  const seasonIcon =
    season === "spring" ? "🌸" :
    season === "summer" ? "☀️" :
    season === "autumn" ? "🍁" :
    "❄️";

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={season}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ position: "fixed", inset: 0, zIndex: -10 }}
        >
          {season === "spring" && <SpringCanvas />}
          {season === "summer" && <SummerCanvas />}
          {season === "autumn" && <AutumnCanvas />}
          {season === "winter" && <WinterCanvas />}
        </motion.div>
      </AnimatePresence>

      {/* 右下角切换季节按钮 */}
      <div
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          zIndex: 50,
        }}
      >
        <motion.button
          onClick={handleNextSeason}
          title="Switch season"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          style={{
            borderRadius: "9999px",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(6px)",
            padding: "0.75rem",
            fontSize: "1.5rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            transition: "0.3s",
            border: "none",
            cursor: "pointer",
          }}
        >
          {seasonIcon}
        </motion.button>
      </div>
    </>
  );
}
