import { render, screen, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AuthCallback from "../../pages/Callback";
import * as UserContext from "../../components/UserContext";

// const mockNavigate = vi.fn();
// const mocksaveAccessToken = vi.fn();

// vi.mock("react-router-dom", async (importOriginal) => {
//   const actual = await importOriginal();
//   return {
//     ...actual,
//     useNavigate: () => mockNavigate,
//   };
// });

// vi.mock("../../components/UserContext", () => ({
//   useUser: vi.fn(),
// }));

// vi.mock("../../components/LanguageContext", () => ({
//   useLanguage: () => ({
//     t: { connecting: "Connexion en cours" },
//   }),
// }));

// const renderCallback = (search = "") => {
//   delete window.location;
//   window.location = { search };
//   UserContext.useUser.mockReturnValue({ saveAccessToken: mocksaveAccessToken });
//   return render(
//     <MemoryRouter>
//       <AuthCallback />
//     </MemoryRouter>,
//   );
// };

// describe("AuthCallback", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   describe("rendering", () => {
//     it("renders connecting message", () => {
//       // ARRANGE + ACT
//       renderCallback();

//       // ASSERT
//       expect(screen.getByText("Connexion en cours...")).toBeInTheDocument();
//     });
//   });

//   describe("useEffect", () => {
//     it("saves tokens and navigates to /profile when access and refresh are present", async () => {
//       // ARRANGE + ACT
//       renderCallback("?access=access-token&refresh=refresh-token");

//       // ASSERT
//       await waitFor(() => {
//         expect(mocksaveAccessToken).toHaveBeenCalledWith(
//           "access-token",
//           "refresh-token",
//         );
//         expect(mockNavigate).toHaveBeenCalledWith("/profile");
//       });
//     });

//     it("navigates to /login with error param when error is present", async () => {
//       // ARRANGE + ACT
//       renderCallback("?error=access_denied");

//       // ASSERT
//       await waitFor(() => {
//         expect(mockNavigate).toHaveBeenCalledWith("/login?error=access_denied");
//         expect(mocksaveAccessToken).not.toHaveBeenCalled();
//       });
//     });

//     // it("does not navigate or save tokens if no params are present", async () => {
//     //   // ARRANGE + ACT
//     //   renderCallback("");

//     //   // ASSERT
//     //   await waitFor(() => {
//     //     expect(mocksaveAccessToken).not.toHaveBeenCalled();
//     //     expect(mockNavigate).toHaveBeenCalledWith("/login?error=token_failed");
//     //   });
//     // });
//   });
// });

const mockNavigate = vi.fn();
const mockSaveAccessToken = vi.fn();
const mockFetchUser = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../components/UserContext", () => ({
  useUser: vi.fn(),
  api: {
    post: vi.fn(),
  },
}));

vi.mock("../../components/LanguageContext", () => ({
  useLanguage: () => ({
    t: { connecting: "Connexion en cours" },
  }),
}));

const renderCallback = (search = "") => {
  UserContext.useUser.mockReturnValue({
    saveAccessToken: mockSaveAccessToken,
    fetchUser: mockFetchUser,
  });
  return render(
    <MemoryRouter initialEntries={[`/auth/callback${search}`]}>
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
      // ARRANGE
      UserContext.api.post.mockResolvedValue({ data: {} });

      // ACT
      renderCallback();

      // ASSERT
      expect(screen.getByText("Connexion en cours...")).toBeInTheDocument();
    });
  });

  describe("useEffect", () => {
    // it("exchanges code, saves token and navigates to /profile on success", async () => {
    //   // ARRANGE
    //   UserContext.api.post.mockResolvedValue({
    //     data: { access: "access-token" },
    //   });

    //   // ACT
    //   renderCallback("?code=my-oauth-code");

    //   // ASSERT
    //   await waitFor(() => {
    //     expect(UserContext.api.post).toHaveBeenCalledWith("/auth/exchange/", {
    //       code: "my-oauth-code",
    //     });
    //     expect(mockSaveAccessToken).toHaveBeenCalledWith("access-token");
    //     expect(mockFetchUser).toHaveBeenCalledWith("access-token");
    //     expect(mockNavigate).toHaveBeenCalledWith("/profile");
    //   });
    // });

    it("navigates to /login?error=token_failed when no code is present", async () => {
      // ACT
      renderCallback("");

      // ASSERT
      await waitFor(() => {
        expect(UserContext.api.post).not.toHaveBeenCalled();
        expect(mockSaveAccessToken).not.toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/login?error=token_failed");
      });
    });

    it("exchanges code, saves token and navigates to /profile on success", async () => {
      // ARRANGE
      delete window.location;
      window.location = { search: "?code=my-oauth-code" };
      UserContext.api.post.mockResolvedValueOnce({
        data: { access: "access-token" },
      });

      // ACT
      renderCallback("?code=my-oauth-code");

      // ASSERT
      await waitFor(() => {
        expect(UserContext.api.post).toHaveBeenCalledWith("/auth/exchange/", {
          code: "my-oauth-code",
        });
        expect(mockSaveAccessToken).toHaveBeenCalledWith("access-token");
        expect(mockFetchUser).toHaveBeenCalledWith("access-token");
        expect(mockNavigate).toHaveBeenCalledWith("/profile");
      });
    });

    it("navigates to /login?error=callback_failed when api call fails", async () => {
      // ARRANGE
      delete window.location;
      window.location = { search: "?code=my-oauth-code" };
      UserContext.api.post.mockRejectedValueOnce(new Error("Server error"));

      // ACT
      renderCallback("?code=my-oauth-code");

      // ASSERT
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/login?error=callback_failed",
        );
        expect(mockSaveAccessToken).not.toHaveBeenCalled();
      });
    });
  });
});
