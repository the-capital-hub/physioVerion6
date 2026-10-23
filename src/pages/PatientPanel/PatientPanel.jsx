import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Sun,
  UserRound,
  Users,
  X,
  AlertCircle,
  LoaderCircle,
  Search,
  ArrowUpRight,
  Clock3,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
} from "lucide-react";
import {
  getPatientResource,
  updatePatientProfile,
  updateExerciseCompletion,
} from "../../services/patientApi";
import "./PatientPanel.css";

const PatientContext = createContext(null);
const NAV_ITEMS = [
  { to: "/patient", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/patient/appointments", label: "My appointments", icon: CalendarDays },
  { to: "/patient/exercises", label: "Exercise plan", icon: Dumbbell },
  { to: "/patient/progress", label: "Recovery progress", icon: TrendingUp },
  { to: "/patient/therapist", label: "My physiotherapist", icon: Users },
  { to: "/patient/profile", label: "My profile", icon: UserRound },
];

const demoData = {
  me: {
    name: "Alex Morgan",
    email: "alex@example.com",
    phone: "",
    condition: "Lower back discomfort",
    recoveryPercent: 68,
  },
  appointments: [
    {
      _id: "demo-1",
      therapistName: "Dr. Priya Sharma",
      type: "Progress review",
      date: "2026-10-26T10:30:00",
      mode: "Online",
      status: "Upcoming",
    },
    {
      _id: "demo-2",
      therapistName: "Dr. Priya Sharma",
      type: "Mobility session",
      date: "2026-10-19T11:00:00",
      mode: "Clinic",
      status: "Completed",
    },
  ],
  exercises: [
    {
      _id: "demo-e1",
      name: "Cat cow stretch",
      description: "Move gently through a comfortable range.",
      sets: 2,
      reps: 10,
      completed: true,
    },
    {
      _id: "demo-e2",
      name: "Knee to chest",
      description: "Hold each side without forcing the movement.",
      sets: 2,
      reps: 8,
      completed: false,
    },
    {
      _id: "demo-e3",
      name: "Pelvic tilt",
      description: "Keep your breathing relaxed throughout.",
      sets: 3,
      reps: 10,
      completed: false,
    },
  ],
  progress: {
    recoveryPercent: 68,
    completedSessions: 8,
    totalSessions: 12,
    weeklyActivity: [
      { label: "Mon", value: 35 },
      { label: "Tue", value: 58 },
      { label: "Wed", value: 45 },
      { label: "Thu", value: 76 },
      { label: "Fri", value: 60 },
      { label: "Sat", value: 88 },
      { label: "Sun", value: 52 },
    ],
  },
  therapist: {
    name: "Dr. Priya Sharma",
    specialty: "Musculoskeletal Physiotherapy",
    experience: "8 years",
    email: "care@rehabics.com",
    phone: "",
    availability: "Contact your clinic to confirm availability",
  },
};

function unwrapList(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}
function formatDate(value) {
  if (!value) return "Date to be confirmed";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}
function greetingName(person) {
  return (
    person?.firstName ||
    person?.name?.split(" ")[0] ||
    person?.fullName?.split(" ")[0] ||
    "there"
  );
}
function usePatient() {
  return useContext(PatientContext);
}

export default function PatientPanel() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("rehabics-patient-theme") === "dark",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState(demoData);
  const [loading, setLoading] = useState(true);
  const [apiWarning, setApiWarning] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("rehabics-patient-theme", dark ? "dark" : "light");
    document.documentElement.dataset.rehabicsPatientTheme = dark
      ? "dark"
      : "light";
  }, [dark]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const resources = [
        "me",
        "appointments",
        "exercises",
        "progress",
        "therapist",
      ];
      const results = await Promise.allSettled(
        resources.map((key) => getPatientResource(key)),
      );
      if (!active) return;
      const next = { ...demoData };
      let failed = false;
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value != null)
          next[resources[index]] = result.value;
        else if (result.status === "rejected") failed = true;
      });
      // Demo data is only a visual fallback. Replace endpoint paths in patientApi.js to connect your API.
      setData(next);
      setApiWarning(
        failed
          ? "Some patient data could not be loaded from the API. Showing sample fallback data for unavailable sections. Check the endpoint paths in patientApi.js."
          : "",
      );
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const context = useMemo(
    () => ({
      data,
      loading,
      apiWarning,
      refresh: () => setRefreshKey((v) => v + 1),
      setData,
    }),
    [data, loading, apiWarning],
  );
  const hideMobile = () => setMobileOpen(false);
  return (
    <PatientContext.Provider value={context}>
      <div className={`rp-shell ${dark ? "rp-dark" : "rp-light"}`}>
        {mobileOpen && (
          <button
            className="rp-scrim"
            aria-label="Close navigation"
            onClick={hideMobile}
          />
        )}
        <aside className={`rp-sidebar ${mobileOpen ? "rp-sidebar-open" : ""}`}>
          <div className="rp-brand">
            <span className="rp-brand-mark">
              <HeartPulse size={22} />
            </span>
            <span>
              rehabics<span className="rp-brand-dot">.</span>
              <small> PATIENT SPACE</small>
            </span>
            <button
              className="rp-icon-btn rp-mobile-close"
              aria-label="Close menu"
              onClick={hideMobile}
            >
              <X size={19} />
            </button>
          </div>
          <div className="rp-side-caption">YOUR CARE</div>
          <nav className="rp-nav">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={hideMobile}
                className={({ isActive }) =>
                  `rp-nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
                {label === "My appointments" && (
                  <ChevronRight className="rp-nav-chevron" size={15} />
                )}
              </NavLink>
            ))}
          </nav>
          <div className="rp-sidebar-bottom">
            <div className="rp-help-card">
              <span className="rp-help-icon">
                <MessageCircle size={18} />
              </span>
              <strong>Need a hand?</strong>
              <p>Our care team is here to help you.</p>
              <a href="mailto:hello@rehabics.com">
                Contact support <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="rp-user-mini">
              <div className="rp-avatar">
                {String(greetingName(data.me)).slice(0, 1).toUpperCase()}
              </div>
              <div className="rp-user-mini-copy">
                <strong>
                  {data.me?.name || data.me?.fullName || "Patient account"}
                </strong>
                <span>Patient account</span>
              </div>
              <button
                className="rp-icon-btn"
                aria-label="Account options"
                onClick={() => {
                  window.location.href = "/patient/profile";
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </aside>
        <main className="rp-main">
          <header className="rp-topbar">
            <button
              className="rp-icon-btn rp-mobile-menu"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="rp-breadcrumb">
              <span>Patient space</span>
              <span className="rp-breadcrumb-slash">/</span>
              <strong>
                {NAV_ITEMS.find((item) => item.to === location.pathname)
                  ?.label ||
                  (location.pathname === "/patient" ? "Overview" : "Your care")}
              </strong>
            </div>
            <div className="rp-top-actions">
              <span className="rp-secure">
                <span /> Secure patient portal
              </span>
              <button
                className="rp-icon-btn"
                aria-label={
                  dark ? "Switch to light theme" : "Switch to dark theme"
                }
                onClick={() => setDark((v) => !v)}
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="rp-avatar rp-avatar-small">
                {String(greetingName(data.me)).slice(0, 1).toUpperCase()}
              </div>
            </div>
          </header>
          {apiWarning && (
            <div className="rp-api-warning">
              <AlertCircle size={17} />
              <span>{apiWarning}</span>
              <button onClick={() => setRefreshKey((v) => v + 1)}>Retry</button>
            </div>
          )}
          {loading && (
            <div className="rp-loading">
              <LoaderCircle className="rp-spin" size={20} /> Loading your care
              information…
            </div>
          )}
          <div className="rp-content">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="exercises" element={<Exercises />} />
              <Route path="progress" element={<Progress />} />
              <Route path="therapist" element={<Therapist />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/patient" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </PatientContext.Provider>
  );
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="rp-page-heading">
      <div>
        <div className="rp-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
function CardTitle({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="rp-card-title">
      <div className="rp-card-title-icon">
        <Icon size={18} />
      </div>
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && <div className="rp-card-title-action">{action}</div>}
    </div>
  );
}
function EmptyState({ title, text }) {
  return (
    <div className="rp-empty">
      <span>
        <ClipboardList size={23} />
      </span>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

function Dashboard() {
  const { data, loading } = usePatient();
  const appointments = unwrapList(data.appointments);
  const exercises = unwrapList(data.exercises);
  const upcoming = appointments.find(
    (item) =>
      !/completed|cancelled/i.test(item.status || "") &&
      new Date(item.date || item.startTime || item.appointmentDate) >=
        new Date(),
  );
  const done = exercises.filter(
    (item) => item.completed || item.isCompleted,
  ).length;
  const recovery =
    data.progress?.recoveryPercent ?? data.me?.recoveryPercent ?? 0;
  return (
    <>
      <PageHeading
        eyebrow="YOUR RECOVERY JOURNEY"
        title={`Good day, ${greetingName(data.me)} 👋`}
        description="Small steps every day add up. Here is your care summary."
        action={
          <span className="rp-date-chip">
            <CalendarDays size={15} />{" "}
            {new Date().toLocaleDateString(undefined, {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
        }
      />
      <section className="rp-welcome-banner">
        <div className="rp-welcome-copy">
          <span className="rp-banner-kicker">
            <Activity size={14} /> YOUR PLAN, YOUR PACE
          </span>
          <h2>Progress is built one step at a time.</h2>
          <p>
            Keep following your prescribed plan and reach out to your
            physiotherapist if something does not feel right.
          </p>
          <NavLink to="/patient/exercises" className="rp-primary-btn">
            View exercise plan <ChevronRight size={16} />
          </NavLink>
        </div>
        <div className="rp-banner-art">
          <div className="rp-art-ring rp-art-ring-one" />
          <div className="rp-art-ring rp-art-ring-two" />
          <div className="rp-art-center">
            <HeartPulse size={52} strokeWidth={1.4} />
          </div>
          <span className="rp-art-pill rp-art-pill-one">
            <CheckCircle2 size={15} /> Keep going
          </span>
          <span className="rp-art-pill rp-art-pill-two">
            <TrendingUp size={15} /> Your journey
          </span>
        </div>
      </section>
      <section className="rp-stat-grid">
        <StatCard
          icon={CalendarDays}
          label="Upcoming session"
          value={
            upcoming
              ? formatDate(
                  upcoming.date ||
                    upcoming.startTime ||
                    upcoming.appointmentDate,
                ).split(",")[0]
              : "Not scheduled"
          }
          note={
            upcoming
              ? upcoming.type || upcoming.title || "Physiotherapy session"
              : "Book or contact your clinic"
          }
          tone="indigo"
        />
        <StatCard
          icon={CheckCircle2}
          label="Exercises completed"
          value={`${done} / ${exercises.length}`}
          note="Based on your exercise checklist"
          tone="cyan"
        />
        <StatCard
          icon={TrendingUp}
          label="Recovery progress"
          value={`${recovery}%`}
          note="Follow your clinician's guidance"
          tone="emerald"
        />
      </section>
      <section className="rp-dashboard-grid">
        <div className="rp-card rp-appointments-card">
          <CardTitle
            icon={CalendarDays}
            title="Next appointment"
            subtitle="Your upcoming care session"
            action={
              <NavLink className="rp-text-link" to="/patient/appointments">
                All appointments <ArrowUpRight size={14} />
              </NavLink>
            }
          />
          {upcoming ? (
            <AppointmentFeature item={upcoming} />
          ) : (
            <EmptyState
              title="No upcoming appointment"
              text="Your next session will appear here once it is scheduled."
            />
          )}
        </div>
        <div className="rp-card">
          <CardTitle
            icon={Dumbbell}
            title="Today's exercises"
            subtitle="Stay consistent, at your pace"
            action={
              <NavLink className="rp-text-link" to="/patient/exercises">
                View plan <ArrowUpRight size={14} />
              </NavLink>
            }
          />
          {exercises.length ? (
            <div className="rp-mini-exercises">
              {exercises.slice(0, 3).map((item, i) => (
                <div
                  className="rp-mini-exercise"
                  key={item._id || item.id || i}
                >
                  <span
                    className={`rp-check-circle ${item.completed || item.isCompleted ? "done" : ""}`}
                  >
                    {(item.completed || item.isCompleted) && (
                      <CheckCircle2 size={16} />
                    )}
                  </span>
                  <div>
                    <strong>
                      {item.name || item.title || "Prescribed exercise"}
                    </strong>
                    <span>
                      {item.sets || 1} sets ·{" "}
                      {item.reps || item.repetitions || "As prescribed"} reps
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No exercises assigned"
              text="Your physiotherapist's plan will show here."
            />
          )}
        </div>
      </section>
      <section className="rp-card rp-week-card">
        <CardTitle
          icon={Activity}
          title="Your weekly rhythm"
          subtitle="A gentle reminder to keep showing up"
        />
        <div className="rp-week-content">
          <div className="rp-week-message">
            <div className="rp-week-illustration">
              <HeartPulse size={25} />
            </div>
            <div>
              <strong>Consistency over intensity</strong>
              <p>
                Follow the exercise frequency recommended by your
                physiotherapist. Rest when needed and report any new or
                worsening symptoms.
              </p>
            </div>
          </div>
          <div className="rp-week-bars">
            {(
              data.progress?.weeklyActivity || demoData.progress.weeklyActivity
            ).map((day, i) => (
              <div className="rp-week-bar-col" key={day.label || i}>
                <div className="rp-week-bar-track">
                  <span
                    style={{
                      height: `${Math.max(8, Math.min(100, day.value || 0))}%`,
                    }}
                  />
                </div>
                <small>{day.label}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
function StatCard({ icon: Icon, label, value, note, tone }) {
  return (
    <div className={`rp-stat-card tone-${tone}`}>
      <div className="rp-stat-top">
        <span className="rp-stat-icon">
          <Icon size={19} />
        </span>
        <span className="rp-stat-label">{label}</span>
      </div>
      <strong className="rp-stat-value">{value}</strong>
      <span className="rp-stat-note">{note}</span>
    </div>
  );
}
function AppointmentFeature({ item }) {
  return (
    <div className="rp-appointment-feature">
      <div className="rp-appointment-date-icon">
        <CalendarDays size={23} />
      </div>
      <div className="rp-appointment-details">
        <span className="rp-status status-upcoming">
          {item.status || "Upcoming"}
        </span>
        <h3>{item.type || item.title || "Physiotherapy session"}</h3>
        <p>
          {item.therapistName ||
            item.physiotherapist?.name ||
            item.therapist?.name ||
            "Your physiotherapist"}
        </p>
        <div className="rp-appointment-meta">
          <span>
            <Clock3 size={14} />{" "}
            {formatDate(item.date || item.startTime || item.appointmentDate)}
          </span>
          <span>
            <MapPin size={14} />{" "}
            {item.mode || item.appointmentType || "Session"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Appointments() {
  const { data, loading } = usePatient();
  const [filter, setFilter] = useState("All");
  const appointments = unwrapList(data.appointments);
  const filtered = appointments.filter(
    (a) =>
      filter === "All" ||
      String(a.status || "Upcoming").toLowerCase() === filter.toLowerCase(),
  );
  return (
    <>
      <PageHeading
        eyebrow="YOUR SCHEDULE"
        title="My appointments"
        description="Keep track of your sessions and care milestones."
        action={
          <a
            className="rp-primary-btn"
            href="mailto:hello@rehabics.com?subject=Appointment%20request"
          >
            <CalendarDays size={16} /> Request a session
          </a>
        }
      />
      <div className="rp-filter-row">
        <div className="rp-filter-tabs">
          {["All", "Upcoming", "Completed", "Cancelled"].map((f) => (
            <button
              key={f}
              className={filter === f ? "selected" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="rp-muted-text">
          {filtered.length}{" "}
          {filtered.length === 1 ? "appointment" : "appointments"}
        </span>
      </div>
      <div className="rp-card rp-table-card">
        {filtered.length ? (
          <div className="rp-appointment-list">
            {filtered.map((item, i) => (
              <div
                className="rp-appointment-row"
                key={item._id || item.id || i}
              >
                <div className="rp-appointment-date-icon">
                  <CalendarDays size={21} />
                </div>
                <div className="rp-appointment-row-main">
                  <strong>
                    {item.type || item.title || "Physiotherapy session"}
                  </strong>
                  <span>
                    {item.therapistName ||
                      item.physiotherapist?.name ||
                      item.therapist?.name ||
                      "Your physiotherapist"}
                  </span>
                  <small>
                    <Clock3 size={13} />{" "}
                    {formatDate(
                      item.date || item.startTime || item.appointmentDate,
                    )}{" "}
                    · {item.mode || item.appointmentType || "Session"}
                  </small>
                </div>
                <span
                  className={`rp-status ${String(item.status || "Upcoming").toLowerCase() === "completed" ? "status-completed" : String(item.status || "Upcoming").toLowerCase() === "cancelled" ? "status-cancelled" : "status-upcoming"}`}
                >
                  {item.status || "Upcoming"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nothing in this view"
            text={
              loading
                ? "Loading your appointments…"
                : "Appointments matching this filter will appear here."
            }
          />
        )}
      </div>
      <p className="rp-note">
        <AlertCircle size={15} /> To reschedule or cancel, please contact your
        clinic directly until those actions are enabled in your account.
      </p>
    </>
  );
}

function Exercises() {
  const { data, setData } = usePatient();
  const [savingId, setSavingId] = useState(null);
  const [search, setSearch] = useState("");
  const exercises = unwrapList(data.exercises);
  const filtered = exercises.filter((e) =>
    `${e.name || e.title || ""} ${e.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const toggle = async (exercise) => {
    const id = exercise._id || exercise.id;
    const next = !(exercise.completed || exercise.isCompleted);
    setData((old) => ({
      ...old,
      exercises: unwrapList(old.exercises).map((e) =>
        (e._id || e.id) === id
          ? { ...e, completed: next, isCompleted: next }
          : e,
      ),
    }));
    if (!String(id).startsWith("demo-")) {
      try {
        setSavingId(id);
        await updateExerciseCompletion(id, next);
      } catch {
        setData((old) => ({
          ...old,
          exercises: unwrapList(old.exercises).map((e) =>
            (e._id || e.id) === id
              ? { ...e, completed: !next, isCompleted: !next }
              : e,
          ),
        }));
        window.alert(
          "Could not save this update. Please check your connection and try again.",
        );
      } finally {
        setSavingId(null);
      }
    }
  };
  const done = exercises.filter((e) => e.completed || e.isCompleted).length;
  return (
    <>
      <PageHeading
        eyebrow="YOUR HOME PROGRAM"
        title="Exercise plan"
        description="Your prescribed movements, all in one place. Move within your comfort and follow your clinician's instructions."
      />
      <div className="rp-progress-inline">
        <div>
          <span>Plan completion</span>
          <strong>
            {done} of {exercises.length} completed
          </strong>
        </div>
        <div className="rp-progress-track">
          <span
            style={{
              width: `${exercises.length ? (done / exercises.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
      <div className="rp-search-row">
        <label className="rp-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your exercises"
          />
        </label>
        <span className="rp-muted-text">{exercises.length} assigned</span>
      </div>
      <div className="rp-exercise-grid">
        {filtered.map((exercise, i) => {
          const completed = exercise.completed || exercise.isCompleted;
          return (
            <article
              className={`rp-card rp-exercise-card ${completed ? "rp-exercise-done" : ""}`}
              key={exercise._id || exercise.id || i}
            >
              <div className="rp-exercise-top">
                <span className="rp-exercise-art">
                  <Dumbbell size={24} />
                </span>
                <span
                  className={`rp-status ${completed ? "status-completed" : "status-upcoming"}`}
                >
                  {completed ? "Completed" : "To do"}
                </span>
              </div>
              <h3>{exercise.name || exercise.title || `Exercise ${i + 1}`}</h3>
              <p>
                {exercise.description ||
                  exercise.instructions ||
                  "Follow the instructions provided by your physiotherapist."}
              </p>
              <div className="rp-exercise-prescription">
                <div>
                  <strong>{exercise.sets || 1}</strong>
                  <span>Sets</span>
                </div>
                <div>
                  <strong>
                    {exercise.reps || exercise.repetitions || "As advised"}
                  </strong>
                  <span>Reps</span>
                </div>
                <div>
                  <strong>{exercise.duration || "Steady"}</strong>
                  <span>Tempo</span>
                </div>
              </div>
              <button
                className={completed ? "rp-secondary-btn" : "rp-primary-btn"}
                onClick={() => toggle(exercise)}
                disabled={savingId === (exercise._id || exercise.id)}
              >
                {savingId === (exercise._id || exercise.id) ? (
                  "Saving…"
                ) : completed ? (
                  <>
                    <CheckCircle2 size={16} /> Mark as not done
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Mark complete
                  </>
                )}
              </button>
            </article>
          );
        })}
      </div>
      {!filtered.length && (
        <div className="rp-card">
          <EmptyState
            title="No exercises found"
            text="Try another search or ask your physiotherapist whether a plan has been assigned."
          />
        </div>
      )}
      <p className="rp-note">
        <AlertCircle size={15} /> Stop if an exercise causes unusual or
        worsening pain, and contact your physiotherapist for guidance. This
        portal does not replace clinical advice.
      </p>
    </>
  );
}

function Progress() {
  const { data } = usePatient();
  const progress = data.progress || {};
  const recovery = progress.recoveryPercent ?? data.me?.recoveryPercent ?? 0;
  const sessions = progress.completedSessions ?? 0;
  const total = progress.totalSessions ?? 0;
  const bars = progress.weeklyActivity || demoData.progress.weeklyActivity;
  return (
    <>
      <PageHeading
        eyebrow="YOUR MILESTONES"
        title="Recovery progress"
        description="Use these indicators to discuss your journey with your physiotherapist."
      />
      <div className="rp-progress-hero rp-card">
        <div className="rp-progress-copy">
          <span className="rp-eyebrow">RECOVERY OVERVIEW</span>
          <h2>Every step counts.</h2>
          <p>
            Your progress is personal. Your physiotherapist can help interpret
            changes and update your plan when needed.
          </p>
          <div className="rp-progress-legend">
            <span>
              <i className="rp-legend-dot indigo-dot" /> Current progress
            </span>
            <span>
              <i className="rp-legend-dot cyan-dot" /> Weekly activity
            </span>
          </div>
        </div>
        <div
          className="rp-progress-ring"
          style={{
            "--progress": `${Math.max(0, Math.min(100, Number(recovery) || 0))}%`,
          }}
        >
          <div>
            <strong>{recovery}%</strong>
            <span>progress</span>
          </div>
        </div>
      </div>
      <div className="rp-stat-grid rp-stat-grid-two">
        <StatCard
          icon={CheckCircle2}
          label="Sessions completed"
          value={total ? `${sessions} / ${total}` : String(sessions)}
          note="Based on your recorded sessions"
          tone="indigo"
        />
        <StatCard
          icon={Activity}
          label="Weekly activity"
          value={`${bars.length} days`}
          note="Activity indicators supplied by your care record"
          tone="cyan"
        />
      </div>
      <div className="rp-card rp-progress-chart-card">
        <CardTitle
          icon={TrendingUp}
          title="Weekly activity"
          subtitle="Relative activity values from your care record"
        />
        <div className="rp-chart">
          {bars.map((day, i) => (
            <div className="rp-chart-col" key={day.label || i}>
              <span className="rp-chart-value">{day.value ?? 0}</span>
              <div className="rp-chart-track">
                <span
                  style={{
                    height: `${Math.max(5, Math.min(100, day.value || 0))}%`,
                  }}
                />
              </div>
              <small>{day.label || `Day ${i + 1}`}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="rp-note">
        <AlertCircle size={15} /> This is a wellness summary, not a diagnosis or
        a medically validated recovery score. Ask your physiotherapist to review
        your progress.
      </div>
    </>
  );
}

function Therapist() {
  const { data } = usePatient();
  const therapist = data.therapist || {};
  return (
    <>
      <PageHeading
        eyebrow="YOUR CARE TEAM"
        title="My physiotherapist"
        description="Your care partner can help you understand your plan and next steps."
      />
      <div className="rp-therapist-layout">
        <div className="rp-card rp-therapist-profile">
          <div className="rp-therapist-cover">
            <div className="rp-therapist-avatar">
              <UserRound size={42} />
            </div>
          </div>
          <div className="rp-therapist-info">
            <span className="rp-status status-completed">
              Assigned care professional
            </span>
            <h2>
              {therapist.name || therapist.fullName || "Your physiotherapist"}
            </h2>
            <p>
              {therapist.specialty ||
                therapist.specialization ||
                "Physiotherapy"}
            </p>
            <div className="rp-therapist-facts">
              <span>
                <CheckCircle2 size={15} />{" "}
                {therapist.experience ||
                  "Experience details available through your clinic"}
              </span>
              <span>
                <HeartPulse size={15} /> Patient focused care
              </span>
            </div>
            <div className="rp-contact-actions">
              {therapist.email && (
                <a
                  className="rp-primary-btn"
                  href={`mailto:${therapist.email}`}
                >
                  <Mail size={16} /> Email therapist
                </a>
              )}
              {therapist.phone && (
                <a className="rp-secondary-btn" href={`tel:${therapist.phone}`}>
                  <Phone size={16} /> Call
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="rp-card rp-care-info">
          <CardTitle
            icon={MessageCircle}
            title="Need to get in touch?"
            subtitle="For appointment changes or questions about your plan"
          />
          <p>
            Use the contact details provided by your clinic. If you experience a
            new or urgent health concern, seek appropriate medical care.
          </p>
          <a
            className="rp-secondary-btn"
            href="mailto:hello@rehabics.com?subject=Patient%20support%20request"
          >
            Contact Rehabics support <ArrowUpRight size={15} />
          </a>
          <div className="rp-care-info-divider" />
          <span className="rp-muted-text">Availability</span>
          <strong>
            {therapist.availability ||
              "Please confirm session availability with your clinic."}
          </strong>
        </div>
      </div>
    </>
  );
}

function Profile() {
  const { data, setData } = usePatient();
  const person = data.me || {};
  const [form, setForm] = useState({
    name: person.name || person.fullName || "",
    email: person.email || "",
    phone: person.phone || "",
    condition: person.condition || person.primaryCondition || "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setForm({
      name: person.name || person.fullName || "",
      email: person.email || "",
      phone: person.phone || "",
      condition: person.condition || person.primaryCondition || "",
    });
  }, [
    person.name,
    person.fullName,
    person.email,
    person.phone,
    person.condition,
    person.primaryCondition,
  ]);
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const updated = await updatePatientProfile(form);
      setData((old) => ({
        ...old,
        me: { ...old.me, ...form, ...(updated || {}) },
      }));
      setMessage("Your profile changes were saved.");
    } catch {
      setMessage(
        "Could not save profile. Confirm the profile endpoint in patientApi.js matches your backend.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <PageHeading
        eyebrow="ACCOUNT SETTINGS"
        title="My profile"
        description="Review your contact details and patient information."
      />
      <form className="rp-card rp-profile-form" onSubmit={submit}>
        <CardTitle
          icon={UserRound}
          title="Personal details"
          subtitle="Keep your information up to date"
        />
        <div className="rp-form-grid">
          <label>
            Full name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="name"
              required
            />
          </label>
          <label>
            Email address
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Phone number
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              type="tel"
              autoComplete="tel"
            />
          </label>
          <label>
            Primary concern
            <input
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              placeholder="As discussed with your clinician"
            />
          </label>
        </div>
        {message && (
          <p className="rp-form-message" role="status">
            {message}
          </p>
        )}
        <div className="rp-form-footer">
          <span className="rp-muted-text">
            Medical details should be confirmed with your care professional.
          </span>
          <button className="rp-primary-btn" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
      <div className="rp-note">
        <AlertCircle size={15} /> Only update information you are comfortable
        sharing. The server must enforce patient authorization for every read
        and write request.
      </div>
    </>
  );
}
