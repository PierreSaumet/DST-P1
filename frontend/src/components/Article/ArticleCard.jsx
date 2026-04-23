import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { useUser } from "../UserContext";

function ArticleCard({ article, onDeleted }) {
  const { api } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/articles/${article.id}/`);
      setShowConfirm(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onDeleted(article.id);
      }, 1500);
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  return (
    <>
      <div className="relative">
        <Link
          to={`/articles/${article.id}`}
          className="flex flex-col justify-between rounded-lg border border-gray-700 bg-gray-100 p-4 shadow transition duration-300 hover:scale-105 hover:shadow-lg dark:border-gray-200 dark:bg-gray-800"
        >
          <div>
            <h3 className="mb-2 line-clamp-2 text-lg font-bold">
              {article.title}
            </h3>
            <p className="mb-2 line-clamp-3 text-sm text-gray-400">
              {article.description}
            </p>
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="mb-3 h-40 w-full rounded object-cover"
              />
            )}
          </div>
          <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
            <span>👁 {article.views}</span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              setShowConfirm(true);
            }}
            className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow transition hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </Link>

        {/* Bouton suppression */}
      </div>

      {/* Modal confirmation */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center gap-3">
                <Trash2 className="text-red-500" size={24} />
                <h2 className="text-lg font-bold">Supprimer l'article ?</h2>
              </div>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                Cette action est irréversible. L'article sera définitivement
                supprimé.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast succès */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-green-500 px-6 py-3 text-sm font-medium text-white shadow-lg"
          >
            ✓ Article supprimé
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ArticleCard;
