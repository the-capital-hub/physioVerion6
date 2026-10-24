
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LogOut,
  Activity,
  CalendarDays,
  Users,
  ClipboardList,
  Dumbbell,
  MessageSquare,
  ChartNoAxesCombined,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  ChevronRight,
  Clock3,
  CheckCircle2,
  CircleAlert,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Stethoscope,
  FileText,
  Filter,
  MoreHorizontal,
  Mail,
  CalendarCheck,
  HeartPulse,
  UserRound,
  Sun,
  Moon,
  ClipboardCheck,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";

import {
  getDoctorOverview,
  getDoctorAppointments,
  getDoctorPatients,
  getTreatmentPlans,
  getExerciseLibrary,
  getDoctorMessages,
  getDoctorProfile,
  updateDoctorAppointmentStatus,
  updateTreatmentPlan,
  createTreatmentPlan,
  deleteTreatmentPlan,
} from "../../services/doctorApi";

import "./DoctorPanel.css";

/* =====================================================
   NAVIGATION
===================================================== */

const NAV = [
  { to: "/doctor", label: "Overview", icon: Activity, end: true },
  { to: "/doctor/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/doctor/patients", label: "My patients", icon: Users },
  { to: "/doctor/treatment-plans", label: "Treatment plans", icon: ClipboardList },
  { to: "/doctor/exercises", label: "Exercise library", icon: Dumbbell },
  { to: "/doctor/messages", label: "Messages", icon: MessageSquare },
  { to: "/doctor/reports", label: "Reports & progress", icon: ChartNoAxesCombined },
  { to: "/doctor/settings", label: "Profile & settings", icon: Settings },
];

/* =====================================================
   HELPERS
===================================================== */

function initials(name = "") {
  return String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "PT";
}

function unwrapList(result, key) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.[key])) return result[key];
  if (Array.isArray(result?.data?.[key])) return result.data[key];
  if (Array.isArray(result?.data)) return result.data;
  return [];
}

function unwrapObject(result, key) {
  return result?.[key] ?? result?.data?.[key] ?? result?.data ?? result ?? {};
}

function normalizeStatus(status = "") {
  return String(status).trim().toLowerCase();
}

