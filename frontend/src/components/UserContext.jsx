import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const UserContext = createContext();

// Axios instance with interceptor for refresh
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [loading, setLoading] = useState(false);

  // Save tokens
  const saveTokens = (accessToken, refreshToken) => {
    setToken(accessToken);
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
  };

  // Clear all
  const clearTokens = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  // Use refresh token to get new access token
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      clearTokens();
      return null;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
        { refresh: refreshToken },
      );
      const newAccessToken = response.data.access;
      saveTokens(newAccessToken, refreshToken);
      return newAccessToken;
    } catch (error) {
      console.error("Refresh token expired.", error);
      clearTokens();
      return null;
    }
  }, []);

  // Retrieve user from the backend
  const fetchUser = useCallback(
    async (accessToken) => {
      const tokenToUse = accessToken || token;
      if (!tokenToUse) return;

      setLoading(true);
      try {
        const response = await api.get("/users/me/", {
          headers: { Authorization: `Bearer ${tokenToUse}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error while retrieving user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Try refresh if get 401
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
        return Promise.reject(error);
      },
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [refreshAccessToken]);

  // If token exist try get user
  useEffect(() => {
    if (token) fetchUser(token);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/token/`,
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );
      saveTokens(response.data.access, response.data.refresh);
      await fetchUser(response.data.access);
      return true;
    } catch (error) {
      console.error("Error connection:", error);
      return false;
    }
  };

  const logout = () => clearTokens();

  return (
    <UserContext.Provider
      value={{ user, token, loading, login, logout, fetchUser, saveTokens }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
