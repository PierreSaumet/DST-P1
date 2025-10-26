import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

function FormSignUp() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/",
        { email, password, first_name: firstName, last_name: lastName },
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.status === 201) {
        const success = await login(email, password);
        if (success) {
          navigate("/profile");
        } else {
          alert("Une erreur est survenue, veuillez recommencer.");
        }
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);

      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({
          non_field_errors: ["Une erreur est survenue, veuillez recommencer."],
        });
      }
    }

    setLoading(false);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-4 w-64 max-w-3xl rounded-xl sm:w-auto"
    >
      {loading ? (
        <div>Wating ...</div>
      ) : (
        <div>
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 text-red-500">
              {Object.entries(errors).map(([field, messages]) => (
                <p key={field}>
                  <strong>{field}:</strong> {messages.join(" ")}
                </p>
              ))}
            </div>
          )}

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
          <div className="mt-5 flex flex-col items-center justify-center md:flex-row">
            {/* First Name / Prénom */}
            <div className="mx-1 my-5 max-w-80 px-5 md:mx-10 md:my-0 md:px-0">
              <input
                type="first_name"
                id="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-main-text focus:border-main-text text-main-text w-full appearance-none border-b-2 p-2 text-center text-2xl focus:border focus:placeholder-transparent focus:outline-none"
                placeholder="Prénom"
                required
              />
            </div>

            {/* Last Name / Nom de Famille */}
            <div className="mx-1 my-5 max-w-80 px-5 md:mx-10 md:my-0 md:px-0">
              <input
                type="last_name"
                id="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-main-text focus:border-main-text text-main-text w-full appearance-none border-b-2 p-2 text-center text-2xl focus:border focus:placeholder-transparent focus:outline-none"
                placeholder="Nom"
                required
              />
            </div>
          </div>

          <button className="bg-main-text my-10 transform rounded-lg px-8 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:scale-110">
            S'inscrire
          </button>
        </div>
      )}
    </form>
  );
}

export default FormSignUp;
