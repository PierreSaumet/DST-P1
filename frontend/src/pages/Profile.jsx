import { useEffect, useState } from "react";
import { useUser } from "../components/UserContext";
import { Navigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const { user, loading, logout, fetchUser } = useUser();
  const [checkedUser, setCheckedUser] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        await fetchUser();
      }
      setCheckedUser(true);
    };

    checkUser();
  }, [user, fetchUser]);

  if (loading || !checkedUser) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour publier un article.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/articles/",
        { title, description, image },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        setSuccess("Article créé avec succès !");
        setTitle("");
        setDescription("");
        setImage("");
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

  return (
    <div className="my-[80px] flex flex-col items-center justify-center text-center">
      <h1>
        Profil de Prénom: {user.first_name} et Nom de Famille: {user.last_name}
      </h1>
      <p>Votre Email: {user.email}</p>

      <div className="mt-10 w-full max-w-lg rounded-lg border border-gray-200 bg-gray-800 p-6 shadow-md">
        <h2 className="text-main-text mb-4 text-2xl font-semibold">
          Écrire un article?
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

      <button
        className="bg-main-text mx-4 mt-10 transform rounded-lg px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-110"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
