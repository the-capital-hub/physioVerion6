import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  Activity, CalendarDays, Users, ClipboardList, Dumbbell, MessageSquare,
  ChartNoAxesCombined, Settings, Search, Bell, Menu, X, ChevronRight,
  Clock3, CheckCircle2, CircleAlert, Plus, ArrowUpRight, ArrowDownRight,
  Stethoscope, FileText, Filter, MoreHorizontal, Phone, Mail, CalendarCheck,
  HeartPulse, UserRound, LogOut, Moon, Sun, PanelLeftClose, ClipboardCheck
} from "lucide-react";
import {
  getDoctorOverview, getDoctorAppointments, getDoctorPatients, getTreatmentPlans,
  getExerciseLibrary, getDoctorMessages, getDoctorReports, getDoctorProfile,
  updateDoctorAppointmentStatus, updateTreatmentPlan, updateDoctorProfile
} from "../../services/doctorApi";
import "./DoctorPanel.css";

const NAV = [
  { to: "/doctor", label: "Overview", icon: Activity, end: true },
  { to: "/doctor/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/doctor/patients", label: "My patients", icon: Users },
  { to: "/doctor/treatment-plans", label: "Treatment plans", icon: ClipboardList },
  { to: "/doctor/exercises", label: "Exercise library", icon: Dumbbell },
  { to: "/doctor/messages", label: "Messages", icon: MessageSquare, count: 3 },
  { to: "/doctor/reports", label: "Reports & progress", icon: ChartNoAxesCombined },
  { to: "/doctor/settings", label: "Profile & settings", icon: Settings }
];

