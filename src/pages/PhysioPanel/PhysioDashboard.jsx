import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays, Users, ClipboardCheck, IndianRupee, ArrowUpRight,
  ArrowRight, Clock3, MapPin, Video, MoreHorizontal, CheckCircle2,
  CircleAlert, Plus, Activity, ChevronRight
} from "lucide-react";
import "./PhysioPanel.css";

const appointments = [
  { id: "APT-2048", name: "Ananya Verma", initials: "AV", type: "Post-knee surgery rehab", time: "09:30 AM", duration: "45 min", mode: "In clinic", status: "Confirmed", tone: "blue" },
  { id: "APT-2049", name: "Rahul Mehta", initials: "RM", type: "Lower back pain", time: "10:30 AM", duration: "30 min", mode: "Video session", status: "Confirmed", tone: "purple" },
  { id: "APT-2050", name: "Priya Singh", initials: "PS", type: "Shoulder mobility", time: "11:15 AM", duration: "45 min", mode: "In clinic", status: "Awaiting", tone: "peach" },
  { id: "APT-2051", name: "Arjun Kumar", initials: "AK", type: "Sports injury recovery", time: "12:30 PM", duration: "60 min", mode: "In clinic", status: "Confirmed", tone: "green" },
];

const patients = [
  { name: "Ananya Verma", initials: "AV", treatment: "Post-knee surgery rehab", progress: 72, next: "Today, 9:30 AM", tone: "blue" },
  { name: "Rahul Mehta", initials: "RM", treatment: "Lower back pain", progress: 54, next: "Today, 10:30 AM", tone: "purple" },
  { name: "Priya Singh", initials: "PS", treatment: "Shoulder mobility", progress: 86, next: "Today, 11:15 AM", tone: "peach" },
];

function StatCard({ icon: Icon, label, value, detail, trend, tone, onClick }) {
  return (
    <button className="physio-stat-card" onClick={onClick}>
      <div className="physio-stat-top"><span className={`physio-stat-icon ${tone}`}><Icon size={20} /></span><span className="physio-stat-trend"><ArrowUpRight size={14} /> {trend}</span></div>
      <span className="physio-stat-label">{label}</span>
      <strong className="physio-stat-value">{value}</strong>
      <span className="physio-stat-detail">{detail}</span>
    </button>
  );
}

