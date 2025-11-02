import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Career() {
    const { t } = useTranslation();

  return (
    <main className="pt-24 pb-16 px-6 text-gray-800 select-none flex flex-col items-center space-y-10">
      {/* 标题 */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="rounded-2xl text-3xl font-bold  text-center bg-white/50 backdrop-blur-md shadow-lg p-8  max-w-4xl w-full"
      >
        {t("career.title")}
      </motion.h2>

      {/* 简介 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="rounded-2xl bg-white/50 backdrop-blur-md shadow-lg p-8 max-w-4xl w-full  text-left"
      >
        <p className="text-lg font-medium mb-3">{t("career.intro_1")}</p>
        <p>
          {t("career.intro_2")}
        </p>
        <p className="mt-4">
          {t("career.intro_3")}
        </p>
      </motion.div>

      {/* 工作经验 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="rounded-2xl bg-white/50 backdrop-blur-md shadow-lg p-8 max-w-4xl w-full space-y-5  text-left"
      >
        <h3 className="text-2xl font-semibold mb-2">{t("career.experience_title")}</h3>

        {(t("career.experience", { returnObjects: true }) as any[]).map(
          (exp: any, idx: number) => (
            <div key={idx}>
              <h4 className="font-semibold text-lg">{exp.position}</h4>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                {exp.details.map((d: string, i: number) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )
        )}
      </motion.div>

      {/* 技能 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="rounded-2xl bg-white/50 backdrop-blur-md shadow-lg p-8 max-w-4xl w-full  text-left"
      >
        <h3 className="text-2xl font-semibold mb-2">{t("career.skills_title")}</h3>
        <ul className="list-disc ml-5 space-y-1">
          {(t("career.skills", { returnObjects: true }) as any[]).map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </motion.div>

      {/* 项目链接 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="rounded-2xl bg-white/50 backdrop-blur-md shadow-lg p-8 max-w-4xl w-full  text-left"
      >
        <h3 className="text-2xl font-semibold mb-2">{t("career.projects_title")}</h3>
        <ul className="list-disc ml-5 space-y-1">
          {(t("career.projects", { returnObjects: true }) as any[]).map(
            (p: any, i: number) => (
              <li key={i}>
                <a
                  href={p.url}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  {p.name}
                </a>
              </li>
            )
          )}
        </ul>
      </motion.div>
    </main>
  );
}
