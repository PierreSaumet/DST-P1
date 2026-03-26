import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import axios from "axios";
import ContactForm from "../../../components/Contact/Form";
import * as UserContext from "../../../components/UserContext";
import * as LanguageContext from "../../../components/LanguageContext";

vi.mock("axios");

vi.mock("../../../components/UserContext", () => ({
  useUser: vi.fn(),
}));

vi.mock("../../../components/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

const mockT = {
  name: "Nom",
  firstName: "Prénom",
  phone: "Téléphone",
  email: "Email",
  message: "Message",
  contactBtn: "Contact",
  contact: {
    form: {
      messageSend: "Votre message a été envoyé correctement:",
      satisfactionPositive:
        "😊 Nous sommes ravis de savoir que ça vous plaît !",
      satisfactionNegative:
        "😞 Nous sommes tristes de savoir que ça ne vous plaît pas.",
    },
  },
};

const mockUser = {
  first_name: "John",
  last_name: "Doe",
  email: "john@test.com",
};

const renderForm = (user = null) => {
  UserContext.useUser.mockReturnValue({ user });
  LanguageContext.useLanguage.mockReturnValue({ t: mockT });
  return render(<ContactForm />);
};

const fillForm = () => {
  fireEvent.change(screen.getByPlaceholderText("Nom"), {
    target: { value: "Doe" },
  });
  fireEvent.change(screen.getByPlaceholderText("Prénom"), {
    target: { value: "John" },
  });
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "john@test.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Message"), {
    target: { value: "Hello!" },
  });
};

const submitForm = () =>
  fireEvent.submit(
    screen.getByRole("button", { name: "Contact" }).closest("form"),
  );

describe("Contact/Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("rendering", () => {
    it("logs error to console on API error", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "valid-token");
      const apiError = { response: { data: { detail: "Server error" } } };
      axios.post.mockRejectedValueOnce(apiError);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.spyOn(window, "alert").mockImplementation(() => {});
      renderForm();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Erreur d'inscription:",
          apiError.response.data,
        );
      });

      consoleSpy.mockRestore();
    });

    it("pre-fills fields with empty strings when user fields are undefined", () => {
      // ARRANGE
      const userWithEmptyFields = {
        first_name: undefined,
        last_name: undefined,
        email: undefined,
      };
      renderForm(userWithEmptyFields);

      // ASSERT
      expect(screen.getByPlaceholderText("Nom").value).toBe("");
      expect(screen.getByPlaceholderText("Prénom").value).toBe("");
      expect(screen.getByPlaceholderText("Email").value).toBe("");
    });

    it("renders all inputs and submit button", () => {
      // ARRANGE
      renderForm();

      // ASSERT
      expect(screen.getByPlaceholderText("Nom")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Prénom")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Téléphone")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Message")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Contact" }),
      ).toBeInTheDocument();
    });

    it("pre-fills fields with user data when user is logged in", () => {
      // ARRANGE
      renderForm(mockUser);

      // ASSERT
      expect(screen.getByPlaceholderText("Nom").value).toBe("Doe");
      expect(screen.getByPlaceholderText("Prénom").value).toBe("John");
      expect(screen.getByPlaceholderText("Email").value).toBe("john@test.com");
    });

    it("leaves fields empty when no user is logged in", () => {
      // ARRANGE
      renderForm(null);

      // ASSERT
      expect(screen.getByPlaceholderText("Nom").value).toBe("");
      expect(screen.getByPlaceholderText("Prénom").value).toBe("");
      expect(screen.getByPlaceholderText("Email").value).toBe("");
    });
  });

  describe("handleSubmit", () => {
    it("shows error message if no token in localStorage", async () => {
      // ARRANGE
      renderForm();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("Vous devez vous identifiez"),
        ).toBeInTheDocument();
      });
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("calls axios.post with correct payload when token exists", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "valid-token");
      axios.post.mockResolvedValueOnce({
        status: 201,
        data: { polarity: true },
      });
      renderForm();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining("/satisfactions/"),
          {
            email: "john@test.com",
            first_name: "John",
            last_name: "Doe",
            description: "Hello!",
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

    it("shows positive satisfaction message on success with polarity true", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "valid-token");
      axios.post.mockResolvedValueOnce({
        status: 201,
        data: { polarity: true },
      });
      renderForm();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("Votre message a été envoyé correctement:"),
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            "😊 Nous sommes ravis de savoir que ça vous plaît !",
          ),
        ).toBeInTheDocument();
      });
    });

    it("shows negative satisfaction message on success with polarity false", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "valid-token");
      axios.post.mockResolvedValueOnce({
        status: 201,
        data: { polarity: false },
      });
      renderForm();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(
          screen.getByText("Votre message a été envoyé correctement:"),
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            "😞 Nous sommes tristes de savoir que ça ne vous plaît pas.",
          ),
        ).toBeInTheDocument();
      });
    });

    it("shows alert on API error", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "valid-token");
      axios.post.mockRejectedValueOnce(new Error("Server error"));
      const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
      renderForm();
      fillForm();

      // ACT
      submitForm();

      // ASSERT
      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          "Inscription ne fonctionne pas.",
        );
      });

      alertMock.mockRestore();
    });
  });

  describe("controlled inputs", () => {
    it("updates all field values on change", () => {
      // ARRANGE
      renderForm();

      // ACT
      fillForm();

      // ASSERT
      expect(screen.getByPlaceholderText("Nom").value).toBe("Doe");
      expect(screen.getByPlaceholderText("Prénom").value).toBe("John");
      expect(screen.getByPlaceholderText("Email").value).toBe("john@test.com");
      expect(screen.getByPlaceholderText("Message").value).toBe("Hello!");
    });
  });
});
