
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Dumbbell,
  TrendingUp,
  ArrowUpRight,
  HeartPulse,
  Clock3,
  CheckCircle2,
  ChevronRight,
  Activity,
  Sun,
  Moon,
  Video,
  Target,
  Sparkles,
} from "lucide-react";
import "./PatientDashboard.css";

const cards = [
  {
    title: "Appointments",
    value: "01",
    note: "Next session scheduled",
    icon: CalendarDays,
    tone: "purple",
    to: "/patient/appointments",
  },
  {
    title: "Daily exercises",
    value: "03",
    note: "Your routine for today",
    icon: Dumbbell,
    tone: "cyan",
    to: "/patient/exercises",
  },
  {
    title: "Recovery progress",
    value: "68%",
    note: "Sample progress data",
    icon: TrendingUp,
    tone: "green",
    to: "/patient/progress",
  },
];

export default function PatientDashboard() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("rehabics-theme") || "light"
  );

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = (user.name || "Alex").trim().split(" ")[0];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("rehabics-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <div className="patient-page">
      <header className="patient-dashboard-header">
        <button
          className="patient-dashboard-brand"
          onClick={() => navigate("/patient/dashboard")}
          aria-label="Go to patient dashboard"
        >
          <span className="patient-brand-mark">
            <HeartPulse size={25} />
          </span>
          <span className="patient-brand-copy">
            <strong>Rehabics</strong>
            <small>YOUR RECOVERY PARTNER</small>
          </span>
        </button>

        <div className="patient-header-right">
          <span className="patient-portal-label">
            <span className="patient-live-dot" />
            Patient Portal
          </span>

          <button
            type="button"
            className="patient-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
          </button>

          <div className="patient-header-profile">
            <span className="patient-header-avatar">
              {firstName.charAt(0).toUpperCase()}
            </span>
            <span className="patient-header-profile-copy">
              <strong>{user.name || "Alex Morgan"}</strong>
              <small>Patient account</small>
            </span>
          </div>
        </div>
      </header>

      <main className="patient-content">
        <motion.section
          className="patient-welcome"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="patient-welcome-copy">
            <div className="patient-eyebrow">
              <span className="patient-live-dot" />
              YOUR PERSONAL HEALTH SPACE
            </div>

            <h1>
              Good to see you, {firstName}! <span>👋</span>
            </h1>

            <p>
              Every small step counts. Let's make today a great recovery day.
            </p>

            <div className="patient-welcome-date">
              <CalendarDays size={17} />
              Your recovery journey, one day at a time
            </div>

            <button
              className="patient-primary-button"
              onClick={() => navigate("/patient/exercises")}
            >
              Explore exercises
              <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="patient-welcome-art" aria-hidden="true">
            <div className="patient-art-orbit patient-art-orbit-one" />
            <div className="patient-art-orbit patient-art-orbit-two" />
            <div className="patient-art-sparkle sparkle-one">
              <Sparkles size={22} />
            </div>
            <div className="patient-art-sparkle sparkle-two">
              <Activity size={20} />
            </div>

            <div className="patient-art-card">
              <div className="patient-art-card-icon">
                <HeartPulse size={37} />
              </div>
              <span>YOUR WELLNESS JOURNEY</span>
              <strong>Move better.</strong>
              <strong>Feel better.</strong>
              <div className="patient-art-card-line" />
              <small>One step at a time.</small>
            </div>

            <div className="patient-art-floating">
              <CheckCircle2 size={18} />
              <span>You've got this!</span>
            </div>
          </div>
        </motion.section>

        <section className="patient-section-intro">
          <div>
            <span className="patient-section-kicker">YOUR OVERVIEW</span>
            <h2>Your recovery at a glance</h2>
            <p>Keep track of your journey and stay connected to your goals.</p>
          </div>
          <span className="patient-demo-badge">
            <span /> Demo dashboard
          </span>
        </section>

        <section className="patient-stat-grid">
          {cards.map(({ title, value, note, icon: Icon, tone, to }, index) => (
            <motion.button
              key={title}
              type="button"
              className="patient-stat-card patient-stat-button"
              onClick={() => navigate(to)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="patient-stat-top">
                <div className={`patient-stat-icon ${tone}`}>
                  <Icon size={22} />
                </div>
                <ArrowUpRight size={19} className="patient-card-arrow" />
              </div>

              <strong className="patient-stat-value">{value}</strong>
              <span className="patient-stat-label">{title}</span>

              <div className="patient-stat-bottom">
                <span>{note}</span>
              </div>
            </motion.button>
          ))}
        </section>

        <div className="patient-dashboard-grid">
          <motion.section
            className="patient-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <div className="patient-panel-heading">
              <div>
                <span className="patient-panel-kicker">UP NEXT</span>
                <h2>Next appointment</h2>
                <p>Your next step toward feeling better.</p>
              </div>

              <button
                type="button"
                className="patient-text-button"
                onClick={() => navigate("/patient/appointments")}
              >
                View all <ChevronRight size={16} />
              </button>
            </div>

            <div className="patient-appointment-card">
              <div className="patient-doctor-avatar">AS</div>

              <div className="patient-doctor-info">
                <h3>Dr. Ananya Sharma</h3>
                <p>Senior Physiotherapist</p>

                <div className="patient-appointment-meta">
                  <span>
                    <CalendarDays size={15} />
                    24 Oct 2026
                  </span>
                  <span>
                    <Clock3 size={15} />
                    10:30 AM
                  </span>
                </div>

                <div className="patient-appointment-type">
                  <Video size={15} />
                  Physiotherapy session · Demo
                </div>
              </div>
            </div>

            <div className="patient-book-banner">
              <div className="patient-book-banner-icon">
                <HeartPulse size={23} />
              </div>

              <div className="patient-book-banner-copy">
                <strong>Ready for your next session?</strong>
                <p>Find a physiotherapist for personalized care.</p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/therapists")}
              >
                Find a therapist
                <ArrowUpRight size={16} />
              </button>
            </div>
          </motion.section>

          <motion.section
            className="patient-panel patient-recovery-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="patient-panel-heading">
              <div>
                <span className="patient-panel-kicker">YOUR JOURNEY</span>
                <h2>Recovery snapshot</h2>
                <p>A quick look at your sample progress.</p>
              </div>

              <div className="patient-heading-icon">
                <TrendingUp size={21} />
              </div>
            </div>

            <div className="patient-progress-score">
              <div className="patient-progress-ring">
                <svg
                  viewBox="0 0 120 120"
                  role="img"
                  aria-label="Illustrative recovery progress of 68 percent"
                >
                  <circle
                    className="patient-ring-track"
                    cx="60"
                    cy="60"
                    r="49"
                    fill="none"
                    strokeWidth="9"
                  />
                  <circle
                    className="patient-ring-value"
                    cx="60"
                    cy="60"
                    r="49"
                    fill="none"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 49 * 0.68} ${2 * Math.PI * 49}`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>

                <div>
                  <strong>68%</strong>
                  <span>Sample score</span>
                </div>
              </div>

              <div className="patient-progress-description">
                <span className="patient-progress-badge">
                  <CheckCircle2 size={14} />
                  Keep going
                </span>

                <h3>Small steps matter.</h3>
                <p>
                  This is illustrative data, not a clinical assessment.
                </p>
              </div>
            </div>

            <div className="patient-goal-note">
              <span className="patient-goal-icon">
                <Target size={18} />
              </span>
              <div>
                <strong>Keep building healthy habits</strong>
                <p>Follow the plan recommended by your physiotherapist.</p>
              </div>
            </div>

            <button
              type="button"
              className="patient-full-width-button"
              onClick={() => navigate("/patient/progress")}
            >
              Explore my progress
              <ArrowUpRight size={17} />
            </button>
          </motion.section>
        </div>

        <motion.section
          className="patient-panel patient-quick-actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="patient-panel-heading">
            <div>
              <span className="patient-panel-kicker">QUICK ACCESS</span>
              <h2>What would you like to do?</h2>
              <p>Jump back into your recovery routine.</p>
            </div>
          </div>

          <div className="patient-action-grid">
            <button
              type="button"
              onClick={() => navigate("/patient/exercises")}
            >
              <span className="patient-action-icon cyan">
                <Dumbbell size={22} />
              </span>
              <span className="patient-action-copy">
                <strong>View exercises</strong>
                <small>Continue your daily routine</small>
              </span>
              <ChevronRight size={19} className="patient-action-arrow" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/patient/appointments")}
            >
              <span className="patient-action-icon purple">
                <CalendarDays size={22} />
              </span>
              <span className="patient-action-copy">
                <strong>Appointments</strong>
                <small>Review upcoming sessions</small>
              </span>
              <ChevronRight size={19} className="patient-action-arrow" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/patient/profile")}
            >
              <span className="patient-action-icon green">
                <Activity size={22} />
              </span>
              <span className="patient-action-copy">
                <strong>Update profile</strong>
                <small>Keep your details current</small>
              </span>
              <ChevronRight size={19} className="patient-action-arrow" />
            </button>
          </div>
        </motion.section>

        <footer className="patient-page-footer">
          <span>Made with care by Rehabics 💜</span>
          <span>
            Demo dashboard · Connect your backend for real patient data.
          </span>
        </footer>
      </main>
    </div>
  );
}
