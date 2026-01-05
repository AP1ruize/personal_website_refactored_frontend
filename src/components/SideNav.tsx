import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Image, Briefcase, PaintRoller } from "lucide-react";

interface SideNavProps {
  isOpen: boolean;
}

export default function SideNav({ isOpen }: SideNavProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: t("sidenav.home"), path: "/", disabled: false },
    { icon: Image, label: t("sidenav.gallery"), path: "/gallery", disabled: true },
    { icon: Briefcase, label: t("sidenav.career"), path: "/career", disabled: false },
    { icon: PaintRoller, label: t("sidenav.room"), path: "/room", disabled: false },
  ];

  return (
    <motion.nav
      initial={{ x: -200 }}
      animate={{ x: isOpen ? 0 : -200 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 h-screen w-52 bg-white/40 backdrop-blur-md border-r border-white/30 z-30 shadow-md"
    >
      <div className="flex flex-col items-start pt-20 space-y-2 px-6">
        {menuItems.map(({ icon: Icon, label, path, disabled }) => (
          <motion.button
            key={label}
            onClick={() => !disabled && navigate(path)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={disabled}
            className={`flex items-center gap-3 text-lg px-2 py-2 rounded-md w-full text-left transition 
              ${
                disabled
                  ? "text-gray-400 cursor-not-allowed opacity-60"
                  : "text-black hover:bg-black/10"
              }`}
          >
            <Icon size={20} stroke="black" /> {label}
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
}
