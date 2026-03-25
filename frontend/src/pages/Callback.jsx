import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";

function AuthCallback() {
  const navigate = useNavigate();
  const { saveTokens } = useUser();

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

  return <p>Connexion en cours...</p>;
}

export default AuthCallback;
