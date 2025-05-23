import { Link } from "react-router-dom";

import imageSection1 from "../../assets/Section1Image.png";

function ExploreWeb() {
  return (
    <section class="my-[80px] flex flex-col items-center justify-center text-center">
      <h1 class="text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
        Explorez le
        <span class="text-main-text font-light"> Web </span>
        sous toutes
        <br />
        ses <span class="decoration-main-text underline">facettes</span>
      </h1>

      <p class="m-8 max-w-3xl text-base font-normal md:text-lg">
        Le monde du web évolue constamment, et nous sommes là pour vous guider à
        travers ses tendances, technologies et meilleures pratiques. Que vous
        soyez développeur, designer ou passionné du digital, notre blog vous
        offre du contenu de qualité pour rester à la pointe.
      </p>

      <div class="flex flex-col content-center justify-center md:flex-row">
        <Link class="bg-main-text border-main-text mx-4 mb-4 rounded-lg border p-3 md:mb-0">
          Découvrir les articles
        </Link>

        <Link class="mx-4 rounded-lg border border-white p-3">
          S'abonner à la newsletter
        </Link>
      </div>

      <div class="max-h-2xl">
        <img
          src={imageSection1}
          alt="For decoration purpose"
          class="my-8 h-auto w-full"
        />
      </div>
    </section>
  );
}

export default ExploreWeb;
