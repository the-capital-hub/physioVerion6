
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Target,
  CalendarDays,
  Activity,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";
import "./PatientDashboard.css";

const data = [
  { week: "Week 1", progress: 18, sessions: 1 },
  { week: "Week 2", progress: 29, sessions: 2 },
  { week: "Week 3", progress: 37, sessions: 2 },
  { week: "Week 4", progress: 49, sessions: 3 },
  { week: "Week 5", progress: 57, sessions: 3 },
  { week: "Week 6", progress: 68, sessions: 4 },
];

const milestones = [
  {
    id: 1,
    title: "Initial assessment",
    description: "Example completed milestone",
    status: "done",
    label: "Done",
    icon: CheckCircle2,
  },
  {
    id: 2,
    title: "Mobility improvement",
    description: "Example milestone in progress",
    status: "current",
    label: "Active",
    icon: Activity,
  },
  {
    id: 3,
    title: "Personal recovery goal",
    description: "Set with your physiotherapist",
    status: "upcoming",
    label: "Next",
    icon: Target,
  },
];

const goal = 80;
const latestProgress = data[data.length - 1].progress;
const totalSessions = data.reduce((total, item) => total + item.sessions, 0);

function ProgressTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="patient-progress-tooltip">
      <strong>{label}</strong>
      <span>
        <i />
        Progress score: {item.progress}%
      </span>
      <span>
        <CalendarDays size={13} />
        Sample sessions: {item.sessions}
      </span>
    </div>
  );
}

export default function PatientProgress() {
  const goalProgress = Math.min(
    100,
    Math.round((latestProgress / goal) * 100)
  );

  return (
    <div className="patient-page patient-progress-page">
      <motion.section
        className="patient-page-title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="patient-eyebrow">
            <span className="patient-live-dot" />
            YOUR RECOVERY JOURNEY
          </span>
          <h1>My Progress</h1>
          <p>Every small step is part of your recovery journey.</p>
        </div>

        <span className="patient-demo-pill">
          <Activity size={15} />
          Illustrative data
        </span>
      </motion.section>

      <div className="patient-stat-grid patient-stat-grid-three">
        <motion.div
          className="patient-stat-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="patient-stat-icon purple">
            <TrendingUp size={21} />
          </div>
          <strong className="patient-stat-value">{latestProgress}%</strong>
          <span className="patient-stat-label">Sample progress score</span>
          <div className="patient-progress-stat-track">
            <span style={{ width: `${latestProgress}%` }} />
          </div>
        </motion.div>

        <motion.div
          className="patient-stat-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="patient-stat-icon cyan">
            <CalendarDays size={21} />
          </div>
          <strong className="patient-stat-value">{totalSessions}</strong>
          <span className="patient-stat-label">Sample sessions tracked</span>
          <span className="patient-progress-stat-caption">
            Across 6 sample weeks
          </span>
        </motion.div>

        <motion.div
          className="patient-stat-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="patient-stat-icon green">
            <Target size={21} />
          </div>
          <strong className="patient-stat-value">{goal}%</strong>
          <span className="patient-stat-label">Illustrative goal</span>
          <span className="patient-progress-stat-caption">
            {goal - latestProgress} points from target
          </span>
        </motion.div>
      </div>

      <section className="patient-panel patient-chart-panel">
        <div className="patient-panel-heading">
          <div>
            <span className="patient-panel-kicker">WEEKLY OVERVIEW</span>
            <h2>Recovery trend</h2>
            <p>Example values for previewing the progress chart.</p>
          </div>

          <span className="patient-chart-legend">
            <span />
            Progress
          </span>
        </div>

        <div className="patient-progress-chart-summary">
          <div>
            <strong>{latestProgress}%</strong>
            <span>Latest sample score</span>
          </div>
          <div className="patient-progress-chart-badge">
            <TrendingUp size={15} />
            <span>6 weeks</span>
          </div>
        </div>

        <div className="patient-chart patient-progress-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 12, right: 12, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="rehabicsProgressFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#6366F1"
                    stopOpacity={0.26}
                  />
                  <stop
                    offset="95%"
                    stopColor="#22D3EE"
                    stopOpacity={0.015}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="var(--progress-grid)"
                strokeDasharray="4 5"
                vertical={false}
              />

              <XAxis
                dataKey="week"
                tick={{ fill: "var(--progress-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
              />

              <YAxis
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tick={{ fill: "var(--progress-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<ProgressTooltip />} />

              <Area
                type="monotone"
                dataKey="progress"
                name="Progress"
                stroke="#818CF8"
                strokeWidth={3}
                fill="url(#rehabicsProgressFill)"
                activeDot={{
                  r: 5,
                  fill: "#22D3EE",
                  stroke: "var(--progress-surface)",
                  strokeWidth: 3,
                }}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="patient-progress-chart-note">
          <Activity size={15} />
          <span>
            These percentages are illustrative UI values, not clinical
            measurements or a prediction of recovery.
          </span>
        </div>
      </section>

      <section className="patient-panel patient-goal-panel">
        <div className="patient-panel-heading">
          <div>
            <span className="patient-panel-kicker">YOUR TARGET</span>
            <h2>Progress goal</h2>
            <p>Example goal for the interface preview.</p>
          </div>
          <Target size={22} className="patient-progress-target-icon" />
        </div>

        <div className="patient-goal-content">
          <div className="patient-goal-values">
            <div>
              <span>Current sample score</span>
              <strong>{latestProgress}%</strong>
            </div>
            <div className="patient-goal-target">
              <span>Illustrative target</span>
              <strong>{goal}%</strong>
            </div>
          </div>

          <div
            className="patient-goal-track"
            role="img"
            aria-label={`${goalProgress}% of illustrative goal reached`}
          >
            <div style={{ width: `${goalProgress}%` }} />
          </div>

          <div className="patient-goal-bottom">
            <span>
              <Sparkles size={14} />
              {goalProgress}% of illustrative target
            </span>
            <span>{goal - latestProgress} points remaining</span>
          </div>
        </div>
      </section>

      <section className="patient-panel patient-milestone-panel">
        <div className="patient-panel-heading">
          <div>
            <span className="patient-panel-kicker">YOUR ACHIEVEMENTS</span>
            <h2>Recovery milestones</h2>
            <p>Example milestones for the UI preview.</p>
          </div>
          <Activity size={22} className="patient-progress-target-icon" />
        </div>

        <div className="patient-milestone-list">
          {milestones.map((milestone) => {
            const Icon = milestone.icon;

            return (
              <motion.div
                key={milestone.id}
                className="patient-milestone"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25 }}
              >
                <span
                  className={`patient-milestone-icon ${milestone.status}`}
                >
                  <Icon size={17} />
                </span>

                <div className="patient-milestone-copy">
                  <strong>{milestone.title}</strong>
                  <span>{milestone.description}</span>
                </div>

                <span
                  className={`patient-milestone-status ${
                    milestone.status === "current" ? "ongoing" : ""
                  }`}
                >
                  {milestone.status === "current" && (
                    <Clock3 size={12} />
                  )}
                  {milestone.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="patient-demo-note">
        <Activity size={18} />
        <p>
          <strong>Demo data:</strong> charts, scores, sessions, and milestones
          are fictional sample values. Connect your verified backend data
          before using this page for real patient progress tracking.
        </p>
      </div>
    </div>
  );
}
