
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  CalendarDays,
  Dumbbell,
  TrendingUp,
  UserRound,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  Clock3,
  CheckCircle2,
  Circle,
  HeartPulse,
  ArrowUpRight,
  Menu,
  X,
  Video,
  Plus,
  Flame,
  Target,
  Footprints,
} from "lucide-react";

import "./PatientPanel.css";

const exercises = [
  {
    id: 1,
    title: "Shoulder Mobility",
    description: "Improve shoulder flexibility",
    duration: "10 min",
    icon: Activity,
  },
  {
    id: 2,
    title: "Gentle Stretching",
    description: "Reduce muscle stiffness",
    duration: "8 min",
    icon: Footprints,
  },
  {
    id: 3,
    title: "Breathing Exercise",
    description: "Relax and recover",
    duration: "5 min",
    icon: HeartPulse,
  },
];

const initialAppointments = [
  {
    id: 1,
    doctor: "Dr. Ananya Sharma",
    specialization: "Senior Physiotherapist",
    date: "24 Oct 2026",
    time: "10:30 AM",
    type: "Video consultation",
  },
];

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Appointments", icon: CalendarDays },
  { name: "My Exercises", icon: Dumbbell },
  { name: "My Progress", icon: TrendingUp },
  { name: "My Profile", icon: UserRound },
];

function getStoredPatient() {
  try {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    const parsedUser = storedUser
      ? JSON.parse(storedUser)
      : {};

    return parsedUser &&
      typeof parsedUser === "object" &&
      !Array.isArray(parsedUser)
      ? parsedUser
      : {};
  } catch {
    return {};
  }
}

function getDisplayName(patient) {
  const name =
    patient.name ||
    patient.fullName ||
    patient.full_name ||
    "Patient";

  return typeof name === "string" && name.trim()
    ? name.trim()
    : "Patient";
}

