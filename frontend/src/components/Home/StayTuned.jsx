import { Link } from "react-router-dom";

import { ArrowRight } from "lucide-react";

import Shapes from "../../assets/Shapes.png";

function StayTuned() {
  return (
    <section class="my-[80px] flex flex-col items-center justify-center px-20 lg:mx-20 xl:flex-row">
      <img
        src={Shapes}
        alt="For decoration purpose"
        class="mx-0 my-4 sm:flex md:mx-20 xl:basis-1/3"
      />

      <div class="flex flex-col text-center xl:basis-2/3 xl:text-start">
        <p class="text-sm font-bold uppercase sm:text-base md:text-lg lg:text-xl">
          Le web, un écosystème en constante évolution
        </p>

        <h2 class="mt-4 mb-8 text-4xl font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Restez informé des dernières{" "}
          <span class="text-main-text">tendances</span> proressez
        </h2>

        <p class="mb-8 text-sm font-normal sm:text-base md:text-lg">
          Chaque semaine, nous analysons les nouveautés du web : frameworks
          émergents, bonnes pratiques SEO, accessibilité, et bien plus encore.
          Ne manquez aucune actualité du digital !
        </p>

        <Link class="justify-content mx-auto flex items-center text-xl font-medium xl:mx-0">
          Lire les articles récents
          <ArrowRight size={24} class="mx-4" />
        </Link>
      </div>
    </section>
  );
}

export default StayTuned;
