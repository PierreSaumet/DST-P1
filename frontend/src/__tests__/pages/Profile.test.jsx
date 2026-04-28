import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import * as UserContext from "../../components/UserContext";
import Profile from "../../pages/Profile";

// ─── Global mocks ─────────────────────────────────────────────────────────────

vi.mock("../../components/UserContext", () => ({
  useUser: vi.fn(),
}));

// ArticleCard and ArticleForm are tested in isolation — stub them here
vi.mock("../../components/Article/ArticleCard", () => ({
  default: ({ article, onDeleted }) => (
    <div data-testid={`article-card-${article.id}`}>
      <span>{article.title}</span>
      <button onClick={() => onDeleted(article.id)}>Delete {article.id}</button>
    </div>
  ),
}));

vi.mock("../../components/Profile/ArticleForm", () => ({
  default: ({ onArticleCreated }) => (
    <button onClick={() => onArticleCreated({ id: 99, title: "New article" })}>
      Create article
    </button>
  ),
}));

vi.mock("../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      loading: "Loading",
      logout: "Logout",
      article: "article",
      liked: "liked",
      profile: {
        activity: "Activity",
        noArticleLiked: "No liked articles yet.",
        lastLiked: "Last liked article:",
        loadingArticles: "Loading articles...",
        noArticle: "No articles yet.",
        publishArticle: "Publish an article",
        publishForm: {
          title: "Title",
          description: "Description",
          image: "Image URL",
        },
      },
    },
  }),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockLogout = vi.fn();

const mockUser = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  email: "john@test.com",
};

const mockArticles = [
  { id: 10, title: "Article A", description: "Desc A", views: 5, image: null },
  { id: 11, title: "Article B", description: "Desc B", views: 3, image: null },
];

