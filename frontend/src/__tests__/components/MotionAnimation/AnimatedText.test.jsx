import { render } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import AnimatedText from "../../../components/MotionAnimation/AnimatedText";

vi.mock("framer-motion", () => ({
  motion: {
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
}));

describe("AnimatedText", () => {
  describe("rendering", () => {
    it("renders all characters of the text", () => {
      // ARRANGE + ACT
      const { container } = render(<AnimatedText text="Hello World" />);

      // ASSERT
      expect(container.textContent.replace(/\u00A0/g, " ")).toBe("Hello World");
    });

    it("renders a non-breaking space between words", () => {
      // ARRANGE + ACT
      const { container } = render(<AnimatedText text="Hello World" />);

      // ASSERT
      expect(container.textContent).toContain("\u00A0");
    });

    it("renders each character as a separate span", () => {
      // ARRANGE + ACT
      const { container } = render(<AnimatedText text="Hi" />);

      // ASSERT
      const charSpans = container.querySelectorAll(".inline-block");
      expect(charSpans.length).toBeGreaterThanOrEqual(2);
    });

    it("does not render non-breaking space for a single word", () => {
      // ARRANGE + ACT
      const { container } = render(<AnimatedText text="Bonjour" />);

      // ASSERT
      expect(container.textContent).not.toContain("\u00A0");
    });
  });
});
