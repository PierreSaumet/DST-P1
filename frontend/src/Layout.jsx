import { Outlet } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

function Layout() {
  return (
    <div class="min-h-screen flex flex-col items-center font-roboto bg-layout-bg text-white ">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
