import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface MusicPlayerProps {
  season: "spring" | "summer" | "autumn" | "winter";
}

const playlists = {
  spring: [
    { title: "rain of blossoms - fripSide", src: "/music/rob_sp1.mp3" },
    { title: "Forget-me-not - fripSide", src: "/music/fmn_sp2.mp3" },
    { title: "今日もいい天気だよ - 南條愛乃", src: "/music/kym_sp3.mp3" },
  ],
  summer: [
    { title: "whitebird - fripSide", src: "/music/whitebird_sm1.mp3" },
    { title: "遠い空へ - Bruno Wen-li", src: "/music/tis_sm2.mp3" },
    { title: "ヒカリノ海 - 南條愛乃", src: "/music/hkr_sm3.mp3" },
  ],
  autumn: [
    { title: "an evening calm - fripSide", src: "/music/aec_at1.mp3" },
    { title: "late in autumn - fripSide", src: "/music/lia_at2.mp3" },
    { title: "Solitude in Autumn - fripSide", src: "/music/sia_at3.mp3" },
  ],
  winter: [
    { title: "WHITE ALBUM - 小木曽雪菜", src: "/music/wa_wt1.mp3" },
    { title: "Twinkle Snow - 小木曽雪菜", src: "/music/ts_wt2.mp3" },
    { title: "愛する心 - 津田朱里", src: "/music/aisr_wt3.mp3" },
    { title: "恋のような - 冬馬かずさ", src: "/music/kny_wt4.mp3" },
  ],
};

const MusicPlayer: React.FC<MusicPlayerProps> = ({ season }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(playlists.spring);

  const currentTrack = currentPlaylist[currentIndex];
  // 用于判断是否由“切歌按钮”触发
const isSwitchingTrackRef = useRef(false);

  // 🎵 季节变化：切换歌单并回到第一首；若当前在播放，则自动播放新歌
  useEffect(() => {
    const newPlaylist = playlists[season];
    setCurrentPlaylist(newPlaylist);
    setCurrentIndex(0);
    if (isPlaying) {
      // 等到 src 更新后再播放
      setTimeout(() => audioRef.current?.play(), 0);
    }
  }, [season]); // 不依赖 isPlaying 的状态更新副作用

  // ▶️ 自动播放下一首
  const handleEnded = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % currentPlaylist.length);
  }, [currentPlaylist.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [handleEnded]);

// ✅ 当歌曲索引变化时，更新音源并根据状态决定是否自动播放
useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const shouldAutoPlay = isPlaying || isSwitchingTrackRef.current;

  audio.pause();
  audio.src = currentTrack.src;
  audio.load();

  if (shouldAutoPlay) {
    const playAfterLoad = () => {
      audio.play().catch(() => {});
      audio.removeEventListener("canplay", playAfterLoad);
      // 播放成功后重置标志位
      isSwitchingTrackRef.current = false;
    };
    audio.addEventListener("canplay", playAfterLoad);
  } else {
    // 如果是暂停状态，确保标志位被重置
    isSwitchingTrackRef.current = false;
  }
}, [currentTrack.src]);

// ✅ 仅响应用户点击的播放/暂停（不修改 src，保留 currentTime）
useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  if (isPlaying) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}, [isPlaying]);



  // ⏯️ 切换播放/暂停（不修改 src，保留 currentTime）
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const playNext = () => {
    isSwitchingTrackRef.current = true;
    setCurrentIndex((i) => (i + 1) % currentPlaylist.length);
  };

  const playPrev = () => {
    isSwitchingTrackRef.current = true;
    setCurrentIndex((i) => (i - 1 + currentPlaylist.length) % currentPlaylist.length);
  };

  return (
  <div
    className="fixed bottom-4 right-24 flex items-center gap-3 px-4 py-2 rounded-full 
               bg-white/50 backdrop-blur-md shadow-lg z-50 w-[370px] select-none"
  >
    {/* 上一首 */}
<motion.button
  whileHover={{ scale: 1.15 }}
  whileTap={{ scale: 0.9 }}
  onClick={playPrev}
  className="w-8 h-8 flex items-center justify-center rounded-full 
             bg-gray-800/80 hover:bg-gray-700 shadow-md 
             text-black transition duration-200"
  title="Previous"
>
  ⏮
</motion.button>

{/* 播放 / 暂停 */}
<motion.button
  whileHover={{ scale: 1.15 }}
  whileTap={{ scale: 0.9 }}
  onClick={togglePlay}
  className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md
             ${isPlaying 
               ? "bg-blue-500 hover:bg-blue-600" 
               : "bg-gray-800/80 hover:bg-gray-700"}
             transition duration-200`}
  title={isPlaying ? "Pause" : "Play"}
>
  {isPlaying ? <Pause size={40} className="text-gray-800" /> : <Play size={20} className="text-gray-800" />}
</motion.button>

{/* 下一首 */}
<motion.button
  whileHover={{ scale: 1.15 }}
  whileTap={{ scale: 0.9 }}
  onClick={playNext}
  className="w-8 h-8 flex items-center justify-center rounded-full 
             bg-gray-800/80 hover:bg-gray-700 shadow-md 
             text-black transition duration-200"
  title="Next"
>
  ⏭
</motion.button>


    {/* 歌名滚动 */}
    <div className="overflow-hidden w-[220px] text-sm font-medium text-gray-800 ml-2">
      <motion.div
        key={currentTrack.title}
        initial={{ x: "100%" }}
        animate={
          currentTrack.title.length > 12
            ? { x: ["100%", "-100%"] }
            : { x: 0 }
        }
        transition={{
          duration: Math.max(currentTrack.title.length / 4, 8),
          repeat: Infinity,
          ease: "linear",
        }}
        className="whitespace-nowrap"
      >
        {currentTrack.title}
      </motion.div>
    </div>

    <audio ref={audioRef} src={currentTrack.src} />
  </div>
);

};

export default MusicPlayer;
