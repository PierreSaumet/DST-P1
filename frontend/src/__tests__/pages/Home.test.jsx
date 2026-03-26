import { render } from "@testing-library/react";
import { vi } from "vitest";
import Home from "../../pages/Home";

vi.mock("../../components/Home/ExploreWeb", () => ({
  default: () => <div>ExploreWeb</div>,
}));
vi.mock("../../components/Home/Trust", () => ({
  default: () => <div>Trust</div>,
}));
vi.mock("../../components/Home/Learn", () => ({
  default: () => <div>Learn</div>,
}));
vi.mock("../../components/Home/StayTuned", () => ({
  default: () => <div>StayTuned</div>,
}));

describe("Home", () => {
  it("renders without crashing", () => {
    render(<Home />);
  });
});
