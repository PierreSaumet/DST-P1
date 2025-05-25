import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./Layout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";

// Define children routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
