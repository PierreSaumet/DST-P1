import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import Form from "../components/Login/Form";
import { useLanguage } from "../components/LanguageContext";

function Login() {
  const { t } = useLanguage();
  const url = import.meta.env.VITE_GITHUB_CALL;
  const handleGithubLogin = () => {
    window.location.href = url;
  };

  return (
    <section className="mt-[60px] mb-[80px] flex flex-col items-center justify-center text-center">
      <div className="mb-2 max-w-4xl md:mb-20">
        <h2 className="mx-5 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
          {t.login.login}
        </h2>
      </div>

      <Form />

      <Link to="/resetpwd" className="hover:text-main-text mb-10">
        {t.login.forgotPwd}
      </Link>

      <div className="flex flex-col items-center text-center">
        <button
          onClick={handleGithubLogin}
          className="bg-main-text my-10 flex transform items-center gap-3 rounded-lg px-8 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:scale-110"
        >
          <Github className="h-5 w-5" />
          {t.login.github}
        </button>
      </div>

      <p className="text-white-gray mx-20 text-center text-xs font-medium md:mx-0">
        {t.login.noAccount}{" "}
        <Link className="hover:text-main-text dark:text-white" to="/signup">
          {t.login.noAccount2}
        </Link>
      </p>
    </section>
  );
}

export default Login;
