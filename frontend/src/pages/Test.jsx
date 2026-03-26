import { useLanguage } from "../components/LanguageContext";

function Test() {
  const { t } = useLanguage();
  return (
    <section className="mt-[60px] mb-[80px] flex flex-col items-center justify-center text-center">
      <h1>{t.test}</h1>

      <button className="mt-6 rounded-lg bg-black px-6 py-3 text-white"></button>
    </section>
  );
}

export default Test;
