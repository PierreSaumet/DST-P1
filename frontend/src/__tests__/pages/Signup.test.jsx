import { render, screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Signup from "../../pages/Signup";

vi.mock("../../components/Signup/Form", () => ({
  default: () => <div>FormSignUp</div>,
}));

const renderSignup = () =>
  render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>,
  );

describe("Signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders without crashing", () => {
      // ARRANGE + ACT
      renderSignup();

      // ASSERT
      expect(screen.getByText("S'inscrire")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Se connecter avec GitHub/ }),
      ).toBeInTheDocument();
    });
  });

  describe("handleGithubLogin", () => {
    it("redirects to GitHub auth URL on button click", () => {
      // ARRANGE
      delete window.location;
      window.location = { href: "" };
      renderSignup();

      // ACT
      fireEvent.click(
        screen.getByRole("button", { name: /Se connecter avec GitHub/ }),
      );

      // ASSERT
      expect(window.location.href).toContain("/auth/github/");
    });
  });
});
