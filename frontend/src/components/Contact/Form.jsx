function ContactForm() {
  return (
    <form className="border-main-text mx-4 w-64 max-w-3xl rounded-xl border sm:w-auto">
      <div className="mt-5 flex flex-col items-center justify-center md:flex-row">
        {/* LastName / Nom */}
        <div className="mx-1 my-5 max-w-80 px-5 md:mx-10 md:my-0 md:px-0">
          <input
            type="text"
            id="lastname"
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
            required
          />
        </div>

        {/* Email */}
        <div className="mx-1 my-5 max-w-80 px-5 md:mx-10 md:my-0 md:px-0">
          <input
            type="email"
            id="email"
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
  );
}

export default ContactForm;
