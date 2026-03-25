import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";

function AuthCallback() {
  const navigate = useNavigate();
  const { saveTokens, fetchUser } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");
    const error = params.get("error");

    console.log("params ", params);

    console.log("access ", access);
    console.log("refresh ", refresh);
    console.log("error ", error);

    if (error) {
      console.log("POURQUOU JE SUIS LA AAA ");
      navigate(`/login?error=${error}`);
      return;
    }

    if (access && refresh) {
      saveTokens(access, refresh);
      // fetchUser(access);
      console.log("BINGO");
      navigate("/profile");
    }
  }, []);

  return <p>Connexion en cours...</p>;
}

export default AuthCallback;
