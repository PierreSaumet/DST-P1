import { render, screen, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import ArticleDetail from "../../pages/ArticleDetail";

vi.mock("axios");

vi.mock("../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      loading: "Chargement",
      back: "Retour",
      articleDetail: {
        articleNotFound: "Article introuvable",
        author: "Auteur",
        w,
      },
    },
  }),
}));

const mockArticle = {
  id: 1,
  title: "Mon Article",
  description: "Une description complète.",
  image: "https://img.com/img.png",
  user: 42,
};

const renderArticleDetail = (id = "1") =>
  render(
    <MemoryRouter initialEntries={[`/articles/${id}`]}>
      <Routes>
        <Route path="/articles/:id" element={<ArticleDetail />} />
      </Routes>
    </MemoryRouter>,
  );

describe("ArticleDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("shows loading state on mount", () => {
      // ARRANGE
      axios.get.mockReturnValueOnce(new Promise(() => {}));

      // ACT
      renderArticleDetail();

      // ASSERT
      expect(screen.getByText("Chargement...")).toBeInTheDocument();
    });

    it("renders article details after successful fetch", async () => {
      // ARRANGE
      axios.get.mockResolvedValueOnce({ data: mockArticle });

      // ACT
      renderArticleDetail();

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText("Mon Article")).toBeInTheDocument();
        expect(
          screen.getByText("Une description complète."),
        ).toBeInTheDocument();
        expect(screen.getByText(/Auteur ID : 42/)).toBeInTheDocument();
        expect(
          screen.getByRole("link", { name: "Retour" }),
        ).toBeInTheDocument();
      });
    });

    it("shows error message if fetch fails", async () => {
      // ARRANGE
      axios.get.mockRejectedValueOnce(new Error("Network error"));

      // ACT
      renderArticleDetail();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("Impossible de charger cet article."),
        ).toBeInTheDocument();
      });
    });

    it("shows article not found message if article is null", async () => {
      // ARRANGE
      axios.get.mockResolvedValueOnce({ data: null });

      // ACT
      renderArticleDetail();

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText("Article introuvable.")).toBeInTheDocument();
      });
    });
  });

  describe("fetchArticle", () => {
    it("calls axios.get with correct URL using id from params", async () => {
      // ARRANGE
      axios.get.mockResolvedValueOnce({ data: mockArticle });

      // ACT
      renderArticleDetail("42");

      // ASSERT
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining("/articles/42/"),
        );
      });
    });

    it("logs error to console if fetch fails", async () => {
      // ARRANGE
      const err = new Error("Network error");
      axios.get.mockRejectedValueOnce(err);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // ACT
      renderArticleDetail();

      // ASSERT
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Erreur lors du chargement de l'article :",
          err,
        );
      });

      consoleSpy.mockRestore();
    });
  });
});