const DEMO = {
  overview: {
    doctor: { name: "Dr. Arjun Mehta", specialty: "Physiotherapist" },
    stats: [
      { label: "Today's appointments", value: "8", delta: "+2 from yesterday", icon: CalendarCheck, tone: "blue" },
      { label: "My patients", value: "42", delta: "+5 this month", icon: Users, tone: "violet" },
      { label: "Active treatment plans", value: "28", delta: "Across active patients", icon: ClipboardList, tone: "cyan" },
      { label: "Patient satisfaction", value: "4.8", delta: "Based on 120 reviews", icon: HeartPulse, tone: "amber" }
    ],
    appointments: [
      { id: "a1", time: "09:00 AM", patientName: "Rahul Sharma", reason: "Back pain · Follow-up", status: "Confirmed" },
      { id: "a2", time: "10:30 AM", patientName: "Priya Patel", reason: "Knee rehabilitation", status: "Confirmed" },
      { id: "a3", time: "12:00 PM", patientName: "Amit Kumar", reason: "Post-surgery recovery", status: "Pending" },
      { id: "a4", time: "02:00 PM", patientName: "Sneha Verma", reason: "Neck pain · Consultation", status: "Confirmed" }
    ],
    recentPatients: [
      { id: "p1", name: "Rahul Sharma", condition: "Back pain", lastVisit: "Today" },
      { id: "p2", name: "Priya Patel", condition: "Knee rehabilitation", lastVisit: "Today" },
      { id: "p3", name: "Amit Kumar", condition: "Post-surgery", lastVisit: "Yesterday" },
      { id: "p4", name: "Sneha Verma", condition: "Neck pain", lastVisit: "Yesterday" }
    ],
    weekly: [{ day: "Mon", count: 8 }, { day: "Tue", count: 6 }, { day: "Wed", count: 7 }, { day: "Thu", count: 5 }, { day: "Fri", count: 9 }, { day: "Sat", count: 4 }, { day: "Sun", count: 3 }]
  },
  appointments: [
    { id: "a1", time: "09:00 AM", date: "Today", patientName: "Rahul Sharma", reason: "Back pain · Follow-up", type: "In clinic", status: "Confirmed" },
    { id: "a2", time: "10:30 AM", date: "Today", patientName: "Priya Patel", reason: "Knee rehabilitation", type: "Online", status: "Confirmed" },
    { id: "a3", time: "12:00 PM", date: "Today", patientName: "Amit Kumar", reason: "Post-surgery recovery", type: "In clinic", status: "Pending" },
    { id: "a4", time: "02:00 PM", date: "Today", patientName: "Sneha Verma", reason: "Neck pain · Consultation", type: "Online", status: "Confirmed" },
    { id: "a5", time: "11:00 AM", date: "Tomorrow", patientName: "Vikram Singh", reason: "Shoulder mobility", type: "In clinic", status: "Confirmed" }
  ],
  patients: [
    { id: "p1", name: "Rahul Sharma", email: "rahul@example.com", condition: "Back pain", progress: 72, lastVisit: "Today", status: "Active" },
    { id: "p2", name: "Priya Patel", email: "priya@example.com", condition: "Knee rehabilitation", progress: 64, lastVisit: "Today", status: "Active" },
    { id: "p3", name: "Amit Kumar", email: "amit@example.com", condition: "Post-surgery recovery", progress: 48, lastVisit: "Yesterday", status: "Active" },
    { id: "p4", name: "Sneha Verma", email: "sneha@example.com", condition: "Neck pain", progress: 83, lastVisit: "Yesterday", status: "Active" },
    { id: "p5", name: "Vikram Singh", email: "vikram@example.com", condition: "Shoulder mobility", progress: 35, lastVisit: "12 Oct", status: "Needs review" }
  ],
  plans: [
    { id: "t1", patientName: "Rahul Sharma", title: "Back pain recovery plan", phase: "Phase 2 · Strengthening", progress: 72, status: "Active", nextReview: "24 Oct" },
    { id: "t2", patientName: "Priya Patel", title: "Knee rehabilitation", phase: "Phase 1 · Mobility", progress: 64, status: "Active", nextReview: "25 Oct" },
    { id: "t3", patientName: "Amit Kumar", title: "Post-surgery recovery", phase: "Phase 1 · Pain management", progress: 48, status: "Needs review", nextReview: "Today" }
  ],
  exercises: [
    { id: "e1", title: "Neck stretches", area: "Neck", level: "Beginner", duration: "5 min", category: "Mobility" },
    { id: "e2", title: "Shoulder rotations", area: "Shoulder", level: "Beginner", duration: "8 min", category: "Mobility" },
    { id: "e3", title: "Knee strengthening", area: "Knee", level: "Intermediate", duration: "12 min", category: "Strength" },
    { id: "e4", title: "Bridge exercise", area: "Lower back", level: "Beginner", duration: "6 min", category: "Strength" },
    { id: "e5", title: "Hamstring stretch", area: "Legs", level: "Beginner", duration: "5 min", category: "Flexibility" },
    { id: "e6", title: "Ankle mobility", area: "Ankle", level: "Intermediate", duration: "7 min", category: "Mobility" }
  ],
  messages: [
    { id: "m1", patientName: "Rahul Sharma", message: "Thank you for the guidance. My back feels better.", time: "10:30 AM", unread: true },
    { id: "m2", patientName: "Priya Patel", message: "When should I start the next exercise?", time: "Yesterday", unread: true },
    { id: "m3", patientName: "Amit Kumar", message: "Can I continue these exercises at home?", time: "Yesterday", unread: true },
    { id: "m4", patientName: "Sneha Verma", message: "The pain has reduced, thank you.", time: "2 days ago", unread: false }
  ],
  reports: { improvement: 75, painTrend: [8, 7, 7, 5, 4, 3, 2], mobility: [3, 4, 4, 5, 6, 7, 8] },
  profile: { name: "Dr. Arjun Mehta", email: "arjun@rehabics.com", phone: "+91 98765 43210", specialty: "Orthopedic Physiotherapy", clinic: "Rehabics Wellness Clinic", bio: "Helping patients build strength, restore mobility, and return to everyday life." }
};

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map(s => s[0]).join("").toUpperCase() || "PT";
}
function Status({ value }) {
  const key = String(value || "Active").toLowerCase().replace(/\s+/g, "-");
  return <span className={`rp-status rp-status--${key}`}>{value || "Active"}</span>;
}
function PageTitle({ eyebrow = "REHABICS CLINIC", title, description, action }) {
  return <div className="rp-page-title"><div><p className="rp-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="rp-muted">{description}</p></div>{action}</div>;
}
function Avatar({ name, small = false }) {
  return <div className={`rp-avatar ${small ? "rp-avatar--small" : ""}`} aria-label={name}>{initials(name)}</div>;
}
function Empty({ title, detail }) {
  return <div className="rp-empty"><div className="rp-empty-icon"><ClipboardCheck size={22}/></div><strong>{title}</strong><p>{detail}</p></div>;
}

