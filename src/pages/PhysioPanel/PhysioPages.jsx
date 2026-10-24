
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  Search,
  Filter,
  Plus,
  Clock3,
  Video,
  MapPin,
  Check,
  X,
  Users,
  ClipboardList,
  ChartNoAxesCombined,
  UserRound,
  Settings,
  Save,
  ChevronRight,
  CircleCheck,
  CircleAlert,
  FileText,
  Trash2,
  RefreshCw,
} from "lucide-react";
import "./PhysioPanel.css";

/* =========================================================
   API CONFIGURATION
   ========================================================= */

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const TONES = ["blue", "purple", "peach", "green", "pink"];

function getPhysioToken() {
  const keys = ["token", "accessToken", "authToken"];

  for (const key of keys) {
    const token =
      localStorage.getItem(key) ||
      sessionStorage.getItem(key);

    if (token) return token;
  }

  return null;
}

async function physioRequest(method, endpoint, data, options = {}) {
  const token = getPhysioToken();

  if (!token) {
    throw new Error("Your session has expired. Please log in again.");
  }

  const response = await axios({
    method,
    url: `${API_URL}${endpoint}`,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: options.signal,
  });

  return response.data;
}

function getInitials(name = "Patient") {
  return String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function getTone(index = 0) {
  return TONES[index % TONES.length];
}

function formatDate(value) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "Time not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Time not set";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isToday(value) {
  if (!value) return false;

  const date = new Date(value);
  const today = new Date();

  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function normalizeStatus(status = "") {
  return String(status).trim().toLowerCase();
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

function getPlanStatus(status = "") {
  const value = normalizeStatus(status);

  if (value === "completed") return "Completed";
  if (value === "paused") return "Paused";
  if (value === "needs review") return "Review due";

  return "In progress";
}

function getAppointmentStatus(status = "") {
  const value = normalizeStatus(status);

  if (value === "confirmed") return "Confirmed";
  if (value === "cancelled") return "Cancelled";
  if (value === "completed") return "Completed";
  if (value === "awaiting") return "Pending";

  return value
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : "Pending";
}

/* =========================================================
   SHARED COMPONENTS
   ========================================================= */

function PageHeader({
  eyebrow,
  title,
  description,
  action,
  onAction,
}) {
  return (
    <div className="physio-page-header">
      <div>
        <div className="physio-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {action && (
        <button
          className="physio-primary-button"
          onClick={onAction}
        >
          <Plus size={18} />
          {action}
        </button>
      )}
    </div>
  );
}

function SearchFilter({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="physio-list-toolbar">
      <label className="physio-list-search">
        <Search size={17} />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      </label>

      <span className="physio-results-note">
        <Filter size={15} />
        Live filter
      </span>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="physio-empty-state">
      <Search size={22} />
      <p>{text}</p>
    </div>
  );
}

function ApiMessage({ error, message, onDismiss, onRetry }) {
  if (!error && !message) return null;

  return (
    <div
      className="physio-inline-message"
      role={error ? "alert" : "status"}
    >
      {error ? (
        <CircleAlert size={16} />
      ) : (
        <CircleCheck size={16} />
      )}

      <span>{error || message}</span>

      {error && onRetry && (
        <button onClick={onRetry} aria-label="Retry">
          <RefreshCw size={15} />
        </button>
      )}

      {!error && onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss">
          <X size={15} />
        </button>
      )}
    </div>
  );
}

/* =========================================================
   APPOINTMENTS
   API:
   GET   /physiotherapist-portal/appointments
   PATCH /physiotherapist-portal/appointments/:id
   ========================================================= */

