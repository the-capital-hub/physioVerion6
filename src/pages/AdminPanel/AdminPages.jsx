
import { useState } from "react";
import {
  Search, Plus, Download, Filter, MoreHorizontal,
  Users, CalendarCheck, IndianRupee, TrendingUp, Save
} from "lucide-react";
import "./AdminPanel.css";

const patientData = [
  { name: "Ananya Sharma", email: "ananya@example.com", condition: "Knee Rehabilitation", joined: "12 Oct 2026", status: "Active" },
  { name: "Rohan Kumar", email: "rohan@example.com", condition: "Sports Injury", joined: "10 Oct 2026", status: "Active" },
  { name: "Meera Patel", email: "meera@example.com", condition: "Back Pain", joined: "08 Oct 2026", status: "Active" },
  { name: "Arjun Rao", email: "arjun@example.com", condition: "Post Surgery Rehab", joined: "05 Oct 2026", status: "Inactive" },
];

const physioData = [
  { name: "Dr. Rahul Verma", email: "rahul@example.com", specialty: "Orthopaedic", patients: 32, status: "Active" },
  { name: "Dr. Priya Singh", email: "priya@example.com", specialty: "Sports Therapy", patients: 28, status: "Active" },
  { name: "Dr. Amit Das", email: "amit@example.com", specialty: "Neurological", patients: 21, status: "Active" },
  { name: "Dr. Neha Gupta", email: "neha@example.com", specialty: "Rehabilitation", patients: 18, status: "Pending" },
];

const appointmentData = [
  { patient: "Ananya Sharma", physio: "Dr. Rahul Verma", service: "Knee Rehabilitation", date: "22 Oct 2026, 10:30 AM", status: "Confirmed" },
  { patient: "Rohan Kumar", physio: "Dr. Priya Singh", service: "Sports Injury", date: "22 Oct 2026, 11:00 AM", status: "Pending" },
  { patient: "Meera Patel", physio: "Dr. Amit Das", service: "Back Pain Therapy", date: "23 Oct 2026, 12:15 PM", status: "Confirmed" },
  { patient: "Arjun Rao", physio: "Dr. Neha Gupta", service: "Post Surgery Rehab", date: "24 Oct 2026, 02:00 PM", status: "Cancelled" },
];

function PageHeading({ eyebrow, title, description, action, onAction }) {
  return (
    <div className="admin-page-heading">
      <div>
        <p className="admin-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="admin-muted">{description}</p>
      </div>
      {action && <button className="admin-primary-button" onClick={onAction}><Plus size={16} /> {action}</button>}
    </div>
  );
}

