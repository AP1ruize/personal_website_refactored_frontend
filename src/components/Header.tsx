import { motion } from "framer-motion";
import { Menu, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  onToggleSideBar: () => void;
  userInfo: { email: string } | null;
}

export default function Header({ onToggleSideBar, userInfo }: HeaderProps) {
    const { i18n } = useTranslation();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "en" ? "zh" : "en");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/40 backdrop-blur-md shadow-sm z-40 flex items-center px-6 py-3 border-b border-white/30">
      {/* 左侧菜单按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggleSideBar}
        className="p-2 mr-4 rounded-full bg-transparent hover:bg-black/10 transition"
      >
        <Menu className="w-6 h-6 stroke-black" />
      </motion.button>

      {/* 网站标题靠左 */}
      <h2 className="text-xl font-semibold text-gray-800 tracking-wide select-none">
        Ethan’s Memorial
      </h2>

      {/* 占位拉开右侧 */}
      <div className="flex-grow" />

      {/* 右上角语言切换 */}
      <motion.button
        onClick={toggleLang}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 px-3 py-1 rounded-md border border-black/10 bg-transparent text-black hover:bg-black/10 transition"
      >
        <Globe className="w-4 h-4 stroke-black" />
        {i18n.language === "en" ? "中文" : "English"}
      </motion.button>

      {/* 用户栏靠右 */}
      {/* <div className="flex items-center gap-3">
        {userInfo ? (
          <>
            <span className="text-gray-700 text-sm">
              Welcome, <b>{userInfo.email}</b>
            </span>
            <Link to="/logOut">
              <button className="px-3 py-1 rounded-md border border-black/10 bg-transparent text-black hover:bg-black/10 transition">
                Log out
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/logIn">
              <button className="px-3 py-1 rounded-md border border-black/10 bg-transparent text-black hover:bg-black/10 transition">
                Log in
              </button>
            </Link>
            <Link to="/signUp">
              <button className="px-3 py-1 rounded-md border border-black/10 bg-transparent text-black hover:bg-black/10 transition">
                Sign up
              </button>
            </Link>
          </>
        )}
      </div> */}
    </header>
  );
}
