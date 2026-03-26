import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Footer from "../../../components/Footer";

vi.mock("../assets/Links.png", () => ({ default: "logo.png" }));

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );

describe("Footer", () => {
  it("renders without crashing", () => {
    // ARRANGE + ACT
    renderFooter();

    // ASSERT
    expect(
      screen.getByText("@ 2026 Weeb, Inc. All rights reserved."),
    ).toBeInTheDocument();
  });
});
