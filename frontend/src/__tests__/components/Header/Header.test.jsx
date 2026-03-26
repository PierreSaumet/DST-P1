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

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders logo and navigation links", () => {
      // ARRANGE + ACT
      renderHeader();

      // ASSERT
      expect(screen.getByText("WEEB")).toBeInTheDocument();
      expect(screen.getAllByRole("link", { name: "Contact" })).toHaveLength(1);
      expect(screen.getAllByRole("link", { name: "Articles" })).toHaveLength(1);
      expect(
        screen.getAllByRole("link", { name: "Se connecter" }),
      ).toHaveLength(1);
      expect(screen.getAllByRole("link", { name: "S'inscrire" })).toHaveLength(
        1,
      );
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
  });

  describe("mobile menu", () => {
    it("opens mobile menu on burger button click", () => {
      // ARRANGE
      renderHeader();

      // ACT
      fireEvent.click(screen.getByRole("button"));

      // ASSERT
      // mobile menu adds a second set of links
      expect(screen.getAllByRole("link", { name: "Contact" })).toHaveLength(2);
      expect(screen.getAllByRole("link", { name: "Profile" })).toHaveLength(2);
      expect(screen.getAllByRole("link", { name: "Articles" })).toHaveLength(2);
      expect(
        screen.getAllByRole("link", { name: "Se connecter" }),
      ).toHaveLength(2);
      expect(screen.getAllByRole("link", { name: "S'inscrire" })).toHaveLength(
        2,
      );
    });

    it("closes mobile menu on burger button click again", () => {
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
});
