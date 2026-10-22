
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  HeartPulse,
  MoveUpRight,
} from "lucide-react";

import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa6";

import "./Footer.css";

const navigation = [
  { label: "Home", to: "/" },
  { label: "About us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Our therapists", to: "/therapists" },
  { label: "Contact", to: "/contact" },
];

const socials = [
  {
    label: "Instagram",
    icon: FaInstagram,
    href: "https://www.instagram.com/",
  },
  {
    label: "LinkedIn",
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/",
  },
  {
    label: "Facebook",
    icon: FaFacebookF,
    href: "https://www.facebook.com/",
  },
  {
    label: "YouTube",
    icon: FaYoutube,
    href: "https://www.youtube.com/",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="rv6-footer">
      <div className="rv6-footer-glow" aria-hidden="true" />
      <div className="rv6-footer-grid" aria-hidden="true" />

      <div className="rv6-footer-container">
        {/* Brand statement */}
        <motion.div
          className="rv6-footer-hero"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="rv6-footer-hero-copy">
            <div className="rv6-footer-eyebrow">
              <span className="rv6-footer-status-dot" />
              YOUR JOURNEY TO BETTER MOVEMENT
            </div>

            <h2>
              Move better.
              <br />
              <span>Live stronger.</span>
            </h2>

            <p>
              Thoughtful physiotherapy. Personalised recovery.
              A healthier you, one step at a time.
            </p>
          </div>

          <Link to="/contact" className="rv6-footer-cta">
            <span>
              Start your recovery
              <small>Let's take the first step</small>
            </span>

            <span className="rv6-footer-cta-icon">
              <ArrowUpRight size={22} />
            </span>
          </Link>
        </motion.div>

        <div className="rv6-footer-divider" />

        {/* Main footer */}
        <div className="rv6-footer-main">
          <div className="rv6-footer-brand-column">
            <Link to="/" className="rv6-footer-brand">
              <span className="rv6-footer-brand-icon">
                <HeartPulse size={24} strokeWidth={2.2} />
              </span>

              <span>
                rehabics<span className="rv6-footer-brand-period">.</span>
              </span>
            </Link>

            <p className="rv6-footer-brand-description">
              Helping you move with confidence and get back to
              the life you love.
            </p>

            <div className="rv6-footer-socials">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit Rehabics on ${label}`}
                  className="rv6-footer-social-link"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <nav
            className="rv6-footer-navigation"
            aria-label="Footer navigation"
          >
            <h3>Explore</h3>

            <ul>
              {navigation.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}>
                    <span>{label}</span>
                    <MoveUpRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="rv6-footer-contact">
            <h3>Let's connect</h3>

            <p>
              Have questions about your recovery?
              We're here to help.
            </p>

            <a
              href="mailto:hello@yourdomain.com"
              className="rv6-footer-email"
            >
              hello@yourdomain.com
              <ArrowUpRight size={16} />
            </a>

            <Link to="/contact" className="rv6-footer-contact-link">
              Get in touch
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="rv6-footer-bottom">
          <p>© {year} Rehabics. All rights reserved.</p>

          <div className="rv6-footer-legal">
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>

          <p className="rv6-footer-made">
            Made for better movement
            <HeartPulse size={15} />
          </p>
        </div>
      </div>
    </footer>
  );
}
