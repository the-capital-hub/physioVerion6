import React, { useMemo, useState } from "react";
import { CalendarDays, Search, Filter, Plus, Clock3, Video, MapPin, Check, X, Users, ClipboardList, ChartNoAxesCombined, UserRound, Settings, Save, ChevronRight, Activity, FileText, CircleCheck, CircleAlert, CalendarClock, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./PhysioPanel.css";

const initialAppointments = [
  { id: "APT-2048", name: "Ananya Verma", initials: "AV", treatment: "Post-knee surgery rehab", date: "2026-10-22", time: "09:30", duration: "45 min", mode: "In clinic", status: "Confirmed", tone: "blue" },
  { id: "APT-2049", name: "Rahul Mehta", initials: "RM", treatment: "Lower back pain", date: "2026-10-22", time: "10:30", duration: "30 min", mode: "Video session", status: "Confirmed", tone: "purple" },
  { id: "APT-2050", name: "Priya Singh", initials: "PS", treatment: "Shoulder mobility", date: "2026-10-22", time: "11:15", duration: "45 min", mode: "In clinic", status: "Awaiting", tone: "peach" },
  { id: "APT-2051", name: "Arjun Kumar", initials: "AK", treatment: "Sports injury recovery", date: "2026-10-22", time: "12:30", duration: "60 min", mode: "In clinic", status: "Confirmed", tone: "green" },
  { id: "APT-2052", name: "Meera Joshi", initials: "MJ", treatment: "Neck pain assessment", date: "2026-10-23", time: "14:00", duration: "45 min", mode: "Video session", status: "Awaiting", tone: "pink" },
];
const initialPatients = [
  { id: "PT-1001", name: "Ananya Verma", initials: "AV", age: 29, treatment: "Post-knee surgery rehab", progress: 72, last: "20 Oct 2026", next: "Today, 9:30 AM", tone: "blue", status: "Active" },
  { id: "PT-1002", name: "Rahul Mehta", initials: "RM", age: 42, treatment: "Lower back pain", progress: 54, last: "19 Oct 2026", next: "Today, 10:30 AM", tone: "purple", status: "Active" },
  { id: "PT-1003", name: "Priya Singh", initials: "PS", age: 35, treatment: "Shoulder mobility", progress: 86, last: "21 Oct 2026", next: "Today, 11:15 AM", tone: "peach", status: "Active" },
  { id: "PT-1004", name: "Arjun Kumar", initials: "AK", age: 24, treatment: "Sports injury recovery", progress: 38, last: "18 Oct 2026", next: "Today, 12:30 PM", tone: "green", status: "Needs review" },
  { id: "PT-1005", name: "Meera Joshi", initials: "MJ", age: 51, treatment: "Neck pain assessment", progress: 61, last: "17 Oct 2026", next: "Tomorrow, 2:00 PM", tone: "pink", status: "Active" },
];
const initialPlans = [
  { id: "TP-301", patient: "Ananya Verma", title: "Post-operative knee mobility", focus: "Strength & range of motion", sessions: "8 of 12 sessions", progress: 67, status: "In progress" },
  { id: "TP-302", patient: "Rahul Mehta", title: "Lumbar stability programme", focus: "Core stability & posture", sessions: "5 of 10 sessions", progress: 50, status: "In progress" },
  { id: "TP-303", patient: "Priya Singh", title: "Shoulder mobility restoration", focus: "Mobility & pain management", sessions: "10 of 12 sessions", progress: 83, status: "Review due" },
  { id: "TP-304", patient: "Arjun Kumar", title: "Sports injury recovery", focus: "Strength & return to sport", sessions: "3 of 12 sessions", progress: 25, status: "In progress" },
];

function PageHeader({ eyebrow, title, description, action, onAction }) {
  return <div className="physio-page-header"><div><div className="physio-eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <button className="physio-primary-button" onClick={onAction}><Plus size={18} />{action}</button>}</div>;
}
function SearchFilter({ value, onChange, placeholder = "Search..." }) {
  return <div className="physio-list-toolbar"><label className="physio-list-search"><Search size={17} /><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} /></label><span className="physio-results-note"><Filter size={15} /> Live filter</span></div>;
}
function EmptyState({ text }) { return <div className="physio-empty-state"><Search size={22} /><p>{text}</p></div>; }

