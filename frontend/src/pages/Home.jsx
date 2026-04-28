import ExploreWeb from "../components/Home/ExploreWeb";
import Learn from "../components/Home/Learn";
import StayTuned from "../components/Home/StayTuned";
import Trust from "../components/Home/Trust";
import axios from "axios";

function Home() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/users/password-reset/request/`,
        {
          email: "admin@admin.com",
        },
      );

      console.log(" ENFER ", response);
    } catch (err) {
      console.log("enfer ", err);
    }
  };

  const handleSubmitProd = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://weeb-backend-mcg6.onrender.com/api/users/password-reset/request/`,
        {
          email: "admin@admin.com",
        },
      );

      console.log(" ENFER ", response);
    } catch (err) {
      console.log("enfer ", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button>CLIQUE</button>
      </form>

      <form onSubmit={handleSubmitProd}>
        <button>CLIQUE PROD</button>
      </form>

      <ExploreWeb />
      <Trust />
      <Learn />
      <StayTuned />
    </div>
  );
}

export default Home;
