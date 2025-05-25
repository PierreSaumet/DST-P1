import { Link } from "react-router-dom";

import { ArrowRight } from "lucide-react";

import Shapes from "../../assets/Shapes.png";

function StayTuned() {
  return (
    <section className="my-[80px] flex flex-col items-center justify-center px-20 lg:mx-20 xl:flex-row">
      <img
        src={Shapes}
        alt="For decoration purpose"
        className="mx-0 my-4 sm:flex md:mx-20 xl:basis-1/3"
      />

      <div className="flex flex-col text-center xl:basis-2/3 xl:text-start">
        <p className="text-sm font-bold uppercase sm:text-base md:text-lg lg:text-xl">
          Le web, un écosystème en constante évolution
        </p>

        <h2 className="mt-4 mb-8 text-4xl font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Restez informé des dernières{" "}
          <span className="text-main-text">tendances</span>
        </h2>

        <p className="mb-8 text-sm font-normal sm:text-base md:text-lg">
          Chaque semaine, nous analysons les nouveautés du web : frameworks
          émergents, bonnes pratiques SEO, accessibilité, et bien plus encore.
          Ne manquez aucune actualité du digital !
        </p>

        <Link className="justify-content hover:text-main-text mx-auto flex items-center text-xl font-medium xl:mx-0">
          Lire les articles récents
          <ArrowRight size={24} className="mx-4" />
        </Link>
      </div>
    </section>
  );
}

export default StayTuned;
