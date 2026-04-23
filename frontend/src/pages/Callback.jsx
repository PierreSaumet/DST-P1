import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { useLanguage } from "../components/LanguageContext";

function AuthCallback() {
  const navigate = useNavigate();
  const { saveAccessToken, fetchUser } = useUser();
  const { t } = useLanguage();

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const access = params.get("access_token");

        if (!access) {
          navigate(`/login?error=token_failed`);
          return;
        }

        saveAccessToken(access);
        await fetchUser(access);

        window.history.replaceState(null, "", "/auth/callback");
        navigate("/profile");
      } catch (err) {
        console.error("Erreur dans AuthCallback:", err);
        navigate("/login?error=callback_failed");
      }
    };

    run();
  }, []);

  return <p>{t.connecting}...</p>;
}

export default AuthCallback;
