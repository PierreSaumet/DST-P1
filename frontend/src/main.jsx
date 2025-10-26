import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./components/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {" "}
    {/* Used for development mode */}
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
);
