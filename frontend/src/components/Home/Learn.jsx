import { Link } from "react-router-dom";

import { ArrowRight } from "lucide-react";

import imageSection1 from "../../assets/Section1Image.png";

function Learn() {
  return (
    <section class="my-[80px] flex flex-col items-center justify-center px-20 lg:mx-20 xl:flex-row">
      <div class="flex flex-col text-center xl:text-start">
        <p class="text-sm font-bold uppercase sm:text-base md:text-lg lg:text-xl">
          Des ressources pour tous les niveaux
        </p>

        <h2 class="text-main-text mt-4 mb-8 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
          Apprenez <span class="text-white">et</span> progressez
        </h2>

        <p class="mb-8 text-sm font-normal sm:text-base md:text-lg">
          Que vous débutiez en développement web ou que vous soyez un expert
          cherchant à approfondir vos connaissances, nous vous proposons des
          tutoriels, guides et bonnes pratiques pour apprendre
          efficacement.{" "}
        </p>

        <Link class="justify-content hover:text-main-text mx-auto flex items-center text-xl font-medium xl:mx-0">
          Explorer les ressources <ArrowRight size={24} class="mx-4" />
        </Link>
      </div>

      <img
        src={imageSection1}
        alt="For decoration purpose"
        class="my-8 h-auto w-full"
      />
    </section>
  );
}

export default Learn;