export function PhysioAppointments() {
  const [items, setItems] = useState(initialAppointments);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");
  const filtered = items.filter(item => `${item.name} ${item.treatment} ${item.id}`.toLowerCase().includes(query.toLowerCase()) && (filter === "All" || item.status === filter));
  function update(id, status) { setItems(old => old.map(item => item.id === id ? { ...item, status } : item)); setMessage(`Appointment ${status.toLowerCase()} in this demo view.`); }
  return <div className="physio-page"><PageHeader eyebrow="SCHEDULE / APPOINTMENTS" title="Appointments" description="Review, confirm and keep every session on track." action="New appointment" onAction={() => setMessage("Connect your booking API to create a real appointment.")} />
    <div className="physio-mini-stats"><div><span>Today's sessions</span><strong>{items.filter(i => i.date === "2026-10-22").length}</strong></div><div><span>Awaiting confirmation</span><strong>{items.filter(i => i.status === "Awaiting").length}</strong></div><div><span>Confirmed</span><strong>{items.filter(i => i.status === "Confirmed").length}</strong></div></div>
    <div className="physio-panel-card"><div className="physio-list-toolbar"><label className="physio-list-search"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search patient or treatment..." /></label><select className="physio-select" value={filter} onChange={e => setFilter(e.target.value)}><option>All</option><option>Confirmed</option><option>Awaiting</option><option>Cancelled</option></select></div>
      {message && <div className="physio-inline-message"><CircleCheck size={16} />{message}<button onClick={() => setMessage("")} aria-label="Dismiss"><X size={15} /></button></div>}
      <div className="physio-table-wrap"><table className="physio-table"><thead><tr><th>Patient / treatment</th><th>Date & time</th><th>Session type</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filtered.map(item => <tr key={item.id}><td><div className="physio-patient-cell"><div className={`physio-avatar patient ${item.tone}`}>{item.initials}</div><div><strong>{item.name}</strong><span>{item.treatment} · {item.id}</span></div></div></td><td><div className="physio-time-cell"><strong>{new Date(`${item.date}T12:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} · {item.time}</strong><span><Clock3 size={13} /> {item.duration}</span></div></td><td><span className="physio-mode"><i>{item.mode === "Video session" ? <Video size={14} /> : <MapPin size={14} />}</i>{item.mode}</span></td><td><span className={`physio-status-pill ${item.status === "Awaiting" ? "waiting" : item.status === "Cancelled" ? "cancelled" : "confirmed"}`}><i />{item.status}</span></td><td><div className="physio-action-group">{item.status === "Awaiting" ? <><button className="physio-accept-button" onClick={() => update(item.id, "Confirmed")} aria-label="Confirm appointment"><Check size={16} /></button><button className="physio-decline-button" onClick={() => update(item.id, "Cancelled")} aria-label="Cancel appointment"><X size={16} /></button></> : <button className="physio-row-action" onClick={() => setMessage(`${item.id}: ${item.name} — ${item.treatment}`)} aria-label="View appointment"><ChevronRight size={18} /></button>}</div></td></tr>)}</tbody></table>{filtered.length === 0 && <EmptyState text="No appointments match your search." />}</div>
    </div><p className="physio-demo-disclaimer">Demo data only. Confirm/cancel changes are local to this page and are not sent to a server.</p>
  </div>;
}

export function PhysioPatients() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = initialPatients.filter(p => `${p.name} ${p.treatment} ${p.id}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="physio-page"><PageHeader eyebrow="CARE / PATIENT DIRECTORY" title="My patients" description="A clear view of the people and recovery journeys you support." action="Add patient" onAction={() => setSelected({ name: "", treatment: "", id: "New patient" })} />
    <div className="physio-mini-stats"><div><span>Active patients</span><strong>48</strong></div><div><span>Sessions this week</span><strong>32</strong></div><div><span>Need a review</span><strong>4</strong></div></div>
    <div className="physio-panel-card"><SearchFilter value={query} onChange={setQuery} placeholder="Search by patient name, ID or condition..." /><div className="physio-table-wrap"><table className="physio-table"><thead><tr><th>Patient</th><th>Care focus</th><th>Recovery progress</th><th>Last session</th><th>Status</th><th /></tr></thead><tbody>{filtered.map(p => <tr key={p.id}><td><div className="physio-patient-cell"><div className={`physio-avatar patient ${p.tone}`}>{p.initials}</div><div><strong>{p.name}</strong><span>{p.id} · Age {p.age}</span></div></div></td><td><span className="physio-condition">{p.treatment}</span></td><td><div className="physio-table-progress"><div className="physio-progress-track"><span style={{ width: `${p.progress}%` }} /></div><strong>{p.progress}%</strong></div></td><td><span className="physio-muted-text">{p.last}</span></td><td><span className={`physio-status-pill ${p.status === "Needs review" ? "waiting" : "confirmed"}`}><i />{p.status}</span></td><td><button className="physio-row-action" onClick={() => setSelected(p)} aria-label={`View ${p.name}`}><ChevronRight size={18} /></button></td></tr>)}</tbody></table>{filtered.length === 0 && <EmptyState text="No patients match your search." />}</div></div>
    {selected && <div className="physio-modal-backdrop" role="presentation" onClick={() => setSelected(null)}><section className="physio-modal" role="dialog" aria-modal="true" aria-label="Patient details" onClick={e => e.stopPropagation()}><button className="physio-modal-close" onClick={() => setSelected(null)} aria-label="Close"><X size={19} /></button><div className="physio-modal-avatar"><UserRound size={25} /></div><h2>{selected.name || "Add patient"}</h2><p>{selected.id}</p>{selected.treatment && <><div className="physio-modal-detail"><span>Care focus</span><strong>{selected.treatment}</strong></div><div className="physio-modal-detail"><span>Recovery progress</span><strong>{selected.progress}%</strong></div><div className="physio-modal-detail"><span>Next appointment</span><strong>{selected.next}</strong></div></>}<p className="physio-demo-disclaimer">Demo patient record. Connect the backend to load real clinical data.</p></section></div>}
  </div>;
}

export function PhysioTreatmentPlans() {
  const [query, setQuery] = useState("");
  const [plans, setPlans] = useState(initialPlans);
  const [message, setMessage] = useState("");
  const filtered = plans.filter(p => `${p.patient} ${p.title} ${p.focus}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="physio-page"><PageHeader eyebrow="CARE / CLINICAL PLANNING" title="Treatment plans" description="Track care goals, treatment milestones and plan reviews." action="Create plan" onAction={() => setMessage("A real treatment-plan form will need to be connected to your backend API.")} />
    {message && <div className="physio-inline-message"><CircleAlert size={16} />{message}<button onClick={() => setMessage("")} aria-label="Dismiss"><X size={15} /></button></div>}
    <div className="physio-plan-grid">{filtered.map(plan => <article className="physio-panel-card physio-plan-card" key={plan.id}><div className="physio-plan-top"><span className="physio-plan-icon"><ClipboardList size={20} /></span><span className={`physio-status-pill ${plan.status === "Review due" ? "waiting" : "confirmed"}`}><i />{plan.status}</span></div><span className="physio-plan-id">{plan.id}</span><h2>{plan.title}</h2><p className="physio-plan-focus">{plan.focus}</p><div className="physio-plan-patient"><span className="physio-avatar patient blue">{plan.patient.split(" ").map(s => s[0]).join("")}</span><strong>{plan.patient}</strong></div><div className="physio-progress-meta"><span>Plan completion</span><strong>{plan.progress}%</strong></div><div className="physio-progress-track"><span style={{ width: `${plan.progress}%` }} /></div><div className="physio-plan-foot"><span>{plan.sessions}</span><button onClick={() => { setPlans(old => old.map(p => p.id === plan.id ? { ...p, status: p.status === "Review due" ? "In progress" : "Review due" } : p)); setMessage(`${plan.id} status changed locally for this demo.`); }}>Mark for review <ChevronRight size={15} /></button></div></article>)}</div>{filtered.length === 0 && <div className="physio-panel-card"><EmptyState text="No treatment plans match your search." /></div>}
    <p className="physio-demo-disclaimer">Treatment plans shown are illustrative examples, not clinical advice or live patient data.</p>
  </div>;
}

export function PhysioProgress() {
  const [period, setPeriod] = useState("6 months");
  const data = period === "6 months" ? [34, 42, 39, 55, 63, 72] : period === "3 months" ? [49, 61, 72] : [63, 72];
  const labels = period === "6 months" ? ["May", "Jun", "Jul", "Aug", "Sep", "Oct"] : period === "3 months" ? ["Aug", "Sep", "Oct"] : ["Sep", "Oct"];
  return <div className="physio-page"><PageHeader eyebrow="INSIGHTS / OUTCOMES" title="Progress reports" description="Review recovery trends and follow-up priorities across your caseload." />
    <div className="physio-mini-stats"><div><span>Average recovery</span><strong>68%</strong></div><div><span>Goals achieved</span><strong>86</strong></div><div><span>Patients improving</span><strong>91%</strong></div></div>
    <div className="physio-bottom-grid"><section className="physio-panel-card physio-report-chart"><div className="physio-section-heading"><div><h2>Recovery trend</h2><p>Illustrative average recovery score</p></div><select className="physio-select" value={period} onChange={e => setPeriod(e.target.value)}><option>6 months</option><option>3 months</option><option>2 months</option></select></div><div className="physio-chart-area"><div className="physio-chart-y"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="physio-chart-main"><div className="physio-chart-gridlines"><i /><i /><i /><i /><i /></div><div className="physio-chart-bars">{data.map((v, i) => <div className="physio-chart-bar-wrap" key={labels[i]}><div className="physio-chart-bar" style={{ height: `${v}%` }} title={`${v}%`}><span>{v}%</span></div><small>{labels[i]}</small></div>)}</div></div></div></section>
      <section className="physio-panel-card physio-report-highlights"><div className="physio-section-heading"><div><h2>Clinical highlights</h2><p>Example follow-up priorities</p></div></div><div className="physio-highlight"><span className="highlight-icon green"><CircleCheck size={18} /></span><div><strong>Recovery milestones met</strong><p>3 sample patients reached a target this week.</p></div></div><div className="physio-highlight"><span className="highlight-icon orange"><CircleAlert size={18} /></span><div><strong>Follow-up recommended</strong><p>4 sample records may need a progress review.</p></div></div><div className="physio-highlight"><span className="highlight-icon blue"><Activity size={18} /></span><div><strong>Exercise adherence</strong><p>Sample adherence trend is stable this month.</p></div></div></section></div>
    <p className="physio-demo-disclaimer">All charts and metrics are demo illustrations. Do not use for medical decisions.</p>
  </div>;
}

export function PhysioSchedule() {
  const [days, setDays] = useState([{ day: "Monday", enabled: true, start: "09:00", end: "17:00" }, { day: "Tuesday", enabled: true, start: "09:00", end: "17:00" }, { day: "Wednesday", enabled: true, start: "10:00", end: "18:00" }, { day: "Thursday", enabled: true, start: "09:00", end: "17:00" }, { day: "Friday", enabled: true, start: "09:00", end: "16:00" }, { day: "Saturday", enabled: false, start: "10:00", end: "14:00" }, { day: "Sunday", enabled: false, start: "10:00", end: "14:00" }]);
  const [saved, setSaved] = useState(false);
  function change(index, key, value) { setDays(old => old.map((d, i) => i === index ? { ...d, [key]: value } : d)); setSaved(false); }
  function save() { localStorage.setItem("physioAvailability", JSON.stringify(days)); setSaved(true); }
  return <div className="physio-page"><PageHeader eyebrow="SCHEDULE / AVAILABILITY" title="Availability" description="Set the hours when patients can request a session with you." />
    <div className="physio-panel-card physio-schedule-card"><div className="physio-section-heading"><div><h2>Weekly working hours</h2><p>Choose the days and times you are available.</p></div><span className="physio-local-save">Saved on this device</span></div>
      {days.map((day, index) => <div className={`physio-day-row ${day.enabled ? "" : "day-disabled"}`} key={day.day}><label className="physio-day-toggle"><input type="checkbox" checked={day.enabled} onChange={e => change(index, "enabled", e.target.checked)} /><span className="physio-switch" /><strong>{day.day}</strong></label>{day.enabled ? <div className="physio-time-inputs"><label><span>Start</span><input type="time" value={day.start} onChange={e => change(index, "start", e.target.value)} /></label><span className="physio-time-dash">—</span><label><span>End</span><input type="time" value={day.end} onChange={e => change(index, "end", e.target.value)} /></label></div> : <span className="physio-day-off">Unavailable</span>}</div>)}
      <div className="physio-schedule-footer">{saved && <span className="physio-saved-message"><CircleCheck size={16} /> Availability saved locally</span>}<button className="physio-primary-button" onClick={save}><Save size={17} /> Save availability</button></div>
    </div><p className="physio-demo-disclaimer">Availability is stored in this browser only. Connect your API to publish it to patient booking.</p>
  </div>;
}

export function PhysioProfile() {
  const existing = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const [form, setForm] = useState({ name: existing.name || existing.fullName || "", email: existing.email || "", phone: existing.phone || "", specialty: existing.specialty || "Musculoskeletal physiotherapy", experience: existing.experience || "5", bio: existing.bio || "" });
  const [saved, setSaved] = useState(false);
  function update(key, value) { setForm(old => ({ ...old, [key]: value })); setSaved(false); }
  function save(e) { e.preventDefault(); const user = { ...existing, ...form }; localStorage.setItem("user", JSON.stringify(user)); setSaved(true); }
  return <div className="physio-page"><PageHeader eyebrow="ACCOUNT / PROFESSIONAL DETAILS" title="My profile" description="Keep your professional information accurate and up to date." />
    <form className="physio-panel-card physio-profile-form" onSubmit={save}><div className="physio-profile-banner"><div className="physio-profile-big-avatar"><UserRound size={34} /></div><div><h2>Professional profile</h2><p>Your details help patients understand your care experience.</p></div></div><div className="physio-form-grid">
      <label>Full name<input required minLength={2} value={form.name} onChange={e => update("name", e.target.value)} placeholder="Dr. A. Sharma" /></label><label>Email address<input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="doctor@example.com" /></label><label>Phone number<input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 98765 43210" /></label><label>Specialty<input value={form.specialty} onChange={e => update("specialty", e.target.value)} placeholder="Your specialty" /></label><label>Years of experience<input type="number" min="0" max="60" value={form.experience} onChange={e => update("experience", e.target.value)} /></label><label className="physio-form-full">Professional bio<textarea rows="4" maxLength="600" value={form.bio} onChange={e => update("bio", e.target.value)} placeholder="Share your approach to patient care and areas of expertise..." /></label>
    </div><div className="physio-form-footer">{saved && <span className="physio-saved-message"><CircleCheck size={16} /> Profile saved on this device</span>}<button className="physio-primary-button" type="submit"><Save size={17} /> Save profile</button></div></form><p className="physio-demo-disclaimer">This saves to browser local storage. It does not update the backend account.</p>
  </div>;
}

export function PhysioSettings() {
  const [prefs, setPrefs] = useState(() => { try { return { emailReminders: true, appointmentAlerts: true, progressDigest: false, compactMode: false, ...JSON.parse(localStorage.getItem("physioSettings") || "{}") }; } catch { return { emailReminders: true, appointmentAlerts: true, progressDigest: false, compactMode: false }; } });
  const [saved, setSaved] = useState(false);
  function toggle(key) { setPrefs(old => ({ ...old, [key]: !old[key] })); setSaved(false); }
  function save() { localStorage.setItem("physioSettings", JSON.stringify(prefs)); setSaved(true); }
  const options = [{ key: "appointmentAlerts", title: "Appointment notifications", description: "Get notified when a session is booked or changed." }, { key: "emailReminders", title: "Email reminders", description: "Receive reminders before your scheduled sessions." }, { key: "progressDigest", title: "Weekly progress digest", description: "A weekly summary of patient progress and pending reviews." }, { key: "compactMode", title: "Compact display", description: "Reduce spacing in lists to fit more information on screen." }];
  return <div className="physio-page"><PageHeader eyebrow="ACCOUNT / PREFERENCES" title="Settings" description="Make your workspace work the way you do." />
    <section className="physio-panel-card physio-settings-card"><div className="physio-section-heading"><div><h2>Notifications & preferences</h2><p>These preferences are stored on this device.</p></div><Settings size={20} className="physio-muted-icon" /></div>{options.map(option => <div className="physio-setting-row" key={option.key}><div><strong>{option.title}</strong><p>{option.description}</p></div><button type="button" role="switch" aria-checked={prefs[option.key]} className={`physio-switch-button ${prefs[option.key] ? "on" : ""}`} onClick={() => toggle(option.key)}><span /></button></div>)}<div className="physio-form-footer">{saved && <span className="physio-saved-message"><CircleCheck size={16} /> Preferences saved</span>}<button className="physio-primary-button" onClick={save}><Save size={17} /> Save preferences</button></div></section>
  </div>;
}