function Overview({ data, loading, go }) {
  const o = data || DEMO.overview;
  return <div className="rp-page">
    <PageTitle title={`Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, ${o.doctor?.name || DEMO.overview.doctor.name}`} description="Here is your clinic overview for today." action={<div className="rp-date-chip"><CalendarDays size={18}/><span>{new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span></div>} />
    <div className="rp-stats">{(o.stats || DEMO.overview.stats).map((s, i) => { const Icon = s.icon || [CalendarCheck, Users, ClipboardList, HeartPulse][i]; return <article className="rp-stat" key={s.label}><div className={`rp-stat-icon rp-tone-${s.tone || ["blue","violet","cyan","amber"][i]}`}><Icon size={21}/></div><div className="rp-stat-copy"><span>{s.label}</span><strong>{s.value}</strong><small>{s.delta}</small></div><ArrowUpRight className="rp-stat-arrow" size={17}/></article>; })}</div>
    <div className="rp-dashboard-grid">
      <section className="rp-card rp-appointments-card"><div className="rp-card-head"><div><h2>Today's appointments</h2><p>Keep your schedule on track</p></div><button className="rp-link-button" onClick={() => go("/doctor/appointments")}>View all <ChevronRight size={16}/></button></div>
        <div className="rp-appointment-list">{(o.appointments || []).length ? o.appointments.slice(0, 5).map(a => <div className="rp-appointment-row" key={a.id}><div className="rp-time"><Clock3 size={14}/>{a.time}</div><Avatar name={a.patientName} small/><div className="rp-appointment-person"><strong>{a.patientName}</strong><span>{a.reason}</span></div><Status value={a.status}/></div>) : <Empty title="No appointments yet" detail="New bookings will appear here."/>}</div>
      </section>
      <section className="rp-card rp-week-card"><div className="rp-card-head"><div><h2>Weekly appointments</h2><p>Session volume this week</p></div><span className="rp-soft-badge">This week</span></div><div className="rp-bars">{(o.weekly || DEMO.overview.weekly).map(d => <div className="rp-bar-column" key={d.day}><span>{d.count}</span><div className="rp-bar-track"><div className="rp-bar" style={{height: `${Math.max(8, d.count / Math.max(...(o.weekly || DEMO.overview.weekly).map(x => x.count)) * 100)}%`}}/></div><small>{d.day}</small></div>)}</div></section>
    </div>
    <section className="rp-card rp-recent-card"><div className="rp-card-head"><div><h2>Recent patients</h2><p>Latest activity in your care list</p></div><button className="rp-link-button" onClick={() => go("/doctor/patients")}>All patients <ChevronRight size={16}/></button></div>
      <div className="rp-recent-grid">{(o.recentPatients || []).map(p => <button className="rp-recent-patient" key={p.id} onClick={() => go("/doctor/patients")}><Avatar name={p.name}/><span><strong>{p.name}</strong><small>{p.condition}</small></span><em>{p.lastVisit}</em><ChevronRight size={16}/></button>)}</div>
    </section>
    {loading && <p className="rp-inline-note">Refreshing clinic data…</p>}
  </div>;
}

function Appointments({ data, refresh, busy, setBusy }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const items = (data || DEMO.appointments).filter(a => (filter === "All" || a.status === filter) && `${a.patientName} ${a.reason} ${a.date}`.toLowerCase().includes(query.toLowerCase()));
  const changeStatus = async (a, status) => {
    setBusy(a.id);
    try { await updateDoctorAppointmentStatus(a.id, status); await refresh(); }
    catch (e) { window.alert(e.message || "Could not update appointment. Check API route configuration."); }
    finally { setBusy(""); }
  };
  return <div className="rp-page"><PageTitle title="Appointments" description="Manage bookings and keep every session organized." action={<button className="rp-primary-button" onClick={() => window.alert("Connect your existing booking flow to create appointments.")}><Plus size={17}/> New appointment</button>}/>
    <section className="rp-card"><div className="rp-toolbar"><div className="rp-search rp-search--inline"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search patient or appointment"/></div><div className="rp-filter"><Filter size={16}/><select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter appointments"><option>All</option><option>Confirmed</option><option>Pending</option><option>Completed</option><option>Cancelled</option></select></div></div>
      {items.length ? <div className="rp-table-wrap"><table className="rp-table"><thead><tr><th>Patient</th><th>Date & time</th><th>Session</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map(a => <tr key={a.id}><td><div className="rp-table-person"><Avatar name={a.patientName} small/><span><strong>{a.patientName}</strong><small>{a.reason}</small></span></div></td><td>{a.date || "Today"}<small className="rp-cell-sub">{a.time}</small></td><td>{a.type || "In clinic"}</td><td><Status value={a.status}/></td><td><select className="rp-action-select" value={a.status} disabled={busy === a.id} onChange={e => changeStatus(a, e.target.value)} aria-label={`Update ${a.patientName} appointment`}><option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select></td></tr>)}</tbody></table></div> : <Empty title="No matching appointments" detail="Try another search or status filter."/>}
    </section></div>;
}

