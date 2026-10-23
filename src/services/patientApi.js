import axios from "axios";

// Update these values to match your existing Rehabics backend.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const TOKEN_KEYS = ["token", "accessToken", "authToken"];

export function getAuthToken() {
  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }
  return null;
}

export const patientApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

patientApi.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Endpoint paths are centralized here. Change these to your API's real routes.
export const patientEndpoints = {
  me: "/patient/me",
  appointments: "/patient/appointments",
  exercises: "/patient/exercises",
  progress: "/patient/progress",
  therapist: "/patient/therapist",
  profile: "/patient/profile",
};

export async function getPatientResource(resource) {
  const response = await patientApi.get(patientEndpoints[resource]);
  return response.data?.data ?? response.data;
}

export async function updatePatientProfile(payload) {
  const response = await patientApi.patch(patientEndpoints.profile, payload);
  return response.data?.data ?? response.data;
}

export async function updateExerciseCompletion(exerciseId, completed) {
  const response = await patientApi.patch(
    `${patientEndpoints.exercises}/${exerciseId}/completion`,
    { completed },
  );
  return response.data?.data ?? response.data;
}
