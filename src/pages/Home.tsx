import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Home() {
    const { t } = useTranslation();

  return (
    <main className="pt-24 pb-16 px-6 text-center text-gray-800 select-none space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="rounded-2xl bg-white/50 backdrop-blur-md shadow-lg p-8 max-w-3xl mx-auto"
      >
        {t("home.title")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="rounded-2xl bg-white/50 backdrop-blur-md shadow-lg p-8 max-w-3xl mx-auto"
      >
        {t("home.text1_title")}
        <br />
        {t("home.text1")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="rounded-2xl bg-white/50 backdrop-blur-md shadow-lg p-8 max-w-3xl mx-auto"
      >
        <h3 className="text-xl font-medium mb-2">{t("home.anime_bg_title")}</h3>
        <p className="text-gray-600 text-sm">
          {t("home.anime_bg")}
        </p>
      </motion.div>
    </main>
  );
}