export function PhysioAppointments() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const loadAppointments = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const result = await physioRequest(
        "get",
        "/physiotherapist-portal/appointments",
        undefined,
        { signal }
      );

      setItems(
        Array.isArray(result.appointments)
          ? result.appointments
          : []
      );
    } catch (err) {
      if (err.code === "ERR_CANCELED") return;

      setError(
        getErrorMessage(err, "Unable to load appointments.")
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadAppointments(controller.signal);

    return () => controller.abort();
  }, [loadAppointments]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const patientName = item.patient || "Patient";
      const treatment = item.type || "Physiotherapy session";

      const matchesQuery = [
        patientName,
        treatment,
        item.id,
        item.patientEmail,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());

      const status = normalizeStatus(item.status);

      const matchesFilter =
        filter === "All" ||
        status === normalizeStatus(filter) ||
        (filter === "Pending" && status === "awaiting");

      return matchesQuery && matchesFilter;
    });
  }, [items, query, filter]);

  const todayItems = items.filter((item) => isToday(item.time));

  async function updateAppointment(id, status) {
    try {
      setUpdatingId(id);
      setError("");
      setMessage("");

      await physioRequest(
        "patch",
        `/physiotherapist-portal/appointments/${id}`,
        { status }
      );

      setMessage(`Appointment updated to ${status}.`);

      await loadAppointments();
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to update appointment.")
      );
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <div className="physio-page">
      <PageHeader
        eyebrow="SCHEDULE / APPOINTMENTS"
        title="Appointments"
        description="Review and manage your patient sessions."
      />

      <ApiMessage
        error={error}
        message={message}
        onDismiss={() => setMessage("")}
        onRetry={() => loadAppointments()}
      />

      <div className="physio-mini-stats">
        <div>
          <span>Today's sessions</span>
          <strong>{todayItems.length}</strong>
        </div>

        <div>
          <span>Awaiting confirmation</span>
          <strong>
            {items.filter((item) =>
              ["pending", "awaiting"].includes(
                normalizeStatus(item.status)
              )
            ).length}
          </strong>
        </div>

        <div>
          <span>Confirmed</span>
          <strong>
            {items.filter(
              (item) =>
                normalizeStatus(item.status) === "confirmed"
            ).length}
          </strong>
        </div>
      </div>

      <div className="physio-panel-card">
        <div className="physio-list-toolbar">
          <label className="physio-list-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patient or treatment..."
            />
          </label>

          <select
            className="physio-select"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

          <button
            className="physio-icon-button"
            onClick={() => loadAppointments()}
            aria-label="Refresh appointments"
          >
            <RefreshCw size={17} />
          </button>
        </div>

        <div className="physio-table-wrap">
          <table className="physio-table">
            <thead>
              <tr>
                <th>Patient / treatment</th>
                <th>Date &amp; time</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, index) => {
                const patientName = item.patient || "Patient";
                const status = getAppointmentStatus(item.status);

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="physio-patient-cell">
                        <div
                          className={`physio-avatar patient ${getTone(index)}`}
                        >
                          {getInitials(patientName)}
                        </div>

                        <div>
                          <strong>{patientName}</strong>
                          <span>
                            {item.type || "Physiotherapy session"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="physio-time-cell">
                        <strong>{formatDate(item.time)}</strong>
                        <span>
                          <Clock3 size={13} />
                          {formatTime(item.time)}
                        </span>
                      </div>
                    </td>

                    <td>{item.durationMinutes || 30} min</td>

                    <td>
                      <span
                        className={`physio-status-pill ${
                          status === "Confirmed" ||
                          status === "Completed"
                            ? "confirmed"
                            : status === "Cancelled"
                              ? "cancelled"
                              : "waiting"
                        }`}
                      >
                        <i />
                        {status}
                      </span>
                    </td>

                    <td>
                      <div className="physio-action-group">
                        {["Pending", "Awaiting"].includes(status) && (
                          <>
                            <button
                              className="physio-accept-button"
                              disabled={updatingId === item.id}
                              onClick={() =>
                                updateAppointment(item.id, "Confirmed")
                              }
                              aria-label="Confirm appointment"
                            >
                              <Check size={16} />
                            </button>

                            <button
                              className="physio-decline-button"
                              disabled={updatingId === item.id}
                              onClick={() =>
                                updateAppointment(item.id, "Cancelled")
                              }
                              aria-label="Cancel appointment"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}

                        {updatingId === item.id && (
                          <span>Saving…</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {loading && <p>Loading appointments…</p>}

          {!loading && filtered.length === 0 && (
            <EmptyState text="No appointments match your search." />
          )}
        </div>
      </div>

      <p className="physio-demo-disclaimer">
        Appointment records are loaded from the connected backend.
      </p>
    </div>
  );
}

/* =========================================================
   PATIENT DIRECTORY
   API:
   GET /physiotherapist-portal/patients
   ========================================================= */

export function PhysioPatients() {
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatients = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const result = await physioRequest(
        "get",
        "/physiotherapist-portal/patients",
        undefined,
        { signal }
      );

      setPatients(
        Array.isArray(result.patients) ? result.patients : []
      );
    } catch (err) {
      if (err.code === "ERR_CANCELED") return;

      setError(
        getErrorMessage(err, "Unable to load patient records.")
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadPatients(controller.signal);

    return () => controller.abort();
  }, [loadPatients]);

  const filtered = useMemo(() => {
    return patients.filter((patient) =>
      [
        patient.name,
        patient.email,
        patient.condition,
        patient.plan,
        patient.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [patients, query]);

  return (
    <div className="physio-page">
      <PageHeader
        eyebrow="CARE / PATIENT DIRECTORY"
        title="My patients"
        description="View patients assigned to your care and their recovery progress."
      />

      <ApiMessage
        error={error}
        onRetry={() => loadPatients()}
      />

      <div className="physio-mini-stats">
        <div>
          <span>Assigned patients</span>
          <strong>{patients.length}</strong>
        </div>

        <div>
          <span>Active plans</span>
          <strong>
            {patients.filter(
              (patient) =>
                normalizeStatus(patient.status) === "active"
            ).length}
          </strong>
        </div>

        <div>
          <span>Need review</span>
          <strong>
            {patients.filter(
              (patient) =>
                normalizeStatus(patient.status) === "needs review"
            ).length}
          </strong>
        </div>
      </div>

      <div className="physio-panel-card">
        <SearchFilter
          value={query}
          onChange={setQuery}
          placeholder="Search patient name, email or condition..."
        />

        <div className="physio-table-wrap">
          <table className="physio-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Care focus</th>
                <th>Recovery progress</th>
                <th>Next review</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {filtered.map((patient, index) => (
                <tr key={patient.id}>
                  <td>
                    <div className="physio-patient-cell">
                      <div
                        className={`physio-avatar patient ${getTone(index)}`}
                      >
                        {getInitials(patient.name)}
                      </div>

                      <div>
                        <strong>{patient.name}</strong>
                        <span>{patient.email || patient.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="physio-condition">
                      {patient.condition || patient.plan || "Not specified"}
                    </span>
                  </td>

                  <td>
                    <div className="physio-table-progress">
                      <div className="physio-progress-track">
                        <span
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                Number(patient.progress) || 0
                              )
                            )}%`,
                          }}
                        />
                      </div>

                      <strong>{patient.progress ?? 0}%</strong>
                    </div>
                  </td>

                  <td>
                    <span className="physio-muted-text">
                      {formatDate(patient.nextReview)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`physio-status-pill ${
                        normalizeStatus(patient.status) === "needs review"
                          ? "waiting"
                          : "confirmed"
                      }`}
                    >
                      <i />
                      {patient.status || "No plan"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="physio-row-action"
                      onClick={() => setSelected(patient)}
                      aria-label={`View ${patient.name}`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && <p>Loading patient records…</p>}

          {!loading && filtered.length === 0 && (
            <EmptyState text="No assigned patients match your search." />
          )}
        </div>
      </div>

      {selected && (
        <div
          className="physio-modal-backdrop"
          role="presentation"
          onClick={() => setSelected(null)}
        >
          <section
            className="physio-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Patient details"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="physio-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X size={19} />
            </button>

            <div className="physio-modal-avatar">
              <UserRound size={25} />
            </div>

            <h2>{selected.name}</h2>
            <p>{selected.email || selected.id}</p>

            <div className="physio-modal-detail">
              <span>Care focus</span>
              <strong>{selected.condition || "Not specified"}</strong>
            </div>

            <div className="physio-modal-detail">
              <span>Recovery plan</span>
              <strong>{selected.plan || "No recovery plan"}</strong>
            </div>

            <div className="physio-modal-detail">
              <span>Recovery progress</span>
              <strong>{selected.progress ?? 0}%</strong>
            </div>

            <div className="physio-modal-detail">
              <span>Next review</span>
              <strong>{formatDate(selected.nextReview)}</strong>
            </div>
          </section>
        </div>
      )}

      <p className="physio-demo-disclaimer">
        Patient information is loaded from the physiotherapist API.
      </p>
    </div>
  );
}

/* =========================================================
   TREATMENT PLANS
   API:
   GET    /physiotherapist-portal/recovery-plans
   POST   /physiotherapist-portal/recovery-plans
   PATCH  /physiotherapist-portal/recovery-plans/:id
   DELETE /physiotherapist-portal/recovery-plans/:id
   ========================================================= */

export function PhysioTreatmentPlans() {
  const [plans, setPlans] = useState([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patientId: "",
    title: "",
    clinicalNotes: "",
    goals: "",
    status: "Active",
    progress: "0",
    reviewDate: "",
    exercises: [],
  });

  const loadPlans = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const result = await physioRequest(
        "get",
        "/physiotherapist-portal/recovery-plans",
        undefined,
        { signal }
      );

      setPlans(Array.isArray(result.plans) ? result.plans : []);
    } catch (err) {
      if (err.code === "ERR_CANCELED") return;

      setError(
        getErrorMessage(err, "Unable to load recovery plans.")
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadPlans(controller.signal);

    return () => controller.abort();
  }, [loadPlans]);

  async function openCreateForm() {
    setError("");
    setMessage("");

    try {
      const result = await physioRequest(
        "get",
        "/physiotherapist-portal/patients"
      );

      const availablePatients = Array.isArray(result.patients)
        ? result.patients
        : [];

      setPatients(availablePatients);

      setForm({
        patientId: availablePatients[0]?.id || "",
        title: "",
        clinicalNotes: "",
        goals: "",
        status: "Active",
        progress: "0",
        reviewDate: "",
        exercises: [],
      });

      setShowForm(true);
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to load patients for the plan.")
      );
    }
  }

  async function createPlan(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.patientId) {
      setError("Select a patient before creating a plan.");
      return;
    }

    if (!form.title.trim()) {
      setError("Plan title is required.");
      return;
    }

    const payload = {
      patientId: form.patientId,
      title: form.title.trim(),
      clinicalNotes: form.clinicalNotes.trim(),
      goals: form.goals
        .split("\n")
        .map((goal) => goal.trim())
        .filter(Boolean),
      status: form.status,
      progress: Number(form.progress),
      reviewDate: form.reviewDate || undefined,
      exercises: form.exercises,
    };

    try {
      setBusyId("create");

      const result = await physioRequest(
        "post",
        "/physiotherapist-portal/recovery-plans",
        payload
      );

      if (result.plan) {
        setPlans((previous) => [result.plan, ...previous]);
      } else {
        await loadPlans();
      }

      setShowForm(false);
      setMessage("Recovery plan created successfully.");
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to create recovery plan.")
      );
    } finally {
      setBusyId("");
    }
  }

  async function toggleReview(plan) {
    const nextStatus =
      plan.status === "Needs review" ? "Active" : "Needs review";

    try {
      setBusyId(plan.id);
      setError("");
      setMessage("");

      await physioRequest(
        "patch",
        `/physiotherapist-portal/recovery-plans/${plan.id}`,
        { status: nextStatus }
      );

      setMessage(`Plan status updated to ${nextStatus}.`);
      await loadPlans();
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to update the recovery plan.")
      );
    } finally {
      setBusyId("");
    }
  }

  async function deletePlan(plan) {
    const confirmed = window.confirm(
      `Delete the recovery plan "${plan.title}"?`
    );

    if (!confirmed) return;

    try {
      setBusyId(plan.id);
      setError("");
      setMessage("");

      await physioRequest(
        "delete",
        `/physiotherapist-portal/recovery-plans/${plan.id}`
      );

      setPlans((previous) =>
        previous.filter((item) => item.id !== plan.id)
      );

      setMessage("Recovery plan deleted.");
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to delete recovery plan.")
      );
    } finally {
      setBusyId("");
    }
  }

  const filtered = plans.filter((plan) =>
    [
      plan.patient,
      plan.title,
      plan.clinicalNotes,
      ...(plan.goals || []),
    ]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="physio-page">
      <PageHeader
        eyebrow="CARE / CLINICAL PLANNING"
        title="Treatment plans"
        description="Create and manage patient recovery goals."
        action="Create plan"
        onAction={openCreateForm}
      />

      <ApiMessage
        error={error}
        message={message}
        onDismiss={() => setMessage("")}
        onRetry={() => loadPlans()}
      />

      {showForm && (
        <form
          className="physio-panel-card physio-profile-form"
          onSubmit={createPlan}
        >
          <div className="physio-section-heading">
            <div>
              <h2>Create recovery plan</h2>
              <p>Save a new plan for an assigned patient.</p>
            </div>

            <button
              type="button"
              className="physio-icon-button"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>

          <div className="physio-form-grid">
            <label>
              Patient
              <select
                required
                value={form.patientId}
                onChange={(event) =>
                  setForm((old) => ({
                    ...old,
                    patientId: event.target.value,
                  }))
                }
              >
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} {patient.email ? `(${patient.email})` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Plan title
              <input
                required
                maxLength={120}
                value={form.title}
                onChange={(event) =>
                  setForm((old) => ({
                    ...old,
                    title: event.target.value,
                  }))
                }
                placeholder="e.g. Knee mobility recovery"
              />
            </label>

            <label className="physio-form-full">
              Clinical notes
              <textarea
                rows="3"
                maxLength={4000}
                value={form.clinicalNotes}
                onChange={(event) =>
                  setForm((old) => ({
                    ...old,
                    clinicalNotes: event.target.value,
                  }))
                }
                placeholder="Enter relevant care notes..."
              />
            </label>

            <label className="physio-form-full">
              Recovery goals
              <textarea
                rows="3"
                value={form.goals}
                onChange={(event) =>
                  setForm((old) => ({
                    ...old,
                    goals: event.target.value,
                  }))
                }
                placeholder={"Enter one goal per line"}
              />
            </label>

            <label>
              Status
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((old) => ({
                    ...old,
                    status: event.target.value,
                  }))
                }
              >
                <option>Active</option>
                <option>Needs review</option>
                <option>Paused</option>
                <option>Completed</option>
              </select>
            </label>

            <label>
              Progress (%)
              <input
                type="number"
                min="0"
                max="100"
                required
                value={form.progress}
                onChange={(event) =>
                  setForm((old) => ({
                    ...old,
                    progress: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Review date
              <input
                type="date"
                value={form.reviewDate}
                onChange={(event) =>
                  setForm((old) => ({
                    ...old,
                    reviewDate: event.target.value,
                  }))
                }
              />
            </label>
          </div>

          <div className="physio-form-footer">
            <button
              type="button"
              className="physio-outline-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
              className="physio-primary-button"
              type="submit"
              disabled={busyId === "create"}
            >
              <Save size={17} />
              {busyId === "create" ? "Saving…" : "Save plan"}
            </button>
          </div>
        </form>
      )}

      <div className="physio-panel-card">
        <SearchFilter
          value={query}
          onChange={setQuery}
          placeholder="Search patient or recovery plan..."
        />
      </div>

      <div className="physio-plan-grid">
        {filtered.map((plan) => {
          const status = getPlanStatus(plan.status);
          const goals = Array.isArray(plan.goals) ? plan.goals : [];

          return (
            <article
              className="physio-panel-card physio-plan-card"
              key={plan.id}
            >
              <div className="physio-plan-top">
                <span className="physio-plan-icon">
                  <ClipboardList size={20} />
                </span>

                <span
                  className={`physio-status-pill ${
                    status === "Review due" ? "waiting" : "confirmed"
                  }`}
                >
                  <i />
                  {status}
                </span>
              </div>

              <span className="physio-plan-id">
                {String(plan.id).slice(-8)}
              </span>

              <h2>{plan.title}</h2>

              <p className="physio-plan-focus">
                {plan.clinicalNotes || goals[0] || "Recovery plan"}
              </p>

              <div className="physio-plan-patient">
                <span className="physio-avatar patient blue">
                  {getInitials(plan.patient)}
                </span>
                <strong>{plan.patient || "Patient"}</strong>
              </div>

              {goals.length > 0 && (
                <div className="physio-plan-focus">
                  <strong>Goals</strong>
                  <ul>
                    {goals.slice(0, 3).map((goal, index) => (
                      <li key={`${plan.id}-goal-${index}`}>{goal}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="physio-progress-meta">
                <span>Plan progress</span>
                <strong>{plan.progress ?? 0}%</strong>
              </div>

              <div className="physio-progress-track">
                <span
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, Number(plan.progress) || 0)
                    )}%`,
                  }}
                />
              </div>

              <div className="physio-plan-foot">
                <span>
                  Review: {formatDate(plan.reviewDate)}
                </span>

                <button
                  disabled={busyId === plan.id}
                  onClick={() => toggleReview(plan)}
                >
                  {plan.status === "Needs review"
                    ? "Mark active"
                    : "Mark for review"}
                  <ChevronRight size={15} />
                </button>
              </div>

              <button
                className="physio-decline-button"
                disabled={busyId === plan.id}
                onClick={() => deletePlan(plan)}
                aria-label={`Delete ${plan.title}`}
              >
                <Trash2 size={15} />
                Delete plan
              </button>
            </article>
          );
        })}
      </div>

      {loading && <p>Loading recovery plans…</p>}

      {!loading && filtered.length === 0 && (
        <div className="physio-panel-card">
          <EmptyState text="No recovery plans found. Create a plan for an assigned patient." />
        </div>
      )}

      <p className="physio-demo-disclaimer">
        Recovery plans are loaded from and saved to the backend.
      </p>
    </div>
  );
}

