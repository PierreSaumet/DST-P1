import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../components/LanguageContext";
import { useUser } from "../components/UserContext";

function ArticleDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user, api } = useUser();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(true);

  // 🔥 FETCH ARTICLE (incrémente views côté backend)
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/articles/${id}/`,
        );
        setArticle(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement de l'article :", err);
        setError("Impossible de charger cet article.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // 🔥 FETCH LIKES
  useEffect(() => {
    const fetchLikes = async () => {
      if (!user || !article) {
        setLoadingLike(false);
        return;
      }

      try {
        const response = await api.get(`likes/`);

        const likedArticles = response.data;

        const isLiked = likedArticles.some(
          (like) => like.article.id === article.id,
        );
        console.log("liked ? ", liked);
        setLiked(isLiked);
      } catch (error) {
        console.error("Erreur récupération likes :", error);
      } finally {
        setLoadingLike(false);
      }
    };

    fetchLikes();
  }, [user, article]);

  const handleLike = async () => {
    if (!user) return;

    try {
      await api.post(`likes/${article.id}/toggle/`);

      // UX instant
      setLiked((prev) => !prev);
    } catch (error) {
      console.error("Erreur toggle like :", error);
    }
  };

  if (loading)
    return <p className="mt-20 text-center text-gray-500">{t.loading}...</p>;

  if (error) return <p className="mt-20 text-center text-red-500">{error}</p>;

  if (!article)
    return (
      <p className="mt-20 text-center text-gray-500">
        {t.articleDetail.articleNotFound}.
      </p>
    );

  return (
    <div className="my-20 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl rounded-2xl border border-gray-700 bg-gray-100 p-6 shadow-lg dark:bg-gray-800">
        {/* IMAGE */}
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="mb-6 h-64 w-full rounded-xl object-cover"
          />
        )}

        {/* TITLE */}
        <h1 className="text-main-text mb-4 text-3xl font-bold">
          {article.title}
        </h1>

        {/* DESCRIPTION */}
        <p className="mb-6 text-gray-300">{article.description}</p>

        {/* META */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Auteur #{article.user}</span>
        </div>

        {/* LIKE BUTTON */}
        {user && (
          <button
            onClick={handleLike}
            disabled={loadingLike}
            className={`mt-6 w-full rounded-lg px-4 py-2 font-medium transition ${
              liked
                ? "bg-red-500 text-white hover:bg-red-600"
                : "border border-gray-500 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {liked ? "❤️ Liké" : "🤍 Like"}
          </button>
        )}

        <Link
          to="/articles"
          className="bg-main-text hover:bg-opacity-90 mt-8 inline-block rounded-lg px-4 py-2 text-white"
        >
          {t.back}
        </Link>
      </div>
    </div>
  );
}

export default ArticleDetail;
