import ExploreWeb from "../components/Home/ExploreWeb";
import Learn from "../components/Home/Learn";
import StayTuned from "../components/Home/StayTuned";
import Trust from "../components/Home/Trust";
import axios from "axios";

function Home() {
  const enfer = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://weeb-backend-mcg6.onrender.com/api/users/password-reset/request/`,
        { email: "admin@admin.com" },
        { headers: { "Content-Type": "application/json" } },
      );

      console.log("enfer ", response);
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    }
  };
  return (
    <div>
      <div>
        <form onSubmit={enfer}>CLIKE KEKEKEKEK</form>
      </div>
      <ExploreWeb />
      <Trust />
      <Learn />
      <StayTuned />
    </div>
  );
}

export default Home;
