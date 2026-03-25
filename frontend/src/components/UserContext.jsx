import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const UserContext = createContext();

// Axios instance avec intercepteur pour le refresh automatique
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [loading, setLoading] = useState(false);

  // Sauvegarde les tokens
  const saveTokens = (accessToken, refreshToken) => {
    setToken(accessToken);
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
  };

  // Vide tout
  const clearTokens = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  // Tente de rafraîchir le access token via le refresh token
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
      console.error("Refresh token expiré, déconnexion.", error);
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

        console.log("PIERRE USER ", response.data);
        setUser(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur:",
          error,
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Intercepteur Axios : si 401, tente un refresh puis relance la requête
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

  // Fetch user au chargement si un token existe
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
      console.error("Erreur de connexion:", error);
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
