import { render, screen, waitFor, act } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { UserProvider, useUser } from "../../components/UserContext";

vi.mock("axios", () => {
  const mockGet = vi.fn();
  const mockPost = vi.fn();

  const mockAxiosInstance = {
    get: mockGet,
    post: mockPost,
    interceptors: {
      response: {
        use: vi.fn(),
        eject: vi.fn(),
      },
    },
  };

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
      post: mockPost,
    },
  };
});

import axios from "axios";

const getApiInstance = () => axios.create();

const TestConsumer = () => {
  const { user, token, login, logout } = useUser();
  return (
    <div>
      <span data-testid="user">{user ? JSON.stringify(user) : "null"}</span>
      <span data-testid="token">{token ?? "null"}</span>
      <button onClick={() => login("test@test.com", "password")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <UserProvider>
      <TestConsumer />
    </UserProvider>,
  );

describe("UserContext", () => {
  let mockGet;
  let mockPost;
  let mockInterceptorUse;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    const apiInstance = getApiInstance();
    mockGet = apiInstance.get;
    mockPost = axios.post;
    mockInterceptorUse = apiInstance.interceptors.response.use;

    mockGet.mockResolvedValue({ data: null });
  });

  const getInterceptorErrorHandler = () => {
    // interceptors.response.use(successFn, errorFn)
    return mockInterceptorUse.mock.calls[0][1];
  };

  describe("login", () => {
    it("returns true and exposes the user if credentials are correct", async () => {
      // ARRANGE
      const mockUser = { id: 1, email: "test@test.com" };
      mockPost.mockResolvedValueOnce({
        data: { access: "access-token", refresh: "refresh-token" },
      });
      mockGet
        .mockResolvedValueOnce({ data: mockUser })
        .mockResolvedValueOnce({ data: mockUser });

      renderWithProvider();

      // ACT
      await act(async () => {
        screen.getByText("Login").click();
      });

      // ASSERT
      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe(
          JSON.stringify(mockUser),
        );
        expect(screen.getByTestId("token").textContent).toBe("access-token");
      });
    });

    it("returns false if credentials are incorrect", async () => {
      // ARRANGE
      mockPost.mockRejectedValueOnce(new Error("Unauthorized"));
      let loginResult;

      const TestLogin = () => {
        const { login } = useUser();
        return (
          <button
            onClick={async () => {
              loginResult = await login("wrong@test.com", "wrongpassword");
            }}
          >
            Login
          </button>
        );
      };

      render(
        <UserProvider>
          <TestLogin />
        </UserProvider>,
      );

      // ACT
      await act(async () => {
        screen.getByText("Login").click();
      });

      // ASSERT
      expect(loginResult).toBe(false);
    });

    it("saves tokens in localStorage after login", async () => {
      // ARRANGE
      mockPost.mockResolvedValueOnce({
        data: { access: "access-token", refresh: "refresh-token" },
      });
      mockGet.mockResolvedValueOnce({ data: { id: 1 } });

      renderWithProvider();

      // ACT
      await act(async () => {
        screen.getByText("Login").click();
      });

      // ASSERT
      await waitFor(() => {
        expect(localStorage.getItem("access_token")).toBe("access-token");
        expect(localStorage.getItem("refresh_token")).toBe("refresh-token");
      });
    });
  });

  describe("logout", () => {
    it("resets user and token to null and clears localStorage", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "access-token");
      mockGet.mockResolvedValueOnce({ data: { id: 1 } });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).not.toBe("null");
      });

      // ACT
      await act(async () => {
        screen.getByText("Logout").click();
      });

      // ASSERT
      expect(screen.getByTestId("user").textContent).toBe("null");
      expect(screen.getByTestId("token").textContent).toBe("null");
      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();
    });
  });

  describe("fetchUser", () => {
    it("fetches and exposes the user if a token is present on mount", async () => {
      // ARRANGE
      const mockUser = { id: 1, email: "test@test.com" };
      localStorage.setItem("access_token", "access-token");
      mockGet.mockResolvedValueOnce({ data: mockUser });

      // ACT
      renderWithProvider();

      // ASSERT
      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe(
          JSON.stringify(mockUser),
        );
      });
    });

    it("leaves user as null if the API call fails", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "access-token");
      mockGet.mockRejectedValueOnce(new Error("Server error"));

      // ACT
      renderWithProvider();

      // ASSERT
      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("null");
      });
    });
  });

  describe("refreshAccessToken", () => {
    it("clears tokens if no refresh token is in localStorage", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "access-token");
      mockGet.mockResolvedValueOnce({ data: { id: 1 } });
      renderWithProvider();
      await waitFor(() =>
        expect(screen.getByTestId("token").textContent).toBe("access-token"),
      );

      const errorHandler = getInterceptorErrorHandler();

      // ACT
      await act(async () => {
        try {
          await errorHandler({
            response: { status: 401 },
            config: { _retry: false, headers: {} },
          });
        } catch (_) {}
      });

      // ASSERT
      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();
    });

    it("refreshes the token and retries the request if refresh token is valid", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "old-access-token");
      localStorage.setItem("refresh_token", "valid-refresh-token");
      mockGet.mockResolvedValueOnce({ data: { id: 1 } });
      renderWithProvider();
      await waitFor(() =>
        expect(screen.getByTestId("token").textContent).toBe(
          "old-access-token",
        ),
      );

      const errorHandler = getInterceptorErrorHandler();
      mockPost.mockResolvedValueOnce({ data: { access: "new-access-token" } });
      const originalRequest = { _retry: false, headers: {} };

      // ACT
      await act(async () => {
        try {
          await errorHandler({
            response: { status: 401 },
            config: originalRequest,
          });
        } catch (_) {}
      });

      // ASSERT
      await waitFor(() => {
        expect(localStorage.getItem("access_token")).toBe("new-access-token");
        expect(originalRequest.headers["Authorization"]).toBe(
          "Bearer new-access-token",
        );
      });
    });

    it("clears tokens if the refresh token is expired", async () => {
      // ARRANGE
      localStorage.setItem("access_token", "old-access-token");
      localStorage.setItem("refresh_token", "expired-refresh-token");
      mockGet.mockResolvedValueOnce({ data: { id: 1 } });
      renderWithProvider();
      await waitFor(() =>
        expect(screen.getByTestId("token").textContent).toBe(
          "old-access-token",
        ),
      );

      const errorHandler = getInterceptorErrorHandler();
      mockPost.mockRejectedValueOnce(new Error("Refresh token expired"));

      // ACT
      await act(async () => {
        try {
          await errorHandler({
            response: { status: 401 },
            config: { _retry: false, headers: {} },
          });
        } catch (e) {
          console.error(e);
        }
      });

      // ASSERT
      await waitFor(() => {
        expect(localStorage.getItem("access_token")).toBeNull();
        expect(localStorage.getItem("refresh_token")).toBeNull();
      });
    });

    it("does not make an API call if no token is available", async () => {
      // ARRANGE
      renderWithProvider();

      // ACT
      await act(async () => {});

      // ASSERT
      expect(mockGet).not.toHaveBeenCalled();
    });

    it("uses accessToken as priority if provided", async () => {
      // ARRANGE
      const mockUser = { id: 1, email: "test@test.com" };
      // different token in localstorage to test
      localStorage.setItem("access_token", "token-from-storage");
      mockGet
        .mockResolvedValueOnce({ data: mockUser })
        .mockResolvedValueOnce({ data: mockUser });

      renderWithProvider();
      await waitFor(() =>
        expect(screen.getByTestId("user").textContent).not.toBe("null"),
      );

      const { fetchUser } = screen.getByTestId("user").__reactFiber
        ? (() => {
            let ctx;
            const TestFetchUser = () => {
              ctx = useUser();
              return null;
            };
            render(
              <UserProvider>
                <TestFetchUser />
              </UserProvider>,
            );
            return ctx;
          })()
        : {};

      let capturedFetchUser;
      const TestCapture = () => {
        const { fetchUser } = useUser();
        capturedFetchUser = fetchUser;
        return null;
      };

      mockGet.mockResolvedValueOnce({ data: mockUser });
      render(
        <UserProvider>
          <TestCapture />
        </UserProvider>,
      );

      // ACT
      await act(async () => {
        await capturedFetchUser("explicit-access-token");
      });

      // ASSERT
      const calls = mockGet.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[1].headers.Authorization).toBe(
        "Bearer explicit-access-token",
      );
    });

    it("uses tokenRef.current if accessToken is not provided", async () => {
      // ARRANGE
      const mockUser = { id: 1, email: "test@test.com" };
      localStorage.setItem("access_token", "token-from-storage");
      mockGet.mockResolvedValueOnce({ data: mockUser });

      let capturedFetchUser;
      const TestCapture = () => {
        const { fetchUser } = useUser();
        capturedFetchUser = fetchUser;
        return null;
      };

      render(
        <UserProvider>
          <TestCapture />
        </UserProvider>,
      );

      await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
      mockGet.mockResolvedValueOnce({ data: mockUser });

      // ACT
      await act(async () => {
        await capturedFetchUser();
      });

      // ASSERT
      const calls = mockGet.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[1].headers.Authorization).toBe(
        "Bearer token-from-storage",
      );
    });

    it("does not make an API call if no token is available", async () => {
      // ARRANGE
      renderWithProvider();

      // ACT
      await act(async () => {});

      // ASSERT
      expect(mockGet).not.toHaveBeenCalled();
    });

    it("returns immediately if no token is available", async () => {
      // ARRANGE
      let capturedFetchUser;
      const TestCapture = () => {
        const { fetchUser } = useUser();
        capturedFetchUser = fetchUser;
        return null;
      };

      render(
        <UserProvider>
          <TestCapture />
        </UserProvider>,
      );

      // ACT
      await act(async () => {
        await capturedFetchUser(undefined);
      });

      // ASSERT
      expect(mockGet).not.toHaveBeenCalled();
    });
  });
});
