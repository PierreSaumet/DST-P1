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

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const tokenRef = useRef(null);
  const refreshPromiseRef = useRef(null);

  const saveAccessToken = useCallback((accessToken) => {
    setToken(accessToken);
    tokenRef.current = accessToken;
  }, []);

  const clearTokens = useCallback(() => {
    setToken(null);
    tokenRef.current = null;
    setUser(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    refreshPromiseRef.current = api
      .post("/auth/token/refresh/")
      .then((response) => {
        const newToken = response.data.access;
        saveAccessToken(newToken);
        return newToken;
      })
      .catch((error) => {
        console.error("Refresh token expired.", error);
        clearTokens();
        return null;
      })
      .finally(() => {
        refreshPromiseRef.current = null;
      });

    return refreshPromiseRef.current;
  }, [saveAccessToken, clearTokens]);

  const fetchUser = useCallback(async (accessToken) => {
    const tokenToUse = accessToken || tokenRef.current;
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
  }, []);

  // Intercepteur requêtes : injecte le token
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      const currentToken = tokenRef.current;
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    });
    return () => api.interceptors.request.eject(interceptor);
  }, []);

  // Intercepteur réponses : retry si 401
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const isRefreshRequest = originalRequest.url?.includes(
          "/auth/token/refresh/",
        );

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isRefreshRequest
        ) {
          originalRequest._retry = true;
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest);
          }
          clearTokens();
        }

        return Promise.reject(error);
      },
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [refreshAccessToken, clearTokens]);

  // Initialisation : tente un refresh au démarrage
  useEffect(() => {
    if (window.location.pathname === "/auth/callback") {
      setInitializing(false);
      return;
    }

    refreshAccessToken()
      .then((t) => {
        if (t) return fetchUser(t);
      })
      .finally(() => {
        setInitializing(false);
      });
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post(
        "/auth/token/",
        { email, password },
        { headers: { "Content-Type": "application/json" } },
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
      await api.post("/auth/logout/");
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
        initializing,
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