/* =========================================================
   PROGRESS REPORTS
   Uses actual recovery plan progress.
   ========================================================= */

export function PhysioProgress() {
  const [plans, setPlans] = useState([]);
  const [period, setPeriod] = useState("All plans");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlans = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const result = await physioRequest(
        "get",
        "/physiotherapist-portal/recovery-plans",
        undefined,
        { signal }
      );

      setPlans(Array.isArray(result.plans) ? result.plans : []);
    } catch (err) {
      if (err.code === "ERR_CANCELED") return;

      setError(
        getErrorMessage(err, "Unable to load progress reports.")
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadPlans(controller.signal);

    return () => controller.abort();
  }, [loadPlans]);

  const averageProgress = plans.length
    ? Math.round(
        plans.reduce(
          (total, plan) => total + (Number(plan.progress) || 0),
          0
        ) / plans.length
      )
    : 0;

  const completedPlans = plans.filter(
    (plan) => normalizeStatus(plan.status) === "completed"
  ).length;

  const needsReview = plans.filter(
    (plan) => normalizeStatus(plan.status) === "needs review"
  ).length;

  const buckets = [
    { label: "0 to 24%", min: 0, max: 24 },
    { label: "25 to 49%", min: 25, max: 49 },
    { label: "50 to 74%", min: 50, max: 74 },
    { label: "75 to 100%", min: 75, max: 100 },
  ];

  const distribution = buckets.map((bucket) => ({
    ...bucket,
    count: plans.filter((plan) => {
      const progress = Number(plan.progress) || 0;
      return progress >= bucket.min && progress <= bucket.max;
    }).length,
  }));

  return (
    <div className="physio-page">
      <PageHeader
        eyebrow="INSIGHTS / OUTCOMES"
        title="Progress reports"
        description="Review recorded recovery progress and treatment priorities."
      />

      <ApiMessage error={error} onRetry={() => loadPlans()} />

      <div className="physio-mini-stats">
        <div>
          <span>Average recovery</span>
          <strong>{loading ? "…" : `${averageProgress}%`}</strong>
        </div>

        <div>
          <span>Completed plans</span>
          <strong>{loading ? "…" : completedPlans}</strong>
        </div>

        <div>
          <span>Need review</span>
          <strong>{loading ? "…" : needsReview}</strong>
        </div>
      </div>

      <div className="physio-bottom-grid">
        <section className="physio-panel-card physio-report-chart">
          <div className="physio-section-heading">
            <div>
              <h2>Recovery distribution</h2>
              <p>Patients grouped by recorded plan progress</p>
            </div>

            <select
              className="physio-select"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option>All plans</option>
            </select>
          </div>

          <div className="physio-chart-area">
            <div className="physio-chart-y">
              <span>{plans.length}</span>
              <span>{Math.ceil(plans.length * 0.75)}</span>
              <span>{Math.ceil(plans.length * 0.5)}</span>
              <span>{Math.ceil(plans.length * 0.25)}</span>
              <span>0</span>
            </div>

            <div className="physio-chart-main">
              <div className="physio-chart-gridlines">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>

              <div className="physio-chart-bars">
                {distribution.map((bucket) => (
                  <div
                    className="physio-chart-bar-wrap"
                    key={bucket.label}
                  >
                    <div
                      className="physio-chart-bar"
                      style={{
                        height: `${
                          plans.length
                            ? Math.max(
                                4,
                                (bucket.count / plans.length) * 100
                              )
                            : 4
                        }%`,
                      }}
                      title={`${bucket.count} plans`}
                    >
                      <span>{bucket.count}</span>
                    </div>

                    <small>{bucket.label}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="physio-panel-card physio-report-highlights">
          <div className="physio-section-heading">
            <div>
              <h2>Clinical highlights</h2>
              <p>Based on saved recovery plans</p>
            </div>
          </div>

          <div className="physio-highlight">
            <span className="highlight-icon green">
              <CircleCheck size={18} />
            </span>

            <div>
              <strong>Completed plans</strong>
              <p>{completedPlans} plans marked completed.</p>
            </div>
          </div>

          <div className="physio-highlight">
            <span className="highlight-icon orange">
              <CircleAlert size={18} />
            </span>

            <div>
              <strong>Follow-up recommended</strong>
              <p>{needsReview} plans marked for review.</p>
            </div>
          </div>

          <div className="physio-highlight">
            <span className="highlight-icon blue">
              <Activity size={18} />
            </span>

            <div>
              <strong>Recorded plans</strong>
              <p>{plans.length} recovery plans in your workspace.</p>
            </div>
          </div>
        </section>
      </div>

      {loading && <p>Loading progress reports…</p>}

      <p className="physio-demo-disclaimer">
        Progress figures reflect values saved in recovery plans.
        They are not an independent clinical assessment.
      </p>
    </div>
  );
}

/* =========================================================
   AVAILABILITY
   No availability API was provided.
   This page intentionally saves locally.
   ========================================================= */

const DEFAULT_DAYS = [
  { day: "Monday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Tuesday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Wednesday", enabled: true, start: "10:00", end: "18:00" },
  { day: "Thursday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Friday", enabled: true, start: "09:00", end: "16:00" },
  { day: "Saturday", enabled: false, start: "10:00", end: "14:00" },
  { day: "Sunday", enabled: false, start: "10:00", end: "14:00" },
];

export function PhysioSchedule() {
  const [days, setDays] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("physioAvailability") || "null"
      ) || DEFAULT_DAYS;
    } catch {
      return DEFAULT_DAYS;
    }
  });

  const [saved, setSaved] = useState(false);

  function change(index, key, value) {
    setDays((previous) =>
      previous.map((day, currentIndex) =>
        currentIndex === index
          ? { ...day, [key]: value }
          : day
      )
    );

    setSaved(false);
  }

  function save(event) {
    event.preventDefault();
    localStorage.setItem("physioAvailability", JSON.stringify(days));
    setSaved(true);
  }

  return (
    <div className="physio-page">
      <PageHeader
        eyebrow="SCHEDULE / AVAILABILITY"
        title="Availability"
        description="Set your preferred weekly working hours."
      />

      <form
        className="physio-panel-card physio-schedule-card"
        onSubmit={save}
      >
        <div className="physio-section-heading">
          <div>
            <h2>Weekly working hours</h2>
            <p>Choose the days and times you are available.</p>
          </div>

          <span className="physio-local-save">Local settings</span>
        </div>

        {days.map((day, index) => (
          <div
            className={`physio-day-row ${
              day.enabled ? "" : "day-disabled"
            }`}
            key={day.day}
          >
            <label className="physio-day-toggle">
              <input
                type="checkbox"
                checked={day.enabled}
                onChange={(event) =>
                  change(index, "enabled", event.target.checked)
                }
              />

              <span className="physio-switch" />
              <strong>{day.day}</strong>
            </label>

            {day.enabled ? (
              <div className="physio-time-inputs">
                <label>
                  <span>Start</span>
                  <input
                    type="time"
                    value={day.start}
                    onChange={(event) =>
                      change(index, "start", event.target.value)
                    }
                  />
                </label>

                <span className="physio-time-dash">to</span>

                <label>
                  <span>End</span>
                  <input
                    type="time"
                    value={day.end}
                    onChange={(event) =>
                      change(index, "end", event.target.value)
                    }
                  />
                </label>
              </div>
            ) : (
              <span className="physio-day-off">Unavailable</span>
            )}
          </div>
        ))}

        <div className="physio-schedule-footer">
          {saved && (
            <span className="physio-saved-message">
              <CircleCheck size={16} />
              Availability saved on this device
            </span>
          )}

          <button className="physio-primary-button" type="submit">
            <Save size={17} />
            Save availability
          </button>
        </div>
      </form>

      <p className="physio-demo-disclaimer">
        Availability is saved in this browser only. A backend endpoint
        is required to publish it to patient booking.
      </p>
    </div>
  );
}

