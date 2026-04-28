import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import FormSignUp from "../../../components/Signup/Form";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      signup: {
        signup: "S'inscrire",
        forgotPwd: "Mot de passe oublié ?",
        github: "Se connecter avec GitHub",
      },
    },
  }),
}));

vi.mock("../../../components/UserContext", () => ({
  useUser: () => ({ login: mockLogin }),
}));

vi.mock("axios");

const renderForm = () =>
  render(
    <MemoryRouter>
      <FormSignUp />
    </MemoryRouter>,
  );

const fillForm = ({
  email = "test@test.com",
  password = "password123",
  firstName = "John",
  lastName = "Doe",
} = {}) => {
  fireEvent.change(document.getElementById("email"), {
    target: { value: email },
  });
  fireEvent.change(document.getElementById("password"), {
    target: { value: password },
  });
  fireEvent.change(document.getElementById("first_name"), {
    target: { value: firstName },
  });
  fireEvent.change(document.getElementById("last_name"), {
    target: { value: lastName },
  });
};

const submitForm = () =>
  fireEvent.submit(
    screen.getByRole("button", { name: "S'inscrire" }).closest("form"),
  );

describe("Signup/Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders all inputs and submit button", () => {
      // ARRANGE
      renderForm();

      // ASSERT
      expect(document.getElementById("email")).toBeInTheDocument();
      expect(document.getElementById("password")).toBeInTheDocument();
      expect(document.getElementById("first_name")).toBeInTheDocument();
      expect(document.getElementById("last_name")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "S'inscrire" }),
      ).toBeInTheDocument();
    });
  });

  describe("controlled inputs", () => {
    it("updates all field values on change", () => {
      // ARRANGE
      renderForm();

      // ACT
      fillForm();

      // ASSERT
      expect(document.getElementById("email").value).toBe("test@test.com");
      expect(document.getElementById("password").value).toBe("password123");
      expect(document.getElementById("first_name").value).toBe("John");
      expect(document.getElementById("last_name").value).toBe("Doe");
    });
  });

  describe("handleSubmit", () => {
    it("shows loading state while submitting", async () => {
      // ARRANGE
      axios.post.mockReturnValueOnce(new Promise(() => {})); // never resolves
      renderForm();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      expect(screen.getByText("Waiting ...")).toBeInTheDocument();
    });

    it("calls axios.post with correct payload on submit", async () => {
      // ARRANGE
      axios.post.mockResolvedValueOnce({ status: 201 });
      mockLogin.mockResolvedValueOnce(true);
      renderForm();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining("/users/"),
          {
            email: "test@test.com",
            password: "password123",
            first_name: "John",
            last_name: "Doe",
          },
          { headers: { "Content-Type": "application/json" } },
        );
      });
    });

    it("navigates to /profile on successful signup and login", async () => {
      // ARRANGE
      axios.post.mockResolvedValueOnce({ status: 201 });
      mockLogin.mockResolvedValueOnce(true);
      renderForm();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/profile");
      });
    });

    it("shows alert if signup succeeds but login fails", async () => {
      // ARRANGE
      axios.post.mockResolvedValueOnce({ status: 201 });
      mockLogin.mockResolvedValueOnce(false);
      const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
      renderForm();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          "Une erreur est survenue, veuillez recommencer.",
        );
        expect(mockNavigate).not.toHaveBeenCalled();
      });

      alertMock.mockRestore();
    });

    it("displays field errors returned by the API", async () => {
      // ARRANGE
      axios.post.mockRejectedValueOnce({
        response: {
          data: {
            email: ["This email is already taken."],
            password: ["Password is too short."],
          },
        },
      });
      renderForm();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText(/This email is already taken./),
        ).toBeInTheDocument();
        expect(screen.getByText(/Password is too short./)).toBeInTheDocument();
      });
    });

    it("displays generic error if API returns no error detail", async () => {
      // ARRANGE
      axios.post.mockRejectedValueOnce(new Error("Network error"));
      renderForm();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText(/Une erreur est survenue, veuillez recommencer./),
        ).toBeInTheDocument();
      });
    });
  });
});