const mockLikes = [
  {
    id: 1,
    created_at: "2024-01-15T10:00:00Z",
    article: { id: 10, title: "Article A" },
  },
  {
    id: 2,
    created_at: "2024-03-01T10:00:00Z",
    article: { id: 11, title: "Article B" },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Build a mock `api` object.
 * By default: articles and likes resolve successfully.
 */
const makeMockApi = ({
  articlesData = { results: mockArticles },
  likesData = mockLikes,
  articlesError = null,
  likesError = null,
} = {}) => ({
  get: vi.fn((url) => {
    if (url.includes("articles")) {
      return articlesError
        ? Promise.reject(articlesError)
        : Promise.resolve({ data: articlesData });
    }
    if (url.includes("likes")) {
      return likesError
        ? Promise.reject(likesError)
        : Promise.resolve({ data: likesData });
    }
    return Promise.resolve({ data: {} });
  }),
});

/**
 * Configure useUser mock and render Profile.
 * Waits for all pending promises so the component is fully loaded.
 */
const renderProfile = async (userOverrides = {}, apiOverrides = {}) => {
  const api = makeMockApi(apiOverrides);

  UserContext.useUser.mockReturnValue({
    user: mockUser,
    loading: false,
    initializing: false,
    logout: mockLogout,
    api,
    ...userOverrides,
  });

  let result;
  await act(async () => {
    result = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );
    await flushPromises();
  });

  return { ...result, api };
};

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Profile", () => {
  // ── Loading / redirects ────────────────────────────────────────────────────

  describe("loading and redirect states", () => {
    it("shows a loading indicator while initializing", () => {
      UserContext.useUser.mockReturnValue({
        user: null,
        loading: false,
        initializing: true,
        logout: mockLogout,
        api: makeMockApi(),
      });

      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>,
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("shows a loading indicator while loading", () => {
      UserContext.useUser.mockReturnValue({
        user: null,
        loading: true,
        initializing: false,
        logout: mockLogout,
        api: makeMockApi(),
      });

      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>,
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("redirects to /login when user is null and not loading", () => {
      UserContext.useUser.mockReturnValue({
        user: null,
        loading: false,
        initializing: false,
        logout: mockLogout,
        api: makeMockApi(),
      });

      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>,
      );

      // Profile content must not be rendered
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      // ArticleForm stub must not be rendered either
      expect(screen.queryByText("Create article")).not.toBeInTheDocument();
    });
  });

  // ── User info ─────────────────────────────────────────────────────────────

  describe("user info", () => {
    it("renders the user's full name", async () => {
      await renderProfile();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("renders the user's email", async () => {
      await renderProfile();
      expect(screen.getByText("john@test.com")).toBeInTheDocument();
    });

    it("renders the logout button", async () => {
      await renderProfile();
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("calls logout when the logout button is clicked", async () => {
      await renderProfile();
      fireEvent.click(screen.getByText("Logout"));
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  // ── API calls ─────────────────────────────────────────────────────────────

  describe("API calls on mount", () => {
    it("fetches articles for the logged-in user", async () => {
      const { api } = await renderProfile();
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining(`user=${mockUser.id}`),
        expect.anything(),
      );
    });

    it("fetches likes on mount", async () => {
      const { api } = await renderProfile();
      expect(api.get).toHaveBeenCalledWith("likes/");
    });

    it("does not fetch when user is null", () => {
      // useEffects bail out early when user is null
      const api = makeMockApi();
      UserContext.useUser.mockReturnValue({
        user: null,
        loading: false,
        initializing: false,
        logout: mockLogout,
        api,
      });

      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>,
      );

      expect(api.get).not.toHaveBeenCalled();
    });

    it("logs an error when articles fetch fails", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await renderProfile({}, { articlesError: new Error("articles error") });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur récupération articles :",
        expect.any(Error),
      );
      consoleSpy.mockRestore();
    });

    it("logs an error when likes fetch fails", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await renderProfile({}, { likesError: new Error("likes error") });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur récupération likes :",
        expect.any(Error),
      );
      consoleSpy.mockRestore();
    });
  });

  // ── Articles section ───────────────────────────────────────────────────────

  describe("articles section", () => {
    it("shows a loading state while articles are being fetched", () => {
      // api.get never resolves → loadingArticles stays true
      const api = {
        get: vi.fn(() => new Promise(() => {})),
      };
      UserContext.useUser.mockReturnValue({
        user: mockUser,
        loading: false,
        initializing: false,
        logout: mockLogout,
        api,
      });

      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>,
      );

      expect(screen.getByText("Loading articles...")).toBeInTheDocument();
    });

    it("renders an ArticleCard for each article", async () => {
      await renderProfile();
      expect(screen.getByTestId("article-card-10")).toBeInTheDocument();
      expect(screen.getByTestId("article-card-11")).toBeInTheDocument();
    });

    it("shows a message when the user has no articles", async () => {
      await renderProfile({}, { articlesData: { results: [] } });
      expect(screen.getByText("No articles yet.")).toBeInTheDocument();
    });

    it("shows a message when articles fetch fails", async () => {
      await renderProfile({}, { articlesError: new Error("fail") });
      expect(screen.getByText("No articles yet.")).toBeInTheDocument();
    });
  });

  // ── Delete article ─────────────────────────────────────────────────────────

  describe("handleDeleted", () => {
    it("removes the deleted article card from the list", async () => {
      await renderProfile();

      expect(screen.getByTestId("article-card-10")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Delete 10"));

      expect(screen.queryByTestId("article-card-10")).not.toBeInTheDocument();
      expect(screen.getByTestId("article-card-11")).toBeInTheDocument();
    });

    it("shows the empty state message when the last article is deleted", async () => {
      await renderProfile({}, { articlesData: { results: [mockArticles[0]] } });

      fireEvent.click(screen.getByText("Delete 10"));

      expect(screen.getByText("No articles yet.")).toBeInTheDocument();
    });
  });

  // ── Create article ─────────────────────────────────────────────────────────

  describe("onArticleCreated", () => {
    it("prepends the new article to the list", async () => {
      await renderProfile();

      fireEvent.click(screen.getByText("Create article"));

      // Article 99 injected by the ArticleForm stub must appear
      expect(screen.getByTestId("article-card-99")).toBeInTheDocument();
    });

    it("shows the new article even when the list was initially empty", async () => {
      await renderProfile({}, { articlesData: { results: [] } });

      expect(screen.getByText("No articles yet.")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Create article"));

      expect(screen.getByTestId("article-card-99")).toBeInTheDocument();
      expect(screen.queryByText("No articles yet.")).not.toBeInTheDocument();
    });
  });

  // ── Likes / activity section ───────────────────────────────────────────────

  describe("likes / activity section", () => {
    it("shows a loading state while likes are being fetched", () => {
      const api = {
        get: vi.fn(() => new Promise(() => {})),
      };
      UserContext.useUser.mockReturnValue({
        user: mockUser,
        loading: false,
        initializing: false,
        logout: mockLogout,
        api,
      });

      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>,
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("shows a message when the user has no likes", async () => {
      await renderProfile({}, { likesData: [] });
      expect(screen.getByText("No liked articles yet.")).toBeInTheDocument();
    });

    it("shows the total number of likes", async () => {
      await renderProfile();
      // 2 likes → "❤️ 2 articles likeds"
      expect(screen.getByText(/❤️ 2/)).toBeInTheDocument();
    });

    it("shows the most recently liked article", async () => {
      await renderProfile();
      // lastLiked is sorted by created_at desc → Article B (2024-03-01)
      expect(screen.getByText("Article B")).toBeInTheDocument();
    });

    it("shows a message when likes fetch fails", async () => {
      await renderProfile({}, { likesError: new Error("fail") });
      expect(screen.getByText("No liked articles yet.")).toBeInTheDocument();
    });
  });
});
