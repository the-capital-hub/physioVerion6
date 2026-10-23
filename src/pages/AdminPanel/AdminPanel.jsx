import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  Download,
  FileText,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  Sun,
  UserCheck,
  Users,
  X,
  RefreshCw,
  Filter,
  BriefcaseMedical,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { adminApi } from "../../services/adminApi";
import "./AdminPanel.css";

const NAV_ITEMS = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard },
  { label: "Patients", path: "/admin/patients", icon: Users },
  { label: "Doctors", path: "/admin/doctors", icon: Stethoscope },
  { label: "Appointments", path: "/admin/appointments", icon: CalendarDays },
  { label: "Treatments", path: "/admin/treatments", icon: Activity },
  { label: "Reports", path: "/admin/reports", icon: FileText },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const SAMPLE_STATS = [
  {
    label: "Total patients",
    value: "1,284",
    delta: "+12.8%",
    icon: Users,
    tone: "indigo",
  },
  {
    label: "Active doctors",
    value: "48",
    delta: "+4.2%",
    icon: Stethoscope,
    tone: "cyan",
  },
  {
    label: "Appointments today",
    value: "36",
    delta: "+8.1%",
    icon: CalendarDays,
    tone: "emerald",
  },
  {
    label: "Pending reviews",
    value: "12",
    delta: "Needs attention",
    icon: ClipboardList,
    tone: "amber",
  },
];

const SAMPLE_ACTIVITY = [
  {
    title: "New patient registered",
    detail: "A new patient profile was created",
    time: "8 min ago",
    icon: UserCheck,
  },
  {
    title: "Appointment rescheduled",
    detail: "An appointment time was updated",
    time: "24 min ago",
    icon: CalendarDays,
  },
  {
    title: "Doctor profile updated",
    detail: "Professional details were edited",
    time: "1 hour ago",
    icon: Stethoscope,
  },
  {
    title: "Treatment plan reviewed",
    detail: "A plan was marked for review",
    time: "2 hours ago",
    icon: ClipboardList,
  },
];

const SAMPLE_APPOINTMENTS = [
  {
    id: "APT-2048",
    patient: "Aarav Sharma",
    doctor: "Dr. Meera Kapoor",
    date: "Today, 10:30 AM",
    type: "Physiotherapy",
    status: "Confirmed",
  },
  {
    id: "APT-2047",
    patient: "Ananya Singh",
    doctor: "Dr. Rahul Verma",
    date: "Today, 11:15 AM",
    type: "Follow up",
    status: "Pending",
  },
  {
    id: "APT-2046",
    patient: "Rohan Das",
    doctor: "Dr. Meera Kapoor",
    date: "Today, 12:00 PM",
    type: "Assessment",
    status: "Confirmed",
  },
  {
    id: "APT-2045",
    patient: "Diya Patel",
    doctor: "Dr. Kabir Khan",
    date: "Today, 12:45 PM",
    type: "Recovery review",
    status: "Cancelled",
  },
];

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "AD"
  );
}

