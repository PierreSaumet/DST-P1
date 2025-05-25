import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="bg-header-bg flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-main-text m-4 text-5xl font-bold">
        404 - Page non trouvée
      </h1>
      <p className="m-4 p-4 text-center font-medium text-white">
        Sorry, this page doesn't exist!
        <br /> Désolé, cette page n'existe pas!
      </p>

      <Link
        to="/"
        className="bg-main-text border-main-text mx-4 mb-4 transform rounded-lg border p-3 font-medium text-white transition duration-300 ease-in-out hover:scale-110 md:mb-0"
      >
        Page Principale
      </Link>
    </div>
  );
}

export default ErrorPage;
