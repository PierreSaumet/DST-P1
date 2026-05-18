import { useState } from "react";
import { api } from "../UserContext";
import { useLanguage } from "../LanguageContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FormReset() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email) => {
    if (!email.trim()) return "L'email est requis.";
    if (!EMAIL_REGEX.test(email)) return "L'adresse email n'est pas valide.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateEmail(email);
    if (validationError) return setError(validationError);

    try {
      const response = await api.post("/users/password-reset/request/", {
        email: email,
      });

      if (response.status === 200) setEmailSent(true);
    } catch (error) {
      console.log("error ", error);
      setError("Une erreur est survenue, veuillez réessayer ultérieurement");
    }
  };
  return (
    <div>
      {emailSent ? (
        <p>Si votre email existe, regardez votre boite email.</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-4 w-64 max-w-3xl rounded-xl sm:w-auto"
        >
          <div className="mt-5 flex flex-col items-center justify-center md:flex-row">
            {/* Email */}
            <div className="mx-1 my-5 max-w-80 px-5 md:mx-10 md:my-0 md:px-0">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-main-text focus:border-main-text text-main-text w-full appearance-none border-b-2 p-2 text-center text-2xl focus:border focus:placeholder-transparent focus:outline-none"
                placeholder={t.email}
                required
              />
            </div>
          </div>

          {error ? (
            <p>{error}</p>
          ) : (
            <button className="bg-main-text my-10 transform rounded-lg px-8 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:scale-110">
              {t.login.login}
            </button>
          )}
        </form>
      )}
    </div>
  );
}

export default FormReset;
