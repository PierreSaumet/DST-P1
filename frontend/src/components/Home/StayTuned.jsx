import { Link } from "react-router-dom";

import { ArrowRight } from "lucide-react";

import Shapes from "../../assets/Shapes.png";
import AnimatedText from "../MotionAnimation/AnimatedText";
import { useLanguage } from "../LanguageContext";

function StayTuned() {
  const { t } = useLanguage();
  return (
    <section className="my-[80px] flex flex-col items-center justify-center px-20 lg:mx-20 xl:flex-row">
      <img
        src={Shapes}
        alt="For decoration purpose"
        className="mx-0 my-4 sm:flex md:mx-20 xl:basis-1/3"
      />

      <div className="flex flex-col text-center xl:basis-2/3 xl:text-start">
        <p className="text-sm font-bold uppercase sm:text-base md:text-lg lg:text-xl">
          {t.stayTuned.p}
        </p>

        <h2 className="mt-4 mb-8 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
          {t.stayTuned.title}{" "}
          <span className="text-main-text">{t.stayTuned.trends}</span>
        </h2>

        <p className="mb-8 text-sm font-normal sm:text-base md:text-lg">
          <AnimatedText text={t.stayTuned.description} />
        </p>

        <Link
          to="articles"
          className="justify-content hover:text-main-text mx-auto flex items-center text-xl font-medium xl:mx-0"
        >
          {t.stayTuned.link}
          <ArrowRight size={24} className="mx-4" />
        </Link>
      </div>
    </section>
  );
}

export default StayTuned;
