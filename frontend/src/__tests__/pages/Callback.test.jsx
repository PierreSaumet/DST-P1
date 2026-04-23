import { render, screen, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AuthCallback from "../../pages/Callback";
import * as UserContext from "../../components/UserContext";

const mockNavigate = vi.fn();
const mocksaveAccessToken = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../components/UserContext", () => ({
  useUser: vi.fn(),
}));

vi.mock("../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: { connecting: "Connexion en cours" },
  }),
}));

const renderCallback = (search = "") => {
  delete window.location;
  window.location = { search };
  UserContext.useUser.mockReturnValue({ saveAccessToken: mocksaveAccessToken });
  return render(
    <MemoryRouter>
      <AuthCallback />
    </MemoryRouter>,
  );
};

describe("AuthCallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders connecting message", () => {
      // ARRANGE + ACT
      renderCallback();

      // ASSERT
      expect(screen.getByText("Connexion en cours...")).toBeInTheDocument();
    });
  });

  describe("useEffect", () => {
    it("saves tokens and navigates to /profile when access and refresh are present", async () => {
      // ARRANGE + ACT
      renderCallback("?access=access-token&refresh=refresh-token");

      // ASSERT
      await waitFor(() => {
        expect(mocksaveAccessToken).toHaveBeenCalledWith(
          "access-token",
          "refresh-token",
        );
        expect(mockNavigate).toHaveBeenCalledWith("/profile");
      });
    });

    it("navigates to /login with error param when error is present", async () => {
      // ARRANGE + ACT
      renderCallback("?error=access_denied");

      // ASSERT
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/login?error=access_denied");
        expect(mocksaveAccessToken).not.toHaveBeenCalled();
      });
    });

    it("does not navigate or save tokens if no params are present", async () => {
      // ARRANGE + ACT
      renderCallback("");

      // ASSERT
      await waitFor(() => {
        expect(mocksaveAccessToken).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });
});