function formatDate(value) {
  if (!value) return "Not scheduled";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "Time not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isToday(value) {
  if (!value) return false;

  const date = new Date(value);
  const today = new Date();

  return (
    !Number.isNaN(date.getTime()) &&
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function mapAppointment(item) {
  const time = item.time || item.startsAt || item.date;

  return {
    ...item,
    id: item.id || item._id,
    patientId: item.patientId || item.patient?._id,
    patientName:
      item.patient ||
      item.patientName ||
      item.patientDetails?.name ||
      "Patient",
    patientEmail: item.patientEmail || "",
    timeValue: time,
    date: time ? formatDate(time) : "Not scheduled",
    time: time ? formatTime(time) : "Time not set",
    reason: item.type || item.reason || "Physiotherapy session",
    type: item.type || "Physiotherapy session",
    durationMinutes: item.durationMinutes || 30,
    status: item.status || "Pending",
  };
}

function mapPatient(item) {
  return {
    ...item,
    id: item.id || item._id,
    name: item.name || item.patientName || "Patient",
    email: item.email || "",
    condition: item.condition || item.plan || "Not specified",
    progress: Number(item.progress) || 0,
    lastVisit: item.lastVisit || "Not recorded",
    status: item.status || "No plan",
  };
}

function mapPlan(item) {
  return {
    ...item,
    id: item.id || item._id,
    patientId: item.patientId || item.patient?._id,
    patientName:
      item.patient ||
      item.patientName ||
      "Patient",
    title: item.title || "Recovery plan",
    phase: item.clinicalNotes || "Recovery programme",
    progress: Number(item.progress) || 0,
    status: item.status || "Active",
    nextReview: formatDate(item.reviewDate),
    goals: Array.isArray(item.goals) ? item.goals : [],
    exercises: Array.isArray(item.exercises) ? item.exercises : [],
  };
}

function mapExercise(item) {
  return {
    ...item,
    id: item.id || item._id,
    title: item.title || item.name || "Exercise",
    area: item.area || item.bodyPart || "General",
    level: item.level || item.difficulty || "Not specified",
    duration: item.duration || item.durationMinutes
      ? `${item.duration || item.durationMinutes} min`
      : "Not specified",
    category: item.category || "General",
  };
}

function mapMessage(item) {
  return {
    ...item,
    id: item.id || item._id,
    patientName:
      item.patientName ||
      item.patient?.name ||
      item.sender?.name ||
      "Patient",
    message: item.message || item.content || item.text || "",
    time: item.time || formatDate(item.createdAt),
    unread: Boolean(item.unread ?? item.isUnread),
  };
}

/* =====================================================
   SHARED COMPONENTS
===================================================== */

function Status({ value }) {
  const status = value || "Active";
  const key = normalizeStatus(status).replace(/\s+/g, "-");

  return (
    <span className={`rp-status rp-status--${key}`}>
      {status}
    </span>
  );
}

function PageTitle({ eyebrow = "REHABICS CLINIC", title, description, action }) {
  return (
    <div className="rp-page-title">
      <div>
        <p className="rp-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="rp-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Avatar({ name, small = false }) {
  return (
    <div
      className={`rp-avatar ${small ? "rp-avatar--small" : ""}`}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}

function Empty({ title, detail }) {
  return (
    <div className="rp-empty">
      <div className="rp-empty-icon">
        <ClipboardCheck size={22} />
      </div>
      <strong>{title}</strong>
      <p>{detail}</p>
    </div>
  );
}

function ErrorNotice({ error, retry }) {
  if (!error) return null;

  return (
    <div className="rp-inline-note" role="alert">
      <CircleAlert size={16} />
      <span>{error}</span>
      {retry && (
        <button className="rp-link-button" onClick={retry}>
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
}

function LoadingNote({ loading }) {
  return loading ? (
    <p className="rp-inline-note">Loading live clinic data…</p>
  ) : null;
}

/* =====================================================
   OVERVIEW
===================================================== */

function Overview({ data, appointments, patients, plans, loading, go }) {
  const stats = [
    {
      label: "Today's appointments",
      value: appointments.filter((item) => isToday(item.timeValue)).length,
      icon: CalendarCheck,
      tone: "blue",
      delta: "From your appointment records",
    },
    {
      label: "My patients",
      value: patients.length,
      icon: Users,
      tone: "violet",
      delta: "Assigned patient records",
    },
    {
      label: "Active treatment plans",
      value: plans.filter(
        (item) => normalizeStatus(item.status) === "active"
      ).length,
      icon: ClipboardList,
      tone: "cyan",
      delta: "From saved recovery plans",
    },
    {
      label: "Unread messages",
      value: data?.stats?.unreadMessages ?? "N/A",
      icon: HeartPulse,
      tone: "amber",
      delta: "From message summary when available",
    },
  ];

  const todayAppointments = appointments
    .filter((item) => isToday(item.timeValue))
    .sort((a, b) => new Date(a.timeValue) - new Date(b.timeValue))
    .slice(0, 5);

  const recentPatients = patients.slice(0, 4);

  const week = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    const day = (today.getDay() + 6) % 7;
    start.setDate(today.getDate() - day);
    start.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      const count = appointments.filter((item) => {
        const appointmentDate = new Date(item.timeValue);
        return (
          !Number.isNaN(appointmentDate.getTime()) &&
          appointmentDate.getFullYear() === date.getFullYear() &&
          appointmentDate.getMonth() === date.getMonth() &&
          appointmentDate.getDate() === date.getDate()
        );
      }).length;

      return {
        day: date.toLocaleDateString("en-IN", { weekday: "short" }),
        count,
      };
    });
  }, [appointments]);

  const maxCount = Math.max(1, ...week.map((item) => item.count));

  return (
    <div className="rp-page">
      <PageTitle
        title={`Good ${
          new Date().getHours() < 12
            ? "morning"
            : new Date().getHours() < 17
              ? "afternoon"
              : "evening"
        }, ${data?.profile?.name || data?.doctor?.name || "Doctor"}`}
        description="Here is your clinic overview for today."
        action={
          <div className="rp-date-chip">
            <CalendarDays size={18} />
            <span>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        }
      />

      <div className="rp-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="rp-stat" key={stat.label}>
              <div className={`rp-stat-icon rp-tone-${stat.tone}`}>
                <Icon size={21} />
              </div>
              <div className="rp-stat-copy">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.delta}</small>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rp-dashboard-grid">
        <section className="rp-card rp-appointments-card">
          <div className="rp-card-head">
            <div>
              <h2>Today's appointments</h2>
              <p>Keep your schedule on track</p>
            </div>
            <button
              className="rp-link-button"
              onClick={() => go("/doctor/appointments")}
            >
              View all <ChevronRight size={16} />
            </button>
          </div>

          <div className="rp-appointment-list">
            {todayAppointments.length ? (
              todayAppointments.map((item) => (
                <div className="rp-appointment-row" key={item.id}>
                  <div className="rp-time">
                    <Clock3 size={14} />
                    {item.time}
                  </div>
                  <Avatar name={item.patientName} small />
                  <div className="rp-appointment-person">
                    <strong>{item.patientName}</strong>
                    <span>{item.reason}</span>
                  </div>
                  <Status value={item.status} />
                </div>
              ))
            ) : (
              <Empty
                title="No appointments today"
                detail="Appointments will appear here when they are recorded."
              />
            )}
          </div>
        </section>

        <section className="rp-card rp-week-card">
          <div className="rp-card-head">
            <div>
              <h2>Weekly appointments</h2>
              <p>Sessions recorded this week</p>
            </div>
            <span className="rp-soft-badge">This week</span>
          </div>

          <div className="rp-bars">
            {week.map((item) => (
              <div className="rp-bar-column" key={item.day}>
                <span>{item.count}</span>
                <div className="rp-bar-track">
                  <div
                    className="rp-bar"
                    style={{
                      height: `${Math.max(8, (item.count / maxCount) * 100)}%`,
                    }}
                  />
                </div>
                <small>{item.day}</small>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rp-card rp-recent-card">
        <div className="rp-card-head">
          <div>
            <h2>My patients</h2>
            <p>Patients assigned to your care</p>
          </div>
          <button
            className="rp-link-button"
            onClick={() => go("/doctor/patients")}
          >
            All patients <ChevronRight size={16} />
          </button>
        </div>

        <div className="rp-recent-grid">
          {recentPatients.length ? (
            recentPatients.map((patient) => (
              <button
                className="rp-recent-patient"
                key={patient.id}
                onClick={() => go("/doctor/patients")}
              >
                <Avatar name={patient.name} />
                <span>
                  <strong>{patient.name}</strong>
                  <small>{patient.condition}</small>
                </span>
                <em>{patient.lastVisit}</em>
                <ChevronRight size={16} />
              </button>
            ))
          ) : (
            <Empty
              title="No assigned patients"
              detail="Patients linked to your recovery plans will appear here."
            />
          )}
        </div>
      </section>

      <LoadingNote loading={loading} />
    </div>
  );
}

/* =====================================================
   APPOINTMENTS
===================================================== */

function Appointments({ data, refresh, busy, setBusy }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const items = data.filter((item) => {
    const matchesStatus =
      filter === "All" ||
      normalizeStatus(item.status) === normalizeStatus(filter);

    const matchesQuery =
      `${item.patientName} ${item.reason} ${item.date}`
        .toLowerCase()
        .includes(query.toLowerCase());

    return matchesStatus && matchesQuery;
  });

  async function changeStatus(item, status) {
    setBusy(item.id);
    setError("");

    try {
      await updateDoctorAppointmentStatus(item.id, status);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="rp-page">
      <PageTitle
        title="Appointments"
        description="Manage bookings and keep every session organized."
      />

      <ErrorNotice error={error} />

      <section className="rp-card">
        <div className="rp-toolbar">
          <div className="rp-search rp-search--inline">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patient or appointment"
            />
          </div>

          <div className="rp-filter">
            <Filter size={16} />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter appointments"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        {items.length ? (
          <div className="rp-table-wrap">
            <table className="rp-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date &amp; time</th>
                  <th>Session</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="rp-table-person">
                        <Avatar name={item.patientName} small />
                        <span>
                          <strong>{item.patientName}</strong>
                          <small>{item.reason}</small>
                        </span>
                      </div>
                    </td>

                    <td>
                      {item.date}
                      <small className="rp-cell-sub">{item.time}</small>
                    </td>

                    <td>{item.type}</td>

                    <td><Status value={item.status} /></td>

                    <td>
                      <select
                        className="rp-action-select"
                        value={item.status}
                        disabled={busy === item.id}
                        onChange={(event) =>
                          changeStatus(item, event.target.value)
                        }
                        aria-label={`Update ${item.patientName} appointment`}
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title="No matching appointments"
            detail="Try another search or status filter."
          />
        )}
      </section>
    </div>
  );
}

/* =====================================================
   PATIENTS
===================================================== */

function Patients({ data, go }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const items = data.filter((patient) => {
    const matchesQuery =
      `${patient.name} ${patient.condition} ${patient.email}`
        .toLowerCase()
        .includes(query.toLowerCase());

    return (
      matchesQuery &&
      (status === "All" || patient.status === status)
    );
  });

  return (
    <div className="rp-page">
      <PageTitle
        title="My patients"
        description="Review patient details and follow recovery milestones."
        action={
          <span className="rp-soft-badge">
            <Users size={15} /> {items.length} patients
          </span>
        }
      />

      <section className="rp-card">
        <div className="rp-toolbar">
          <div className="rp-search rp-search--inline">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, condition, email"
            />
          </div>

          <div className="rp-filter">
            <Filter size={16} />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option>All</option>
              <option>Active</option>
              <option>Needs review</option>
              <option>Completed</option>
              <option>Paused</option>
            </select>
          </div>
        </div>

        {items.length ? (
          <div className="rp-patient-grid">
            {items.map((patient) => (
              <article className="rp-patient-card" key={patient.id}>
                <div className="rp-patient-card-top">
                  <Avatar name={patient.name} />
                  <Status value={patient.status} />
                </div>

                <h3>{patient.name}</h3>
                <p>{patient.condition}</p>

                <div className="rp-patient-email">
                  <Mail size={14} />
                  {patient.email || "Email not available"}
                </div>

                <div className="rp-progress-head">
                  <span>Recovery progress</span>
                  <strong>{patient.progress}%</strong>
                </div>

                <div className="rp-progress-track">
                  <span
                    style={{
                      width: `${Math.min(100, Math.max(0, patient.progress))}%`,
                    }}
                  />
                </div>

                <div className="rp-patient-foot">
                  <small>Last visit: {patient.lastVisit}</small>
                  <button
                    className="rp-link-button"
                    onClick={() => go("/doctor/treatment-plans")}
                  >
                    View care plan <ChevronRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Empty
            title="No patients found"
            detail="No assigned patient records match your search."
          />
        )}
      </section>
    </div>
  );
}

/* =====================================================
   TREATMENT PLANS
===================================================== */

function TreatmentPlans({ data, patients, refresh, busy, setBusy }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    title: "",
    clinicalNotes: "",
    goals: "",
    reviewDate: "",
  });

  const items = data.filter((plan) =>
    `${plan.patientName} ${plan.title} ${plan.phase}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  async function review(plan) {
    const status =
      normalizeStatus(plan.status) === "needs review"
        ? "Active"
        : "Needs review";

    setBusy(plan.id);
    setError("");

    try {
      await updateTreatmentPlan(plan.id, { status });
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy("");
    }
  }

  async function removePlan(plan) {
    if (!window.confirm(`Delete "${plan.title}"?`)) return;

    setBusy(plan.id);
    setError("");

    try {
      await deleteTreatmentPlan(plan.id);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy("");
    }
  }

  async function submitPlan(event) {
    event.preventDefault();
    setError("");

    if (!form.patientId || !form.title.trim()) {
      setError("Select a patient and enter a plan title.");
      return;
    }

    setBusy("create");

    try {
      await createTreatmentPlan({
        patientId: form.patientId,
        title: form.title.trim(),
        clinicalNotes: form.clinicalNotes.trim(),
        goals: form.goals
          .split("\n")
          .map((goal) => goal.trim())
          .filter(Boolean),
        reviewDate: form.reviewDate || undefined,
        status: "Active",
        progress: 0,
      });

      setShowForm(false);
      setForm({
        patientId: "",
        title: "",
        clinicalNotes: "",
        goals: "",
        reviewDate: "",
      });

      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="rp-page">
      <PageTitle
        title="Treatment plans"
        description="Track personalized recovery journeys and plan reviews."
        action={
          <button
            className="rp-primary-button"
            onClick={() => setShowForm((value) => !value)}
          >
            <Plus size={17} /> Create plan
          </button>
        }
      />

      <ErrorNotice error={error} />

      {showForm && (
        <section className="rp-card rp-settings-card">
          <div className="rp-card-head">
            <div>
              <h2>Create recovery plan</h2>
              <p>Assign a plan to a patient in your care list.</p>
            </div>
            <button
              className="rp-icon-button"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>

          {patients.length === 0 ? (
            <Empty
              title="No assigned patients"
              detail="A patient must be available in your care list before creating a plan."
            />
          ) : (
            <form className="rp-settings-form" onSubmit={submitPlan}>
              <div className="rp-form-grid">
                <label className="rp-field">
                  Patient
                  <select
                    value={form.patientId}
                    onChange={(event) =>
                      setForm((old) => ({
                        ...old,
                        patientId: event.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rp-field">
                  Plan title
                  <input
                    value={form.title}
                    onChange={(event) =>
                      setForm((old) => ({
                        ...old,
                        title: event.target.value,
                      }))
                    }
                    required
                    maxLength={120}
                  />
                </label>

                <label className="rp-field rp-field--full">
                  Clinical notes
                  <textarea
                    rows="3"
                    value={form.clinicalNotes}
                    onChange={(event) =>
                      setForm((old) => ({
                        ...old,
                        clinicalNotes: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="rp-field rp-field--full">
                  Goals, one per line
                  <textarea
                    rows="3"
                    value={form.goals}
                    onChange={(event) =>
                      setForm((old) => ({
                        ...old,
                        goals: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="rp-field">
                  Review date
                  <input
                    type="date"
                    value={form.reviewDate}
                    onChange={(event) =>
                      setForm((old) => ({
                        ...old,
                        reviewDate: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <div className="rp-form-actions">
                <button
                  type="button"
                  className="rp-secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  className="rp-primary-button"
                  disabled={busy === "create"}
                  type="submit"
                >
                  <Save size={16} />
                  {busy === "create" ? "Saving…" : "Save plan"}
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      <section className="rp-card">
        <div className="rp-toolbar">
          <div className="rp-search rp-search--inline">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search plans or patients"
            />
          </div>
          <span className="rp-soft-badge">{items.length} plans</span>
        </div>

        {items.length ? (
          <div className="rp-plan-list">
            {items.map((plan) => (
              <article className="rp-plan-row" key={plan.id}>
                <div className="rp-plan-icon">
                  <ClipboardList size={21} />
                </div>

                <div className="rp-plan-main">
                  <div className="rp-plan-title">
                    <h3>{plan.title}</h3>
                    <Status value={plan.status} />
                  </div>

                  <p>
                    {plan.patientName} <span>•</span> {plan.phase}
                  </p>

                  <div className="rp-progress-track">
                    <span
                      style={{
                        width: `${Math.min(100, Math.max(0, plan.progress))}%`,
                      }}
                    />
                  </div>

                  <small>{plan.progress}% completed</small>
                </div>

                <div className="rp-plan-review">
                  <small>Next review</small>
                  <strong>{plan.nextReview}</strong>

                  <button
                    className="rp-secondary-button"
                    disabled={busy === plan.id}
                    onClick={() => review(plan)}
                  >
                    {normalizeStatus(plan.status) === "needs review"
                      ? "Mark active"
                      : "Flag review"}
                  </button>

                  <button
                    className="rp-link-button"
                    disabled={busy === plan.id}
                    onClick={() => removePlan(plan)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Empty
            title="No treatment plans found"
            detail="Create a plan or try a different search."
          />
        )}
      </section>
    </div>
  );
}

/* =====================================================
   EXERCISE LIBRARY
===================================================== */

function Exercises({ data }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const items = data.filter((exercise) => {
    const matchesQuery =
      `${exercise.title} ${exercise.area} ${exercise.category}`
        .toLowerCase()
        .includes(query.toLowerCase());

    return (
      matchesQuery &&
      (category === "All" || exercise.category === category)
    );
  });

  return (
    <div className="rp-page">
      <PageTitle
        title="Exercise library"
        description="Browse movements available in your exercise library."
        action={
          <span className="rp-soft-badge">
            <Dumbbell size={15} /> {items.length} exercises
          </span>
        }
      />

      <section className="rp-exercise-grid">
        <div className="rp-toolbar rp-toolbar--wide">
          <div className="rp-search rp-search--inline">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search exercises"
            />
          </div>

          <div className="rp-filter">
            <Filter size={16} />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>All</option>
              <option>Mobility</option>
              <option>Strength</option>
              <option>Flexibility</option>
            </select>
          </div>
        </div>

        {items.map((exercise, index) => (
          <article className="rp-exercise-card" key={exercise.id}>
            <div className={`rp-exercise-art rp-exercise-art--${index % 4}`}>
              <Activity size={33} />
              <span>{exercise.area}</span>
            </div>

            <div className="rp-exercise-content">
              <div className="rp-exercise-meta">
                <span>{exercise.category}</span>
                <span>{exercise.duration}</span>
              </div>

              <h3>{exercise.title}</h3>
              <p>{exercise.level} · {exercise.area}</p>
            </div>
          </article>
        ))}

        {!items.length && (
          <div className="rp-card">
            <Empty
              title="No exercises found"
              detail="No matching exercises were returned by the backend."
            />
          </div>
        )}
      </section>
    </div>
  );
}

/* =====================================================
   MESSAGES
===================================================== */

function Messages({ data }) {
  const [selectedId, setSelectedId] = useState("");
  const current =
    data.find((item) => item.id === selectedId) || data[0] || null;

  return (
    <div className="rp-page">
      <PageTitle
        title="Messages"
        description="Review patient messages from your connected account."
      />

      <section className="rp-card rp-messages-layout">
        <div className="rp-message-list">
          <div className="rp-message-list-head">
            <strong>Conversations</strong>
            <span>{data.filter((item) => item.unread).length} unread</span>
          </div>

          {data.map((message) => (
            <button
              className={`rp-message-item ${
                current?.id === message.id ? "is-selected" : ""
              }`}
              key={message.id}
              onClick={() => setSelectedId(message.id)}
            >
              <Avatar name={message.patientName} small />
              <span>
                <strong>{message.patientName}</strong>
                <small>{message.message}</small>
              </span>
              <time>{message.time}</time>
              {message.unread && <i />}
            </button>
          ))}

          {!data.length && (
            <Empty
              title="No messages"
              detail="No messages were returned by the messaging API."
            />
          )}
        </div>

        <div className="rp-message-thread">
          {current ? (
            <>
              <div className="rp-thread-head">
                <Avatar name={current.patientName} />
                <span>
                  <strong>{current.patientName}</strong>
                  <small>Patient conversation</small>
                </span>
                <MoreHorizontal size={19} />
              </div>

              <div className="rp-thread-body">
                <div className="rp-chat-date">{current.time}</div>
                <div className="rp-chat-bubble">
                  {current.message || "Message content unavailable."}
                  <small>{current.time}</small>
                </div>
              </div>
            </>
          ) : (
            <Empty
              title="Select a conversation"
              detail="Choose a patient message to view its content."
            />
          )}

          <p className="rp-inline-note">
            Reply sending and full conversation history need a verified
            messaging API workflow.
          </p>
        </div>
      </section>
    </div>
  );
}

/* =====================================================
   REPORTS
   Derived from actual recovery plan records.
===================================================== */

function Reports({ plans }) {
  const average = plans.length
    ? Math.round(
        plans.reduce((total, plan) => total + plan.progress, 0) /
          plans.length
      )
    : 0;

  const completed = plans.filter(
    (plan) => normalizeStatus(plan.status) === "completed"
  ).length;

  const needsReview = plans.filter(
    (plan) => normalizeStatus(plan.status) === "needs review"
  ).length;

  const distribution = [
    { label: "0 to 24%", min: 0, max: 24 },
    { label: "25 to 49%", min: 25, max: 49 },
    { label: "50 to 74%", min: 50, max: 74 },
    { label: "75 to 100%", min: 75, max: 100 },
  ].map((bucket) => ({
    ...bucket,
    count: plans.filter(
      (plan) => plan.progress >= bucket.min && plan.progress <= bucket.max
    ).length,
  }));

  return (
    <div className="rp-page">
      <PageTitle
        title="Reports & progress"
        description="Review recorded recovery progress and treatment priorities."
        action={
          <button className="rp-secondary-button" onClick={() => window.print()}>
            <FileText size={16} /> Print report
          </button>
        }
      />

      <div className="rp-report-stats">
        <div className="rp-card">
          <span className="rp-muted">Average recorded progress</span>
          <strong className="rp-report-number">{average}%</strong>
          <div className="rp-progress-track">
            <span style={{ width: `${average}%` }} />
          </div>
          <small>Calculated from saved recovery plans.</small>
        </div>

        <div className="rp-card">
          <span className="rp-muted">Completed plans</span>
          <strong className="rp-report-number">{completed}</strong>
          <p className="rp-chart-caption">
            Plans marked as completed.
          </p>
        </div>

        <div className="rp-card">
          <span className="rp-muted">Plans needing review</span>
          <strong className="rp-report-number">{needsReview}</strong>
          <p className="rp-chart-caption">
            Plans flagged for clinical review.
          </p>
        </div>
      </div>

      <section className="rp-card">
        <div className="rp-card-head">
          <div>
            <h2>Recovery distribution</h2>
            <p>Plans grouped by recorded progress</p>
          </div>
        </div>

        <div className="rp-bars">
          {distribution.map((bucket) => (
            <div className="rp-bar-column" key={bucket.label}>
              <span>{bucket.count}</span>
              <div className="rp-bar-track">
                <div
                  className="rp-bar"
                  style={{
                    height: `${
                      plans.length
                        ? Math.max(8, (bucket.count / plans.length) * 100)
                        : 8
                    }%`,
                  }}
                />
              </div>
              <small>{bucket.label}</small>
            </div>
          ))}
        </div>
      </section>

      <p className="rp-inline-note">
        These are administrative progress summaries, not independent clinical
        assessments.
      </p>
    </div>
  );
}

/* =====================================================
   PROFILE
   Backend supports GET profile only in supplied routes.
===================================================== */

function SettingsPage({ data, loading, error, refresh }) {
  const profile = data || {};

  return (
    <div className="rp-page">
      <PageTitle
        title="Profile & settings"
        description="Review your professional details from your account."
      />

      <ErrorNotice error={error} retry={refresh} />

      <section className="rp-card rp-settings-card">
        <div className="rp-profile-banner">
          <div className="rp-profile-avatar">
            <Stethoscope size={28} />
          </div>

          <div>
            <h2>{profile.name || "Physiotherapist profile"}</h2>
            <p>{profile.specialization || "Physiotherapist"}</p>
            <span className="rp-soft-badge">
              <CheckCircle2 size={14} /> Account profile
            </span>
          </div>
        </div>

        {loading ? (
          <p className="rp-inline-note">Loading profile…</p>
        ) : (
          <div className="rp-settings-form">
            <div className="rp-form-grid">
              <label className="rp-field">
                Full name
                <input value={profile.name || ""} readOnly />
              </label>

              <label className="rp-field">
                Email address
                <input value={profile.email || ""} readOnly />
              </label>

              <label className="rp-field">
                Phone number
                <input value={profile.phone || ""} readOnly />
              </label>

              <label className="rp-field">
                Specialization
                <input value={profile.specialization || ""} readOnly />
              </label>
            </div>
          </div>
        )}
      </section>

      <p className="rp-inline-note">
        Editing profile details requires a backend update endpoint. The
        currently supplied API supports reading profile information.
      </p>
    </div>
  );
}

/* =====================================================
   MAIN DOCTOR PANEL
===================================================== */

export default function DoctorPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    ["token", "accessToken", "authToken", "user", "currentUser"].forEach(
      (key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      }
    );

    navigate("/login", { replace: true });
  };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState("");

  const [overview, setOverview] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [plans, setPlans] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState("");

  const currentNav = NAV.find((item) =>
    item.end
      ? item.to === location.pathname
      : item.to === location.pathname
  ) || NAV[0];

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    const jobs = [
      {
        key: "overview",
        request: getDoctorOverview,
        setter: (result) => setOverview(unwrapObject(result, "overview")),
      },
      {
        key: "appointments",
        request: getDoctorAppointments,
        setter: (result) =>
          setAppointments(
            unwrapList(result, "appointments").map(mapAppointment)
          ),
      },
      {
        key: "patients",
        request: getDoctorPatients,
        setter: (result) =>
          setPatients(unwrapList(result, "patients").map(mapPatient)),
      },
      {
        key: "plans",
        request: getTreatmentPlans,
        setter: (result) =>
          setPlans(unwrapList(result, "plans").map(mapPlan)),
      },
      {
        key: "exercises",
        request: getExerciseLibrary,
        setter: (result) =>
          setExercises(unwrapList(result, "exercises").map(mapExercise)),
      },
      {
        key: "messages",
        request: getDoctorMessages,
        setter: (result) =>
          setMessages(unwrapList(result, "messages").map(mapMessage)),
      },
      {
        key: "profile",
        request: getDoctorProfile,
        setter: (result) => setProfile(unwrapObject(result, "profile")),
      },
    ];

    const results = await Promise.all(
      jobs.map(async (job) => {
        try {
          const result = await job.request();
          job.setter(result);
          return { key: job.key, ok: true };
        } catch (err) {
          return {
            key: job.key,
            ok: false,
            message: getErrorMessage(err),
          };
        }
      })
    );

    const failed = results.filter((result) => !result.ok);

    if (failed.length) {
      setError(
        `Some data could not be loaded: ${failed
          .map((item) => `${item.key}: ${item.message}`)
          .join(" | ")}`
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    document.documentElement.dataset.rehabicsDoctorTheme = dark
      ? "dark"
      : "light";

    return () => {
      delete document.documentElement.dataset.rehabicsDoctorTheme;
    };
  }, [dark]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const quickResults = useMemo(() => {
    if (!globalSearch.trim()) return [];

    const query = globalSearch.toLowerCase();

    return [
      ...patients.map((patient) => ({
        ...patient,
        searchName: patient.name,
        searchDetail: patient.condition,
        target: "/doctor/patients",
      })),
      ...appointments.map((appointment) => ({
        ...appointment,
        searchName: appointment.patientName,
        searchDetail: appointment.reason,
        target: "/doctor/appointments",
      })),
    ]
      .filter((item) =>
        `${item.searchName} ${item.searchDetail || ""}`
          .toLowerCase()
          .includes(query)
      )
      .slice(0, 5);
  }, [globalSearch, patients, appointments]);

  return (
    <div className={`rp-shell ${dark ? "rp-shell--dark" : ""}`}>
      <aside className={`rp-sidebar ${mobileOpen ? "rp-sidebar--open" : ""}`}>
        <div className="rp-brand">
          <div className="rp-brand-mark">
            <Activity size={23} />
          </div>

          <span>
            rehabics
            <small>Move better. Live brighter.</small>
          </span>

          <button
            className="rp-mobile-close rp-icon-button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="rp-workspace">
          <div className="rp-workspace-dot" />
          <span>Physiotherapy workspace</span>
          <ChevronRight size={15} />
        </div>

        <nav className="rp-nav" aria-label="Doctor navigation">
          {NAV.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rp-nav-link ${isActive ? "is-active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="rp-sidebar-help">
          <div className="rp-help-icon">
            <HeartPulse size={18} />
          </div>
          <strong>Need a hand?</strong>
          <p>Visit your support center for dashboard guidance.</p>
        </div>

        <button
          className="rp-doctor-profile"
          onClick={() => navigate("/doctor/settings")}
        >
          <Avatar name={profile.name || "Physiotherapist"} />
          <span>
            <strong>{profile.name || "Physiotherapist"}</strong>
            <small>{profile.specialization || "Clinical workspace"}</small>
          </span>
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          className="rp-nav-link rp-logout-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {mobileOpen && (
        <button
          className="rp-mobile-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <main className="rp-main">
        <header className="rp-topbar">
          <div className="rp-topbar-left">
            <button
              className="rp-menu-button rp-icon-button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>

            <div className="rp-search rp-global-search">
              <Search size={18} />

              <input
                value={globalSearch}
                onChange={(event) => setGlobalSearch(event.target.value)}
                placeholder="Search patients or appointments…"
                aria-label="Search patients and appointments"
              />

              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch("")}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}

              {quickResults.length > 0 && (
                <div className="rp-search-results">
                  {quickResults.map((item, index) => (
                    <button
                      key={`${item.id}-${index}`}
                      onClick={() => {
                        setGlobalSearch("");
                        navigate(item.target);
                      }}
                    >
                      <Avatar name={item.searchName} small />
                      <span>
                        <strong>{item.searchName}</strong>
                        <small>{item.searchDetail}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rp-topbar-actions">
            <button
              className="rp-theme-toggle"
              onClick={() => setDark((value) => !value)}
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {dark ? <Moon size={17} /> : <Sun size={17} />}
              <span className="rp-toggle-knob" />
            </button>

            <button
              className="rp-icon-button rp-notification-button"
              onClick={() => navigate("/doctor/messages")}
              aria-label="Open messages"
            >
              <Bell size={19} />
              {messages.some((item) => item.unread) && <i />}
            </button>

            <button
              className="rp-top-profile"
              onClick={() => navigate("/doctor/settings")}
            >
              <Avatar name={profile.name || "Physiotherapist"} small />
              <span>
                <strong>{profile.name || "Physiotherapist"}</strong>
                <small>Physiotherapy</small>
              </span>
              <ChevronRight size={15} />
            </button>
          </div>
        </header>

        <div className="rp-content">
          <ErrorNotice error={error} retry={refresh} />

          <Routes>
            <Route
              index
              element={
                <Overview
                  data={overview}
                  appointments={appointments}
                  patients={patients}
                  plans={plans}
                  loading={loading}
                  go={navigate}
                />
              }
            />

            <Route
              path="appointments"
              element={
                <Appointments
                  data={appointments}
                  refresh={refresh}
                  busy={busy}
                  setBusy={setBusy}
                />
              }
            />

            <Route
              path="patients"
              element={<Patients data={patients} go={navigate} />}
            />

            <Route
              path="treatment-plans"
              element={
                <TreatmentPlans
                  data={plans}
                  patients={patients}
                  refresh={refresh}
                  busy={busy}
                  setBusy={setBusy}
                />
              }
            />

            <Route
              path="exercises"
              element={<Exercises data={exercises} />}
            />

            <Route
              path="messages"
              element={<Messages data={messages} />}
            />

            <Route
              path="reports"
              element={<Reports plans={plans} />}
            />

            <Route
              path="settings"
              element={
                <SettingsPage
                  data={profile}
                  loading={loading}
                  error={error}
                  refresh={refresh}
                />
              }
            />

            <Route
              path="*"
              element={
                <Overview
                  data={overview}
                  appointments={appointments}
                  patients={patients}
                  plans={plans}
                  loading={loading}
                  go={navigate}
                />
              }
            />
          </Routes>
        </div>

        <footer className="rp-footer">
          <span>© {new Date().getFullYear()} Rehabics. Care that moves with you.</span>
          <button className="rp-link-button" onClick={refresh} disabled={loading}>
            <RefreshCw size={14} />
            {loading ? "Refreshing…" : "Refresh data"}
          </button>
        </footer>
      </main>
    </div>
  );
}
