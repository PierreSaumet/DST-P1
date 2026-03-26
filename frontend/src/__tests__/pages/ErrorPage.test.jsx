import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ErrorPage from "../../pages/ErrorPage";

vi.mock("../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      errorPage: {
        title: "404 - Page non trouvée",
        description: "Désolé, cette page n'existe pas!",
      },
      back: "Retour",
    },
  }),
}));

const renderErrorPage = () =>
  render(
    <MemoryRouter>
      <ErrorPage />
    </MemoryRouter>,
  );

describe("ErrorPage", () => {
  it("displays the error description", () => {
    // ARRANGE
    renderErrorPage();

    // ASSERT
    expect(
      screen.getAllByText("Désolé, cette page n'existe pas!"),
    ).toHaveLength(2);
  });

  it("displays a link back to the home page", () => {
    // ARRANGE
    renderErrorPage();

    // ASSERT
    const link = screen.getByRole("link", { name: "Retour" });
    expect(link).toHaveAttribute("href", "/");
  });
});
