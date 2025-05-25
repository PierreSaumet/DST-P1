import { Link } from "react-router-dom";

import { ArrowRight } from "lucide-react";

import imageSection1 from "../../assets/Section1Image.png";

function Learn() {
  return (
    <section className="my-[80px] flex flex-col items-center justify-center px-20 lg:mx-20 xl:flex-row">
      <div className="flex flex-col text-center xl:text-start">
        <p className="text-sm font-bold uppercase sm:text-base md:text-lg lg:text-xl">
          Des ressources pour tous les niveaux
        </p>

        <h2 className="text-main-text mt-4 mb-8 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
          Apprenez <span className="text-white">et</span>
          <br className="hidden md:block" /> progressez
        </h2>

        <p className="mb-8 text-sm font-normal sm:text-base md:text-lg">
          Que vous débutiez en développement web ou que vous soyez un expert
          cherchant à approfondir vos connaissances, nous vous proposons des
          tutoriels, guides et bonnes pratiques pour apprendre
          efficacement.{" "}
        </p>

        <Link className="justify-content hover:text-main-text mx-auto flex items-center text-xl font-medium xl:mx-0">
          Explorer les ressources <ArrowRight size={24} className="mx-4" />
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
