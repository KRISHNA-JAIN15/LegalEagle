import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Github, Twitter, MessageCircle } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Features", path: "/features" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Pricing", path: "/pricing" },
    { name: "Docs", path: "/docs" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isMobileOpen ? "mobile-open" : ""}`}>
      <div className="navbar-header">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 4L4 36h32L20 4z" fill="#ff4d00" />
              <path d="M20 12L10 32h20L20 12z" fill="#fff" />
            </svg>
          </div>
          LegalEagle
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <span className="navbar-divider"></span>

      <ul className="navbar-nav">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className={`navbar-link ${isActive(link.path) ? "active" : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <span className="navbar-divider"></span>

      <div className="navbar-social">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-social-link"
          aria-label="GitHub"
        >
          <Github size={18} />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-social-link"
          aria-label="Twitter"
        >
          <Twitter size={18} />
        </a>
        <a
          href="https://discord.com"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-social-link"
          aria-label="Discord"
        >
          <MessageCircle size={18} />
        </a>
      </div>

      <span className="navbar-divider"></span>

      <Link
        to="/login"
        className="navbar-cta"
        onClick={() => setIsMobileOpen(false)}
      >
        Get Started
      </Link>
    </nav>
  );
};

export default Navbar;
