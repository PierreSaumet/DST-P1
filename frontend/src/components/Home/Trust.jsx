import { motion } from "framer-motion";

import SmartFinder from "../../assets/confidence/smartfinder.png";
import Zoomer from "../../assets/confidence/zoomer.png";
import Shells from "../../assets/confidence/shells.png";
import Waves from "../../assets/confidence/waves.png";
import Artvenue from "../../assets/confidence/artevnue.png";

function Trust() {
  return (
    <section className="my-[80px] flex flex-col items-center justify-center text-center">
      <h2 className="mx-2 text-3xl font-extrabold sm:text-4xl md:text-5xl lg:text-6xl">
        Ils nous font confiance
      </h2>

      <div className="mt-[80px] flex flex-col content-center justify-center md:flex-row">
        <motion.div
          initial={{ scale: 0.5, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 2.2 }}
          className=""
        >
          <img
            src={SmartFinder}
            alt="logo smartfinder"
            className="my-4 max-h-[32px] md:mx-4 lg:mx-8"
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0.5, rotate: 0 }}
          animate={{ scale: 1, rotate: -360 }}
          transition={{ duration: 1 }}
          className=""
        >
          <img
            src={Shells}
            alt="logo Shells"
            className="my-4 max-h-[32px] md:mx-4 lg:mx-8"
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0.5, rotate: -180 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 3 }}
          className=""
        >
          <img
            src={Zoomer}
            alt="logo Zoomer"
            className="my-4 max-h-[32px] md:mx-4 lg:mx-8"
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0.5, rotate: -360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.4 }}
          className=""
        >
          <img
            src={Waves}
            alt="logo Waves"
            className="my-4 max-h-[32px] md:mx-4 lg:mx-8"
          />
        </motion.div>

        <motion.div
          initial={{ scale: 0.5, rotate: 0 }}
          animate={{ scale: 1, rotate: -360 }}
          transition={{ duration: 2 }}
          className=""
        >
          <img
            src={Artvenue}
            alt="logo Artvenue"
            className="my-4 max-h-[32px] md:mx-4 lg:mx-8"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Trust;
