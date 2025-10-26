import axios from "axios";

import { useState, useEffect } from "react";
import { useUser } from "../UserContext";

function ContactForm() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [satisfaction, setSatisfaction] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vous devez vous identifiez");
        return;
      }
      setError("");
      const response = await axios.post(
        "http://localhost:8000/api/satisfactions/",
        {
          email,
          first_name: firstName,
          last_name: lastName,
          description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 201) {
        const data = response.data;

        setSatisfaction(data.polarity);
        setSuccess(true);
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error.response?.data);
      alert("Inscription ne fonctionen pas.");
    }
  };
  return (
    <div>
      {error}
      {success ? (
        <div className="text-xl font-normal">
          Votre message a été envoyé correctement:
          {satisfaction ? (
            <p className="mx-8 my-8 md:mx-4 md:text-lg lg:mx-0">
              😊 Nous sommes ravis de savoir que ça vous plaît !
            </p>
          ) : (
            <p className="mx-8 my-8 md:mx-4 md:text-lg lg:mx-0">
              😞 Nous sommes tristes de savoir que ça ne vous plaît pas.
            </p>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="border-main-text mx-4 w-64 max-w-3xl rounded-xl border sm:w-auto"
        >
          <div className="mt-5 flex flex-col items-center justify-center md:flex-row">
            {/* LastName / Nom */}
            <div className="mx-1 my-5 max-w-80 px-5 md:mx-10 md:my-0 md:px-0">
              <input
                type="text"
                id="lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-main-text focus:border-main-text text-main-text w-full appearance-none border-b-2 p-2 text-center text-2xl focus:border focus:placeholder-transparent focus:outline-none"
                placeholder="Nom"
                required
              />
            </div>

            {/* FirstName / Prenom */}
            <div className="mx-1 my-5 max-w-80 px-5 md:mx-10 md:my-0 md:px-0">
              <input
                type="text"
                id="firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-main-text focus:border-main-text text-main-text w-full appearance-none border-b-2 p-2 text-center text-2xl focus:border focus:placeholder-transparent focus:outline-none"
                placeholder="Prénom"
                required
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center md:mt-5 md:flex-row">
            {/* Other / Autre */}
            <div className="mx-1 my-5 max-w-80 px-5 md:mx-10 md:my-0 md:px-0">
              <input
                type="tel"
                id="phone"
                className="border-main-text focus:border-main-text text-main-text w-full appearance-none border-b-2 p-2 text-center text-2xl focus:border focus:placeholder-transparent focus:outline-none"
                placeholder="Téléphone"
              />
            </div>

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
          </div>

          {/* Message */}
          <div className="flex flex-col items-center justify-center md:mt-5 md:flex-row">
            <div className="my-5 flex-auto px-5 md:mx-10 md:my-0 md:px-0">
              <input
                type="text"
                id="message"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-main-text focus:border-main-text text-main-text w-full appearance-none border-b-2 p-2 text-center text-2xl focus:border focus:placeholder-transparent focus:outline-none"
                placeholder="Message"
                required
              />
            </div>
          </div>

          <button className="bg-main-text my-10 transform rounded-lg px-8 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:scale-110">
            Contact
          </button>
        </form>
      )}
    </div>
  );
}

export default ContactForm;