/* =========================================================
   PROFESSIONAL PROFILE
   GET /physiotherapist-portal/profile
   Profile editing requires an update endpoint.
   ========================================================= */

export function PhysioProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const result = await physioRequest(
        "get",
        "/physiotherapist-portal/profile",
        undefined,
        { signal }
      );

      const profile = result.profile || {};

      setForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        specialization: profile.specialization || "",
      });
    } catch (err) {
      if (err.code === "ERR_CANCELED") return;

      setError(
        getErrorMessage(err, "Unable to load your profile.")
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadProfile(controller.signal);

    return () => controller.abort();
  }, [loadProfile]);

  return (
    <div className="physio-page">
      <PageHeader
        eyebrow="ACCOUNT / PROFESSIONAL DETAILS"
        title="My profile"
        description="View your professional information from your account."
      />

      <ApiMessage error={error} onRetry={() => loadProfile()} />

      <section className="physio-panel-card physio-profile-form">
        <div className="physio-profile-banner">
          <div className="physio-profile-big-avatar">
            <UserRound size={34} />
          </div>

          <div>
            <h2>Professional profile</h2>
            <p>Your information from the Rehabics account.</p>
          </div>
        </div>

        {loading ? (
          <p>Loading profile…</p>
        ) : (
          <div className="physio-form-grid">
            <label>
              Full name
              <input value={form.name} readOnly />
            </label>

            <label>
              Email address
              <input value={form.email} readOnly />
            </label>

            <label>
              Phone number
              <input value={form.phone} readOnly />
            </label>

            <label>
              Specialization
              <input value={form.specialization} readOnly />
            </label>
          </div>
        )}
      </section>

      <p className="physio-demo-disclaimer">
        Profile data is loaded from the backend. Editing requires a
        profile update endpoint, which has not been provided yet.
      </p>
    </div>
  );
}

