
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const keys = ["token", "accessToken", "authToken"];

  let token = null;

  for (const key of keys) {
    token =
      localStorage.getItem(key) ||
      sessionStorage.getItem(key);

    if (token) break;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const BASE = "/physiotherapist-portal";

function unwrap(response) {
  const body = response?.data;

  if (body?.success === false) {
    throw new Error(body.message || "API request failed.");
  }

  return body?.data ?? body ?? null;
}

async function get(path) {
  return unwrap(await api.get(path));
}

async function post(path, payload) {
  return unwrap(await api.post(path, payload));
}

async function patch(path, payload) {
  return unwrap(await api.patch(path, payload));
}

async function remove(path) {
  return unwrap(await api.delete(path));
}

export async function getDoctorOverview() {
  return get(`${BASE}/overview`);
}

export async function getDoctorAppointments() {
  return get(`${BASE}/appointments`);
}

export async function getDoctorPatients() {
  return get(`${BASE}/patients`);
}

export async function getTreatmentPlans() {
  return get(`${BASE}/recovery-plans`);
}

export async function getExerciseLibrary() {
  return get(`${BASE}/exercises`);
}

export async function getDoctorMessages() {
  return get(`${BASE}/messages`);
}

export async function getDoctorProfile() {
  return get(`${BASE}/profile`);
}

export async function updateDoctorAppointmentStatus(id, status) {
  return patch(
    `${BASE}/appointments/${encodeURIComponent(id)}`,
    { status }
  );
}

export async function createDoctorAppointment(payload) {
  return post(`${BASE}/appointments`, payload);
}

export async function updateTreatmentPlan(id, changes) {
  return patch(
    `${BASE}/recovery-plans/${encodeURIComponent(id)}`,
    changes
  );
}

export async function createTreatmentPlan(payload) {
  return post(`${BASE}/recovery-plans`, payload);
}

export async function deleteTreatmentPlan(id) {
  return remove(
    `${BASE}/recovery-plans/${encodeURIComponent(id)}`
  );
}

export default api;
