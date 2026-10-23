import axios from "axios";

/**
 * Configure VITE_API_BASE_URL in your project root.
 * Set VITE_DOCTOR_* variables to your EXISTING backend paths.
 * Defaults below are examples only; replace them with your real routes.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  // Change this key if your existing login stores the token elsewhere.
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const paths = {
  overview: import.meta.env.VITE_DOCTOR_OVERVIEW_PATH || "/doctor/dashboard",
  appointments: import.meta.env.VITE_DOCTOR_APPOINTMENTS_PATH || "/doctor/appointments",
  patients: import.meta.env.VITE_DOCTOR_PATIENTS_PATH || "/doctor/patients",
  plans: import.meta.env.VITE_DOCTOR_PLANS_PATH || "/doctor/treatment-plans",
  exercises: import.meta.env.VITE_DOCTOR_EXERCISES_PATH || "/doctor/exercises",
  messages: import.meta.env.VITE_DOCTOR_MESSAGES_PATH || "/doctor/messages",
  reports: import.meta.env.VITE_DOCTOR_REPORTS_PATH || "/doctor/reports",
  profile: import.meta.env.VITE_DOCTOR_PROFILE_PATH || "/doctor/profile"
};

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function getDoctorOverview() { return unwrap(await api.get(paths.overview)); }
export async function getDoctorAppointments() { return unwrap(await api.get(paths.appointments)); }
export async function getDoctorPatients() { return unwrap(await api.get(paths.patients)); }
export async function getTreatmentPlans() { return unwrap(await api.get(paths.plans)); }
export async function getExerciseLibrary() { return unwrap(await api.get(paths.exercises)); }
export async function getDoctorMessages() { return unwrap(await api.get(paths.messages)); }
export async function getDoctorReports() { return unwrap(await api.get(paths.reports)); }
export async function getDoctorProfile() { return unwrap(await api.get(paths.profile)); }

export async function updateDoctorAppointmentStatus(id, status) {
  const path = `${paths.appointments}/${encodeURIComponent(id)}/status`;
  return unwrap(await api.patch(path, { status }));
}
export async function updateTreatmentPlan(id, changes) {
  return unwrap(await api.patch(`${paths.plans}/${encodeURIComponent(id)}`, changes));
}
export async function updateDoctorProfile(profile) {
  return unwrap(await api.patch(paths.profile, profile));
}

export default api;
