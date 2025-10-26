import { Link } from "react-router-dom";

import FormSignUp from "../components/Signup/Form";

function Signup() {
  return (
    <section className="mt-[60px] mb-[80px] flex flex-col items-center justify-center text-center">
      <div className="mb-2 max-w-4xl md:mb-20">
        <h2 className="mx-5 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
          S'inscrire
        </h2>
      </div>

      <FormSignUp />

      <Link className="hover:text-main-text mb-10">Mot de passe oublié ?</Link>
    </section>
  );
}

export default Signup;
