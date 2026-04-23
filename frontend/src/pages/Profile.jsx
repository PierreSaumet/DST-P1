import { useEffect, useState } from "react";
import { useUser } from "../components/UserContext";
import { Link, Navigate } from "react-router-dom";
import { ScrollText } from "lucide-react";
import ArticleCard from "../components/Article/ArticleCard";

function Profile() {
  const { user, loading, logout, fetchUser, api, initializing } = useUser();
  const [checkedUser, setCheckedUser] = useState(false);
  const [likes, setLikes] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    setCheckedUser(true);
  }, [user, fetchUser]);

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
    return <div>Chargement...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleDeleted = (deletedId) => {
    setArticles((prev) => prev.filter((a) => a.id !== deletedId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const response = await api.post(`articles/`, {
        title,
        description,
        image,
      });

      if (response.status === 201) {
        setSuccess("Article créé avec succès !");
        setTitle("");
        setDescription("");
        setImage("");
        setArticles((prev) => [response.data, ...prev]);
      }
    } catch (err) {
      console.error("Erreur lors de la création de l'article :", err);
      const errorMsg =
        err.response?.data?.title?.[0] ||
        err.response?.data?.description?.[0] ||
        err.response?.data?.detail ||
        "Erreur lors de la création de l'article.";
      setError(errorMsg);
    }
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
          Activité
        </h2>

        {loadingLikes ? (
          <p className="text-center text-gray-400">Chargement...</p>
        ) : likes.length === 0 ? (
          <p className="text-center text-gray-400">
            Vous n'avez encore liké aucun article.
          </p>
        ) : (
          <div className="flex flex-col gap-4 text-center">
            {/* Nombre de likes */}
            <p className="text-lg font-medium">
              ❤️ {likes.length} article{likes.length > 1 ? "s" : ""} aimé
              {likes.length > 1 ? "s" : ""}
            </p>

            {/* Dernier article liké */}
            {lastLiked && (
              <div className="rounded-lg border border-gray-600 bg-gray-100 p-4 dark:bg-gray-700">
                <p className="mb-2 text-sm text-gray-500">
                  Dernier article liké :
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
          <p>Chargement des articles...</p>
        ) : articles.length === 0 ? (
          <p className="text-gray-400">
            Vous n'avez encore écrit aucun article.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onDeleted={handleDeleted}
              />
              // <Link
              //   to={`/articles/${article.id}`}
              //   key={article.id}
              //   className="flex flex-col justify-between rounded-lg border border-gray-700 bg-gray-100 p-4 shadow transition duration-300 hover:scale-105 hover:shadow-lg dark:border-gray-200 dark:bg-gray-800"
              // >
              //   <div>
              //     <h3 className="mb-2 line-clamp-2 text-lg font-bold">
              //       {article.title}
              //     </h3>

              //     <p className="mb-2 line-clamp-3 text-sm text-gray-400">
              //       {article.description}
              //     </p>

              //     {article.image && (
              //       <img
              //         src={article.image}
              //         alt={article.title}
              //         className="mb-3 h-40 w-full rounded object-cover"
              //       />
              //     )}
              //   </div>

              //   <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
              //     <span>👁 {article.views}</span>
              //   </div>
              // </Link>
            ))}
          </div>
        )}
      </div>

      {user.is_active ? (
        <div className="mt-10 w-full max-w-lg rounded-lg border border-gray-200 border-gray-700 bg-gray-100 p-6 shadow-md dark:bg-gray-800">
          <h2 className="text-main-text mb-4 text-2xl font-semibold">
            Écrire un article?
          </h2>

          {success && (
            <p className="mb-4 rounded-lg bg-green-100 p-2 text-green-700">
              {success}
            </p>
          )}
          {error && (
            <p className="mb-4 rounded-lg bg-red-100 p-2 text-red-700">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-left"
          >
            {/* Title / titre */}
            <input
              type="text"
              placeholder="Titre (minimum 5 caractères)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus:ring-main-text rounded-lg border border-gray-300 p-2 focus:ring-2 focus:outline-none"
              required
            />

            {/* Description  */}
            <textarea
              placeholder="Description de l'article"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="focus:ring-main-text rounded-lg border border-gray-300 p-2 focus:ring-2 focus:outline-none"
              required
            ></textarea>

            {/* url */}
            <input
              type="url"
              placeholder="Lien de l'image (facultatif)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="focus:ring-main-text rounded-lg border border-gray-300 p-2 focus:ring-2 focus:outline-none"
            />

            <button
              type="submit"
              className="bg-main-text mt-4 rounded-lg px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105"
            >
              Publier l'article
            </button>
          </form>
        </div>
      ) : (
        <p>
          Veuillez patientez qu'un administrateur accepte votre compte avant de
          publier un article
        </p>
      )}

      <button
        className="dark:bg-main-text mx-4 mt-10 transform cursor-pointer rounded-lg border-2 border-black px-4 py-2 transition duration-300 ease-in-out hover:scale-110"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
