import SmartFinder from "../assets/confidence/smartfinder.png";
import Zoomer from "../assets/confidence/zoomer.png";
import Shells from "../assets/confidence/shells.png";
import Waves from "../assets/confidence/waves.png";
import Artvenue from "../assets/confidence/artevnue.png";

function HomeTrust() {
  return (
    <section class="my-[80px] flex flex-col items-center justify-center text-center">
      <h2 class="text-3xl font-extrabold sm:text-4xl md:text-5xl lg:text-6xl">
        Ils nous font confiance
      </h2>

      <div class="mt-[80px] flex flex-col content-center justify-center md:flex-row">
        <img
          src={SmartFinder}
          alt="logo smartfinder"
          class="my-4 max-h-[32px] md:mx-4 lg:mx-8"
        />

        <img
          src={Zoomer}
          alt="logo Zoomer"
          class="my-4 max-h-[32px] md:mx-4 lg:mx-8"
        />

        <img
          src={Shells}
          alt="logo Shells"
          class="my-4 max-h-[32px] md:mx-4 lg:mx-8"
        />

        <img
          src={Waves}
          alt="logo Waves"
          class="my-4 max-h-[32px] md:mx-4 lg:mx-8"
        />

        <img
          src={Artvenue}
          alt="logo Artvenue"
          class="my-4 max-h-[32px] md:mx-4 lg:mx-8"
        />
      </div>
    </section>
  );
}

export default HomeTrust;