function Patients({ data, go }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const items = (data || DEMO.patients).filter(p => `${p.name} ${p.condition} ${p.email}`.toLowerCase().includes(query.toLowerCase()) && (status === "All" || p.status === status));
  return <div className="rp-page"><PageTitle title="My patients" description="Review patient details and follow recovery milestones." action={<span className="rp-soft-badge"><Users size={15}/>{items.length} patients</span>}/><section className="rp-card"><div className="rp-toolbar"><div className="rp-search rp-search--inline"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, condition, email"/></div><div className="rp-filter"><Filter size={16}/><select value={status} onChange={e => setStatus(e.target.value)}><option>All</option><option>Active</option><option>Needs review</option></select></div></div>
    {items.length ? <div className="rp-patient-grid">{items.map(p => <article className="rp-patient-card" key={p.id}><div className="rp-patient-card-top"><Avatar name={p.name}/><Status value={p.status}/></div><h3>{p.name}</h3><p>{p.condition}</p><div className="rp-patient-email"><Mail size={14}/>{p.email}</div><div className="rp-progress-head"><span>Recovery progress</span><strong>{p.progress}%</strong></div><div className="rp-progress-track"><span style={{width:`${p.progress}%`}}/></div><div className="rp-patient-foot"><small>Last visit: {p.lastVisit}</small><button className="rp-link-button" onClick={() => go("/doctor/treatment-plans")}>View care plan <ChevronRight size={15}/></button></div></article>)}</div> : <Empty title="No patients found" detail="Adjust your search and try again."/>}</section></div>;
}

function TreatmentPlans({ data, refresh, setBusy }) {
  const [query, setQuery] = useState("");
  const items = (data || DEMO.plans).filter(p => `${p.patientName} ${p.title} ${p.phase}`.toLowerCase().includes(query.toLowerCase()));
  const review = async p => {
    setBusy(p.id);
    try { await updateTreatmentPlan(p.id, { status: p.status === "Needs review" ? "Active" : "Needs review" }); await refresh(); }
    catch (e) { window.alert(e.message || "Could not update treatment plan. Check API route configuration."); }
    finally { setBusy(""); }
  };
  return <div className="rp-page"><PageTitle title="Treatment plans" description="Track personalized recovery journeys and plan reviews." action={<button className="rp-primary-button" onClick={() => window.alert("Connect this action to your existing treatment plan creation flow.")}><Plus size={17}/> Create plan</button>}/><section className="rp-card"><div className="rp-toolbar"><div className="rp-search rp-search--inline"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search plans or patients"/></div><span className="rp-soft-badge">{items.length} plans</span></div>
    {items.length ? <div className="rp-plan-list">{items.map(p=><article className="rp-plan-row" key={p.id}><div className="rp-plan-icon"><ClipboardList size={21}/></div><div className="rp-plan-main"><div className="rp-plan-title"><h3>{p.title}</h3><Status value={p.status}/></div><p>{p.patientName} <span>•</span> {p.phase}</p><div className="rp-progress-track"><span style={{width:`${p.progress}%`}}/></div><small>{p.progress}% completed</small></div><div className="rp-plan-review"><small>Next review</small><strong>{p.nextReview}</strong><button className="rp-secondary-button" onClick={()=>review(p)}>{p.status === "Needs review" ? "Mark active" : "Flag review"}</button></div></article>)}</div> : <Empty title="No treatment plans found" detail="Create a plan or try a different search."/>}</section></div>;
}

