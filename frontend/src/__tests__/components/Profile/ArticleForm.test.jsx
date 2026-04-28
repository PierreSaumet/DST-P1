import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import * as LanguageContext from "../../../components/LanguageContext";
import ArticleForm from "../../../components/Profile/ArticleForm";

// ─── Global mocks ─────────────────────────────────────────────────────────────

vi.mock("../../../components/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockApi = { post: vi.fn() };
const mockOnArticleCreated = vi.fn();

const t = {
  profile: {
    publishArticle: "Publish an article",
    publishForm: {
      title: "Title",
      description: "Description",
      image: "Image URL",
    },
  },
};

const validArticle = {
  title: "My article",
  description: "A great description.",
  image: "https://example.com/image.jpg",
};

const createdArticle = { id: 1, ...validArticle };

// ─── Why no vi.useFakeTimers() globally? ──────────────────────────────────────
// ArticleForm has no setTimeout — all async work is a single api.post Promise.
// We resolve it with flushPromises inside act(), which lets React flush state
// updates without touching the timer queue at all.
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderForm = () =>
  render(<ArticleForm api={mockApi} onArticleCreated={mockOnArticleCreated} />);

/** Fill every field and optionally submit the form. */
const fillForm = ({ title, description, image } = validArticle) => {
  fireEvent.change(screen.getByPlaceholderText(t.profile.publishForm.title), {
    target: { value: title },
  });
  fireEvent.change(
    screen.getByPlaceholderText(t.profile.publishForm.description),
    { target: { value: description } },
  );
  fireEvent.change(screen.getByPlaceholderText(t.profile.publishForm.image), {
    target: { value: image },
  });
};

const submitForm = () =>
  fireEvent.click(
    screen.getByRole("button", { name: t.profile.publishArticle }),
  );

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  LanguageContext.useLanguage.mockReturnValue({ t });
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("ArticleForm", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("renders the form heading", () => {
      renderForm();
      expect(
        screen.getByRole("heading", { name: t.profile.publishArticle }),
      ).toBeInTheDocument();
    });

    it("renders the title input", () => {
      renderForm();
      expect(
        screen.getByPlaceholderText(t.profile.publishForm.title),
      ).toBeInTheDocument();
    });

    it("renders the description textarea", () => {
      renderForm();
      expect(
        screen.getByPlaceholderText(t.profile.publishForm.description),
      ).toBeInTheDocument();
    });

    it("renders the image URL input", () => {
      renderForm();
      expect(
        screen.getByPlaceholderText(t.profile.publishForm.image),
      ).toBeInTheDocument();
    });

    it("renders the submit button", () => {
      renderForm();
      expect(
        screen.getByRole("button", { name: t.profile.publishArticle }),
      ).toBeInTheDocument();
    });

    it("does not show success message by default", () => {
      renderForm();
      expect(
        screen.queryByText("Article créé avec succès !"),
      ).not.toBeInTheDocument();
    });

    it("does not show error message by default", () => {
      renderForm();
      expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
    });

    it("title input is required", () => {
      renderForm();
      expect(
        screen.getByPlaceholderText(t.profile.publishForm.title),
      ).toBeRequired();
    });

    it("description textarea is required", () => {
      renderForm();
      expect(
        screen.getByPlaceholderText(t.profile.publishForm.description),
      ).toBeRequired();
    });

    it("image input is not required", () => {
      renderForm();
      expect(
        screen.getByPlaceholderText(t.profile.publishForm.image),
      ).not.toBeRequired();
    });

    it("image input has type url", () => {
      renderForm();
      expect(
        screen.getByPlaceholderText(t.profile.publishForm.image),
      ).toHaveAttribute("type", "url");
    });
  });

  // ── User interactions ──────────────────────────────────────────────────────

  describe("user interactions", () => {
    it("updates title field on change", () => {
      renderForm();
      const input = screen.getByPlaceholderText(t.profile.publishForm.title);
      fireEvent.change(input, { target: { value: "Hello" } });
      expect(input).toHaveValue("Hello");
    });

    it("updates description field on change", () => {
      renderForm();
      const textarea = screen.getByPlaceholderText(
        t.profile.publishForm.description,
      );
      fireEvent.change(textarea, { target: { value: "Some content" } });
      expect(textarea).toHaveValue("Some content");
    });

    it("updates image field on change", () => {
      renderForm();
      const input = screen.getByPlaceholderText(t.profile.publishForm.image);
      fireEvent.change(input, {
        target: { value: "https://example.com/img.jpg" },
      });
      expect(input).toHaveValue("https://example.com/img.jpg");
    });
  });

  // ── Submit — success ───────────────────────────────────────────────────────

  describe("submit — success", () => {
    beforeEach(() => {
      mockApi.post.mockResolvedValue({ status: 201, data: createdArticle });
    });

    it("calls api.post with the correct endpoint and payload", async () => {
      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(mockApi.post).toHaveBeenCalledWith("articles/", {
        title: validArticle.title,
        description: validArticle.description,
        image: validArticle.image,
      });
    });

    it("shows success message after creation", async () => {
      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(
        screen.getByText("Article créé avec succès !"),
      ).toBeInTheDocument();
    });

    it("calls onArticleCreated with the returned article", async () => {
      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(mockOnArticleCreated).toHaveBeenCalledWith(createdArticle);
    });

    it("resets title field after successful submission", async () => {
      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(
        screen.getByPlaceholderText(t.profile.publishForm.title),
      ).toHaveValue("");
    });

    it("resets description field after successful submission", async () => {
      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(
        screen.getByPlaceholderText(t.profile.publishForm.description),
      ).toHaveValue("");
    });

    it("resets image field after successful submission", async () => {
      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(
        screen.getByPlaceholderText(t.profile.publishForm.image),
      ).toHaveValue("");
    });

    it("does not show an error message on success", async () => {
      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(screen.queryByText(/erreur/i)).not.toBeInTheDocument();
    });

    it("clears a previous error message on new successful submit", async () => {
      // First submission fails
      mockApi.post.mockRejectedValueOnce({
        response: { data: { detail: "Server error" } },
      });
      renderForm();
      fillForm();
      submitForm();
      await act(async () => {
        await flushPromises();
      });
      expect(screen.getByText("Server error")).toBeInTheDocument();

      // Second submission succeeds
      mockApi.post.mockResolvedValueOnce({ status: 201, data: createdArticle });
      submitForm();
      await act(async () => {
        await flushPromises();
      });

      expect(screen.queryByText("Server error")).not.toBeInTheDocument();
      expect(
        screen.getByText("Article créé avec succès !"),
      ).toBeInTheDocument();
    });

    it("does not call onArticleCreated when status is not 201", async () => {
      mockApi.post.mockResolvedValue({ status: 200, data: createdArticle });
      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(mockOnArticleCreated).not.toHaveBeenCalled();
    });
  });

  // ── Submit — error ─────────────────────────────────────────────────────────

  describe("submit — error", () => {
    it("shows title field error returned by the API", async () => {
      mockApi.post.mockRejectedValue({
        response: { data: { title: ["This field is required."] } },
      });

      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(screen.getByText("This field is required.")).toBeInTheDocument();
    });

    it("shows description field error returned by the API", async () => {
      mockApi.post.mockRejectedValue({
        response: { data: { description: ["Too short."] } },
      });

      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(screen.getByText("Too short.")).toBeInTheDocument();
    });

    it("shows detail error returned by the API", async () => {
      mockApi.post.mockRejectedValue({
        response: { data: { detail: "Authentication required." } },
      });

      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(screen.getByText("Authentication required.")).toBeInTheDocument();
    });

    it("shows a fallback error message when no specific error is provided", async () => {
      mockApi.post.mockRejectedValue({ response: { data: {} } });

      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(
        screen.getByText("Erreur lors de la création de l'article."),
      ).toBeInTheDocument();
    });

    it("shows a fallback error message when there is no response object", async () => {
      mockApi.post.mockRejectedValue(new Error("Network error"));

      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(
        screen.getByText("Erreur lors de la création de l'article."),
      ).toBeInTheDocument();
    });

    it("does not call onArticleCreated on error", async () => {
      mockApi.post.mockRejectedValue({
        response: { data: { detail: "Forbidden." } },
      });

      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(mockOnArticleCreated).not.toHaveBeenCalled();
    });

    it("does not reset fields on error", async () => {
      mockApi.post.mockRejectedValue({
        response: { data: { detail: "Forbidden." } },
      });

      renderForm();
      fillForm();
      submitForm();

      await act(async () => {
        await flushPromises();
      });

      expect(
        screen.getByPlaceholderText(t.profile.publishForm.title),
      ).toHaveValue(validArticle.title);
      expect(
        screen.getByPlaceholderText(t.profile.publishForm.description),
      ).toHaveValue(validArticle.description);
    });

    it("clears a previous success message on new failed submit", async () => {
      // First submission succeeds
      mockApi.post.mockResolvedValueOnce({ status: 201, data: createdArticle });
      renderForm();
      fillForm();
      submitForm();
      await act(async () => {
        await flushPromises();
      });
      expect(
        screen.getByText("Article créé avec succès !"),
      ).toBeInTheDocument();

      // Second submission fails
      mockApi.post.mockRejectedValueOnce({
        response: { data: { detail: "Server error" } },
      });
      fillForm();
      submitForm();
      await act(async () => {
        await flushPromises();
      });

      expect(
        screen.queryByText("Article créé avec succès !"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });
});
