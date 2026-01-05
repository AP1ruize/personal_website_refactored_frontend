import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SeasonalBackground from "./background/SeasonalBackground";
import MusicPlayer from "./components/MusicPlayer";
// import SeasonalBackground from "./background/OptimizedSeasonalBackground";
// import MusicPlayer from "./components/OptimizedMusicPlayer";

import Header from "./components/Header";
import SideNav from "./components/SideNav";
import Home from "./pages/Home";
import Career from "./pages/Career";
import Room from "./pages/Room";
import "./App.css";

type Season = "spring" | "summer" | "autumn" | "winter";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  // const [userInfo, setUserInfo] = useState<{ email: string } | null>(null);
  const [season, setSeason] = useState<Season>("spring");

  return (
    <>
      {/* 背景 + 音乐 */}
      <SeasonalBackground season={season} setSeason={setSeason} />
      <MusicPlayer season={season} />

      {/* 统一头部 & 侧边栏 */}
      <Header onToggleSideBar={() => setIsOpen(!isOpen)}  />
      <SideNav isOpen={isOpen} />

      {/* 主内容：侧边栏展开时右移 */}
      <div className={`transition-all duration-300 ${isOpen ? "ml-52" : "ml-0"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/career" element={<Career />} />
          {/* <Route path="/room" element={<Room />} /> */}
          <Route path="/room"
            element={
              <div className="full-width-page">
                <Room />
              </div>
            }
          />
          {/* 其他页面后续继续加，比如：
              <Route path="/gallery" element={<Gallery />} />
              
              <Route path="/logIn" element={<Login setUserInfo={setUserInfo} />} />
              <Route path="/signUp" element={<SignUp />} />
          */}
        </Routes>
      </div>
    </>
  );
}