function Exercises({ data }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const items = (data || DEMO.exercises).filter(e => `${e.title} ${e.area} ${e.category}`.toLowerCase().includes(query.toLowerCase()) && (category === "All" || e.category === category));
  return <div className="rp-page"><PageTitle title="Exercise library" description="Browse movements to support patient-specific exercise plans." action={<span className="rp-soft-badge"><Dumbbell size={15}/>{items.length} exercises</span>}/><section className="rp-exercise-grid">
    <div className="rp-toolbar rp-toolbar--wide"><div className="rp-search rp-search--inline"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search exercises"/></div><div className="rp-filter"><Filter size={16}/><select value={category} onChange={e=>setCategory(e.target.value)}><option>All</option><option>Mobility</option><option>Strength</option><option>Flexibility</option></select></div></div>
    {items.map((e,i)=><article className="rp-exercise-card" key={e.id}><div className={`rp-exercise-art rp-exercise-art--${i%4}`}><Activity size={33}/><span>{e.area}</span></div><div className="rp-exercise-content"><div className="rp-exercise-meta"><span>{e.category}</span><span>{e.duration}</span></div><h3>{e.title}</h3><p>{e.level} · {e.area}</p><button className="rp-secondary-button" onClick={()=>window.alert("Connect this exercise to your existing treatment plan assignment API.")}>Assign to patient <ArrowUpRight size={15}/></button></div></article>)}
    {!items.length && <div className="rp-card"><Empty title="No exercises found" detail="Try another search or category."/></div>}
  </section></div>;
}

function Messages({ data }) {
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const current = selected || (data || DEMO.messages)[0];
  return <div className="rp-page"><PageTitle title="Messages" description="Keep patient communication clear and connected."/><section className="rp-card rp-messages-layout"><div className="rp-message-list"><div className="rp-message-list-head"><strong>Conversations</strong><span>{(data || DEMO.messages).filter(m=>m.unread).length} unread</span></div>{(data || DEMO.messages).map(m=><button className={`rp-message-item ${current?.id===m.id?"is-selected":""}`} key={m.id} onClick={()=>{setSelected(m);setReply("");}}><Avatar name={m.patientName} small/><span><strong>{m.patientName}</strong><small>{m.message}</small></span><time>{m.time}</time>{m.unread&&<i/>}</button>)}</div><div className="rp-message-thread"><div className="rp-thread-head"><Avatar name={current?.patientName || "Patient"}/><span><strong>{current?.patientName || "Patient"}</strong><small>Patient conversation</small></span><button className="rp-icon-button" aria-label="More conversation options"><MoreHorizontal size={19}/></button></div><div className="rp-thread-body"><div className="rp-chat-date">Recent message</div><div className="rp-chat-bubble">{current?.message || "No message selected."}<small>{current?.time}</small></div><p className="rp-inline-note">Connect your messaging API to load full conversation history and send replies.</p></div><form className="rp-reply-box" onSubmit={e=>{e.preventDefault(); if(reply.trim()) window.alert("Connect send action to your messaging API before sending patient replies.");}}><input value={reply} onChange={e=>setReply(e.target.value)} placeholder="Write a reply…" aria-label="Write a reply"/><button className="rp-primary-button" type="submit">Send <ArrowUpRight size={16}/></button></form></div></section></div>;
}

function Reports({ data }) {
  const report = data || DEMO.reports;
  return <div className="rp-page"><PageTitle title="Reports & progress" description="Review recovery signals and treatment outcomes." action={<button className="rp-secondary-button" onClick={()=>window.print()}><FileText size={16}/> Print report</button>}/><div className="rp-report-stats"><div className="rp-card"><span className="rp-muted">Overall improvement</span><strong className="rp-report-number">{report.improvement}%</strong><div className="rp-progress-track"><span style={{width:`${report.improvement}%`}}/></div><small>Illustrative summary. Use verified clinical data in production.</small></div><div className="rp-card"><span className="rp-muted">Pain level trend</span><div className="rp-mini-chart">{(report.painTrend || DEMO.reports.painTrend).map((v,i)=><div key={i} className="rp-mini-column"><span style={{height:`${v*10}%`}}/><small>{["M","T","W","T","F","S","S"][i]}</small></div>)}</div><p className="rp-chart-caption"><ArrowDownRight size={16}/> Lower pain scores may indicate improvement when clinically validated.</p></div><div className="rp-card"><span className="rp-muted">Mobility trend</span><div className="rp-mini-chart rp-mini-chart--cyan">{(report.mobility || DEMO.reports.mobility).map((v,i)=><div key={i} className="rp-mini-column"><span style={{height:`${v*10}%`}}/><small>{["M","T","W","T","F","S","S"][i]}</small></div>)}</div><p className="rp-chart-caption"><ArrowUpRight size={16}/> Review alongside the patient’s assessment.</p></div></div><section className="rp-card"><div className="rp-card-head"><div><h2>Clinical reporting</h2><p>Keep notes and outcomes linked to verified patient records.</p></div></div><Empty title="Reports depend on your API data" detail="Connect your outcome assessments and progress endpoints to populate clinical reports." /></section></div>;
}

