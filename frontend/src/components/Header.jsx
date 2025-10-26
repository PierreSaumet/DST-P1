import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-header-bg fixed z-50 mx-auto h-20 w-full max-w-5xl rounded-xl px-4 py-2 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          {" "}
          {/* Left Part   */}
          <Link to="/" className="my-3 text-3xl font-bold md:my-0">
            WEEB
          </Link>
          <Link
            to="/contact"
            className="hover:text-main-text hidden items-center p-4 text-xl font-medium md:flex"
          >
            Contact
          </Link>
          <Link
            to="/profile"
            className="hover:text-main-text hidden items-center p-4 text-xl font-medium md:flex"
          >
            Profile
          </Link>
          <Link
            to="/articles"
            className="hover:text-main-text hidden items-center p-4 text-xl font-medium md:flex"
          >
            Articles
          </Link>
        </div>

        <div className="hidden items-center md:flex">
          {" "}
          {/* Right Part */}
          <Link to="/login" className="hover:text-main-text mx-4 text-base">
            Se connecter
          </Link>
          <Link
            to="/signup"
            className="bg-main-text mx-4 transform rounded-lg px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-110"
          >
            S'inscrire
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            <X size={44} className="bg-main-text rounded-lg p-1" />
          ) : (
            <Menu size={44} className="bg-main-text rounded-lg p-1" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className="bg-opacity-50 bg-header-bg fixed inset-0 top-20 z-10 min-h-full"
            onClick={() => setMenuOpen(false)}
          />

          <div className="bg-header-bg sticky right-0 left-0 z-20 flex flex-col rounded-xl p-4 text-center md:hidden">
            {" "}
            <Link
              to="/contact"
              className="px-4 py-2 text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2 text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/articles"
              className="px-4 py-2 text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Articles
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Se connecter
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-lg"
              onClick={() => setMenuOpen(false)}
            >
              S'inscrire
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}

export default Header;
