
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Activity, LayoutDashboard, Users, UserRound, CalendarDays,
  ClipboardList, BarChart3, Settings, LogOut, Menu, Bell, Search
} from "lucide-react";
import { useState } from "react";
import "./AdminPanel.css";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/patients", label: "Patients", icon: Users },
  { to: "/admin/physiotherapists", label: "Physiotherapists", icon: UserRound },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/admin/treatment-plans", label: "Treatment Plans", icon: ClipboardList },
  { to: "/admin/analytics", label: "Analytics & Reports", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  function logout() {
    // Demo logout. Replace with your backend logout logic.
    navigate("/login");
  }

  return (
    <div className="admin-shell">
      {sidebarOpen && (
        <button
          className="admin-sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-brand">
          <span className="admin-brand-icon"><Activity size={23} /></span>
          <span>Rehabics <small>ADMIN PORTAL</small></span>
        </div>

        <p className="admin-nav-caption">WORKSPACE</p>
        <nav className="admin-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-avatar">AD</div>
            <div>
              <strong>Admin User</strong>
              <small>Administrator</small>
            </div>
          </div>
          <button className="admin-logout" onClick={logout}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-icon-button admin-menu-button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
          >
            <Menu size={21} />
          </button>

          <div className="admin-search">
            <Search size={17} />
            <input placeholder="Search dashboard..." aria-label="Search dashboard" />
            <kbd>⌘ K</kbd>
          </div>

          <div className="admin-topbar-right">
            <span className="admin-status"><i /> System operational</span>
            <button className="admin-icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <div className="admin-avatar">AD</div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