function SettingsPage({ data, refresh }) {
  const profile = data || DEMO.profile;
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  useEffect(()=>setForm(profile), [profile]);
  const update = (key, value) => setForm(prev=>({...prev,[key]:value}));
  const submit = async e => {
    e.preventDefault(); setSaving(true);
    try { await updateDoctorProfile(form); await refresh(); window.alert("Profile update request completed."); }
    catch (err) { window.alert(err.message || "Could not update profile. Check API route configuration."); }
    finally { setSaving(false); }
  };
  return <div className="rp-page"><PageTitle title="Profile & settings" description="Manage your professional details and clinic information."/><section className="rp-card rp-settings-card"><div className="rp-profile-banner"><div className="rp-profile-avatar"><Stethoscope size={28}/></div><div><h2>{form.name || "Doctor profile"}</h2><p>{form.specialty || "Physiotherapist"}</p><span className="rp-soft-badge"><CheckCircle2 size={14}/> Professional profile</span></div></div><form className="rp-settings-form" onSubmit={submit}><div className="rp-form-grid">{[["name","Full name"],["email","Email address"],["phone","Phone number"],["specialty","Specialty"],["clinic","Clinic name"]].map(([key,label])=><label className="rp-field" key={key}>{label}<input value={form[key] || ""} onChange={e=>update(key,e.target.value)} required={["name","email"].includes(key)} type={key==="email"?"email":"text"}/></label>)}<label className="rp-field rp-field--full">Professional bio<textarea rows="4" value={form.bio || ""} onChange={e=>update("bio",e.target.value)}/></label></div><div className="rp-form-actions"><span className="rp-muted">Changes are saved through your configured API.</span><button className="rp-primary-button" disabled={saving} type="submit">{saving?"Saving…":"Save changes"}</button></div></form></section></div>;
}

