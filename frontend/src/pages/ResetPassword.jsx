import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import Form from "../components/Login/Form";
// import { useLanguage } from "../components/LanguageContext";
import FormReset from "../components/ResetPassword/FormReset";

function ResetPassword() {
  //   const { t } = useLanguage();

  return (
    <section className="mt-[60px] mb-[80px] flex flex-col items-center justify-center text-center">
      <div className="mb-2 max-w-4xl md:mb-20">
        <h2 className="mx-5 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
          Mot de passe oublié?
        </h2>
      </div>

      <FormReset />
    </section>
  );
}

export default ResetPassword;
