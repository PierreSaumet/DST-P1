import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ResetPassword from "../../pages/ResetPassword";
import * as UserContext from "../../components/UserContext";

vi.mock("../../components/UserContext", () => ({
  useUser: vi.fn(),
  api: {
    post: vi.fn(),
  },
}));

vi.mock("../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      email: "Email",
      login: { login: "Envoyer" },
    },
  }),
}));

const renderResetPassword = () =>
  render(
    <MemoryRouter>
      <ResetPassword />
    </MemoryRouter>,
  );

describe("ResetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the title and form", () => {
      // ARRANGE + ACT
      renderResetPassword();

      // ASSERT
      expect(screen.getByText("Mot de passe oublié?")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    });
  });

  describe("FormReset", () => {
    it("shows error if email is empty on submit", async () => {
      // ARRANGE
      renderResetPassword();

      // ACT
      const form = screen.getByPlaceholderText("Email").closest("form");
      form.dispatchEvent(new Event("submit", { bubbles: true }));

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText("L'email est requis.")).toBeInTheDocument();
      });
    });

    it("shows error if email is invalid", async () => {
      // ARRANGE
      renderResetPassword();

      // ACT
      await userEvent.type(screen.getByPlaceholderText("Email"), "invalid@");
      const form = screen.getByPlaceholderText("Email").closest("form");
      form.dispatchEvent(new Event("submit", { bubbles: true }));

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("L'adresse email n'est pas valide."),
        ).toBeInTheDocument();
      });
    });

    it("shows success message if api returns 200", async () => {
      // ARRANGE
      UserContext.api.post.mockResolvedValueOnce({ status: 200 });
      renderResetPassword();

      // ACT
      await userEvent.type(
        screen.getByPlaceholderText("Email"),
        "test@test.com",
      );
      await userEvent.click(screen.getByText("Envoyer"));

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText(
            "Si votre email existe, regardez votre boite email.",
          ),
        ).toBeInTheDocument();
      });
    });

    it("shows error message if api call fails", async () => {
      // ARRANGE
      UserContext.api.post.mockRejectedValueOnce(new Error("Server error"));
      renderResetPassword();

      // ACT
      await userEvent.type(
        screen.getByPlaceholderText("Email"),
        "test@test.com",
      );
      await userEvent.click(screen.getByText("Envoyer"));

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText(
            "Une erreur est survenue, veuillez réessayer ultérieurement",
          ),
        ).toBeInTheDocument();
      });
    });
  });
});
