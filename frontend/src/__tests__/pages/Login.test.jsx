import { render } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../../pages/Login";

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
});
