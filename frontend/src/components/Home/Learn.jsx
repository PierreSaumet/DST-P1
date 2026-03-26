import { Link } from "react-router-dom";

import { ArrowRight } from "lucide-react";

import imageSection1 from "../../assets/Section1Image.png";
import AnimatedText from "../MotionAnimation/AnimatedText";
import { useLanguage } from "../LanguageContext";

function Learn() {
  const { t } = useLanguage();

  return (
    <section className="my-[80px] flex flex-col items-center justify-center px-20 lg:mx-20 xl:flex-row">
      <div className="flex flex-col text-center xl:text-start">
        <p className="text-sm font-bold uppercase sm:text-base md:text-lg lg:text-xl">
          {t.learn.p}
        </p>

        <h2 className="text-main-text mt-4 mb-8 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
          {t.learn.h2}{" "}
          <span className="text-black dark:text-white">{t.learn.and}</span>
          <br className="hidden md:block" /> {t.learn.progress}
        </h2>

        <p className="mb-8 text-sm font-normal sm:text-base md:text-lg">
          <AnimatedText text={t.learn.description} />
        </p>

        <Link className="justify-content hover:text-main-text mx-auto flex items-center text-xl font-medium xl:mx-0">
          {t.learn.explore}
          <ArrowRight size={24} className="mx-4" />
        </Link>
      </div>

      <img
        src={imageSection1}
        alt="For decoration purpose"
        className="my-8 h-auto w-full"
      />
    </section>
  );
}

export default Learn;
