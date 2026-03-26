import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Articles from "../../pages/Articles";

vi.mock("axios");

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      articles: {
        title: "Liste des Articles",
        placeholder: "Rechercher un article...",
        loadingArticles: "Chargement des articles",
      },
      search: "Rechercher",
      previous: "Précédent",
      next: "Suivant",
    },
  }),
}));

const mockArticles = [
  {
    id: 1,
    title: "Article 1",
    description: "Description 1",
    image: "img1.jpg",
    user: 1,
  },
  {
    id: 2,
    title: "Article 2",
    description: "Description 2",
    image: "img2.jpg",
    user: 2,
  },
];

const renderArticles = () =>
  render(
    <MemoryRouter>
      <Articles />
    </MemoryRouter>,
  );

describe("Articles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("shows loading state on mount", () => {
      // ARRANGE
      axios.get.mockReturnValueOnce(new Promise(() => {}));

      // ACT
      renderArticles();

      // ASSERT
      expect(
        screen.getByText("Chargement des articles..."),
      ).toBeInTheDocument();
    });

    it("renders articles list after successful fetch", async () => {
      // ARRANGE
      axios.get.mockResolvedValueOnce({
        data: { results: mockArticles, next: null, previous: null },
      });

      // ACT
      renderArticles();

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText("Article 1")).toBeInTheDocument();
        expect(screen.getByText("Article 2")).toBeInTheDocument();
      });
    });

    it("shows error message if fetch fails", async () => {
      // ARRANGE
      axios.get.mockRejectedValueOnce(new Error("Network error"));

      // ACT
      renderArticles();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("Impossible de charger les articles."),
        ).toBeInTheDocument();
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
      renderArticles();

      // ASSERT
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Erreur lors du chargement des articles :",
          err,
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe("pagination", () => {
    it("disables previous button when no previous page", async () => {
      // ARRANGE
      axios.get.mockResolvedValueOnce({
        data: {
          results: mockArticles,
          next: "http://api/articles/?page=2",
          previous: null,
        },
      });

      // ACT
      renderArticles();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Précédent" }),
        ).toBeDisabled();
      });
    });

    it("disables next button when no next page", async () => {
      // ARRANGE
      axios.get.mockResolvedValueOnce({
        data: {
          results: mockArticles,
          next: null,
          previous: "http://api/articles/?page=1",
        },
      });

      // ACT
      renderArticles();

      // ASSERT
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Suivant" })).toBeDisabled();
      });
    });

    it("fetches next page on next button click", async () => {
      // ARRANGE
      axios.get.mockResolvedValueOnce({
        data: {
          results: mockArticles,
          next: "http://api/articles/?page=2",
          previous: null,
        },
      });
      renderArticles();
      await waitFor(() => screen.getByText("Article 1"));

      axios.get.mockResolvedValueOnce({
        data: {
          results: mockArticles,
          next: null,
          previous: "http://api/articles/?page=1",
        },
      });

      // ACT
      fireEvent.click(screen.getByRole("button", { name: "Suivant" }));

      // ASSERT
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          "http://api/articles/?page=2",
          expect.any(Object),
        );
      });
    });

    it("fetches previous page on previous button click", async () => {
      // ARRANGE
      axios.get.mockResolvedValueOnce({
        data: {
          results: mockArticles,
          next: null,
          previous: "http://api/articles/?page=1",
        },
      });
      renderArticles();
      await waitFor(() => screen.getByText("Article 1"));

      axios.get.mockResolvedValueOnce({
        data: {
          results: mockArticles,
          next: "http://api/articles/?page=2",
          previous: null,
        },
      });

      // ACT
      fireEvent.click(screen.getByRole("button", { name: "Précédent" }));

      // ASSERT
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          "http://api/articles/?page=1",
          expect.any(Object),
        );
      });
    });

    it("does not fetch if next page is null on next button click", async () => {
      // ARRANGE
      axios.get.mockResolvedValueOnce({
        data: { results: mockArticles, next: null, previous: null },
      });
      renderArticles();
      await waitFor(() => screen.getByText("Article 1"));

      // ACT
      fireEvent.click(screen.getByRole("button", { name: "Suivant" }));

      // ASSERT
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it("does not fetch if previous page is null on previous button click", async () => {
      // ARRANGE
      axios.get.mockResolvedValueOnce({
        data: { results: mockArticles, next: null, previous: null },
      });
      renderArticles();
      await waitFor(() => screen.getByText("Article 1"));

      // ACT
      fireEvent.click(screen.getByRole("button", { name: "Précédent" }));

      // ASSERT
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleSearch", () => {
    it("fetches articles with search query on form submit", async () => {
      // ARRANGE
      axios.get.mockResolvedValueOnce({
        data: { results: mockArticles, next: null, previous: null },
      });
      renderArticles();
      await waitFor(() => screen.getByText("Article 1"));

      axios.get.mockResolvedValueOnce({
        data: { results: [mockArticles[0]], next: null, previous: null },
      });

      // ACT
      fireEvent.change(
        screen.getByPlaceholderText("Rechercher un article..."),
        {
          target: { value: "Article 1" },
        },
      );
      fireEvent.submit(
        screen.getByPlaceholderText("Rechercher un article...").closest("form"),
      );

      // ASSERT
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining("/articles/"),
          { params: { search: "Article 1" } },
        );
      });
    });
  });

  describe("goToArticle", () => {
    it("navigates to article detail page on article click", async () => {
      // ARRANGE
      axios.get.mockResolvedValueOnce({
        data: { results: mockArticles, next: null, previous: null },
      });
      renderArticles();
      await waitFor(() => screen.getByText("Article 1"));

      // ACT
      fireEvent.click(screen.getByText("Article 1"));

      // ASSERT
      expect(mockNavigate).toHaveBeenCalledWith("/articles/1");
    });
  });
});
