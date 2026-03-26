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
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: password },
  });
  fireEvent.change(screen.getByPlaceholderText("Prénom"), {
    target: { value: firstName },
  });
  fireEvent.change(screen.getByPlaceholderText("Nom"), {
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
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Prénom")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Nom")).toBeInTheDocument();
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
      expect(screen.getByPlaceholderText("Email").value).toBe("test@test.com");
      expect(screen.getByPlaceholderText("Password").value).toBe("password123");
      expect(screen.getByPlaceholderText("Prénom").value).toBe("John");
      expect(screen.getByPlaceholderText("Nom").value).toBe("Doe");
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
