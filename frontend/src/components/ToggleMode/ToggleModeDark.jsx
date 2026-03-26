import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import useTheme from "./useTheme";

function ToggleModeDark() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-pressed={isDark}
      style={{
        background: isDark ? "#1e293b" : "#fef9c3",
        borderColor: isDark ? "#334155" : "#fde68a",
      }}
      className="relative flex h-[28px] w-[56px] cursor-pointer items-center rounded-full border transition-colors duration-500 select-none focus-visible:ring-2 focus-visible:ring-[var(--color-main-text)] focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 1000, damping: 100, mass: 5 }}
        style={{
          background: isDark ? "#0f172a" : "#ffffff",
          top: 3,
          left: isDark ? 31 : 3,
        }}
        className="absolute flex h-[22px] w-[22px] items-center justify-center rounded-full shadow-sm"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -40, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 40, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {isDark ? (
              <Moon size={13} strokeWidth={2.5} color="#94A3B8" />
            ) : (
              <Sun size={13} strokeWidth={2.5} color="#FACC15" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isDark && (
          <motion.span
            key="ghost-sun"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-[8px] flex items-center"
          >
            <Sun size={11} strokeWidth={2} color="#FACC15" />
          </motion.span>
        )}
        {!isDark && (
          <motion.span
            key="ghost-moon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-[8px] flex items-center"
          >
            <Moon size={11} strokeWidth={2} color="#94A3B8" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default ToggleModeDark;
