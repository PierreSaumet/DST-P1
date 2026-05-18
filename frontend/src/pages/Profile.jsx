import { useEffect, useState } from "react";
import { useUser } from "../components/UserContext";
import { Link, Navigate } from "react-router-dom";
import { ScrollText } from "lucide-react";
import ArticleCard from "../components/Article/ArticleCard";
import { useLanguage } from "../components/LanguageContext";
import ArticleForm from "../components/Profile/ArticleForm";

function Profile() {
  const { t } = useLanguage();
  const { user, loading, logout, api, initializing } = useUser();
  const [likes, setLikes] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(true);

  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!user) return;

      try {
        const response = await api.get(`/articles/?user=${user.id}`, {});

        setArticles(response.data.results);
      } catch (error) {
        console.error("Erreur récupération articles :", error);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticles();
  }, [user]);

  useEffect(() => {
    const fetchLikes = async () => {
      if (!user) return;

      try {
        const response = await api.get(`likes/`);

        setLikes(response.data);
      } catch (error) {
        console.error("Erreur récupération likes :", error);
      } finally {
        setLoadingLikes(false);
      }
    };

    fetchLikes();
  }, [user]);

  if (initializing || loading) {
    return <div>{t.loading}...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleDeleted = (deletedId) => {
    setArticles((prev) => prev.filter((a) => a.id !== deletedId));
  };

  const lastLiked = likes
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
  return (
    <div className="my-[80px] flex flex-col items-center justify-center text-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          {user.first_name} {user.last_name}
        </h1>
        <p className="text-gray-400">{user.email}</p>
      </div>

      <div className="mb-10 w-full max-w-2xl rounded-xl border border-gray-700 bg-gray-100 p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 flex items-center justify-center gap-2 text-xl font-semibold">
          <ScrollText size={20} />
          {t.profile.activity}
        </h2>

        {loadingLikes ? (
          <p className="text-center text-gray-400">{t.loading}...</p>
        ) : likes.length === 0 ? (
          <p className="text-center text-gray-400">
            {/* No likes  */}
            {t.profile.noArticleLiked}
          </p>
        ) : (
          <div className="flex flex-col gap-4 text-center">
            {/* Number of likes */}
            <p className="text-lg font-medium">
              ❤️ {likes.length} {t.article}
              {likes.length > 1 ? "s" : ""} {t.liked}
              {likes.length > 1 ? "s" : ""}
            </p>

            {/* Last article liked */}
            {lastLiked && (
              <div className="rounded-lg border border-gray-600 bg-gray-100 p-4 dark:bg-gray-700">
                <p className="mb-2 text-sm text-gray-500">
                  {t.profile.lastLiked}
                </p>

                <p className="font-bold">{lastLiked.article.title}</p>
                <p>{new Date(lastLiked.created_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-10 w-full max-w-6xl">
        <h2 className="mb-6 text-2xl font-semibold">Mes articles</h2>

        {loadingArticles ? (
          <p>{t.profile.loadingArticles}</p>
        ) : articles.length === 0 ? (
          <p className="text-gray-400">{t.profile.noArticle}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        )}
      </div>

      <ArticleForm
        api={api}
        onArticleCreated={(newArticle) => {
          setArticles((prev) => [newArticle, ...prev]);
        }}
      />

      <button
        id="logout"
        className="dark:bg-main-text mx-4 mt-10 transform cursor-pointer rounded-lg border-2 border-black px-4 py-2 transition duration-300 ease-in-out hover:scale-110"
        onClick={logout}
      >
        {t.logout}
      </button>
    </div>
  );
}

export default Profile;
