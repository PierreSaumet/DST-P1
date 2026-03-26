import { render, screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import ToggleModeDark from "../../../components/ToggleMode/ToggleModeDark";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock("../../../components/ToggleMode/useTheme", () => ({
  default: vi.fn(),
}));

import useTheme from "../../../components/ToggleMode/useTheme";

const mockToggle = vi.fn();

describe("ToggleModeDark", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders in light mode with sun icon", () => {
      // ARRANGE
      useTheme.mockReturnValue({ isDark: false, toggle: mockToggle });

      // ACT
      render(<ToggleModeDark />);

      // ASSERT
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");
      expect(button).toHaveStyle({ background: "#fef9c3" });
    });

    it("renders in dark mode with moon icon", () => {
      // ARRANGE
      useTheme.mockReturnValue({ isDark: true, toggle: mockToggle });

      // ACT
      render(<ToggleModeDark />);

      // ASSERT
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(button).toHaveStyle({ background: "#1e293b" });
    });
  });

  describe("toggle", () => {
    it("calls toggle on button click", () => {
      // ARRANGE
      useTheme.mockReturnValue({ isDark: false, toggle: mockToggle });
      render(<ToggleModeDark />);

      // ACT
      fireEvent.click(screen.getByRole("button"));

      // ASSERT
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });
});