export default function DoctorPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState("");
  const [overview, setOverview] = useState(DEMO.overview);
  const [appointments, setAppointments] = useState(DEMO.appointments);
  const [patients, setPatients] = useState(DEMO.patients);
  const [plans, setPlans] = useState(DEMO.plans);
  const [exercises, setExercises] = useState(DEMO.exercises);
  const [messages, setMessages] = useState(DEMO.messages);
  const [reports, setReports] = useState(DEMO.reports);
  const [profile, setProfile] = useState(DEMO.profile);
  const currentNav = NAV.find(n => n.to === location.pathname) || NAV[0];

  const refresh = async () => {
    setLoading(true);
    const jobs = [
      ["overview", getDoctorOverview, setOverview],
      ["appointments", getDoctorAppointments, setAppointments],
      ["patients", getDoctorPatients, setPatients],
      ["plans", getTreatmentPlans, setPlans],
      ["exercises", getExerciseLibrary, setExercises],
      ["messages", getDoctorMessages, setMessages],
      ["reports", getDoctorReports, setReports],
      ["profile", getDoctorProfile, setProfile]
    ];
    await Promise.all(jobs.map(async ([key, fn, setter]) => {
      try { const result = await fn(); if (result != null) setter(Array.isArray(result) ? result : (result.data ?? result[key] ?? result)); }
      catch (err) { console.info(`[Rehabics Doctor Panel] ${key} API not connected; demo fallback remains active.`, err.message); }
    }));
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);
  useEffect(() => { document.documentElement.dataset.rehabicsDoctorTheme = dark ? "dark" : "light"; return () => { delete document.documentElement.dataset.rehabicsDoctorTheme; }; }, [dark]);
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const quickResults = useMemo(() => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase();
    return [...(patients || []), ...(appointments || []).map(a=>({ ...a, name:a.patientName, condition:a.reason, id:a.id }))].filter(x=>`${x.name} ${x.condition || ""}`.toLowerCase().includes(q)).slice(0,5);
  }, [globalSearch, patients, appointments]);

  return <div className={`rp-shell ${dark ? "rp-shell--dark" : ""}`}>
    <aside className={`rp-sidebar ${mobileOpen?"rp-sidebar--open":""}`}>
      <div className="rp-brand"><div className="rp-brand-mark"><Activity size={23}/></div><span>rehabics<small>Move better. Live brighter.</small></span><button className="rp-mobile-close rp-icon-button" onClick={()=>setMobileOpen(false)} aria-label="Close menu"><X size={20}/></button></div>
      <div className="rp-workspace"><div className="rp-workspace-dot"/><span>Physiotherapy workspace</span><ChevronRight size={15}/></div>
      <nav className="rp-nav" aria-label="Doctor navigation">{NAV.map(item=>{const Icon=item.icon;return <NavLink key={item.to} to={item.to} end={item.end} className={({isActive})=>`rp-nav-link ${isActive?"is-active":""}`}><Icon size={18}/><span>{item.label}</span>{item.count&&<em>{item.count}</em>}</NavLink>;})}</nav>
      <div className="rp-sidebar-help"><div className="rp-help-icon"><HeartPulse size={18}/></div><strong>Need a hand?</strong><p>Visit the help center for dashboard guidance.</p><button onClick={()=>window.alert("Connect this action to your support/help center.")}>Get support <ArrowUpRight size={14}/></button></div>
      <button className="rp-doctor-profile" onClick={()=>navigate("/doctor/settings")}><Avatar name={profile.name || DEMO.profile.name}/><span><strong>{profile.name || DEMO.profile.name}</strong><small>{profile.specialty || "Physiotherapist"}</small></span><ChevronRight size={16}/></button>
    </aside>
    {mobileOpen&&<button className="rp-mobile-scrim" aria-label="Close navigation" onClick={()=>setMobileOpen(false)}/>}
    <main className="rp-main">
      <header className="rp-topbar"><div className="rp-topbar-left"><button className="rp-menu-button rp-icon-button" onClick={()=>setMobileOpen(true)} aria-label="Open navigation"><Menu size={21}/></button><div className="rp-search rp-global-search"><Search size={18}/><input value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)} placeholder="Search patients, appointments or notes…" aria-label="Search patients and appointments"/>{globalSearch&&<button onClick={()=>setGlobalSearch("")} aria-label="Clear search"><X size={15}/></button>}{quickResults.length>0&&<div className="rp-search-results">{quickResults.map(x=><button key={x.id} onClick={()=>{setGlobalSearch("");navigate("/doctor/patients");}}><Avatar name={x.name} small/><span><strong>{x.name}</strong><small>{x.condition}</small></span></button>)}</div>}</div></div><div className="rp-topbar-actions"><button className="rp-theme-toggle" onClick={()=>setDark(v=>!v)} aria-label={dark?"Switch to light theme":"Switch to dark theme"}>{dark?<Moon size={17}/>:<Sun size={17}/>}<span className="rp-toggle-knob"/></button><button className="rp-icon-button rp-notification-button" onClick={()=>navigate("/doctor/messages")} aria-label="Open messages"><Bell size={19}/><i/></button><button className="rp-top-profile" onClick={()=>navigate("/doctor/settings")}><Avatar name={profile.name || DEMO.profile.name} small/><span><strong>{profile.name || DEMO.profile.name}</strong><small>Physiotherapist</small></span><ChevronRight size={15}/></button></div></header>
      <div className="rp-content"><Routes>
        <Route index element={<Overview data={overview} loading={loading} go={navigate}/>}/>
        <Route path="appointments" element={<Appointments data={appointments} refresh={refresh} busy={busy} setBusy={setBusy}/>}/>
        <Route path="patients" element={<Patients data={patients} go={navigate}/>}/>
        <Route path="treatment-plans" element={<TreatmentPlans data={plans} refresh={refresh} setBusy={setBusy}/>}/>
        <Route path="exercises" element={<Exercises data={exercises}/>}/>
        <Route path="messages" element={<Messages data={messages}/>}/>
        <Route path="reports" element={<Reports data={reports}/>}/>
        <Route path="settings" element={<SettingsPage data={profile} refresh={refresh}/>}/>
        <Route path="*" element={<Overview data={overview} loading={loading} go={navigate}/>}/>
      </Routes></div>
      <footer className="rp-footer"><span>© {new Date().getFullYear()} Rehabics. Care that moves with you.</span><span><i/> All systems operational</span></footer>
    </main>
  </div>;
}
