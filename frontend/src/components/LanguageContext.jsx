import { createContext, useContext, useState } from "react";
import fr from "../assets/fr.json";
import en from "../assets/en.json";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "fr";
  });
  const t = lang === "fr" ? fr : en;
  const toggle = () => {
    setLang((l) => {
      const next = l === "fr" ? "en" : "fr";
      localStorage.setItem("lang", next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
