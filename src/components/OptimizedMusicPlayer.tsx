import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

interface MusicPlayerProps {
  season: "spring" | "summer" | "autumn" | "winter";
}

// 音乐表
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

const OptimizedMusicPlayer: React.FC<MusicPlayerProps> = ({ season }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMounted, setIsMounted] = useState(false); // 延迟挂载 audio
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState(playlists.spring);
  const [isSwitching, setIsSwitching] = useState(false);

  const currentTrack = currentPlaylist[currentIndex];

  //  延迟挂载音频（避免阻塞主线程）
  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 1000);
    return () => clearTimeout(t);
  }, []);

  //  切换季节只加载当前歌单，不立即解码音频
  useEffect(() => {
    setCurrentPlaylist(playlists[season]);
    setCurrentIndex(0);
  }, [season]);

  //  自动下一首
  const handleEnded = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % currentPlaylist.length);
  }, [currentPlaylist.length]);

  // 歌曲变化时更新音源（预加载 metadata）
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.src = currentTrack.src;
    audio.preload = "metadata"; // 仅加载元数据
    audio.load();

    if (isPlaying || isSwitching) {
      const onCanPlay = () => {
        audio.play().catch(() => {});
        setIsSwitching(false);
        audio.removeEventListener("canplay", onCanPlay);
      };
      audio.addEventListener("canplay", onCanPlay);
    }
  }, [currentTrack.src]);

  //  播放 / 暂停状态变化
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.play().catch(() => {}) : audio.pause();
  }, [isPlaying]);

  //  生命周期绑定/解绑事件
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [handleEnded]);

  const togglePlay = () => setIsPlaying((p) => !p);
  const playNext = () => {
    setIsSwitching(true);
    setCurrentIndex((i) => (i + 1) % currentPlaylist.length);
  };
  const playPrev = () => {
    setIsSwitching(true);
    setCurrentIndex((i) => (i - 1 + currentPlaylist.length) % currentPlaylist.length);
  };

  return (
    <div
      className="fixed bottom-4 right-24 flex items-center gap-3 px-4 py-2 rounded-full 
                 bg-white/50 backdrop-blur-md shadow-lg z-50 w-[370px] select-none"
    >
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={playPrev}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-gray-700"
      >
        ⏮
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md
                   ${isPlaying ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-800/80 hover:bg-gray-700"}`}
      >
        {isPlaying ? <Pause size={40} /> : <Play size={20} />}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={playNext}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-gray-700"
      >
        ⏭
      </motion.button>

      <div className="overflow-hidden w-[220px] text-sm font-medium text-gray-800 ml-2">
        <motion.div
          key={currentTrack.title}
          initial={{ x: "100%" }}
          animate={
            currentTrack.title.length > 12 ? { x: ["100%", "-100%"] } : { x: 0 }
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

      {isMounted && <audio ref={audioRef} preload="metadata" />}
    </div>
  );
};

export default OptimizedMusicPlayer;
