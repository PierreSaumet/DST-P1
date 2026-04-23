import { Link } from "react-router-dom";

import Form from "../components/Login/Form";
import { useLanguage } from "../components/LanguageContext";

function Login() {
  const { t } = useLanguage();
  return (
    <section className="mt-[60px] mb-[80px] flex flex-col items-center justify-center text-center">
      <div className="mb-2 max-w-4xl md:mb-20">
        <h2 className="mx-5 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
          {t.login.login}
        </h2>
      </div>

      <Form />

      <Link className="hover:text-main-text mb-10">{t.login.forgotPwd}</Link>

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
