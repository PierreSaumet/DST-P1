import ExploreWeb from "../components/Home/ExploreWeb";
import Learn from "../components/Home/Learn";
import StayTuned from "../components/Home/StayTuned";
import Trust from "../components/Home/Trust";
import { api } from "../components/UserContext";

function Home() {
  const enfer = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `/users/password-reset/request/`,
        { email: "saumet.pierre@gmail.com" },
        // { headers: { "Content-Type": "application/json" } },
      );

      console.log("enfer ", response);
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    }
  };
  return (
    <div>
      <div>
        <form onSubmit={enfer}>
          <button>CLIKE KEKEKEKEK</button>
        </form>
      </div>
      <ExploreWeb />
      <Trust />
      <Learn />
      <StayTuned />
    </div>
  );
}

export default Home;
