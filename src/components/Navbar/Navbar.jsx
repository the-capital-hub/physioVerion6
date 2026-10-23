
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  HeartPulse,
  Sun,
  Moon,
} from "lucide-react";
import "./Navbar.css";

const navigation = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Our Therapists", path: "/therapists" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const nextMode = !darkMode;

    document.documentElement.classList.toggle("dark", nextMode);
    setDarkMode(nextMode);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link
          to="/"
          className="navbar-brand"
          aria-label="Rehabics home"
          onClick={closeMenu}
        >
          <span className="navbar-logo">
            <HeartPulse size={25} strokeWidth={2.3} />
          </span>

          <span className="navbar-brand-text">
            <span className="navbar-brand-name">rehabics</span>
            <span className="navbar-brand-tagline">
              MOVE BETTER. LIVE BETTER.
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-links" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <button
            type="button"
            className="navbar-theme-toggle"
            onClick={toggleTheme}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          <Link to="/login" className="navbar-login">
            Log in
          </Link>

          <Link to="/appointment" className="navbar-cta">
            Book Appointment
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="navbar-mobile-actions">
          <button
            type="button"
            className="navbar-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <button
            type="button"
            className="navbar-menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            className="navbar-mobile-menu"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="navbar-mobile-links">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `navbar-mobile-link ${isActive ? "active" : ""}`
                    }
                  >
                    {item.label}
                    <ChevronDown
                      className="navbar-mobile-arrow"
                      size={17}
                    />
                  </NavLink>
                </motion.div>
              ))}
            </div>

            <div className="navbar-mobile-auth">
              <Link
                to="/login"
                className="navbar-mobile-login"
                onClick={closeMenu}
              >
                Log in
              </Link>

              <Link
                to="/appointmnet"
                className="navbar-cta navbar-mobile-cta"
                onClick={closeMenu}
              >
                Book Appointment
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <p className="navbar-mobile-note">
              Your journey to better movement starts here.
            </p>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
