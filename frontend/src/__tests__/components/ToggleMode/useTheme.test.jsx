import { renderHook, act } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import useTheme, {
  getInitialTheme,
} from "../../../components/ToggleMode/useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("defaults to light mode when no theme in localStorage and no system preference", () => {
      // ARRANGE
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });

      // ACT
      const { result } = renderHook(() => useTheme());

      // ASSERT
      expect(result.current.isDark).toBe(false);
    });

    it("defaults to dark mode when system preference is dark", () => {
      // ARRANGE
      window.matchMedia = vi.fn().mockReturnValue({ matches: true });

      // ACT
      const { result } = renderHook(() => useTheme());

      // ASSERT
      expect(result.current.isDark).toBe(true);
    });

    it("restores dark theme from localStorage", () => {
      // ARRANGE
      localStorage.setItem("theme", "dark");

      // ACT
      const { result } = renderHook(() => useTheme());

      // ASSERT
      expect(result.current.isDark).toBe(true);
    });

    it("restores light theme from localStorage", () => {
      // ARRANGE
      localStorage.setItem("theme", "light");
      window.matchMedia = vi.fn().mockReturnValue({ matches: true });

      // ACT
      const { result } = renderHook(() => useTheme());

      // ASSERT
      expect(result.current.isDark).toBe(false);
    });
  });

  describe("useEffect", () => {
    it("adds dark class to document root when isDark is true", () => {
      // ARRANGE
      localStorage.setItem("theme", "dark");

      // ACT
      renderHook(() => useTheme());

      // ASSERT
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("removes dark class from document root when isDark is false", () => {
      // ARRANGE
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "light");
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });

      // ACT
      renderHook(() => useTheme());

      // ASSERT
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      expect(localStorage.getItem("theme")).toBe("light");
    });
  });

  describe("toggle", () => {
    it("switches from light to dark on toggle", () => {
      // ARRANGE
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });
      const { result } = renderHook(() => useTheme());
      expect(result.current.isDark).toBe(false);

      // ACT
      act(() => result.current.toggle());

      // ASSERT
      expect(result.current.isDark).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("switches back from dark to light on second toggle", () => {
      // ARRANGE
      localStorage.setItem("theme", "dark");
      const { result } = renderHook(() => useTheme());
      expect(result.current.isDark).toBe(true);

      // ACT
      act(() => result.current.toggle());

      // ASSERT
      expect(result.current.isDark).toBe(false);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      expect(localStorage.getItem("theme")).toBe("light");
    });

    describe("SSR compatibility", () => {
      it("returns false if window is undefined (SSR)", () => {
        // ARRANGE
        const originalWindow = global.window;
        global.window = undefined;

        // ACT
        const initialTheme = getInitialTheme();

        // ASSERT
        expect(initialTheme).toBe(false);

        // Cleanup
        global.window = originalWindow;
      });
    });
  });
});
