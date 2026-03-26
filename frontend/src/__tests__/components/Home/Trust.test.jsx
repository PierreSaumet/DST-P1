import { render } from "@testing-library/react";
import { vi } from "vitest";
import Trust from "../../../components/Home/Trust";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));
vi.mock("../../../components/LanguageContext", () => ({
  useLanguage: () => ({ t: { trust: { title: "Ils nous font confiance" } } }),
}));

describe("Trust", () => {
  it("renders without crashing", () => {
    render(<Trust />);
  });
});
