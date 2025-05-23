import { Link } from "react-router-dom";

import Form from "../components/Login/Form";

function Login() {
  return (
    <section class="mt-[30px] mb-[80px] flex flex-col items-center justify-center text-center">
      <div class="mb-2 max-w-4xl md:mb-20">
        <h2 class="mx-5 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
          Se connecter
        </h2>
      </div>

      <Form />

      <Link class="mb-10">Mot de passe oublié ?</Link>

      <p className="text-white-gray mx-20 text-center text-xs font-medium md:mx-0">
        Vous n’avez pas de compte ? Vous pouvez en{" "}
        <span class="text-white">créer un</span>
      </p>
    </section>
  );
}

export default Login;
