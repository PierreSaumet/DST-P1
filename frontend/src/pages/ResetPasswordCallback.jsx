import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../components/UserContext";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const PASSWORD_RULES = [
  { test: (p) => p.length >= 8, label: "8 caractères minimum" },
  { test: (p) => /[a-z]/.test(p), label: "Une minuscule" },
  { test: (p) => /[A-Z]/.test(p), label: "Une majuscule" },
  { test: (p) => /\d/.test(p), label: "Un chiffre" },
  {
    test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
    label: "Un caractère spécial",
  },
];

function ResetPasswordCallback() {
  const [newPwd, setNewPwd] = useState("");
  const [newPwdAgain, setNewPwdAgain] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [uidb4, setUidb64] = useState("");
  const [tokenCode, setTokenCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const getParams = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        console.log("params ", params);
        const uidb64 = params.get("uidb64");
        const tokenCode = params.get("token");

        if (!uidb64) {
          setError("Une erreur est survenue, veuillez recommencer.");
          return;
        }
        if (!tokenCode) {
          setError("Une erreur est survenue, veuillez recommencer.");
          return;
        }
        setUidb64(uidb64);
        setTokenCode(tokenCode);
      } catch (err) {
        console.error("Erreur dans ResetPasswordCallback:", err);
        setError(
          "Une erreur est survenue, veuillez recommencer ultérieurement.",
        );
      }
    };

    getParams();
  }, []);

  const validatePassword = (pwd, pwdAgain) => {
    if (!PASSWORD_REGEX.test(pwd))
      return "Le mot de passe ne respecte pas les critères requis.";
    if (pwd !== pwdAgain) return "Les mots de passe ne correspondent pas.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const validationError = validatePassword(newPwd, newPwdAgain);
    if (validationError) return setError(validationError);

    try {
      const response = await api.post(
        `/users/password-reset/confirm/?uidb64=${uidb4}`,
        {
          token: tokenCode,
          password: newPwd,
        },
      );
      if (response.status === 200) setSuccess(true);
    } catch (error) {
      console.log("error ", error);
      setError("Une erreur est survenue, veuillez réessayer ultérieurement");
    }
  };

  return (
    <section className="mt-[60px] mb-[80px] flex flex-col items-center justify-center text-center">
      {!success ? (
        <form
          onSubmit={handleSubmit}
          className="border-main-text mx-4 w-64 max-w-3xl rounded-xl border sm:w-auto"
        >
          <p className="my-10 text-sm font-bold sm:text-base md:text-lg lg:text-xl">
            Veuillez entrer votre nouveau mot de passe dans les deux champs
          </p>

          <div className="mt-5 flex flex-col items-center justify-center md:flex-row">
            {/* Check good password */}
            {showRules && (
              <ul className="mt-3 space-y-1 text-left text-sm">
                {PASSWORD_RULES.map(({ test, label }) => {
                  const isValid = test(newPwd);
                  return (
                    <li
                      key={label}
                      className={`flex items-center gap-2 transition-colors duration-200 ${
                        isValid ? "text-green-500" : "text-red-400"
                      }`}
                    >
                      <span>{isValid ? "✓" : "✗"}</span>
                      {label}
                    </li>
                  );
                })}
              </ul>
            )}
            {/* Check same password */}
            {newPwdAgain && (
              <p
                className={`mt-2 text-sm ${newPwd === newPwdAgain ? "text-green-500" : "text-red-400"}`}
              >
                {newPwd === newPwdAgain
                  ? "✓ Les mots de passe correspondent"
                  : "✗ Les mots de passe ne correspondent pas"}
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-col items-center justify-center md:flex-row">
            {/* New password */}
            <div className="mx-1 my-5 max-w-80 px-5 md:mx-10 md:my-0 md:px-0">
              <input
                type="password"
                id="password"
                value={newPwd}
                onChange={(e) => {
                  setNewPwd(e.target.value);
                  setError("");
                }}
                onFocus={() => setShowRules(true)}
                onBlur={() => setShowRules(false)}
                className="border-main-text focus:border-main-text text-main-text w-full appearance-none border-b-2 p-2 text-center text-2xl focus:border focus:placeholder-transparent focus:outline-none"
                placeholder="Nouveau mot de passe"
                required
              />
            </div>

            {/* Confirm same password */}
            <div className="mx-1 my-5 max-w-80 px-5 md:mx-10 md:my-0 md:px-0">
              <input
                type="password"
                id="password-confirm"
                value={newPwdAgain}
                onChange={(e) => {
                  setNewPwdAgain(e.target.value);
                  setError("");
                }}
                className="border-main-text focus:border-main-text text-main-text w-full appearance-none border-b-2 p-2 text-center text-2xl focus:border focus:placeholder-transparent focus:outline-none"
                placeholder="Même mot de passe"
                required
              />
            </div>
          </div>

          {error && (
            <p className="mx-auto mb-4 max-w-sm text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!PASSWORD_REGEX.test(newPwd) || newPwd !== newPwdAgain}
            className="bg-main-text my-10 transform rounded-lg px-8 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            Créer votre mot de passe
          </button>
        </form>
      ) : (
        <div className="mt-5 flex flex-col items-center justify-center">
          <p className="my-10 text-green-500">
            Votre mot de passe a été réiniatiliasé vous pouvez vous conebbecter.
          </p>
          <Link className="bg-main-text my-10 transform rounded-lg px-8 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:scale-110">
            se connecter
          </Link>
        </div>
      )}
    </section>
  );
}

export default ResetPasswordCallback;
