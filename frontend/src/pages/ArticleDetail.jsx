import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/articles/${id}/`,
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

  if (loading)
    return <p className="mt-20 text-center text-gray-500">Chargement...</p>;
  if (error) return <p className="mt-20 text-center text-red-500">{error}</p>;
  if (!article)
    return (
      <p className="mt-20 text-center text-gray-500">Article introuvable.</p>
    );

  return (
    <div className="my-20 flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl rounded-xl border border-gray-200 bg-gray-800 p-6 shadow-md">
        <img
          src={article.image}
          alt={article.title}
          className="mb-6 h-64 w-full rounded-xl object-cover"
        />
        <h1 className="text-main-text mb-4 text-3xl font-bold">
          {article.title}
        </h1>
        <p className="mb-6 text-gray-200">{article.description}</p>
        <p className="text-sm text-gray-400">✍️ Auteur ID : {article.user}</p>

        <Link
          to="/articles"
          className="bg-main-text hover:bg-opacity-90 mt-8 inline-block rounded-lg px-4 py-2 text-white"
        >
          Retour
        </Link>
      </div>
    </div>
  );
}

export default ArticleDetail;