function DataTable({ headers, rows, searchValue }) {
  const filteredRows = rows.filter((row) =>
    row.join(" ").toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="admin-table-scroll">
      <table className="admin-table">
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}<th>Actions</th></tr></thead>
        <tbody>
          {filteredRows.map((row, index) => (
            <tr key={`${row[0]}-${index}`}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {cellIndex === row.length - 1 && ["Active", "Inactive", "Pending", "Confirmed", "Cancelled", "Completed"].includes(cell) ? (
                    <span className={`admin-badge ${cell.toLowerCase()}`}>{cell}</span>
                  ) : cell}
                </td>
              ))}
              <td><button className="admin-row-action" title="More actions" onClick={() => alert("Connect this action to your backend.")}><MoreHorizontal size={18} /></button></td>
            </tr>
          ))}
          {filteredRows.length === 0 && (
            <tr><td colSpan={headers.length + 1} className="admin-empty">No matching records found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ManagementPage({ eyebrow, title, description, action, headers, rows }) {
  const [search, setSearch] = useState("");
  return (
    <div className="admin-page">
      <PageHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={action}
        onAction={() => alert(`Connect "${action}" to your backend API.`)}
      />
      <section className="admin-card admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-search admin-page-search">
            <Search size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${title.toLowerCase()}...`} />
          </div>
          <button className="admin-secondary-button" onClick={() => alert("Connect filters to your API.")}><Filter size={15} /> Filters</button>
          <button className="admin-secondary-button" onClick={() => window.print()}><Download size={15} /> Export</button>
        </div>
        <DataTable headers={headers} rows={rows} searchValue={search} />
        <div className="admin-table-footer">Showing {rows.filter((r) => r.join(" ").toLowerCase().includes(search.toLowerCase())).length} of {rows.length} records</div>
      </section>
    </div>
  );
}

export function AdminPatients() {
  return <ManagementPage
    eyebrow="MANAGEMENT" title="Patients" description="Manage patient records and rehabilitation journeys."
    action="Add Patient"
    headers={["Patient", "Email", "Condition", "Joined", "Status"]}
    rows={patientData.map((p) => [p.name, p.email, p.condition, p.joined, p.status])}
  />;
}

export function AdminPhysiotherapists() {
  return <ManagementPage
    eyebrow="TEAM MANAGEMENT" title="Physiotherapists" description="Manage practitioners, specialties and approvals."
    action="Add Physiotherapist"
    headers={["Physiotherapist", "Email", "Specialty", "Patients", "Status"]}
    rows={physioData.map((p) => [p.name, p.email, p.specialty, String(p.patients), p.status])}
  />;
}

export function AdminAppointments() {
  return <ManagementPage
    eyebrow="SCHEDULING" title="Appointments" description="Track bookings, schedules and appointment status."
    action="New Appointment"
    headers={["Patient", "Physiotherapist", "Service", "Date & Time", "Status"]}
    rows={appointmentData.map((a) => [a.patient, a.physio, a.service, a.date, a.status])}
  />;
}

export function AdminTreatmentPlans() {
  return <ManagementPage
    eyebrow="CARE MANAGEMENT" title="Treatment Plans" description="Review rehabilitation plans and care progress."
    action="Create Plan"
    headers={["Plan", "Patient", "Physiotherapist", "Duration", "Status"]}
    rows={[
      ["Knee Mobility Recovery", "Ananya Sharma", "Dr. Rahul Verma", "6 weeks", "Active"],
      ["Sports Injury Recovery", "Rohan Kumar", "Dr. Priya Singh", "4 weeks", "Active"],
      ["Back Pain Management", "Meera Patel", "Dr. Amit Das", "8 weeks", "Pending"],
      ["Post-Operative Rehab", "Arjun Rao", "Dr. Neha Gupta", "12 weeks", "Completed"],
    ]}
  />;
}

export function AdminAnalytics() {
  const metrics = [
    { label: "Patient Growth", value: "+12.8%", icon: Users },
    { label: "Appointments", value: "356", icon: CalendarCheck },
    { label: "Monthly Revenue", value: "₹2.48L", icon: IndianRupee },
    { label: "Growth Rate", value: "+8.4%", icon: TrendingUp },
  ];

  return (
    <div className="admin-page">
      <PageHeading eyebrow="INSIGHTS" title="Analytics & Reports" description="Monitor platform performance using overview metrics." />
      <div className="admin-stats-grid">
        {metrics.map(({ label, value, icon: Icon }) => (
          <article className="admin-stat-card" key={label}>
            <div className="admin-stat-top"><span>{label}</span><span className="admin-stat-icon"><Icon size={19} /></span></div>
            <h2>{value}</h2><div className="admin-stat-foot">Sample reporting data</div>
          </article>
        ))}
      </div>
      <section className="admin-card admin-info-card">
        <h2>Reporting information</h2>
        <p className="admin-muted">These metrics are placeholders. Connect your API and database to calculate accurate revenue, patient growth and appointment completion rates.</p>
        <button className="admin-secondary-button" onClick={() => window.print()}><Download size={15} /> Print report</button>
      </section>
    </div>
  );
}

export function AdminSettings() {
  const [settings, setSettings] = useState({
    platformName: "Rehabics",
    supportEmail: "support@rehabics.com",
    timezone: "Asia/Kolkata",
    notifications: true,
  });
  const [saved, setSaved] = useState(false);

  function update(field, value) {
    setSettings((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function saveSettings(e) {
    e.preventDefault();
    // Demo only. Persist settings through your backend in production.
    setSaved(true);
  }

  return (
    <div className="admin-page">
      <PageHeading eyebrow="CONFIGURATION" title="Settings" description="Manage your platform preferences." />
      <form className="admin-card admin-settings-card" onSubmit={saveSettings}>
        <h2>General settings</h2>
        <p className="admin-muted">Update basic platform details.</p>
        <label>Platform name
          <input value={settings.platformName} onChange={(e) => update("platformName", e.target.value)} required />
        </label>
        <label>Support email
          <input type="email" value={settings.supportEmail} onChange={(e) => update("supportEmail", e.target.value)} required />
        </label>
        <label>Timezone
          <select value={settings.timezone} onChange={(e) => update("timezone", e.target.value)}>
            <option value="Asia/Kolkata">India Standard Time (Asia/Kolkata)</option>
            <option value="UTC">UTC</option>
          </select>
        </label>
        <label className="admin-toggle-row">
          <span><strong>Email notifications</strong><small>Enable platform notification preferences</small></span>
          <input type="checkbox" checked={settings.notifications} onChange={(e) => update("notifications", e.target.checked)} />
        </label>
        <div className="admin-settings-actions">
          {saved && <span className="admin-positive">Settings updated in this demo.</span>}
          <button className="admin-primary-button" type="submit"><Save size={16} /> Save settings</button>
        </div>
      </form>
    </div>
  );
}
