import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8000/api/articles/";

  // Get all articles from the backend
  const fetchArticles = async (url = BASE_URL, query = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(url, {
        params: query ? { search: query } : {},
      });

      setArticles(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (err) {
      console.error("Erreur lors du chargement des articles :", err);
      setError("Impossible de charger les articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Make request based on the search input
  const handleSearch = (e) => {
    e.preventDefault();
    fetchArticles(BASE_URL, search);
  };

  // Next page
  const handleNextPage = () => {
    if (nextPage) fetchArticles(nextPage);
  };

  // Prev page
  const handlePrevPage = () => {
    if (prevPage) fetchArticles(prevPage);
  };

  const goToArticle = (id) => {
    navigate(`/articles/${id}`);
  };

  return (
    <div className="my-20 flex flex-col items-center justify-center px-4">
      <h1 className="text-main-text mb-6 text-3xl font-bold">
        Liste des Articles
      </h1>

      <form onSubmit={handleSearch} className="mb-6 flex w-full max-w-lg">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="focus:ring-main-text flex-1 rounded-l-lg border border-gray-300 p-2 text-lg focus:ring-2 focus:outline-none"
          placeholder="Rechercher un article (titre, description, auteur...)"
        />
        <button
          type="submit"
          className="bg-main-text hover:bg-opacity-90 mx-4 rounded-r-lg px-4 py-2 text-white"
        >
          Rechercher
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Chargement des articles...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => goToArticle(article.id)}
                className="cursor-pointer rounded-xl border border-gray-200 bg-gray-800 shadow-md transition-transform hover:scale-[1.02]"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-48 w-full rounded-t-xl object-cover"
                />
                <div className="p-4 text-center">
                  <h2 className="text-main-text text-xl font-semibold">
                    {article.title}
                  </h2>
                  <p className="mt-2 text-center text-gray-200">
                    {article.description.slice(0, 10)}...
                  </p>
                  <p className="mt-3 text-sm text-gray-400">
                    Auteur ID : {article.user}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={!prevPage}
              className={`rounded-lg px-4 py-2 ${
                prevPage
                  ? "bg-main-text hover:bg-opacity-90 text-white"
                  : "cursor-not-allowed bg-gray-300 text-gray-600"
              }`}
            >
              Précédent
            </button>
            <button
              onClick={handleNextPage}
              disabled={!nextPage}
              className={`rounded-lg px-4 py-2 ${
                nextPage
                  ? "bg-main-text hover:bg-opacity-90 text-white"
                  : "cursor-not-allowed bg-gray-300 text-gray-600"
              }`}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Articles;
