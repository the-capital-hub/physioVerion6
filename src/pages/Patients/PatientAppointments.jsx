
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  Video,
  MapPin,
  Plus,
  Search,
  XCircle,
  CheckCircle2,
  ArrowUpRight,
  CalendarCheck,
} from "lucide-react";
import "./PatientDashboard.css";

const sample = [
  {
    id: 1,
    doctor: "Dr. Ananya Sharma",
    specialty: "Senior Physiotherapist",
    date: "24 Oct 2026",
    time: "10:30 AM",
    type: "Video consultation",
    status: "Confirmed",
  },
  {
    id: 2,
    doctor: "Dr. Rahul Verma",
    specialty: "Musculoskeletal Physiotherapy",
    date: "29 Oct 2026",
    time: "04:00 PM",
    type: "Clinic visit",
    status: "Pending",
  },
];

export default function PatientAppointments() {
  const navigate = useNavigate();

  const [items, setItems] = useState(sample);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = items.filter(
    (appointment) =>
      (filter === "All" || appointment.status === filter) &&
      `${appointment.doctor} ${appointment.specialty}`
        .toLowerCase()
        .includes(query.toLowerCase().trim())
  );

  const cancelAppointment = (id) => {
    const confirmed = window.confirm(
      "Remove this demo appointment from the list?"
    );

    if (confirmed) {
      setItems((previous) =>
        previous.filter((appointment) => appointment.id !== id)
      );
    }
  };

  return (
    <div className="patient-page">
      <motion.section
        className="patient-page-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <span className="patient-eyebrow">
            <span className="patient-live-dot" />
            YOUR CARE SCHEDULE
          </span>

          <h1>Appointments</h1>

          <p>
            Manage your upcoming physiotherapy sessions in one place.
          </p>
        </div>

        <button
          type="button"
          className="patient-primary-button patient-title-action"
          onClick={() => navigate("/therapists")}
        >
          <Plus size={17} />
          Book a session
          <ArrowUpRight size={16} />
        </button>
      </motion.section>

      <section className="patient-stat-grid patient-stat-grid-three">
        <motion.article
          className="patient-stat-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="patient-stat-top">
            <div className="patient-stat-icon purple">
              <CalendarDays size={21} />
            </div>
          </div>
          <strong className="patient-stat-value">
            {String(items.length).padStart(2, "0")}
          </strong>
          <span className="patient-stat-label">Total sessions</span>
          <div className="patient-stat-bottom">
            <span>All listed appointments</span>
          </div>
        </motion.article>

        <motion.article
          className="patient-stat-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="patient-stat-top">
            <div className="patient-stat-icon green">
              <CheckCircle2 size={21} />
            </div>
          </div>
          <strong className="patient-stat-value">
            {String(
              items.filter((appointment) => appointment.status === "Confirmed")
                .length
            ).padStart(2, "0")}
          </strong>
          <span className="patient-stat-label">Confirmed</span>
          <div className="patient-stat-bottom">
            <span>Sessions marked confirmed</span>
          </div>
        </motion.article>

        <motion.article
          className="patient-stat-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="patient-stat-top">
            <div className="patient-stat-icon orange">
              <Clock3 size={21} />
            </div>
          </div>
          <strong className="patient-stat-value">
            {String(
              items.filter((appointment) => appointment.status === "Pending")
                .length
            ).padStart(2, "0")}
          </strong>
          <span className="patient-stat-label">Awaiting confirmation</span>
          <div className="patient-stat-bottom">
            <span>Sessions marked pending</span>
          </div>
        </motion.article>
      </section>

      <motion.section
        className="patient-panel patient-appointments-panel"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
      >
        <div className="patient-panel-heading">
          <div>
            <span className="patient-panel-kicker">YOUR SCHEDULE</span>
            <h2>All appointments</h2>
            <p>Search and filter your listed sessions.</p>
          </div>

          <div className="patient-appointments-heading-icon">
            <CalendarCheck size={22} />
          </div>
        </div>

        <div className="patient-list-toolbar">
          <label className="patient-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search physiotherapist..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search physiotherapist or specialty"
            />
            {query && (
              <button
                type="button"
                className="patient-search-clear"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <XCircle size={16} />
              </button>
            )}
          </label>

          <div className="patient-filter-tabs" aria-label="Filter appointments">
            {["All", "Confirmed", "Pending"].map((status) => (
              <button
                type="button"
                key={status}
                className={filter === status ? "selected" : ""}
                aria-pressed={filter === status}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="patient-appointment-list">
          {filtered.map((appointment, index) => {
            const initials = appointment.doctor
              .replace("Dr. ", "")
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <motion.article
                className="patient-appointment-row"
                key={appointment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="patient-doctor-avatar">{initials}</div>

                <div className="patient-doctor-info">
                  <h3>{appointment.doctor}</h3>
                  <p>{appointment.specialty}</p>

                  <div className="patient-appointment-meta">
                    <span>
                      <CalendarDays size={15} />
                      {appointment.date}
                    </span>

                    <span>
                      <Clock3 size={15} />
                      {appointment.time}
                    </span>

                    <span>
                      {appointment.type.includes("Video") ? (
                        <Video size={15} />
                      ) : (
                        <MapPin size={15} />
                      )}
                      {appointment.type}
                    </span>
                  </div>
                </div>

                <span
                  className={`patient-status ${appointment.status.toLowerCase()}`}
                >
                  <span />
                  {appointment.status}
                </span>

                <button
                  type="button"
                  className="patient-remove-button"
                  title="Remove demo appointment"
                  aria-label={`Remove appointment with ${appointment.doctor}`}
                  onClick={() => cancelAppointment(appointment.id)}
                >
                  <XCircle size={19} />
                </button>
              </motion.article>
            );
          })}

          {filtered.length === 0 && (
            <div className="patient-empty-state">
              <span className="patient-empty-icon">
                <CalendarDays size={28} />
              </span>
              <h3>No appointments found</h3>
              <p>
                Try another search term or change the status filter.
              </p>
              <button
                type="button"
                className="patient-primary-button"
                onClick={() => {
                  setQuery("");
                  setFilter("All");
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </motion.section>

      <div className="patient-demo-note">
        <span className="patient-demo-note-icon">
          <CalendarCheck size={18} />
        </span>
        <p>
          <strong>Demo preview:</strong> appointments are stored in temporary
          component state. Removing an appointment here does not cancel a real
          booking. Connect your backend for persistent appointment management.
        </p>
      </div>

      <footer className="patient-page-footer">
        <span>Made with care by Rehabics 💜</span>
        <span>Patient appointments · Demo data</span>
      </footer>
    </div>
  );
}
