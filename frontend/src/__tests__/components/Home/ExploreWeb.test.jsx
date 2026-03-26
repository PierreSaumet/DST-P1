import { render } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ExploreWeb from "../../../components/Home/ExploreWeb";

vi.mock("../../../components/MotionAnimation/AnimatedText", () => ({
  default: ({ text }) => <span>{text}</span>,
}));
vi.mock("../../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      exploreWeb: {
        h1: "Explorez le",
        web: "Web",
        inAll: "sous toutes",
        its: "ses",
        facets: "facettes",
        description: "Description",
        discoveryArticle: "Découvrir les articles",
        subscribeNewsletter: "S'abonner à la newsletter",
      },
    },
  }),
}));

describe("ExploreWeb", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <ExploreWeb />
      </MemoryRouter>,
    );
  });
});
