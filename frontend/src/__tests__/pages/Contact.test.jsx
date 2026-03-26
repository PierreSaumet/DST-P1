import { render } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Contact from "../../pages/Contact";

vi.mock("../../components/Contact/Form", () => ({
  default: () => <div>ContactForm</div>,
}));
vi.mock("../../components/MotionAnimation/AnimatedText", () => ({
  default: ({ text }) => <span>{text}</span>,
}));
vi.mock("../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      contact: {
        opinion: "Votre avis compte !",
        description: "Votre retour est essentiel.",
      },
    },
  }),
}));

describe("Contact", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    );
  });
});
