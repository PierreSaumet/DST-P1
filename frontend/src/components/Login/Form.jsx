function Form() {
  return (
    <form class="mx-4 w-64 max-w-3xl rounded-xl sm:w-auto">
      <div class="mt-5 flex flex-col items-center justify-center md:flex-row">
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

        {/* Password / Mot de Passe */}
        <div className="mx-1 my-5 max-w-80 px-5 md:mx-10 md:my-0 md:px-0">
          <input
            type="password"
            id="password"
            className="border-main-text focus:border-main-text text-main-text w-full appearance-none border-b-2 p-2 text-center text-2xl focus:border focus:placeholder-transparent focus:outline-none"
            placeholder="Password"
            required
          />
        </div>
      </div>

      <button className="bg-main-text my-10 rounded-lg px-8 py-4 text-base font-medium text-white">
        Se connecter
      </button>
    </form>
  );
}

export default Form;
