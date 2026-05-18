import { render, screen, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ArticleDetail from "../../pages/ArticleDetail";
import userEvent from "@testing-library/user-event";

import * as UserContext from "../../components/UserContext";

vi.mock("../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      loading: "Chargement",
      back: "Retour",
      articleDetail: {
        articleNotFound: "Article introuvable",
        author: "Auteur",
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

vi.mock("../../components/UserContext", () => ({
  useUser: vi.fn(),
}));

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
};

const renderArticleDetail = (id = "1") => {
  UserContext.useUser.mockReturnValue({
    user: { id: 42 },
    api: mockApi,
  });

  return render(
    <MemoryRouter initialEntries={[`/articles/${id}`]}>
      <Routes>
        <Route path="/articles/:id" element={<ArticleDetail />} />
      </Routes>
    </MemoryRouter>,
  );
};

// const renderArticleDetail = (id = "1") =>
//   render(
//     <MemoryRouter initialEntries={[`/articles/${id}`]}>
//       <Routes>
//         <Route path="/articles/:id" element={<ArticleDetail />} />
//       </Routes>
//     </MemoryRouter>,
//   );

describe("ArticleDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("shows loading state on mount", () => {
      // ARRANGE
      mockApi.get.mockReturnValueOnce(new Promise(() => {}));

      // ACT
      renderArticleDetail();

      // ASSERT
      expect(screen.getByText("Chargement...")).toBeInTheDocument();
    });

    it("renders article details after successful fetch", async () => {
      // ARRANGE
      mockApi.get.mockResolvedValueOnce({ data: mockArticle });

      // ACT
      renderArticleDetail();

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText("Mon Article")).toBeInTheDocument();
        expect(
          screen.getByText("Une description complète."),
        ).toBeInTheDocument();
        // expect(screen.getByText(/Auteur ID : 42/)).toBeInTheDocument();

        expect(
          screen.getByText(
            (content, element) =>
              element?.tagName === "SPAN" &&
              element.textContent.includes("Auteur") &&
              element.textContent.includes("42"),
          ),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("link", { name: "Retour" }),
        ).toBeInTheDocument();
      });
    });

    it("shows error message if fetch fails", async () => {
      // ARRANGE
      mockApi.get.mockRejectedValueOnce(new Error("Network error"));

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
      mockApi.get.mockResolvedValueOnce({ data: null });

      // ACT
      renderArticleDetail();

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText("Article introuvable.")).toBeInTheDocument();
      });
    });
  });

  describe("fetchArticle", () => {
    it("calls mockApi.get with correct URL using id from params", async () => {
      // ARRANGE
      mockApi.get.mockResolvedValueOnce({ data: mockArticle });

      // ACT
      renderArticleDetail("42");

      // ASSERT
      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith(
          expect.stringContaining("/articles/42/"),
        );
      });
    });

    it("logs error to console if fetch fails", async () => {
      // ARRANGE
      const err = new Error("Network error");
      mockApi.get.mockRejectedValueOnce(err);
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

  describe("handleLike", () => {
    it("toggles like on button click", async () => {
      // ARRANGE
      mockApi.get
        .mockResolvedValueOnce({ data: mockArticle })
        .mockResolvedValueOnce({ data: [] });
      mockApi.post.mockResolvedValueOnce({});

      renderArticleDetail();

      await waitFor(() => {
        expect(screen.getByText(/🤍/)).toBeInTheDocument();
      });

      // ACT
      await userEvent.click(screen.getByRole("button"));

      // ASSERT
      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith("likes/1/toggle/");
        expect(screen.getByText(/❤️/)).toBeInTheDocument();
      });
    });

    it("logs error if toggle like fails", async () => {
      // ARRANGE
      mockApi.get
        .mockResolvedValueOnce({ data: mockArticle })
        .mockResolvedValueOnce({ data: [] });
      mockApi.post.mockRejectedValueOnce(new Error("Toggle error"));
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderArticleDetail();

      await waitFor(() => {
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      // ACT
      await userEvent.click(screen.getByRole("button"));

      // ASSERT
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Erreur toggle like :",
          expect.any(Error),
        );
      });

      consoleSpy.mockRestore();
    });
  });
});
