import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Form from "../../../components/Login/Form";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../../components/UserContext", () => ({
  useUser: () => ({ login: mockLogin }),
}));

vi.mock("../../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      login: {
        login: "Se connecter",
        forgotPwd: "Mot de passe oublié ?",
        noAccount: "Vous n’avez pas de compte ? Vous pouvez en",
        noAccount2: "créer un.",
      },
      email: "Email",
    },
  }),
}));

const renderForm = () =>
  render(
    <MemoryRouter>
      <Form />
    </MemoryRouter>,
  );

describe("Login/Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders email input, password input and submit button", () => {
      // ARRANGE
      renderForm();

      // ASSERT
      expect(document.getElementById("email")).toBeInTheDocument();
      expect(document.getElementById("password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Se connecter" }),
      ).toBeInTheDocument();
    });
  });

  describe("handleSubmit", () => {
    it("calls login with email and password on form submit", async () => {
      // ARRANGE
      mockLogin.mockResolvedValueOnce(true);
      renderForm();

      // ACT
      fireEvent.change(document.getElementById("email"), {
        target: { value: "test@test.com" },
      });
      fireEvent.change(document.getElementById("password"), {
        target: { value: "password123" },
      });
      fireEvent.submit(
        screen.getByRole("button", { name: "Se connecter" }).closest("form"),
      );

      // ASSERT
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("test@test.com", "password123");
      });
    });

    it("navigates to /profile on successful login", async () => {
      // ARRANGE
      mockLogin.mockResolvedValueOnce(true);
      renderForm();

      // ACT
      fireEvent.change(document.getElementById("email"), {
        target: { value: "test@test.com" },
      });
      fireEvent.change(document.getElementById("password"), {
        target: { value: "password123" },
      });
      fireEvent.submit(
        screen.getByRole("button", { name: "Se connecter" }).closest("form"),
      );

      // ASSERT
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/profile");
      });
    });

    it("shows alert and does not navigate on failed login", async () => {
      // ARRANGE
      mockLogin.mockResolvedValueOnce(false);
      const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
      renderForm();

      // ACT
      fireEvent.change(document.getElementById("email"), {
        target: { value: "wrong@test.com" },
      });
      fireEvent.change(document.getElementById("password"), {
        target: { value: "wrongpassword" },
      });
      fireEvent.submit(
        screen.getByRole("button", { name: "Se connecter" }).closest("form"),
      );

      // ASSERT
      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          "Email ou mot de passe incorrect.",
        );
        expect(mockNavigate).not.toHaveBeenCalled();
      });

      alertMock.mockRestore();
    });
  });

  describe("controlled inputs", () => {
    it("updates email value on change", () => {
      // ARRANGE
      renderForm();
      const emailInput = document.getElementById("email");

      // ACT
      fireEvent.change(emailInput, { target: { value: "new@test.com" } });

      // ASSERT
      expect(emailInput.value).toBe("new@test.com");
    });

    it("updates password value on change", () => {
      // ARRANGE
      renderForm();
      const passwordInput = document.getElementById("password");

      // ACT
      fireEvent.change(passwordInput, { target: { value: "newpassword" } });

      // ASSERT
      expect(passwordInput.value).toBe("newpassword");
    });
  });
});
