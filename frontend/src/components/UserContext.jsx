import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  // Retrieve user from Backend and setUser
  const fetchUser = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  // Call FetchUser if token changes
  useEffect(() => {
    fetchUser();
  }, [token]);

  // Get token
  const login = async (email, password) => {
    console.log("On est dans le login");
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/token/",
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );

      const newToken = response.data.access;
      setToken(newToken);
      localStorage.setItem("token", newToken);

      return true;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return false;
    }
  };

  // Used to deconnect the user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{ user, token, loading, login, logout, fetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
