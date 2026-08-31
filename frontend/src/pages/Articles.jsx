import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../components/LanguageContext";
import { api } from "../components/UserContext";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { t } = useLanguage();
  const navigate = useNavigate();

  const fetchArticles = async (params = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/articles/", {
        params,
        withCredentials: true,
      });

      setArticles(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (err) {
      console.error("Erreur chargement articles :", err);
      setError("Impossible de charger les articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    setActiveSearch(searchInput);

    fetchArticles({
      search: searchInput,
    });
  };

  const handleNextPage = () => {
    if (!nextPage || loading) return;

    const page = new URL(nextPage, window.location.origin).searchParams.get(
      "page",
    );

    fetchArticles({
      page,
      search: activeSearch,
    });
  };

  const handlePrevPage = () => {
    if (!prevPage || loading) return;

    const page = new URL(prevPage, window.location.origin).searchParams.get(
      "page",
    );

    fetchArticles({
      page,
      search: activeSearch,
    });
  };

  const goToArticle = (id) => {
    navigate(`/articles/${id}`);
  };

  return (
    <div className="my-20 flex flex-col items-center justify-center px-4">
      <h1 className="text-main-text mb-6 text-3xl font-bold">
        {t.articles.title}
      </h1>

      <form onSubmit={handleSearch} className="mb-6 flex w-full max-w-lg">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="focus:ring-main-text flex-1 rounded-l-lg border border-gray-300 p-2 text-lg focus:ring-2 focus:outline-none"
          placeholder={t.articles.placeholder}
        />
        <button
          type="submit"
          className="bg-main-text hover:bg-opacity-90 mx-4 rounded-r-lg px-4 py-2 text-white"
        >
          {t.search}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">{t.articles.loadingArticles}...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => goToArticle(article.id)}
                className="cursor-pointer rounded-xl border border-gray-200 bg-gray-100 shadow-md transition-transform hover:scale-[1.02] dark:bg-gray-800"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-48 w-full rounded-t-xl object-cover"
                />
                <div className="p-4 text-center">
                  <h2 className="text-main-text text-xl font-semibold">
                    {article.title.slice(0, 12)}
                  </h2>
                  <p className="mt-2 text-center break-words text-gray-200">
                    {article.description.slice(0, 50)}...
                  </p>
                  <p className="mt-3 text-sm text-gray-400">
                    {t.articleDetail.author} ID : {article.user}
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
              {t.previous}
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
              {t.next}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Articles;
