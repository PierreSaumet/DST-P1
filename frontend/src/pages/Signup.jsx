import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import FormSignUp from "../components/Signup/Form";
import { useLanguage } from "../components/LanguageContext";
import axios from "axios";

function Signup() {
  const { t } = useLanguage();
  const handleGithubLogin = () => {
    window.location.href = `http://127.0.0.1:8000/api/auth/github/`;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.get(
  //       `http://127.0.0.1:8000/api/auth/github/`,
  //       {
  //         withCredentials: true,
  //       },
  //     );

  //     console.log(" ENFER ", response);
  //   } catch (err) {
  //     console.log("enfer ", err);
  //   }
  // };

  return (
    <section className="mt-[60px] mb-[80px] flex flex-col items-center justify-center text-center">
      <div className="mb-2 max-w-4xl md:mb-20">
        <h2 className="mx-5 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
          {t.signup.signup}
        </h2>
      </div>

      <FormSignUp />

      <Link className="hover:text-main-text mb-10">{t.signup.forgotPwd}</Link>

      <div className="flex flex-col items-center text-center">
        <button
          onClick={handleGithubLogin}
          className="bg-main-text my-10 flex transform items-center gap-3 rounded-lg px-8 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:scale-110"
        >
          <Github className="h-5 w-5" />
          {t.signup.github}
        </button>
        <form onSubmit={handleGithubLogin}>
          <button className="bg-main-text my-10 flex transform items-center gap-3 rounded-lg px-8 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:scale-110">
            <Github className="h-5 w-5" />
            {t.signup.github}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Signup;
