
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const TOKEN_KEYS = ["token", "accessToken", "authToken"];

export function getAuthToken() {
  for (const key of TOKEN_KEYS) {
    const token =
      localStorage.getItem(key) || sessionStorage.getItem(key);

    if (token) return token;
  }

  return null;
}

export const patientApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

patientApi.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const patientEndpoints = {
  portal: "/patient-portal",
  appointments: "/appointments/mine",

  // These routes need to exist in your backend before use.
  me: null,
  exercises: null,
  progress: null,
  therapist: null,
  profile: null,
};

export async function getPatientResource(resource) {
  const endpoint = patientEndpoints[resource];

  if (!endpoint) {
    throw new Error(
      `Backend endpoint for "${resource}" is not configured.`
    );
  }

  const response = await patientApi.get(endpoint);

  return response.data?.data ?? response.data;
}

export async function updatePatientProfile(payload) {
  if (!patientEndpoints.profile) {
    throw new Error("Patient profile API route is not configured.");
  }

  const response = await patientApi.patch(
    patientEndpoints.profile,
    payload
  );

  return response.data?.data ?? response.data;
}

export async function updateExerciseCompletion(exerciseId, completed) {
  if (!patientEndpoints.exercises) {
    throw new Error("Exercise completion API route is not configured.");
  }

  const response = await patientApi.patch(
    `${patientEndpoints.exercises}/${exerciseId}/completion`,
    { completed }
  );

  return response.data?.data ?? response.data;
}