export default function PhysioDashboard() {
  const navigate = useNavigate();
  let user = {};
  try { user = JSON.parse(localStorage.getItem("user") || "{}"); } catch {}
  const firstName = (user.name || user.fullName || user.full_name || "Doctor").trim().split(" ")[0];

  return (
    <div className="physio-page">
      <div className="physio-welcome-row">
        <div><div className="physio-eyebrow"><span className="physio-live-dot" /> THURSDAY, YOUR CARE WORKSPACE</div><h1>Good morning, {firstName} <span className="physio-wave">✦</span></h1><p>Here’s what’s happening with your patients today.</p></div>
        <button className="physio-primary-button" onClick={() => navigate("/physio/appointments")}><Plus size={18} /> Manage appointments</button>
      </div>

      <section className="physio-stats-grid" aria-label="Practice overview">
        <StatCard icon={CalendarDays} label="Today's sessions" value="12" detail="4 sessions coming up" trend="+2 this week" tone="blue" onClick={() => navigate("/physio/appointments")} />
        <StatCard icon={Users} label="Active patients" value="48" detail="6 new this month" trend="+8.4%" tone="purple" onClick={() => navigate("/physio/patients")} />
        <StatCard icon={ClipboardCheck} label="Plans to review" value="07" detail="3 need your attention" trend="Due today" tone="orange" onClick={() => navigate("/physio/treatment-plans")} />
        <StatCard icon={IndianRupee} label="Monthly earnings" value="₹42,800" detail="Across completed sessions" trend="+12.6%" tone="green" onClick={() => navigate("/physio/progress")} />
      </section>

      <section className="physio-main-grid">
        <div className="physio-panel-card physio-appointments-card">
          <div className="physio-section-heading"><div><h2>Today's appointments</h2><p>Your schedule at a glance</p></div><button className="physio-text-button" onClick={() => navigate("/physio/appointments")}>View all <ArrowRight size={16} /></button></div>
          <div className="physio-table-wrap">
            <table className="physio-table">
              <thead><tr><th>Patient</th><th>Time & mode</th><th>Status</th><th /></tr></thead>
              <tbody>{appointments.map(item => <tr key={item.id}>
                <td><div className="physio-patient-cell"><div className={`physio-avatar patient ${item.tone}`}>{item.initials}</div><div><strong>{item.name}</strong><span>{item.type}</span></div></div></td>
                <td><div className="physio-time-cell"><strong><Clock3 size={14} /> {item.time}</strong><span>{item.mode === "Video session" ? <Video size={13} /> : <MapPin size={13} />} {item.mode} · {item.duration}</span></div></td>
                <td><span className={`physio-status-pill ${item.status === "Awaiting" ? "waiting" : "confirmed"}`}><i />{item.status}</span></td>
                <td><button className="physio-row-action" aria-label={`Open ${item.name} appointment`} onClick={() => navigate("/physio/appointments")}><ChevronRight size={18} /></button></td>
              </tr>)}</tbody>
            </table>
          </div>
          <div className="physio-card-bottom-note"><CircleAlert size={16} /><span>One appointment is awaiting confirmation.</span><button onClick={() => navigate("/physio/appointments")}>Review</button></div>
        </div>

        <div className="physio-panel-card physio-day-card">
          <div className="physio-section-heading"><div><h2>Day overview</h2><p>Thursday · Your schedule</p></div><button className="physio-icon-button" aria-label="More day overview options"><MoreHorizontal size={20} /></button></div>
          <div className="physio-day-summary"><div className="physio-day-ring"><div><strong>75%</strong><span>booked</span></div></div><div className="physio-day-legend"><div><i className="legend-blue" /><span>Booked hours</span><strong>6h</strong></div><div><i className="legend-light" /><span>Available</span><strong>2h</strong></div><div><i className="legend-orange" /><span>Breaks</span><strong>1h</strong></div></div></div>
          <div className="physio-next-session"><div className="physio-next-icon"><Clock3 size={18} /></div><div><span>NEXT SESSION</span><strong>Rahul Mehta</strong><p>Lower back pain · 10:30 AM</p></div><button aria-label="View next session" onClick={() => navigate("/physio/appointments")}><ArrowUpRight size={18} /></button></div>
          <button className="physio-outline-button" onClick={() => navigate("/physio/schedule")}>Manage availability <ArrowRight size={16} /></button>
        </div>
      </section>

      <section className="physio-panel-card physio-patients-card">
        <div className="physio-section-heading"><div><h2>Patient progress</h2><p>Keep an eye on recovery milestones</p></div><button className="physio-text-button" onClick={() => navigate("/physio/patients")}>All patients <ArrowRight size={16} /></button></div>
        <div className="physio-patient-progress-grid">{patients.map(patient => <article className="physio-progress-patient" key={patient.name}>
          <div className="physio-progress-patient-top"><div className="physio-patient-cell"><div className={`physio-avatar patient ${patient.tone}`}>{patient.initials}</div><div><strong>{patient.name}</strong><span>{patient.treatment}</span></div></div><button className="physio-row-action" aria-label={`View ${patient.name}`} onClick={() => navigate("/physio/patients")}><ArrowUpRight size={17} /></button></div>
          <div className="physio-progress-meta"><span>Recovery progress</span><strong>{patient.progress}%</strong></div><div className="physio-progress-track"><span style={{ width: `${patient.progress}%` }} /></div>
          <div className="physio-progress-foot"><CalendarDays size={14} /><span>Next: {patient.next}</span></div>
        </article>)}</div>
      </section>

      <section className="physio-bottom-grid">
        <div className="physio-panel-card physio-tasks-card"><div className="physio-section-heading"><div><h2>Priority checklist</h2><p>Small steps, better outcomes</p></div><span className="physio-task-count">3 items</span></div>
          <label className="physio-task"><input type="checkbox" /><span className="physio-task-check"><CheckCircle2 size={17} /></span><span><strong>Review treatment plans</strong><small>3 plans waiting for review</small></span><span className="physio-priority high">High</span></label>
          <label className="physio-task"><input type="checkbox" /><span className="physio-task-check"><CheckCircle2 size={17} /></span><span><strong>Update patient notes</strong><small>Ananya Verma · Yesterday's session</small></span><span className="physio-priority medium">Medium</span></label>
          <label className="physio-task"><input type="checkbox" /><span className="physio-task-check"><CheckCircle2 size={17} /></span><span><strong>Confirm new appointment</strong><small>Priya Singh · 11:15 AM</small></span><span className="physio-priority medium">Medium</span></label>
        </div>
        <div className="physio-panel-card physio-quick-card"><div className="physio-section-heading"><div><h2>Quick actions</h2><p>Jump right into your work</p></div><Activity size={19} className="physio-muted-icon" /></div>
          <button onClick={() => navigate("/physio/appointments")}><span className="quick-icon blue"><CalendarDays size={18} /></span><span><strong>Appointments</strong><small>Review today's schedule</small></span><ChevronRight size={18} /></button>
          <button onClick={() => navigate("/physio/patients")}><span className="quick-icon purple"><Users size={18} /></span><span><strong>Patient directory</strong><small>Find a patient record</small></span><ChevronRight size={18} /></button>
          <button onClick={() => navigate("/physio/treatment-plans")}><span className="quick-icon orange"><ClipboardCheck size={18} /></span><span><strong>Treatment plans</strong><small>Review recovery goals</small></span><ChevronRight size={18} /></button>
        </div>
      </section>
      <p className="physio-demo-disclaimer">Preview workspace · The figures and patient records shown here are demonstration data, not live patient records.</p>
    </div>
  );
}
