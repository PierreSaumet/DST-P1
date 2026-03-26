import { Link } from "react-router-dom";

import imageSection1 from "../../assets/Section1Image.png";
import AnimatedText from "../MotionAnimation/AnimatedText";
import { useLanguage } from "../LanguageContext";

function ExploreWeb() {
  const { t } = useLanguage();

  return (
    <section className="my-[80px] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
        {t.exploreWeb.h1}
        <span className="text-main-text font-light"> {t.exploreWeb.web} </span>
        {t.exploreWeb.inAll}
        <br />
        {t.exploreWeb.its}{" "}
        <span className="decoration-main-text underline">
          {t.exploreWeb.facets}
        </span>
      </h1>

      <p className="m-8 max-w-3xl font-normal md:text-lg">
        <AnimatedText text={t.exploreWeb.description} />
      </p>

      <div className="flex flex-col content-center justify-center md:flex-row">
        <Link
          to="/"
          className="bg-main-text border-main-text mx-4 mb-4 transform rounded-lg border p-3 transition duration-300 ease-in-out hover:scale-110 md:mb-0"
        >
          {t.exploreWeb.discoveryArticle}
        </Link>

        <Link className="mx-4 transform rounded-lg border border-black p-3 transition duration-300 ease-in-out hover:scale-110 dark:border-white">
          {t.exploreWeb.subscribeNewsletter}
        </Link>
      </div>

      <div className="max-h-2xl">
        <img
          src={imageSection1}
          alt="For decoration purpose"
          className="my-8 h-auto w-full"
        />
      </div>
    </section>
  );
}

export default ExploreWeb;
