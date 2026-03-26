import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import {
  LanguageProvider,
  useLanguage,
} from "../../components/LanguageContext";

const TestConsumer = () => {
  const { lang, toggle, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="translation">{t.back}</span>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <LanguageProvider>
      <TestConsumer />
    </LanguageProvider>,
  );

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("defaults to French when no lang in localStorage", () => {
      // ARRANGE + ACT
      renderWithProvider();

      // ASSERT
      expect(screen.getByTestId("lang").textContent).toBe("fr");
      expect(screen.getByTestId("translation").textContent).toBe("Retour");
    });

    it("restores lang from localStorage on mount", () => {
      // ARRANGE
      localStorage.setItem("lang", "en");

      // ACT
      renderWithProvider();

      // ASSERT
      expect(screen.getByTestId("lang").textContent).toBe("en");
    });
  });

  describe("toggle", () => {
    it("switches from French to English on first toggle", () => {
      // ARRANGE
      renderWithProvider();

      // ACT
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
      });

      // ASSERT
      expect(screen.getByTestId("lang").textContent).toBe("en");
      expect(localStorage.getItem("lang")).toBe("en");
    });

    it("switches back from English to French on second toggle", () => {
      // ARRANGE
      renderWithProvider();

      // ACT
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
      });
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
      });

      // ASSERT
      expect(screen.getByTestId("lang").textContent).toBe("fr");
      expect(localStorage.getItem("lang")).toBe("fr");
    });

    it("updates translation after toggle", () => {
      // ARRANGE
      renderWithProvider();
      expect(screen.getByTestId("translation").textContent).toBe("Retour");

      // ACT
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
      });

      // ASSERT — t.back in English
      expect(screen.getByTestId("translation").textContent).not.toBe("Retour");
    });
  });
});
