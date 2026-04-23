import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios from "axios";

const UserContext = createContext();

// Axios instance with interceptor for refresh
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const tokenRef = useRef(token);

  // Save token
  const saveAccessToken = useCallback((accessToken) => {
    setToken(accessToken);
  }, []);

  // Clear tokens
  const clearTokens = useCallback(() => {
    setToken(null);
    tokenRef.current = null;
    setUser(null);
  }, []);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const refreshAccessToken = useCallback(async () => {
    try {
      console.log(" ava,t");
      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
      );
      console.log("RESPOSNE ", response);
      const newAccessToken = response.data.access;
      saveAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Refresh token expired.", error);
      return null;
    }
  }, [saveAccessToken, clearTokens]);

  // FetchUser
  const fetchUser = useCallback(async (accessToken) => {
    const tokenToUse = accessToken || tokenRef.current;
    console.log("laaaaaaaaaaaa", tokenToUse);
    if (!tokenToUse) return;
    setLoading(true);
    try {
      const response = await api.get("/users/me/", {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      });

      console.log("le user?    ", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error while retrieving user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      const token = tokenRef.current;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    return () => api.interceptors.request.eject(interceptor);
  }, []);

  // Try to refresh
  useEffect(() => {
    console.log(
      "window.location.pathnamewindow.location.pathname ",
      window.location.pathname,
    );
    if (window.location.pathname === "/auth/callback") {
      console.log("ON SKIP");
      return;
    }
    refreshAccessToken().then((t) => {
      if (t) fetchUser(t);
    });
  }, [refreshAccessToken, fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/token/`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      saveAccessToken(response.data.access);
      await fetchUser(response.data.access);
      return true;
    } catch (error) {
      console.error("Error connection:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Le back supprime le cookie refresh_token
      await api.post(
        `${import.meta.env.VITE_API_URL}/auth/logout/`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
    } finally {
      clearTokens();
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        fetchUser,
        saveAccessToken,
        api,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
