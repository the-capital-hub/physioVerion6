
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CalendarDays,
  Users,
  ClipboardCheck,
  Activity,
  ArrowUpRight,
  ArrowRight,
  Clock3,
  MapPin,
  Video,
  MoreHorizontal,
  CheckCircle2,
  CircleAlert,
  Plus,
  ChevronRight,
} from "lucide-react";
import "./PhysioPanel.css";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const tones = ["blue", "purple", "peach", "green"];

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken")
  );
}

function getInitials(name = "Patient") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function getTone(index) {
  return tones[index % tones.length];
}

function formatTime(value) {
  if (!value) return "Time not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time not set";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value) {
  if (!value) return "Not scheduled";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function isToday(value) {
  if (!value) return false;

  const date = new Date(value);
  const today = new Date();

  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function getStatusClass(status = "") {
  const value = status.toLowerCase();

  if (value === "confirmed" || value === "completed") {
    return "confirmed";
  }

  return "waiting";
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  trend,
  tone,
  onClick,
}) {
  return (
    <button className="physio-stat-card" onClick={onClick}>
      <div className="physio-stat-top">
        <span className={`physio-stat-icon ${tone}`}>
          <Icon size={20} />
        </span>
        <span className="physio-stat-trend">
          <ArrowUpRight size={14} />
          {trend}
        </span>
      </div>

      <span className="physio-stat-label">{label}</span>
      <strong className="physio-stat-value">{value}</strong>
      <span className="physio-stat-detail">{detail}</span>
    </button>
  );
}

export default function PhysioDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    } catch {
      setUser({});
    }
  }, []);

  const firstName = (
    user.name ||
    user.fullName ||
    user.full_name ||
    "Doctor"
  )
    .trim()
    .split(" ")[0];

  const loadDashboard = useCallback(async (signal) => {
    const token = getToken();

    if (!token) {
      setApiError("Please login again to load your dashboard.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setApiError("");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      };

      const [overviewRes, appointmentsRes, patientsRes] =
        await Promise.all([
          axios.get(`${API_URL}/physiotherapist-portal/overview`, config),
          axios.get(
            `${API_URL}/physiotherapist-portal/appointments`,
            config
          ),
          axios.get(
            `${API_URL}/physiotherapist-portal/patients`,
            config
          ),
        ]);

      setStats(overviewRes.data?.stats || {});
      setAppointments(
        Array.isArray(appointmentsRes.data?.appointments)
          ? appointmentsRes.data.appointments
          : []
      );
      setPatients(
        Array.isArray(patientsRes.data?.patients)
          ? patientsRes.data.patients
          : []
      );
    } catch (error) {
      if (error.code === "ERR_CANCELED") return;

      console.error(
        "Physiotherapist dashboard error:",
        error.response?.data || error.message
      );

      setApiError(
        error.response?.data?.message ||
          "Unable to load dashboard data. Please try again."
      );
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadDashboard(controller.signal);

    return () => controller.abort();
  }, [loadDashboard, refreshKey]);

  const todayAppointments = appointments
    .filter((item) => isToday(item.time))
    .sort((a, b) => new Date(a.time) - new Date(b.time));

  const nextSession = todayAppointments.find(
    (item) =>
      new Date(item.time) >= new Date() &&
      !["cancelled", "completed"].includes(
        (item.status || "").toLowerCase()
      )
  );

  const activePatients = Number(stats?.totalPatients ?? patients.length);
  const todaySessions = Number(
    stats?.todaySessions ?? todayAppointments.length
  );
  const activePlans = Number(stats?.activePlans ?? 0);
  const averageProgress = Number(stats?.averageProgress ?? 0);

  return (
    <div className="physio-page">
      <div className="physio-welcome-row">
        <div>
          <div className="physio-eyebrow">
            <span className="physio-live-dot" />
            YOUR CARE WORKSPACE
          </div>

          <h1>
            Good day, {firstName} <span className="physio-wave">✦</span>
          </h1>

          <p>
            Here is your live patient and appointment overview.
          </p>
        </div>

        <button
          className="physio-primary-button"
          onClick={() => navigate("/physio/appointments")}
        >
          <Plus size={18} />
          Manage appointments
        </button>
      </div>

      {apiError && (
        <div className="physio-card-bottom-note" role="alert">
          <CircleAlert size={16} />
          <span>{apiError}</span>
          <button onClick={() => setRefreshKey((value) => value + 1)}>
            Retry
          </button>
        </div>
      )}

      <section className="physio-stats-grid" aria-label="Practice overview">
        <StatCard
          icon={CalendarDays}
          label="Today's sessions"
          value={loading ? "…" : todaySessions}
          detail="Appointments scheduled today"
          trend="Live data"
          tone="blue"
          onClick={() => navigate("/physio/appointments")}
        />

        <StatCard
          icon={Users}
          label="Assigned patients"
          value={loading ? "…" : activePatients}
          detail="Patients with recovery plans"
          trend="Live data"
          tone="purple"
          onClick={() => navigate("/physio/patients")}
        />

        <StatCard
          icon={ClipboardCheck}
          label="Active plans"
          value={loading ? "…" : activePlans}
          detail="Plans marked as active"
          trend="Live data"
          tone="orange"
          onClick={() => navigate("/physio/treatment-plans")}
        />

        <StatCard
          icon={Activity}
          label="Average recovery"
          value={loading ? "…" : `${averageProgress}%`}
          detail="Recorded plan progress"
          trend="Live data"
          tone="green"
          onClick={() => navigate("/physio/patients")}
        />
      </section>

      <section className="physio-main-grid">
        <div className="physio-panel-card physio-appointments-card">
          <div className="physio-section-heading">
            <div>
              <h2>Today's appointments</h2>
              <p>Your schedule at a glance</p>
            </div>

            <button
              className="physio-text-button"
              onClick={() => navigate("/physio/appointments")}
            >
              View all <ArrowRight size={16} />
            </button>
          </div>

          <div className="physio-table-wrap">
            <table className="physio-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Time &amp; duration</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {todayAppointments.map((item, index) => {
                  const name = item.patient || "Patient";

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="physio-patient-cell">
                          <div
                            className={`physio-avatar patient ${getTone(index)}`}
                          >
                            {getInitials(name)}
                          </div>

                          <div>
                            <strong>{name}</strong>
                            <span>
                              {item.type || "Physiotherapy session"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="physio-time-cell">
                          <strong>
                            <Clock3 size={14} />
                            {formatTime(item.time)}
                          </strong>

                          <span>
                            <CalendarDays size={13} />
                            {item.durationMinutes || 30} min
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`physio-status-pill ${getStatusClass(
                            item.status
                          )}`}
                        >
                          <i />
                          {item.status || "Pending"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="physio-row-action"
                          aria-label={`Open ${name} appointment`}
                          onClick={() =>
                            navigate("/physio/appointments")
                          }
                        >
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {!loading && todayAppointments.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      No appointments scheduled for today.
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td colSpan={4}>Loading appointments…</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="physio-card-bottom-note">
            <CalendarDays size={16} />
            <span>
              {todayAppointments.length} appointment
              {todayAppointments.length === 1 ? "" : "s"} scheduled today.
            </span>
            <button
              onClick={() => navigate("/physio/appointments")}
            >
              Review
            </button>
          </div>
        </div>

        <div className="physio-panel-card physio-day-card">
          <div className="physio-section-heading">
            <div>
              <h2>Day overview</h2>
              <p>{new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}</p>
            </div>

            <button
              className="physio-icon-button"
              aria-label="Refresh dashboard"
              onClick={() => setRefreshKey((value) => value + 1)}
            >
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="physio-day-summary">
            <div className="physio-day-ring">
              <div>
                <strong>{todaySessions}</strong>
                <span>sessions</span>
              </div>
            </div>

            <div className="physio-day-legend">
              <div>
                <i className="legend-blue" />
                <span>Scheduled today</span>
                <strong>{todaySessions}</strong>
              </div>

              <div>
                <i className="legend-light" />
                <span>Active plans</span>
                <strong>{activePlans}</strong>
              </div>

              <div>
                <i className="legend-orange" />
                <span>Awaiting action</span>
                <strong>
                  {todayAppointments.filter((item) =>
                    ["pending", "awaiting"].includes(
                      (item.status || "").toLowerCase()
                    )
                  ).length}
                </strong>
              </div>
            </div>
          </div>

          <div className="physio-next-session">
            <div className="physio-next-icon">
              <Clock3 size={18} />
            </div>

            <div>
              <span>NEXT SESSION</span>
              <strong>{nextSession?.patient || "No upcoming session"}</strong>
              <p>
                {nextSession
                  ? `${nextSession.type || "Physiotherapy"} · ${formatTime(nextSession.time)}`
                  : "Your upcoming sessions will appear here."}
              </p>
            </div>

            <button
              aria-label="View appointments"
              onClick={() => navigate("/physio/appointments")}
            >
              <ArrowUpRight size={18} />
            </button>
          </div>

          <button
            className="physio-outline-button"
            onClick={() => navigate("/physio/schedule")}
          >
            Manage availability <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="physio-panel-card physio-patients-card">
        <div className="physio-section-heading">
          <div>
            <h2>Patient progress</h2>
            <p>Recovery milestones from assigned plans</p>
          </div>

          <button
            className="physio-text-button"
            onClick={() => navigate("/physio/patients")}
          >
            All patients <ArrowRight size={16} />
          </button>
        </div>

        <div className="physio-patient-progress-grid">
          {patients.map((patient, index) => (
            <article
              className="physio-progress-patient"
              key={patient.id}
            >
              <div className="physio-progress-patient-top">
                <div className="physio-patient-cell">
                  <div
                    className={`physio-avatar patient ${getTone(index)}`}
                  >
                    {getInitials(patient.name)}
                  </div>

                  <div>
                    <strong>{patient.name}</strong>
                    <span>{patient.condition || patient.plan}</span>
                  </div>
                </div>

                <button
                  className="physio-row-action"
                  aria-label={`View ${patient.name}`}
                  onClick={() => navigate("/physio/patients")}
                >
                  <ArrowUpRight size={17} />
                </button>
              </div>

              <div className="physio-progress-meta">
                <span>Recovery progress</span>
                <strong>{patient.progress ?? 0}%</strong>
              </div>

              <div className="physio-progress-track">
                <span
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, Number(patient.progress) || 0)
                    )}%`,
                  }}
                />
              </div>

              <div className="physio-progress-foot">
                <CalendarDays size={14} />
                <span>
                  Next review: {formatDate(patient.nextReview)}
                </span>
              </div>
            </article>
          ))}

          {!loading && patients.length === 0 && (
            <p>
              No assigned patients found. Create a recovery plan to connect
              a patient to your care.
            </p>
          )}

          {loading && <p>Loading patient records…</p>}
        </div>
      </section>

      <section className="physio-bottom-grid">
        <div className="physio-panel-card physio-tasks-card">
          <div className="physio-section-heading">
            <div>
              <h2>Priority checklist</h2>
              <p>Shortcuts for your care workflow</p>
            </div>
            <span className="physio-task-count">3 items</span>
          </div>

          <label className="physio-task">
            <input type="checkbox" />
            <span className="physio-task-check">
              <CheckCircle2 size={17} />
            </span>
            <span>
              <strong>Review treatment plans</strong>
              <small>{activePlans} active plans in your workspace</small>
            </span>
            <span className="physio-priority high">High</span>
          </label>

          <label className="physio-task">
            <input type="checkbox" />
            <span className="physio-task-check">
              <CheckCircle2 size={17} />
            </span>
            <span>
              <strong>Review today's schedule</strong>
              <small>{todaySessions} sessions scheduled today</small>
            </span>
            <span className="physio-priority medium">Medium</span>
          </label>

          <label className="physio-task">
            <input type="checkbox" />
            <span className="physio-task-check">
              <CheckCircle2 size={17} />
            </span>
            <span>
              <strong>Check patient progress</strong>
              <small>{activePatients} assigned patients</small>
            </span>
            <span className="physio-priority medium">Medium</span>
          </label>
        </div>

        <div className="physio-panel-card physio-quick-card">
          <div className="physio-section-heading">
            <div>
              <h2>Quick actions</h2>
              <p>Jump right into your work</p>
            </div>
            <Activity size={19} className="physio-muted-icon" />
          </div>

          <button onClick={() => navigate("/physio/appointments")}>
            <span className="quick-icon blue">
              <CalendarDays size={18} />
            </span>
            <span>
              <strong>Appointments</strong>
              <small>Review your schedule</small>
            </span>
            <ChevronRight size={18} />
          </button>

          <button onClick={() => navigate("/physio/patients")}>
            <span className="quick-icon purple">
              <Users size={18} />
            </span>
            <span>
              <strong>Patient directory</strong>
              <small>Find assigned patients</small>
            </span>
            <ChevronRight size={18} />
          </button>

          <button onClick={() => navigate("/physio/treatment-plans")}>
            <span className="quick-icon orange">
              <ClipboardCheck size={18} />
            </span>
            <span>
              <strong>Treatment plans</strong>
              <small>Manage recovery goals</small>
            </span>
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <p className="physio-demo-disclaimer">
        {loading
          ? "Loading live dashboard data…"
          : apiError
            ? "Live dashboard data could not be loaded."
            : "Dashboard data loaded from your Rehabics backend."}
      </p>
    </div>
  );
}
