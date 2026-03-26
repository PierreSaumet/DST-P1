import { useEffect, useState } from "react";

export const getInitialTheme = () => {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem("theme");
  if (saved) return saved === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

function useTheme() {
  const [isDark, setIsDark] = useState(getInitialTheme);
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);
  return { isDark, toggle: () => setIsDark((d) => !d) };
}

export default useTheme;
