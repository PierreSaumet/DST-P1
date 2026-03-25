import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../LanguageContext";

function ToggleModeLanguage() {
  const { lang, toggle } = useLanguage();
  const isFr = lang === "fr";

  return (
    <button
      onClick={toggle}
      style={{
        background: isFr ? "#003189" : "#B22234",
        borderColor: isFr ? "#334155" : "#3C3B6E",
      }}
      className="relative flex h-[28px] w-[56px] cursor-pointer items-center rounded-full border transition-colors duration-500 select-none focus-visible:ring-2 focus-visible:ring-[var(--color-main-text)] focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 1000, damping: 100, mass: 5 }}
        style={{
          top: 3,
          left: isFr ? 3 : 31,
        }}
        className="absolute flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white text-[13px] shadow-sm"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={lang}
            initial={{ opacity: 0, rotate: -40, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 40, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isFr ? "🇫🇷" : "🇬🇧"}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isFr && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-[7px] text-[11px]"
          >
            🇬🇧
          </motion.span>
        )}
        {!isFr && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-[7px] text-[11px]"
          >
            🇫🇷
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default ToggleModeLanguage;
