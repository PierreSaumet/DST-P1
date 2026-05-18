import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ResetPasswordCallback from "../../pages/ResetPasswordCallback";
import * as UserContext from "../../components/UserContext";

vi.mock("../../components/UserContext", () => ({
  useUser: vi.fn(),
  api: {
    post: vi.fn(),
  },
}));

const VALID_PASSWORD = "Password1!";

const renderComponent = (search = "?uidb64=abc&token=xyz") => {
  delete window.location;
  window.location = { search };
  return render(
    <MemoryRouter>
      <ResetPasswordCallback />
    </MemoryRouter>,
  );
};

describe("ResetPasswordCallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("shows the form when params are valid", async () => {
      // ARRANGE + ACT
      renderComponent();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Nouveau mot de passe"),
        ).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText("Même mot de passe"),
        ).toBeInTheDocument();
      });
    });

    it("shows error if uidb64 is missing", async () => {
      // ARRANGE + ACT
      renderComponent("?token=xyz");

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("Une erreur est survenue, veuillez recommencer."),
        ).toBeInTheDocument();
      });
    });

    it("shows error if token is missing", async () => {
      // ARRANGE + ACT
      renderComponent("?uidb64=abc");

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("Une erreur est survenue, veuillez recommencer."),
        ).toBeInTheDocument();
      });
    });
  });

  describe("password rules", () => {
    it("shows password rules on focus", async () => {
      // ARRANGE
      renderComponent();

      // ACT
      await userEvent.click(
        screen.getByPlaceholderText("Nouveau mot de passe"),
      );

      // ASSERT
      expect(screen.getByText("8 caractères minimum")).toBeInTheDocument();
      expect(screen.getByText("Une minuscule")).toBeInTheDocument();
      expect(screen.getByText("Une majuscule")).toBeInTheDocument();
      expect(screen.getByText("Un chiffre")).toBeInTheDocument();
      expect(screen.getByText("Un caractère spécial")).toBeInTheDocument();
    });

    it("hides password rules on blur", async () => {
      // ARRANGE
      renderComponent();

      // ACT
      await userEvent.click(
        screen.getByPlaceholderText("Nouveau mot de passe"),
      );
      await userEvent.tab();

      // ASSERT
      expect(
        screen.queryByText("8 caractères minimum"),
      ).not.toBeInTheDocument();
    });

    it("shows passwords do not match message", async () => {
      // ARRANGE
      renderComponent();

      // ACT
      await userEvent.type(
        screen.getByPlaceholderText("Nouveau mot de passe"),
        VALID_PASSWORD,
      );
      await userEvent.type(
        screen.getByPlaceholderText("Même mot de passe"),
        "different",
      );

      // ASSERT
      expect(
        screen.getByText("✗ Les mots de passe ne correspondent pas"),
      ).toBeInTheDocument();
    });

    it("shows passwords match message", async () => {
      // ARRANGE
      renderComponent();

      // ACT
      await userEvent.type(
        screen.getByPlaceholderText("Nouveau mot de passe"),
        VALID_PASSWORD,
      );
      await userEvent.type(
        screen.getByPlaceholderText("Même mot de passe"),
        VALID_PASSWORD,
      );

      // ASSERT
      expect(
        screen.getByText("✓ Les mots de passe correspondent"),
      ).toBeInTheDocument();
    });
  });

  describe("form validation", () => {
    it("shows error if password does not meet requirements", async () => {
      // ARRANGE
      renderComponent();

      // ACT
      await userEvent.type(
        screen.getByPlaceholderText("Nouveau mot de passe"),
        "weakpassword",
      );
      await userEvent.type(
        screen.getByPlaceholderText("Même mot de passe"),
        "weakpassword",
      );
      const form = screen
        .getByPlaceholderText("Nouveau mot de passe")
        .closest("form");
      form.dispatchEvent(new Event("submit", { bubbles: true }));

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText(
            "Le mot de passe ne respecte pas les critères requis.",
          ),
        ).toBeInTheDocument();
      });
    });

    it("shows error if passwords do not match", async () => {
      // ARRANGE
      renderComponent();

      // ACT
      await userEvent.type(
        screen.getByPlaceholderText("Nouveau mot de passe"),
        VALID_PASSWORD,
      );
      await userEvent.type(
        screen.getByPlaceholderText("Même mot de passe"),
        "Different1!",
      );
      const form = screen
        .getByPlaceholderText("Nouveau mot de passe")
        .closest("form");
      form.dispatchEvent(new Event("submit", { bubbles: true }));

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("Les mots de passe ne correspondent pas."),
        ).toBeInTheDocument();
      });
    });
  });

  describe("api", () => {
    it("calls api.post with correct params on valid submit", async () => {
      // ARRANGE
      UserContext.api.post.mockResolvedValueOnce({ status: 200 });
      renderComponent();

      // ACT
      await userEvent.type(
        screen.getByPlaceholderText("Nouveau mot de passe"),
        VALID_PASSWORD,
      );
      await userEvent.type(
        screen.getByPlaceholderText("Même mot de passe"),
        VALID_PASSWORD,
      );
      const form = screen
        .getByPlaceholderText("Nouveau mot de passe")
        .closest("form");
      form.dispatchEvent(new Event("submit", { bubbles: true }));

      // ASSERT
      await waitFor(() => {
        expect(UserContext.api.post).toHaveBeenCalledWith(
          "/users/password-reset/confirm/?uidb64=abc",
          { token: "xyz", password: VALID_PASSWORD },
        );
      });
    });

    it("shows success message if api returns 200", async () => {
      // ARRANGE
      UserContext.api.post.mockResolvedValueOnce({ status: 200 });
      renderComponent();

      // ACT
      await userEvent.type(
        screen.getByPlaceholderText("Nouveau mot de passe"),
        VALID_PASSWORD,
      );
      await userEvent.type(
        screen.getByPlaceholderText("Même mot de passe"),
        VALID_PASSWORD,
      );
      const form = screen
        .getByPlaceholderText("Nouveau mot de passe")
        .closest("form");
      form.dispatchEvent(new Event("submit", { bubbles: true }));

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText(/Votre mot de passe a été réiniatiliasé/),
        ).toBeInTheDocument();
      });
    });

    it("shows error if api call fails", async () => {
      // ARRANGE
      UserContext.api.post.mockRejectedValueOnce(new Error("Server error"));
      renderComponent();

      // ACT
      await userEvent.type(
        screen.getByPlaceholderText("Nouveau mot de passe"),
        VALID_PASSWORD,
      );
      await userEvent.type(
        screen.getByPlaceholderText("Même mot de passe"),
        VALID_PASSWORD,
      );
      const form = screen
        .getByPlaceholderText("Nouveau mot de passe")
        .closest("form");
      form.dispatchEvent(new Event("submit", { bubbles: true }));

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText(
            "Une erreur est survenue, veuillez réessayer ultérieurement",
          ),
        ).toBeInTheDocument();
      });
    });
    it("shows error if URLSearchParams throws", async () => {
      // ARRANGE
      const originalURLSearchParams = global.URLSearchParams;
      global.URLSearchParams = vi.fn(() => {
        throw new Error("URLSearchParams error");
      });

      // ACT
      renderComponent();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText(
            "Une erreur est survenue, veuillez recommencer ultérieurement.",
          ),
        ).toBeInTheDocument();
      });

      // CLEANUP
      global.URLSearchParams = originalURLSearchParams;
    });
  });
});
