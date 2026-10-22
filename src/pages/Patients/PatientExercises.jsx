
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Clock3,
  Search,
  CheckCircle2,
  Circle,
  Activity,
  Footprints,
  HeartPulse,
  RotateCcw,
  ArrowUpRight,
  Target,
  Sparkles,
} from "lucide-react";
import "./PatientDashboard.css";

const routines = [
  {
    id: 1,
    title: "Shoulder Mobility",
    description: "Gentle range-of-motion practice",
    minutes: 10,
    level: "Beginner",
    icon: Activity,
    category: "Mobility",
  },
  {
    id: 2,
    title: "Gentle Stretching",
    description: "Stretch within a comfortable range",
    minutes: 8,
    level: "Beginner",
    icon: Footprints,
    category: "Stretching",
  },
  {
    id: 3,
    title: "Breathing Exercise",
    description: "Slow, relaxed breathing practice",
    minutes: 5,
    level: "Easy",
    icon: HeartPulse,
    category: "Wellness",
  },
  {
    id: 4,
    title: "Seated Leg Extensions",
    description: "Controlled movement while seated",
    minutes: 7,
    level: "Beginner",
    icon: Dumbbell,
    category: "Strength",
  },
];

export default function PatientExercises() {
  const [done, setDone] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const categories = [
    "All",
    ...new Set(routines.map((routine) => routine.category)),
  ];

  const filtered = routines.filter((routine) => {
    const matchesCategory =
      category === "All" || routine.category === category;

    const searchText =
      `${routine.title} ${routine.description} ${routine.category}`.toLowerCase();

    return matchesCategory && searchText.includes(query.toLowerCase().trim());
  });

  const progress = Math.round((done.length / routines.length) * 100);

  const toggleExercise = (id) => {
    setDone((previous) =>
      previous.includes(id)
        ? previous.filter((exerciseId) => exerciseId !== id)
        : [...previous, id]
    );
  };

  const resetRoutine = () => {
    setDone([]);
    setShowResetConfirm(false);
  };

  const totalMinutes = routines.reduce(
    (total, routine) => total + routine.minutes,
    0
  );

  return (
    <div className="patient-page patient-exercises-page">
      <motion.section
        className="patient-page-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <span className="patient-eyebrow">
            <span className="patient-live-dot" />
            YOUR DAILY ROUTINE
          </span>
          <h1>My Exercises</h1>
          <p>Small steps every day. Celebrate every bit of progress.</p>
        </div>

        <div className="patient-exercise-summary">
          <div className="patient-exercise-summary-icon">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <strong>
              {String(done.length).padStart(2, "0")}
              <span>/{routines.length}</span>
            </strong>
            <small>Completed today</small>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="patient-exercise-hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <div className="patient-exercise-hero-copy">
          <span className="patient-hero-kicker">
            <Sparkles size={14} />
            TODAY'S PLAN
          </span>

          <h2>Progress, not perfection.</h2>

          <p>
            Build a consistent routine at a pace that works for you.
            Follow your physiotherapist's personalized recommendations.
          </p>

          <div className="patient-exercise-hero-meta">
            <span>
              <Dumbbell size={16} />
              {routines.length} exercises
            </span>
            <span>
              <Clock3 size={16} />
              {totalMinutes} minutes total
            </span>
          </div>
        </div>

        <div className="patient-exercise-hero-progress">
          <div
            className="patient-hero-progress-ring"
            style={{ "--exercise-progress": `${progress}%` }}
            role="img"
            aria-label={`${progress}% of sample routine completed`}
          >
            <div>
              <strong>{progress}%</strong>
              <span>Complete</span>
            </div>
          </div>
          <small>
            {progress === 100
              ? "Excellent work today!"
              : "One step at a time"}
          </small>
        </div>

        <div className="patient-exercise-hero-decoration" />
      </motion.section>

      <section className="patient-panel patient-routine-panel">
        <div className="patient-panel-heading">
          <div>
            <span className="patient-panel-kicker">YOUR COLLECTION</span>
            <h2>Exercise library</h2>
            <p>Find your routine and track completed exercises.</p>
          </div>

          <button
            type="button"
            className="patient-text-button"
            onClick={() => setShowResetConfirm(true)}
            disabled={done.length === 0}
          >
            <RotateCcw size={15} />
            Reset today
          </button>
        </div>

        {showResetConfirm && (
          <div className="patient-reset-confirm">
            <div>
              <strong>Reset today's progress?</strong>
              <p>This will unmark all completed sample exercises.</p>
            </div>
            <div className="patient-reset-actions">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
              >
                Keep progress
              </button>
              <button type="button" onClick={resetRoutine}>
                Reset
              </button>
            </div>
          </div>
        )}

        <div className="patient-list-toolbar patient-exercise-toolbar">
          <label className="patient-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search exercises..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search exercises"
            />

            {query && (
              <button
                type="button"
                className="patient-search-clear"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <div
            className="patient-filter-tabs patient-filter-scroll"
            aria-label="Filter exercises by category"
          >
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? "selected" : ""}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="patient-routine-results">
          <span>
            Showing <strong>{filtered.length}</strong> of {routines.length}{" "}
            exercises
          </span>
          <span>
            <Target size={14} />
            {progress}% completed
          </span>
        </div>

        <div className="patient-routine-grid">
          {filtered.map((routine, index) => {
            const Icon = routine.icon;
            const checked = done.includes(routine.id);

            return (
              <motion.article
                key={routine.id}
                className={`patient-routine-card ${checked ? "completed" : ""}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div className="patient-routine-card-top">
                  <div className="patient-exercise-icon">
                    <Icon size={23} />
                  </div>

                  <span className="patient-routine-level">
                    {routine.level}
                  </span>
                </div>

                <div className="patient-routine-card-copy">
                  <h3>{routine.title}</h3>
                  <p>{routine.description}</p>
                </div>

                <div className="patient-routine-meta">
                  <span>
                    <Clock3 size={15} />
                    {routine.minutes} min
                  </span>
                  <span>{routine.category}</span>
                </div>

                <button
                  type="button"
                  className={`patient-exercise-check ${
                    checked ? "checked" : ""
                  }`}
                  onClick={() => toggleExercise(routine.id)}
                  aria-pressed={checked}
                >
                  {checked ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Circle size={18} />
                  )}
                  <span>
                    {checked ? "Completed" : "Mark complete"}
                  </span>
                  <ArrowUpRight size={15} className="patient-routine-arrow" />
                </button>
              </motion.article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="patient-empty-state">
            <span className="patient-empty-icon">
              <Search size={27} />
            </span>
            <h3>No matching exercises</h3>
            <p>Try another search term or select a different category.</p>
            <button
              type="button"
              className="patient-primary-button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="patient-exercise-footer">
          <div>
            <div className="patient-exercise-footer-icon">
              <HeartPulse size={20} />
            </div>
            <div>
              <strong>
                {progress === 100
                  ? "Amazing work! Routine completed."
                  : "Consistency is your superpower"}
              </strong>
              <p>
                {progress === 100
                  ? "You've marked every exercise in this sample routine complete."
                  : "Celebrate small wins and follow your clinician's exercise plan."}
              </p>
            </div>
          </div>

          <div className="patient-footer-progress">
            <span>{progress}%</span>
            <div className="patient-footer-progress-track">
              <div style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="patient-demo-note">
        <span className="patient-demo-note-icon">
          <HeartPulse size={18} />
        </span>
        <p>
          <strong>Sample exercise data:</strong> completion status resets when
          this page reloads. Only perform exercises recommended by your
          physiotherapist. Stop if you experience pain or unusual symptoms.
        </p>
      </div>

      <footer className="patient-page-footer">
        <span>Made with care by Rehabics 💜</span>
        <span>My exercises · Demo data</span>
      </footer>
    </div>
  );
}
