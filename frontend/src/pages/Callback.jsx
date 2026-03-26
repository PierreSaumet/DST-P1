import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { useLanguage } from "../components/LanguageContext";

function AuthCallback() {
  const navigate = useNavigate();
  const { saveTokens } = useUser();
  const { t } = useLanguage();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");
    const error = params.get("error");

    if (error) {
      // USE ERROR
      navigate(`/login?error=${error}`);
      return;
    }

    if (access && refresh) {
      saveTokens(access, refresh);
      navigate("/profile");
    }
  }, []);

  return <p>{t.connecting}...</p>;
}

export default AuthCallback;
