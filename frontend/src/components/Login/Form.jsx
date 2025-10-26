import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
function Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);

    if (success) {
      navigate("/profile");
    } else {
      alert("Email ou mot de passe incorrect.");
    }
  };
  return (
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
            placeholder="Email"
            required
          />
        </div>

        {/* Password / Mot de Passe */}
        <div className="mx-1 my-5 max-w-80 px-5 md:mx-10 md:my-0 md:px-0">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-main-text focus:border-main-text text-main-text w-full appearance-none border-b-2 p-2 text-center text-2xl focus:border focus:placeholder-transparent focus:outline-none"
            placeholder="Password"
            required
          />
        </div>
      </div>

      <button className="bg-main-text my-10 transform rounded-lg px-8 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:scale-110">
        Se connecter
      </button>
    </form>
  );
}

export default Form;