/* =========================================================
   SETTINGS
   No backend settings endpoint was provided.
   ========================================================= */

export function PhysioSettings() {
  const [prefs, setPrefs] = useState(() => {
    const defaults = {
      emailReminders: true,
      appointmentAlerts: true,
      progressDigest: false,
      compactMode: false,
    };

    try {
      return {
        ...defaults,
        ...JSON.parse(
          localStorage.getItem("physioSettings") || "{}"
        ),
      };
    } catch {
      return defaults;
    }
  });

  const [saved, setSaved] = useState(false);

  function toggle(key) {
    setPrefs((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));

    setSaved(false);
  }

  function save() {
    localStorage.setItem("physioSettings", JSON.stringify(prefs));
    setSaved(true);
  }

  const options = [
    {
      key: "appointmentAlerts",
      title: "Appointment notifications",
      description: "Get notified when a session is booked or changed.",
    },
    {
      key: "emailReminders",
      title: "Email reminders",
      description: "Receive reminders before scheduled sessions.",
    },
    {
      key: "progressDigest",
      title: "Weekly progress digest",
      description: "A summary of patient progress and pending reviews.",
    },
    {
      key: "compactMode",
      title: "Compact display",
      description: "Reduce spacing in lists to fit more information.",
    },
  ];

  return (
    <div className="physio-page">
      <PageHeader
        eyebrow="ACCOUNT / PREFERENCES"
        title="Settings"
        description="Customize your workspace preferences."
      />

      <section className="physio-panel-card physio-settings-card">
        <div className="physio-section-heading">
          <div>
            <h2>Notifications &amp; preferences</h2>
            <p>Preferences saved on this device.</p>
          </div>

          <Settings size={20} className="physio-muted-icon" />
        </div>

        {options.map((option) => (
          <div className="physio-setting-row" key={option.key}>
            <div>
              <strong>{option.title}</strong>
              <p>{option.description}</p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={prefs[option.key]}
              className={`physio-switch-button ${
                prefs[option.key] ? "on" : ""
              }`}
              onClick={() => toggle(option.key)}
            >
              <span />
            </button>
          </div>
        ))}

        <div className="physio-form-footer">
          {saved && (
            <span className="physio-saved-message">
              <CircleCheck size={16} />
              Preferences saved
            </span>
          )}

          <button className="physio-primary-button" onClick={save}>
            <Save size={17} />
            Save preferences
          </button>
        </div>
      </section>

      <p className="physio-demo-disclaimer">
        These settings are stored in the current browser. A backend
        settings endpoint is needed for account-wide synchronization.
      </p>
    </div>
  );
}
