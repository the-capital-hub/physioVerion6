
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Dumbbell,
  TrendingUp,
  UserRound,
  Settings,
  LogOut,
  HeartPulse,
  Menu,
  X,
  Headset,
} from "lucide-react";
import { useState } from "react";
import "./PatientDashboard.css";

const links = [
  {
    label: "Dashboard",
    to: "/patient/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Appointments",
    to: "/patient/appointments",
    icon: CalendarDays,
  },
  {
    label: "My Exercises",
    to: "/patient/exercises",
    icon: Dumbbell,
  },
  {
    label: "My Progress",
    to: "/patient/progress",
    icon: TrendingUp,
  },
  {
    label: "My Profile",
    to: "/patient/profile",
    icon: UserRound,
  },
  {
    label: "Settings",
    to: "/patient/settings",
    icon: Settings,
  },
];

export default function PatientLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const getUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") ||
        sessionStorage.getItem("user") ||
        "{}"
      );
    } catch {
      return {};
    }
  };

  const user = getUser();
  const userName = user.name || user.fullName || "Patient";
  const avatarLetter = userName.charAt(0).toUpperCase();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setMobileOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <div className="patient-app">
      {mobileOpen && (
        <button
          type="button"
          className="patient-mobile-overlay"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <aside
        id="patient-sidebar"
        className={`patient-sidebar ${mobileOpen ? "is-open" : ""}`}
      >
        <div className="patient-brand">
          <div className="patient-brand-icon">
            <HeartPulse size={25} />
          </div>

          <div className="patient-brand-copy">
            <h2>Rehabics</h2>
            <span>YOUR RECOVERY PARTNER</span>
          </div>

          <button
            type="button"
            className="patient-close-menu"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <p className="patient-sidebar-label">PATIENT PORTAL</p>

        <nav className="patient-navigation" aria-label="Patient navigation">
          {links.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/patient/dashboard"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `patient-nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="patient-sidebar-bottom">
          <div className="patient-help-card">
            <div className="patient-help-icon">
              <Headset size={21} />
            </div>

            <h4>We're here for you</h4>
            <p>Need help with your recovery journey?</p>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate("/contact");
              }}
            >
              Contact support →
            </button>
          </div>

          <button
            type="button"
            className="patient-logout"
            onClick={logout}
          >
            <LogOut size={19} />
            <span>Log out</span>
          </button>

          <div className="patient-sidebar-footer">
            © 2026 Rehabics Healthcare
          </div>
        </div>
      </aside>

      <main className="patient-main">
        <header className="patient-topbar">
          <button
            type="button"
            className="patient-menu-toggle"
            onClick={() => setMobileOpen(true)}
            aria-controls="patient-sidebar"
            aria-expanded={mobileOpen}
            aria-label="Open navigation menu"
          >
            <Menu size={23} />
          </button>

          <div className="patient-breadcrumb">
            <span>Rehabics</span>
            <span className="patient-breadcrumb-divider">/</span>
            <span>Patient Portal</span>
          </div>

          <div className="patient-header-user">
            <div className="patient-avatar">{avatarLetter}</div>

            <div className="patient-header-user-text">
              <strong>{userName}</strong>
              <span>Patient account</span>
            </div>
          </div>
        </header>

        <div className="patient-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
