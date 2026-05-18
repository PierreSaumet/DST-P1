import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../../pages/Login";
import userEvent from "@testing-library/user-event";

vi.mock("../../components/Login/Form", () => ({
  default: () => <div>Form</div>,
}));

vi.mock("../../components/LanguageContext", () => ({
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

describe("Login", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
  });

  it("redirects to github url on button click", async () => {
    // ARRANGE
    delete window.location;
    window.location = { href: "" };

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    // ACT
    await userEvent.click(screen.getByRole("button"));

    // ASSERT
    expect(window.location.href).toBe(import.meta.env.VITE_GITHUB_CALL);
  });
});
