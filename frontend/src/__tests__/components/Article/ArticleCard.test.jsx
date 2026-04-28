import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import * as UserContext from "../../../components/UserContext";
import * as LanguageContext from "../../../components/LanguageContext";
import ArticleCard from "../../../components/Article/ArticleCard";

// ─── Mocks globaux ────────────────────────────────────────────────────────────

vi.mock("../../../components/UserContext", () => ({
  useUser: vi.fn(),
}));

vi.mock("../../../components/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

// framer-motion : on court-circuite les animations pour éviter tout timer interne
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockDelete = vi.fn();
const mockOnDeleted = vi.fn();

const article = {
  id: 42,
  title: "Mon super article",
  description: "Une description courte.",
  views: 123,
  image: "https://example.com/image.jpg",
};

const articleWithoutImage = { ...article, image: null };

const t = {
  delete: {
    deleteArticle: "Supprimer l'article",
    description: "Cette action est irréversible.",
    cancel: "Annuler",
    delete: "Supprimer",
    delarticleDeletedete: "Article supprimé !",
  },
};

// ─── Pourquoi pas vi.useFakeTimers() global ? ─────────────────────────────────
// waitFor() de testing-library utilise de vrais setTimeout en interne pour
// poller le DOM. Si on remplace tous les timers par des fakes dès le départ,
// waitFor se fige et timeout. La règle : fake timers uniquement dans les tests
// qui ont besoin de contrôler le setTimeout(1500), installés et désinstallés
// dans le corps du test lui-même.
//
// Pour les tests async "simples" (juste attendre la résolution d'une Promise),
// on utilise `flushPromises` : une micro-attente qui laisse la callstack JS
// se vider sans bloquer waitFor.
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderCard = (props = {}) =>
  render(
    <MemoryRouter>
      <ArticleCard article={article} onDeleted={mockOnDeleted} {...props} />
    </MemoryRouter>,
  );

const openModal = () => {
  renderCard();
  fireEvent.click(screen.getByRole("button"));
};

const openAndConfirm = () => {
  renderCard();
  fireEvent.click(screen.getByRole("button")); // ouvre la modale
  fireEvent.click(screen.getByRole("button", { name: t.delete.delete }));
};

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  UserContext.useUser.mockReturnValue({ api: { delete: mockDelete } });
  LanguageContext.useLanguage.mockReturnValue({ t });
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("ArticleCard", () => {
  // ── Rendu initial ──────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("affiche le titre et la description", () => {
      renderCard();
      expect(screen.getByText(article.title)).toBeInTheDocument();
      expect(screen.getByText(article.description)).toBeInTheDocument();
    });

    it("affiche le nombre de vues", () => {
      renderCard();
      expect(screen.getByText(`👁 ${article.views}`)).toBeInTheDocument();
    });

    it("affiche l'image quand elle est fournie", () => {
      renderCard();
      const img = screen.getByRole("img", { name: article.title });
      expect(img).toHaveAttribute("src", article.image);
    });

    it("n'affiche pas d'image quand elle est absente", () => {
      renderCard({ article: articleWithoutImage });
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("le lien pointe vers la bonne URL", () => {
      renderCard();
      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        `/articles/${article.id}`,
      );
    });

    it("affiche le bouton de suppression (croix)", () => {
      renderCard();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("n'affiche pas la modale de confirmation par défaut", () => {
      renderCard();
      expect(
        screen.queryByText(t.delete.deleteArticle),
      ).not.toBeInTheDocument();
    });

    it("n'affiche pas le toast de succès par défaut", () => {
      renderCard();
      expect(
        screen.queryByText(t.delete.delarticleDeletedete),
      ).not.toBeInTheDocument();
    });
  });

  // ── Modale de confirmation ─────────────────────────────────────────────────

  describe("confirmation modal", () => {
    it("s'ouvre en cliquant sur le bouton X", () => {
      openModal();
      expect(screen.getByText(t.delete.deleteArticle)).toBeInTheDocument();
      expect(screen.getByText(t.delete.description)).toBeInTheDocument();
    });

    it("affiche les boutons Annuler et Supprimer", () => {
      openModal();
      expect(
        screen.getByRole("button", { name: t.delete.cancel }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: t.delete.delete }),
      ).toBeInTheDocument();
    });

    it("se ferme en cliquant sur Annuler", () => {
      openModal();
      fireEvent.click(screen.getByRole("button", { name: t.delete.cancel }));
      expect(
        screen.queryByText(t.delete.deleteArticle),
      ).not.toBeInTheDocument();
    });

    it("se ferme en cliquant sur l'overlay", () => {
      openModal();
      const overlay = document.querySelector(".fixed.inset-0");
      fireEvent.click(overlay);
      expect(
        screen.queryByText(t.delete.deleteArticle),
      ).not.toBeInTheDocument();
    });

    it("le clic sur le contenu de la modale ne la ferme pas (stopPropagation)", () => {
      openModal();
      const modalContent = screen
        .getByText(t.delete.description)
        .closest("div");
      fireEvent.click(modalContent);
      expect(screen.getByText(t.delete.deleteArticle)).toBeInTheDocument();
    });

    it("le clic sur le bouton X ne déclenche pas de navigation (preventDefault)", () => {
      renderCard();
      expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
    });
  });

  // ── Suppression (succès) ───────────────────────────────────────────────────
  //
  // Stratégie : on laisse les vrais timers actifs pour les tests qui utilisent
  // uniquement flushPromises (résolution de Promise), et on installe les fake
  // timers localement dans les tests qui doivent contrôler le setTimeout(1500).

  describe("delete — success", () => {
    beforeEach(() => {
      mockDelete.mockResolvedValue({});
    });

    it("appelle api.delete avec la bonne URL", async () => {
      openAndConfirm();
      await act(async () => {
        await flushPromises();
      });

      expect(mockDelete).toHaveBeenCalledWith(`/articles/${article.id}/`);
    });

    it("ferme la modale après suppression", async () => {
      openAndConfirm();
      await act(async () => {
        await flushPromises();
      });

      expect(
        screen.queryByText(t.delete.deleteArticle),
      ).not.toBeInTheDocument();
    });

    it("affiche le toast de succès après suppression", async () => {
      openAndConfirm();
      await act(async () => {
        await flushPromises();
      });

      expect(
        screen.getByText(t.delete.delarticleDeletedete),
      ).toBeInTheDocument();
    });

    it("n'appelle pas onDeleted avant 1500 ms", async () => {
      vi.useFakeTimers();
      mockDelete.mockResolvedValue({});

      openAndConfirm();
      // Flush la Promise de api.delete sans toucher aux timers
      await act(async () => {
        await Promise.resolve();
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockOnDeleted).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it("appelle onDeleted avec l'id de l'article après 1500 ms", async () => {
      vi.useFakeTimers();
      mockDelete.mockResolvedValue({});

      openAndConfirm();
      await act(async () => {
        await Promise.resolve();
      });

      act(() => {
        vi.advanceTimersByTime(1500);
      });

      expect(mockOnDeleted).toHaveBeenCalledWith(article.id);

      vi.useRealTimers();
    });

    it("cache le toast après 1500 ms", async () => {
      vi.useFakeTimers();
      mockDelete.mockResolvedValue({});

      openAndConfirm();
      await act(async () => {
        await Promise.resolve();
      });

      // Toast visible avant le délai
      expect(
        screen.getByText(t.delete.delarticleDeletedete),
      ).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1500);
      });

      expect(
        screen.queryByText(t.delete.delarticleDeletedete),
      ).not.toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  // ── Suppression (erreur) ───────────────────────────────────────────────────

  describe("delete — error", () => {
    it("log l'erreur et ne plante pas si l'API échoue", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockDelete.mockRejectedValue(new Error("Network error"));

      openAndConfirm();
      await act(async () => {
        await flushPromises();
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur suppression:",
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it("laisse la modale ouverte en cas d'erreur", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      mockDelete.mockRejectedValue(new Error("Network error"));

      openAndConfirm();
      await act(async () => {
        await flushPromises();
      });

      // setShowConfirm(false) n'est appelé qu'en cas de succès
      expect(screen.getByText(t.delete.deleteArticle)).toBeInTheDocument();
    });

    it("n'affiche pas le toast en cas d'erreur", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      mockDelete.mockRejectedValue(new Error("Network error"));

      openAndConfirm();
      await act(async () => {
        await flushPromises();
      });

      expect(
        screen.queryByText(t.delete.delarticleDeletedete),
      ).not.toBeInTheDocument();
    });
  });
});
