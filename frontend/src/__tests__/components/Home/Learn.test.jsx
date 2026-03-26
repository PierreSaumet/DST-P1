import { render } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Learn from "../../../components/Home/Learn";

vi.mock("../../../components/MotionAnimation/AnimatedText", () => ({
  default: ({ text }) => <span>{text}</span>,
}));
vi.mock("../../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      learn: {
        p: "Des ressources pour tous les niveaux",
        h2: "Apprenez",
        and: "et",
        progress: "progressez",
        description: "Description",
        explore: "Explorer les ressources",
      },
    },
  }),
}));

describe("Learn", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Learn />
      </MemoryRouter>,
    );
  });
});
