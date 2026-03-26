import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Profile from "../../pages/Profile";
import * as UserContext from "../../components/UserContext";

vi.mock("axios");

vi.mock("../../components/UserContext", () => ({
  useUser: vi.fn(),
}));

const mockUser = {
  first_name: "John",
  last_name: "Doe",
  email: "john@test.com",
};

const mockFetchUser = vi.fn();
const mockLogout = vi.fn();

const renderProfile = () =>
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>,
  );

const setupUser = (overrides = {}) => {
  UserContext.useUser.mockReturnValue({
    user: mockUser,
    loading: false,
    logout: mockLogout,
    fetchUser: mockFetchUser,
    ...overrides,
  });
};

const fillForm = ({
  title = "Mon titre",
  description = "Ma description",
  image = "https://img.com/img.png",
} = {}) => {
  fireEvent.change(
    screen.getByPlaceholderText("Titre (minimum 5 caractères)"),
    {
      target: { value: title },
    },
  );
  fireEvent.change(screen.getByPlaceholderText("Description de l'article"), {
    target: { value: description },
  });
  fireEvent.change(
    screen.getByPlaceholderText("Lien de l'image (facultatif)"),
    {
      target: { value: image },
    },
  );
};

const submitForm = () =>
  fireEvent.submit(
    screen.getByRole("button", { name: "Publier l'article" }).closest("form"),
  );

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("rendering", () => {
    it("shows loading state while checking user", () => {
      // ARRANGE
      setupUser({ loading: true, user: null });

      // ACT
      renderProfile();

      // ASSERT
      expect(screen.getByText("Chargement...")).toBeInTheDocument();
    });

    it("shows loading state while checkedUser is false", () => {
      // ARRANGE
      mockFetchUser.mockReturnValue(new Promise(() => {}));
      setupUser({ user: null, loading: false });

      // ACT
      renderProfile();

      // ASSERT
      expect(screen.getByText("Chargement...")).toBeInTheDocument();
    });

    it("redirects to /login if no user after check", async () => {
      // ARRANGE
      mockFetchUser.mockResolvedValueOnce(null);
      setupUser({ user: null, loading: false });

      // ACT
      renderProfile();

      // ASSERT
      await waitFor(() => {
        expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
      });

      expect(
        screen.queryByPlaceholderText("Titre (minimum 5 caractères)"),
      ).not.toBeInTheDocument();
    });

    it("renders user profile and article form when user is logged in", async () => {
      // ARRANGE
      setupUser();
      mockFetchUser.mockResolvedValueOnce(null);

      // ACT
      renderProfile();

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText(/Profil de Prénom: John/)).toBeInTheDocument();
        expect(
          screen.getByText(/Votre Email: john@test.com/),
        ).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText("Titre (minimum 5 caractères)"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("useEffect", () => {
    it("calls fetchUser if user is null on mount", async () => {
      // ARRANGE
      mockFetchUser.mockResolvedValueOnce(null);
      setupUser({ user: null, loading: false });

      // ACT
      renderProfile();

      // ASSERT
      await waitFor(() => {
        expect(mockFetchUser).toHaveBeenCalled();
      });
    });

    it("does not call fetchUser if user is already set", async () => {
      // ARRANGE
      setupUser();

      // ACT
      renderProfile();

      // ASSERT
      await waitFor(() => {
        expect(mockFetchUser).not.toHaveBeenCalled();
      });
    });
  });

  describe("handleSubmit", () => {
    it("shows error if no token in localStorage", async () => {
      // ARRANGE
      setupUser();
      renderProfile();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("Vous devez être connecté pour publier un article."),
        ).toBeInTheDocument();
      });
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("calls axios.post with correct payload when token exists", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "valid-token");
      axios.post.mockResolvedValueOnce({ status: 201 });
      setupUser();
      renderProfile();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining("/articles/"),
          {
            title: "Mon titre",
            description: "Ma description",
            image: "https://img.com/img.png",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer valid-token",
            },
          },
        );
      });
    });

    it("shows success message and resets form on article creation", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "valid-token");
      axios.post.mockResolvedValueOnce({ status: 201 });
      setupUser();
      renderProfile();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("Article créé avec succès !"),
        ).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText("Titre (minimum 5 caractères)").value,
        ).toBe("");
        expect(
          screen.getByPlaceholderText("Description de l'article").value,
        ).toBe("");
        expect(
          screen.getByPlaceholderText("Lien de l'image (facultatif)").value,
        ).toBe("");
      });
    });

    it("shows error from title field if API returns title error", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "valid-token");
      axios.post.mockRejectedValueOnce({
        response: { data: { title: ["Le titre est trop court."] } },
      });
      setupUser();
      renderProfile();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("Le titre est trop court."),
        ).toBeInTheDocument();
      });
    });

    it("shows error from description field if API returns description error", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "valid-token");
      axios.post.mockRejectedValueOnce({
        response: { data: { description: ["La description est invalide."] } },
      });
      setupUser();
      renderProfile();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("La description est invalide."),
        ).toBeInTheDocument();
      });
    });

    it("shows error from detail field if API returns detail error", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "valid-token");
      axios.post.mockRejectedValueOnce({
        response: { data: { detail: "Permission refusée." } },
      });
      setupUser();
      renderProfile();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText("Permission refusée.")).toBeInTheDocument();
      });
    });

    it("shows generic error message if API returns no specific error", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "valid-token");
      axios.post.mockRejectedValueOnce(new Error("Network error"));
      setupUser();
      renderProfile();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("Erreur lors de la création de l'article."),
        ).toBeInTheDocument();
      });
    });

    it("logs error to console on API error", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "valid-token");
      const apiError = new Error("Network error");
      axios.post.mockRejectedValueOnce(apiError);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      setupUser();
      renderProfile();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Erreur lors de la création de l'article :",
          apiError,
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe("logout", () => {
    it("calls logout on button click", async () => {
      // ARRANGE
      setupUser();
      renderProfile();

      // ACT
      fireEvent.click(screen.getByRole("button", { name: "Logout" }));

      // ASSERT
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe("controlled inputs", () => {
    it("updates all field values on change", () => {
      // ARRANGE
      setupUser();
      renderProfile();

      // ACT
      fillForm();

      // ASSERT
      expect(
        screen.getByPlaceholderText("Titre (minimum 5 caractères)").value,
      ).toBe("Mon titre");
      expect(
        screen.getByPlaceholderText("Description de l'article").value,
      ).toBe("Ma description");
      expect(
        screen.getByPlaceholderText("Lien de l'image (facultatif)").value,
      ).toBe("https://img.com/img.png");
    });
  });
});
