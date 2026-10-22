import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Activity, LayoutDashboard, CalendarDays, Users, ClipboardList,
  ChartNoAxesCombined, Clock3, UserRound, Settings, LogOut, Menu,
  Bell, Search, ChevronDown, Stethoscope, PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import "./PhysioPanel.css";

const navItems = [
  { to: "/physio/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/physio/appointments", label: "Appointments", icon: CalendarDays, badge: "4" },
  { to: "/physio/patients", label: "My patients", icon: Users },
  { to: "/physio/treatment-plans", label: "Treatment plans", icon: ClipboardList },
  { to: "/physio/progress", label: "Progress reports", icon: ChartNoAxesCombined },
  { to: "/physio/schedule", label: "Availability", icon: Clock3 },
  { to: "/physio/profile", label: "My profile", icon: UserRound },
  { to: "/physio/settings", label: "Settings", icon: Settings },
];

export function getPhysioUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

export default function PhysioLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const user = useMemo(() => getPhysioUser(), []);
  const name = user.name || user.fullName || user.full_name || "Dr. A. Sharma";
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  return (
    <div className={`physio-app ${collapsed ? "sidebar-collapsed" : ""}`}>
      {mobileOpen && <button className="physio-mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`physio-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="physio-brand">
          <div className="physio-brand-mark"><Activity size={23} strokeWidth={2.4} /></div>
          <div className="physio-brand-copy"><strong>rehabics</strong><span>CARE WORKSPACE</span></div>
          <button className="physio-icon-button physio-collapse-button" aria-label="Collapse sidebar" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <div className="physio-workspace-label">WORKSPACE</div>
        <nav className="physio-nav" aria-label="Physiotherapist navigation">
          {navItems.map(({ to, label, icon: Icon, badge, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `physio-nav-link ${isActive ? "active" : ""}`}>
              <Icon size={19} />
              <span className="physio-nav-label">{label}</span>
              {badge && <span className="physio-nav-badge">{badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="physio-sidebar-spacer" />
        <div className="physio-help-card">
          <div className="physio-help-icon"><Stethoscope size={19} /></div>
          <strong>Need a hand?</strong>
          <p>Our care support team is here to help.</p>
          <button onClick={() => navigate("/contact")}>Contact support <span>↗</span></button>
        </div>
        <button className="physio-logout" onClick={logout}><LogOut size={18} /><span className="physio-nav-label">Sign out</span></button>
        <div className="physio-sidebar-user">
          <div className="physio-avatar">{initials || "DR"}</div>
          <div className="physio-user-copy"><strong>{name}</strong><span>Physiotherapist</span></div>
          <ChevronDown size={16} className="physio-user-chevron" />
        </div>
      </aside>

      <div className="physio-main">
        <header className="physio-topbar">
          <button className="physio-icon-button physio-mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={21} /></button>
          <div className="physio-breadcrumb"><span>Workspace</span><span className="physio-breadcrumb-separator">/</span><strong>Physiotherapist portal</strong></div>
          <div className="physio-topbar-actions">
            <label className="physio-search"><Search size={17} /><input aria-label="Search" placeholder="Search patients, sessions..." onKeyDown={event => { if (event.key === "Enter") navigate("/physio/patients"); }} /></label>
            <button className="physio-icon-button physio-notification" aria-label="Notifications" onClick={() => navigate("/physio/appointments")}><Bell size={19} /><i /></button>
            <div className="physio-topbar-divider" />
            <div className="physio-topbar-user"><div className="physio-avatar small">{initials || "DR"}</div><div><strong>{name}</strong><span>Care professional</span></div></div>
          </div>
        </header>
        <main className="physio-content"><Outlet /></main>
        <footer className="physio-footer"><span>© {new Date().getFullYear()} Rehabics</span><span>Better movement. Better living.</span><span><i className="physio-status-dot" /> Workspace ready</span></footer>
      </div>
    </div>
  );
}
