import { createContext, useContext, useState } from "react";
import fr from "../assets/fr.json";
import en from "../assets/en.json";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("fr");
  const t = lang === "fr" ? fr : en;
  const toggle = () => setLang((l) => (l === "fr" ? "en" : "fr"));
  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
