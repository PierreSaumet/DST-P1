import { Outlet } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

function Layout() {
  /*
    Principal Layout of this project
      Display Header and Footer for all pages
      Every page is rendered by Outlet
  */
  return (
    <div className="bg-layout-bg font-roboto text-base-text flex min-h-screen flex-col items-center pt-5">
      <Header />
      <main className="mt-10 min-h-[70vh] w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
