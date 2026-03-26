import { render, screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import ToggleModeLanguage from "../../../components/ToggleMode/ToggleModeLanguage";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

import * as LanguageContextModule from "../../../components/LanguageContext";

const mockToggle = vi.fn();

describe("ToggleModeLanguage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders in french with french flag icon", () => {
      // ARRANGE
      vi.spyOn(LanguageContextModule, "useLanguage").mockReturnValue({
        lang: "fr",
        toggle: mockToggle,
      });

      // ACT
      render(<ToggleModeLanguage />);
      const button = screen.getByRole("button");
      const activeFlag = screen.getByText("🇫🇷");
      const inactiveFlag = screen.queryByText("🇬🇧");

      // ASSERT
      expect(button).toHaveStyle({ background: "#003189" });
      expect(activeFlag).toBeInTheDocument();
      expect(inactiveFlag).toBeInTheDocument();
    });

    it("renders english with enflish flag icon", () => {
      // ARRANGE
      vi.spyOn(LanguageContextModule, "useLanguage").mockReturnValue({
        lang: "en",
        toggle: mockToggle,
      });
      // ACT
      render(<ToggleModeLanguage />);
      const button = screen.getByRole("button");
      const activeFlag = screen.getByText("🇬🇧");
      const inactiveFlag = screen.queryByText("🇫🇷");

      // ASSERT
      expect(button).toHaveStyle({ background: "#B22234" });
      expect(activeFlag).toBeInTheDocument();
      expect(inactiveFlag).toBeInTheDocument();
    });
  });

  describe("toggle", () => {
    it("calls toggle on button click", () => {
      // ARRANGE
      vi.spyOn(LanguageContextModule, "useLanguage").mockReturnValue({
        lang: "fr",
        toggle: mockToggle,
      });
      render(<ToggleModeLanguage />);

      // ACT
      fireEvent.click(screen.getByRole("button"));

      // ASSERT
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });
});
