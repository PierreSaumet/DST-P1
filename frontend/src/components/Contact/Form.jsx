import { useState, useEffect } from "react";
import { api, useUser } from "../UserContext";
import { useLanguage } from "../LanguageContext";

function ContactForm() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [satisfaction, setSatisfaction] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLanguage();

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
      setError("");
      const response = await api.post(`/satisfactions/`, {
        email,
        first_name: firstName,
        last_name: lastName,
        description,
      });
      if (response.status === 201) {
        const data = response.data;

        setSatisfaction(data.polarity);
        setSuccess(true);
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error.response?.data);
      alert("Inscription ne fonctionne pas.");
    }
  };
  return (
    <div>
      {error}
      {success ? (
        <div className="text-xl font-normal">
          {t.contact.form.messageSend}
          {satisfaction ? (
            <p className="mx-8 my-8 text-3xl text-blue-200 md:mx-4 md:text-lg lg:mx-0">
              {t.contact.form.satisfactionPositive}
            </p>
          ) : (
            <p className="mx-8 my-8 text-3xl text-red-200 md:mx-4 md:text-lg lg:mx-0">
              {t.contact.form.satisfactionNegative}
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
                placeholder={t.name}
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
                placeholder={t.firstName}
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
                placeholder={t.phone}
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
                placeholder={t.email}
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
                placeholder={t.message}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-main-text my-10 transform rounded-lg px-8 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:scale-110"
          >
            {t.contactBtn}
          </button>
        </form>
      )}
    </div>
  );
}

export default ContactForm;
