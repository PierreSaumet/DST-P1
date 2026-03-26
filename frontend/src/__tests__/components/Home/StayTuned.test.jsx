import { render } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import StayTuned from "../../../components/Home/StayTuned";

vi.mock("../../../components/MotionAnimation/AnimatedText", () => ({
  default: ({ text }) => <span>{text}</span>,
}));
vi.mock("../../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      stayTuned: {
        p: "Le web, un écosystème en constante évolution",
        title: "Restez informé des dernières",
        trends: "tendances",
        description: "Description",
        link: "Lire les articles récents",
      },
    },
  }),
}));

describe("StayTuned", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <StayTuned />
      </MemoryRouter>,
    );
  });
});
