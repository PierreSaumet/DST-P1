import { useState } from "react";
import { useLanguage } from "../LanguageContext";

function ArticleForm({ api, onArticleCreated }) {
  const { t } = useLanguage();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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

        // envoie au parent
        onArticleCreated(response.data);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.title?.[0] ||
        err.response?.data?.description?.[0] ||
        err.response?.data?.detail ||
        "Erreur lors de la création de l'article.";

      setError(errorMsg);
    }
  };

  return (
    <div className="mt-10 w-full max-w-lg rounded-lg border border-gray-200 border-gray-700 bg-gray-100 p-6 shadow-md dark:bg-gray-800">
      <h2 className="text-main-text mb-4 text-2xl font-semibold">
        {t.profile.publishArticle}
      </h2>

      {success && (
        <p className="mb-4 rounded-lg bg-green-100 p-2 text-green-700">
          {success}
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-lg bg-red-100 p-2 text-red-700">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        <input
          type="text"
          placeholder={t.profile.publishForm.title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="focus:ring-main-text rounded-lg border border-gray-300 p-2 focus:ring-2 focus:outline-none"
        />

        <textarea
          placeholder={t.profile.publishForm.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="focus:ring-main-text rounded-lg border border-gray-300 p-2 focus:ring-2 focus:outline-none"
          required
        />

        <input
          type="url"
          placeholder={t.profile.publishForm.image}
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="focus:ring-main-text rounded-lg border border-gray-300 p-2 focus:ring-2 focus:outline-none"
        />

        <button
          type="submit"
          className="bg-main-text mt-4 rounded-lg px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105"
        >
          {t.profile.publishArticle}
        </button>
      </form>
    </div>
  );
}

export default ArticleForm;