function Overview({ data, loading, onRefresh }) {
  const stats = data?.stats?.length ? data.stats : SAMPLE_STATS;
  const activity = data?.activity?.length ? data.activity : SAMPLE_ACTIVITY;
  const appointments = data?.appointments?.length
    ? data.appointments
    : SAMPLE_APPOINTMENTS;
  return (
    <div className="adm-page">
      <div className="adm-page-heading">
        <div>
          <span className="adm-eyebrow">ADMINISTRATION</span>
          <h1>Good morning, Admin</h1>
          <p>Here is what is happening across Rehabics today.</p>
        </div>
        <button className="adm-btn adm-btn-secondary" onClick={onRefresh}>
          <RefreshCw size={16} className={loading ? "adm-spin" : ""} /> Refresh
          data
        </button>
      </div>
      <div className="adm-stat-grid">
        {stats.map((item, i) => {
          const Icon = item.iconName
            ? Activity
            : SAMPLE_STATS[i % SAMPLE_STATS.length].icon;
          return (
            <article className="adm-stat-card" key={item.label}>
              <div
                className={`adm-stat-icon ${item.tone || ["indigo", "cyan", "emerald", "amber"][i % 4]}`}
              >
                <Icon size={20} />
              </div>
              <div className="adm-stat-top">
                <span>{item.label}</span>
                <span className="adm-stat-delta">{item.delta || ""}</span>
              </div>
              <strong>{item.value ?? item.count ?? "—"}</strong>
              <div className="adm-stat-foot">
                <span className="adm-dot" /> Live overview metric
              </div>
            </article>
          );
        })}
      </div>
      <div className="adm-overview-grid">
        <section className="adm-card adm-chart-card">
          <div className="adm-card-heading">
            <div>
              <h2>Appointment activity</h2>
              <p>Weekly appointment volume</p>
            </div>
            <button className="adm-select-like">
              This week <ChevronDown size={14} />
            </button>
          </div>
          <div className="adm-chart">
            {[42, 63, 49, 78, 58, 88, 69].map((height, i) => (
              <div className="adm-chart-col" key={i}>
                <div className="adm-chart-bar-wrap">
                  <div
                    className={`adm-chart-bar ${i === 5 ? "is-active" : ""}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
          <div className="adm-chart-legend">
            <span>
              <i /> Appointments booked
            </span>
            <span className="adm-chart-note">
              Illustrative chart until connected to analytics API
            </span>
          </div>
        </section>
        <section className="adm-card">
          <div className="adm-card-heading">
            <div>
              <h2>Recent activity</h2>
              <p>Latest system events</p>
            </div>
            <button
              className="adm-icon-btn"
              aria-label="Activity notifications"
            >
              <Bell size={17} />
            </button>
          </div>
          <div className="adm-activity-list">
            {activity.map((item, i) => {
              const Icon = item.iconName
                ? Activity
                : SAMPLE_ACTIVITY[i % SAMPLE_ACTIVITY.length].icon;
              return (
                <div className="adm-activity" key={`${item.title}-${i}`}>
                  <div className="adm-activity-icon">
                    <Icon size={17} />
                  </div>
                  <div className="adm-activity-copy">
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                    <span>{item.time || item.createdAt || ""}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <section className="adm-card adm-table-card">
        <div className="adm-card-heading">
          <div>
            <h2>Today's appointments</h2>
            <p>Recent booking activity across the platform</p>
          </div>
          <a className="adm-text-link" href="/admin/appointments">
            View all <ArrowRight size={15} />
          </a>
        </div>
        <AppointmentTable rows={appointments.slice(0, 4)} />
      </section>
    </div>
  );
}

function AppointmentTable({ rows }) {
  return (
    <div className="adm-table-scroll">
      <table className="adm-table">
        <thead>
          <tr>
            <th>Appointment</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Schedule</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || row._id || i}>
              <td className="adm-id">{row.id || row._id || `APT-${i + 1}`}</td>
              <td>
                <span className="adm-person">
                  <span className="adm-avatar">
                    {getInitials(row.patient || row.patientName)}
                  </span>
                  {row.patient || row.patientName || "Patient"}
                </span>
              </td>
              <td>{row.doctor || row.doctorName || "Doctor"}</td>
              <td>{row.date || row.scheduledAt || "Not scheduled"}</td>
              <td>{row.type || row.reason || "Consultation"}</td>
              <td>
                <span
                  className={`adm-status ${(row.status || "Pending").toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {row.status || "Pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DataPage({ page, data, loading, error, onRefresh }) {
  const titleMap = {
    patients: "Patients",
    doctors: "Doctors",
    appointments: "Appointments",
    treatments: "Treatments",
    reports: "Reports",
    settings: "Settings",
  };
  const title = titleMap[page] || "Administration";
  const list = Array.isArray(data) ? data : data?.items || data?.[page] || [];
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = useMemo(
    () =>
      list.filter((item) => {
        const text = Object.values(item || {})
          .filter((v) => typeof v === "string" || typeof v === "number")
          .join(" ")
          .toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          (status === "all" ||
            String(item.status || "").toLowerCase() === status)
        );
      }),
    [list, query, status],
  );
  return (
    <div className="adm-page">
      <div className="adm-page-heading">
        <div>
          <span className="adm-eyebrow">ADMINISTRATION</span>
          <h1>{title}</h1>
          <p>Manage and review {title.toLowerCase()} across Rehabics.</p>
        </div>
        <button className="adm-btn adm-btn-secondary" onClick={onRefresh}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>
      <section className="adm-card adm-data-card">
        <div className="adm-toolbar">
          <label className="adm-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
            />
          </label>
          <label className="adm-filter">
            <Filter size={15} />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <button
            className="adm-btn adm-btn-secondary"
            onClick={() => {
              setQuery("");
              setStatus("all");
            }}
          >
            <X size={15} /> Clear
          </button>
        </div>
        {error && (
          <div className="adm-inline-error">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {loading ? (
          <div className="adm-empty">
            <RefreshCw className="adm-spin" size={22} />
            <p>Loading {title.toLowerCase()}…</p>
          </div>
        ) : page === "settings" ? (
          <div className="adm-settings-grid">
            <div>
              <ShieldCheck size={22} />
              <h3>Security & access</h3>
              <p>
                Role protected admin access should be enforced by your backend.
              </p>
            </div>
            <div>
              <Bell size={22} />
              <h3>Notifications</h3>
              <p>Connect notification preferences to your settings API.</p>
            </div>
            <div>
              <BriefcaseMedical size={22} />
              <h3>Platform configuration</h3>
              <p>
                Keep clinic and operational settings in your server
                configuration.
              </p>
            </div>
          </div>
        ) : filtered.length ? (
          <div className="adm-table-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Record</th>
                  <th>Name / Details</th>
                  <th>Contact / Category</th>
                  <th>Status</th>
                  <th>Last updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={item._id || item.id || i}>
                    <td className="adm-id">
                      {item._id ||
                        item.id ||
                        `${page.slice(0, 3).toUpperCase()}-${i + 1}`}
                    </td>
                    <td>
                      <span className="adm-person">
                        <span className="adm-avatar">
                          {getInitials(
                            item.name ||
                              item.fullName ||
                              item.patientName ||
                              item.title,
                          )}
                        </span>
                        {item.name ||
                          item.fullName ||
                          item.patientName ||
                          item.title ||
                          item.email ||
                          "Record"}
                      </span>
                    </td>
                    <td>
                      {item.email ||
                        item.phone ||
                        item.specialty ||
                        item.type ||
                        item.role ||
                        "—"}
                    </td>
                    <td>
                      <span
                        className={`adm-status ${String(item.status || "active")
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {item.status || "Active"}
                      </span>
                    </td>
                    <td>
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="adm-empty">
            <ClipboardList size={26} />
            <h3>No connected records yet</h3>
            <p>
              When the {page} endpoint is configured, records will appear here.
            </p>
            <button className="adm-btn adm-btn-secondary" onClick={onRefresh}>
              <RefreshCw size={15} /> Try again
            </button>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <div className="adm-table-footer">
            Showing {filtered.length} of {list.length} records
          </div>
        )}
      </section>
    </div>
  );
}

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState(null);
  const [records, setRecords] = useState({});
  const navigate = useNavigate();
  const path = window.location.pathname;
  const page = path.split("/")[2] || "overview";

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      if (page === "overview") {
        const result = await adminApi.getOverview();
        if (result) setOverview(result);
      } else {
        const result = await adminApi.getResource(page);
        setRecords((prev) => ({ ...prev, [page]: result }));
      }
    } catch (err) {
      setError(
        err?.message ||
          "Could not load live data. Check the API endpoint configuration.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [page]);

  const handleLogout = () => {
    // Use the project's existing logout/auth context here if one is available.
    navigate("/login");
  };

  return (
    <div className={`adm-shell ${dark ? "adm-dark" : ""}`}>
      <aside className={`adm-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="adm-brand">
          <span className="adm-brand-mark">
            <Activity size={21} />
          </span>
          <span>
            rehabics<span className="adm-brand-dot">.</span>
            <small>ADMIN CONSOLE</small>
          </span>
          <button
            className="adm-close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>
        <div className="adm-workspace">
          <div className="adm-workspace-logo">
            <ShieldCheck size={18} />
          </div>
          <div>
            <strong>Rehabics Health</strong>
            <span>Platform workspace</span>
          </div>
          <ChevronDown size={15} />
        </div>
        <span className="adm-nav-label">WORKSPACE</span>
        <nav className="adm-nav">
          {NAV_ITEMS.map(({ label, path: itemPath, icon: Icon }) => (
            <NavLink
              end={itemPath === "/admin"}
              to={itemPath}
              key={label}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `adm-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "Reports" && <span className="adm-nav-count">3</span>}
            </NavLink>
          ))}
        </nav>
        <div className="adm-sidebar-bottom">
          <div className="adm-help-box">
            <div className="adm-help-icon">
              <ShieldCheck size={19} />
            </div>
            <strong>Need assistance?</strong>
            <p>Review system status and administration guidance.</p>
            <button onClick={() => navigate("/contact")}>
              Contact support <ArrowRight size={14} />
            </button>
          </div>
          <button
            className="adm-profile"
            onClick={() => navigate("/admin/settings")}
          >
            <span className="adm-profile-avatar">AD</span>
            <span>
              <strong>Administrator</strong>
              <small>Admin account</small>
            </span>
            <ChevronDown size={15} />
          </button>
        </div>
      </aside>
      {sidebarOpen && (
        <button
          className="adm-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <main className="adm-main">
        <header className="adm-topbar">
          <button
            className="adm-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="adm-breadcrumb">
            Workspace <span>/</span>{" "}
            <strong>
              {NAV_ITEMS.find((n) => n.path === path)?.label ||
                (page === "overview"
                  ? "Overview"
                  : page[0]?.toUpperCase() + page.slice(1))}
            </strong>
          </div>
          <div className="adm-topbar-actions">
            <label className="adm-global-search">
              <Search size={16} />
              <input
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search anything..."
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate("/admin/patients")
                }
              />
              <kbd>⌘ K</kbd>
            </label>
            <button
              className="adm-icon-btn"
              onClick={() => setDark((v) => !v)}
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="adm-icon-btn adm-notification-btn"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <i />
            </button>
            <span className="adm-top-avatar">AD</span>
          </div>
        </header>
        {error && page === "overview" && (
          <div className="adm-global-error">
            <AlertCircle size={16} />
            {error}
            <button onClick={loadData}>Retry</button>
          </div>
        )}
        {page === "overview" ? (
          <Overview data={overview} loading={loading} onRefresh={loadData} />
        ) : (
          <DataPage
            page={page}
            data={records[page]}
            loading={loading}
            error={error}
            onRefresh={loadData}
          />
        )}
        <footer className="adm-footer">
          <span>© {new Date().getFullYear()} Rehabics Health</span>
          <span>
            <i /> System overview <span className="adm-footer-sep">·</span>{" "}
            Alpine Horizon
          </span>
        </footer>
      </main>
    </div>
  );
}