export default function PatientDashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("Dashboard");
  const [completed, setCompleted] = useState([]);
  const [appointments] = useState(initialAppointments);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const patient = useMemo(() => getStoredPatient(), []);
  const patientName = getDisplayName(patient);
  const firstName = patientName.split(/\s+/)[0] || "Patient";

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const exerciseProgress = Math.round(
    (completed.length / exercises.length) * 100
  );

  const filteredExercises = exercises.filter((exercise) => {
    const query = search.trim().toLowerCase();

    return (
      exercise.title.toLowerCase().includes(query) ||
      exercise.description.toLowerCase().includes(query)
    );
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const changePage = (page) => {
    setActivePage(page);
    setMobileOpen(false);
    setShowNotifications(false);

    if (page === "My Profile") {
      navigate("/profile");
      return;
    }

    if (page === "Settings") {
      navigate("/settings");
      return;
    }

    const sectionIds = {
      Dashboard: "dashboard-home",
      Appointments: "appointments",
      "My Exercises": "exercises",
      "My Progress": "progress",
    };

    const sectionId = sectionIds[page];

    if (sectionId) {
      requestAnimationFrame(() => {
        if (page === "Dashboard") {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          return;
        }

        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

  const bookAppointment = () => {
    navigate("/therapists");
  };

  const toggleExercise = (exerciseId) => {
    setCompleted((previous) =>
      previous.includes(exerciseId)
        ? previous.filter((id) => id !== exerciseId)
        : [...previous, exerciseId]
    );
  };

  return (
    <div className="patient-app">
      {mobileOpen && (
        <button
          type="button"
          className="patient-mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`patient-sidebar ${mobileOpen ? "is-open" : ""}`}
        aria-label="Patient navigation"
      >
        <div className="patient-brand">
          <div className="patient-brand-icon">
            <HeartPulse size={25} />
          </div>

          <div>
            <h2>Rehabics</h2>
            <span>YOUR RECOVERY PARTNER</span>
          </div>

          <button
            type="button"
            className="patient-close-menu"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="patient-sidebar-label">MENU</div>

        <nav className="patient-navigation">
          {menuItems.map(({ name, icon: Icon }) => (
            <button
              type="button"
              key={name}
              className={`patient-nav-item ${
                activePage === name ? "active" : ""
              }`}
              onClick={() => changePage(name)}
              aria-current={activePage === name ? "page" : undefined}
            >
              <Icon size={19} />
              <span>{name}</span>

              {name === "Appointments" && appointments.length > 0 && (
                <span className="patient-nav-count">
                  {appointments.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="patient-sidebar-label patient-support-label">
          PREFERENCES
        </div>

        <button
          type="button"
          className={`patient-nav-item ${
            activePage === "Settings" ? "active" : ""
          }`}
          onClick={() => changePage("Settings")}
        >
          <Settings size={19} />
          <span>Settings</span>
        </button>

        <div className="patient-sidebar-bottom">
          <div className="patient-help-card">
            <div className="patient-help-icon">
              <HeartPulse size={21} />
            </div>

            <h4>Need some help?</h4>
            <p>We're here to support your recovery journey.</p>

            <button
              type="button"
              onClick={() => navigate("/contact")}
            >
              Contact support <ChevronRight size={15} />
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
            © {new Date().getFullYear()} Rehabics Healthcare
          </div>
        </div>
      </aside>

      <main className="patient-main">
        <header className="patient-topbar">
          <button
            type="button"
            className="patient-menu-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={23} />
          </button>

          <div className="patient-breadcrumb">
            <span>Patient Portal</span>
            <ChevronRight size={15} />
            <strong>{activePage}</strong>
          </div>

          <div className="patient-topbar-actions">
            <div className="patient-search">
              <Search size={17} />

              <input
                type="search"
                placeholder="Search exercises..."
                value={search}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearch(value);

                  if (value.trim()) {
                    setActivePage("My Exercises");
                  }
                }}
                aria-label="Search exercises"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="patient-notification-wrap">
              <button
                type="button"
                className="patient-icon-button"
                onClick={() =>
                  setShowNotifications((previous) => !previous)
                }
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <Bell size={20} />
                <span className="patient-notification-dot" />
              </button>

              {showNotifications && (
                <div
                  className="patient-notification-popover"
                  role="status"
                >
                  <strong>Notifications</strong>
                  <p>Your daily exercise routine is ready.</p>
                  <p>Remember to check your next appointment.</p>
                </div>
              )}
            </div>

            <div className="patient-header-user">
              <div className="patient-avatar">
                {firstName.charAt(0).toUpperCase()}
              </div>

              <div className="patient-header-user-text">
                <strong>{patientName}</strong>
                <span>Patient</span>
              </div>
            </div>
          </div>
        </header>

        <div className="patient-content">
          <section
            className="patient-welcome"
            id="dashboard-home"
          >
            <div>
              <div className="patient-eyebrow">
                <span className="patient-live-dot" />
                YOUR PERSONAL HEALTH SPACE
              </div>

              <h1>
                Good to see you, {firstName}! <span>👋</span>
              </h1>

              <p>
                Every small step counts. Let's make today a great recovery
                day.
              </p>

              <div className="patient-welcome-date">
                <CalendarDays size={16} />
                {today}
              </div>
            </div>

            <div className="patient-welcome-art">
              <div className="patient-art-circle patient-art-circle-one" />
              <div className="patient-art-circle patient-art-circle-two" />

              <div className="patient-art-card">
                <HeartPulse size={38} />
                <span>HEAL</span>
                <strong>Move better.</strong>
                <strong>Feel better.</strong>
              </div>

              <div className="patient-art-floating">
                <CheckCircle2 size={17} />
                <span>You've got this!</span>
              </div>
            </div>
          </section>

          <section className="patient-stat-grid">
            <article className="patient-stat-card">
              <div className="patient-stat-top">
                <div className="patient-stat-icon purple">
                  <CalendarDays size={21} />
                </div>
                <span className="patient-stat-tag">UPCOMING</span>
              </div>

              <strong className="patient-stat-value">
                {appointments.length.toString().padStart(2, "0")}
              </strong>

              <span className="patient-stat-label">Appointments</span>

              <div className="patient-stat-bottom">
                <span>Next session scheduled</span>
                <button
                  type="button"
                  onClick={() => changePage("Appointments")}
                  aria-label="View appointments"
                >
                  <ArrowUpRight size={17} />
                </button>
              </div>
            </article>

            <article className="patient-stat-card">
              <div className="patient-stat-top">
                <div className="patient-stat-icon cyan">
                  <Dumbbell size={21} />
                </div>
                <span className="patient-stat-tag">TODAY</span>
              </div>

              <strong className="patient-stat-value">
                {completed.length}/{exercises.length}
              </strong>

              <span className="patient-stat-label">
                Exercises completed
              </span>

              <div className="patient-mini-progress">
                <div style={{ width: `${exerciseProgress}%` }} />
              </div>

              <span className="patient-stat-footnote">
                {exerciseProgress}% of today's routine
              </span>
            </article>

            <article className="patient-stat-card">
              <div className="patient-stat-top">
                <div className="patient-stat-icon green">
                  <Flame size={21} />
                </div>
                <span className="patient-stat-tag">CONSISTENCY</span>
              </div>

              <strong className="patient-stat-value">
                {completed.length > 0 ? 1 : 0}{" "}
                <small>day{completed.length > 0 ? "" : "s"}</small>
              </strong>

              <span className="patient-stat-label">Activity streak</span>

              <div className="patient-stat-bottom">
                <span>Keep building the habit</span>
                <Flame size={16} className="patient-flame" />
              </div>
            </article>

            <article className="patient-stat-card">
              <div className="patient-stat-top">
                <div className="patient-stat-icon orange">
                  <Target size={21} />
                </div>
                <span className="patient-stat-tag">YOUR GOAL</span>
              </div>

              <strong className="patient-stat-value">80%</strong>
              <span className="patient-stat-label">Recovery goal</span>

              <div className="patient-mini-progress">
                <div style={{ width: "80%" }} />
              </div>

              <span className="patient-stat-footnote">
                Sample target
              </span>
            </article>
          </section>

          <div className="patient-dashboard-grid">
            <section
              className="patient-panel patient-appointment-panel"
              id="appointments"
            >
              <div className="patient-panel-heading">
                <div>
                  <h2>Upcoming appointment</h2>
                  <p>Your next step toward feeling better.</p>
                </div>

                <button
                  type="button"
                  className="patient-text-button"
                  onClick={() => navigate("/appointments")}
                >
                  View all <ChevronRight size={16} />
                </button>
              </div>

              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div
                    className="patient-appointment-card"
                    key={appointment.id}
                  >
                    <div className="patient-doctor-avatar">
                      {appointment.doctor
                        .replace(/^Dr\.\s*/i, "")
                        .split(/\s+/)
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="patient-doctor-info">
                      <h3>{appointment.doctor}</h3>
                      <p>{appointment.specialization}</p>

                      <div className="patient-appointment-meta">
                        <span>
                          <CalendarDays size={15} />
                          {appointment.date}
                        </span>
                        <span>
                          <Clock3 size={15} />
                          {appointment.time}
                        </span>
                      </div>

                      <div className="patient-appointment-type">
                        <Video size={15} />
                        {appointment.type}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="patient-appointment-action"
                      onClick={() => navigate("/appointments")}
                    >
                      Details <ChevronRight size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="patient-empty-state">
                  <CalendarDays size={28} />
                  <h3>No upcoming appointments</h3>
                  <p>Book a session when you're ready.</p>

                  <button
                    type="button"
                    className="patient-primary-button"
                    onClick={bookAppointment}
                  >
                    <Plus size={17} /> Book appointment
                  </button>
                </div>
              )}

              <div className="patient-book-banner">
                <div className="patient-book-banner-icon">
                  <HeartPulse size={21} />
                </div>

                <div>
                  <strong>Ready for your next session?</strong>
                  <p>
                    Connect with a physiotherapist for personalized care.
                  </p>
                </div>

                <button type="button" onClick={bookAppointment}>
                  Find a therapist <ArrowUpRight size={16} />
                </button>
              </div>
            </section>

            <section
              className="patient-panel patient-progress-panel"
              id="progress"
            >
              <div className="patient-panel-heading">
                <div>
                  <h2>Your recovery</h2>
                  <p>Small steps, meaningful progress.</p>
                </div>

                <div className="patient-progress-icon">
                  <TrendingUp size={19} />
                </div>
              </div>

              <div className="patient-progress-score">
                <div className="patient-progress-ring">
                  <svg
                    viewBox="0 0 120 120"
                    role="img"
                    aria-label="Illustrative recovery progress 68 percent"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="49"
                      fill="none"
                      stroke="var(--patient-ring-track, #EEF0F7)"
                      strokeWidth="9"
                    />

                    <circle
                      cx="60"
                      cy="60"
                      r="49"
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 49 * 0.68} ${
                        2 * Math.PI * 49
                      }`}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>

                  <div>
                    <strong>68%</strong>
                    <span>Sample progress</span>
                  </div>
                </div>

                <div className="patient-progress-description">
                  <span className="patient-progress-badge">
                    <TrendingUp size={14} /> Keep going
                  </span>

                  <h3>Every step counts!</h3>

                  <p>
                    This is illustrative demo data, not a clinical recovery
                    measurement. Follow the plan agreed with your
                    physiotherapist.
                  </p>
                </div>
              </div>

              <div className="patient-milestones">
                <div className="patient-milestone">
                  <span className="patient-milestone-icon done">
                    <CheckCircle2 size={17} />
                  </span>

                  <div>
                    <strong>Initial assessment</strong>
                    <span>Example milestone</span>
                  </div>

                  <span className="patient-milestone-status">Sample</span>
                </div>

                <div className="patient-milestone">
                  <span className="patient-milestone-icon current">
                    <Activity size={17} />
                  </span>

                  <div>
                    <strong>Mobility improvement</strong>
                    <span>Example milestone</span>
                  </div>

                  <span className="patient-milestone-status ongoing">
                    Sample
                  </span>
                </div>

                <div className="patient-milestone">
                  <span className="patient-milestone-icon upcoming">
                    <Target size={17} />
                  </span>

                  <div>
                    <strong>Recovery target</strong>
                    <span>Example milestone</span>
                  </div>

                  <span className="patient-milestone-status">Sample</span>
                </div>
              </div>

              <button
                type="button"
                className="patient-full-width-button"
                onClick={() => changePage("My Progress")}
              >
                Explore my progress <ArrowUpRight size={17} />
              </button>
            </section>
          </div>

          <section
            className="patient-panel patient-exercises-panel"
            id="exercises"
          >
            <div className="patient-panel-heading">
              <div>
                <h2>Today's exercise plan</h2>
                <p>
                  Complete your assigned routine at your own pace.
                </p>
              </div>

              <div className="patient-exercise-counter">
                <CheckCircle2 size={17} />
                {completed.length} of {exercises.length} completed
              </div>
            </div>

            <div className="patient-exercise-list">
              {filteredExercises.map((exercise) => {
                const Icon = exercise.icon;
                const isDone = completed.includes(exercise.id);

                return (
                  <article
                    className={`patient-exercise-item ${
                      isDone ? "is-complete" : ""
                    }`}
                    key={exercise.id}
                  >
                    <div className="patient-exercise-icon">
                      <Icon size={22} />
                    </div>

                    <div className="patient-exercise-info">
                      <h3>{exercise.title}</h3>
                      <p>{exercise.description}</p>
                    </div>

                    <div className="patient-exercise-duration">
                      <Clock3 size={15} />
                      {exercise.duration}
                    </div>

                    <button
                      type="button"
                      className={`patient-exercise-check ${
                        isDone ? "checked" : ""
                      }`}
                      onClick={() => toggleExercise(exercise.id)}
                      aria-pressed={isDone}
                    >
                      {isDone ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Circle size={18} />
                      )}

                      <span>
                        {isDone ? "Completed" : "Mark done"}
                      </span>
                    </button>
                  </article>
                );
              })}

              {filteredExercises.length === 0 && (
                <div className="patient-no-results">
                  No exercises match "{search}".
                </div>
              )}
            </div>

            <div className="patient-exercise-footer">
              <div>
                <div className="patient-exercise-footer-icon">
                  <HeartPulse size={19} />
                </div>

                <div>
                  <strong>
                    {completed.length === exercises.length
                      ? "Amazing work! Routine completed."
                      : "Consistency is your superpower"}
                  </strong>

                  <p>
                    {completed.length === exercises.length
                      ? "You completed every exercise in this sample routine."
                      : "Follow the exercise plan recommended by your physiotherapist."}
                  </p>
                </div>
              </div>

              <div className="patient-footer-progress">
                <span>{exerciseProgress}%</span>

                <div className="patient-footer-progress-track">
                  <div style={{ width: `${exerciseProgress}%` }} />
                </div>
              </div>
            </div>
          </section>

          <footer className="patient-page-footer">
            <span>Made with care by Rehabics 💜</span>
            <span>
              Your health information deserves privacy. Appointment,
              exercise and recovery information on this screen currently
              includes demo data.
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
