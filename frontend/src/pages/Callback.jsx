import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, useUser } from "../components/UserContext";
import { useLanguage } from "../components/LanguageContext";

function AuthCallback() {
  const navigate = useNavigate();
  const { saveAccessToken, fetchUser } = useUser();
  const { t } = useLanguage();

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          navigate("/login?error=token_failed");
          return;
        }

        const { data } = await api.post("/auth/exchange/", { code });

        window.history.replaceState(null, "", "/auth/callback");
        saveAccessToken(data.access);
        await fetchUser(data.access);
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
