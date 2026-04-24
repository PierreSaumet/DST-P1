import { render, screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Header from "../../../components/Header";

vi.mock("../../../components/ToggleMode/ToggleModeDark", () => ({
  default: () => <div>ToggleModeDark</div>,
}));
vi.mock("../../../components/ToggleMode/ToggleModeLanguage", () => ({
  default: () => <div>ToggleModeLanguage</div>,
}));

const mockLogout = vi.fn();

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

vi.mock("../../../components/UserContext", () => ({
  useUser: vi.fn(),
}));

vi.mock("../../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      header: {
        login: "Se connecter",
        signup: "S'inscrire",
      },
    },
  }),
}));

import * as UserContext from "../../../components/UserContext";

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    UserContext.useUser.mockReturnValue({
      user: { first_name: "John", last_name: "Doe", email: "john@test.com" },
      logout: mockLogout,
    });
  });

  describe("rendering", () => {
    it("renders logo and navigation links", () => {
      // ARRANGE + ACT
      renderHeader();

      // ASSERT
      expect(screen.getByText("WEEB")).toBeInTheDocument();
      expect(screen.getAllByRole("link", { name: "Contact" })).toHaveLength(1);
      expect(screen.getAllByRole("link", { name: "Articles" })).toHaveLength(1);
    });

    it("renders menu toggle button", () => {
      // ARRANGE + ACT
      renderHeader();

      // ASSERT
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("does not show mobile menu by default", () => {
      // ARRANGE + ACT
      renderHeader();

      // ASSERT
      // mobile menu links are duplicates — only desktop ones visible
      expect(screen.getAllByRole("link", { name: "Contact" })).toHaveLength(1);
    });
    it("shows login and signup when user is not logged in", () => {
      UserContext.useUser.mockReturnValue({
        user: null,
        logout: mockLogout,
      });

      renderHeader();

      expect(screen.getByText("Se connecter")).toBeInTheDocument();
      expect(screen.getByText("S'inscrire")).toBeInTheDocument();
    });
  });

  describe("mobile menu", () => {
    it("opens mobile menu on button click", () => {
      // ARRANGE
      renderHeader();

      // ACT
      fireEvent.click(screen.getByRole("button"));

      // ASSERT
      expect(screen.getByText("Se connecter")).toBeInTheDocument();
    });

    it("closes mobile menu on button click again", () => {
      // ARRANGE
      renderHeader();
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getAllByRole("link", { name: "Contact" })).toHaveLength(2);

      // ACT
      fireEvent.click(screen.getByRole("button"));

      // ASSERT
      expect(screen.getAllByRole("link", { name: "Contact" })).toHaveLength(1);
    });

    it("closes mobile menu when a link is clicked", () => {
      // ARRANGE
      renderHeader();
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getAllByRole("link", { name: "Contact" })).toHaveLength(2);

      // ACT
      const mobileLinks = screen.getAllByRole("link", { name: "Contact" });
      fireEvent.click(mobileLinks[1]);

      // ASSERT
      expect(screen.getAllByRole("link", { name: "Contact" })).toHaveLength(1);
    });

    it("closes mobile menu when overlay is clicked", () => {
      // ARRANGE
      renderHeader();
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getAllByRole("link", { name: "Contact" })).toHaveLength(2);

      // ACT
      // overlay is the fixed div with onClick={() => setMenuOpen(false)}
      const overlay = document.querySelector(".bg-opacity-50");
      fireEvent.click(overlay);

      // ASSERT
      expect(screen.getAllByRole("link", { name: "Contact" })).toHaveLength(1);
    });
  });

  describe("logout", () => {
    it("calls logout on button click", async () => {
      // ARRANGE
      renderHeader();

      // ACT
      fireEvent.click(screen.getByRole("logout"));

      // ASSERT
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
