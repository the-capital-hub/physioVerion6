
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("rehabics_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

async function getFirstAvailable(paths) {
  let lastError;

  for (const path of paths) {
    try {
      const response = await client.get(path);
      return response.data?.data ?? response.data;
    } catch (error) {
      lastError = error;

      if (![404, 405].includes(error?.response?.status)) {
        throw error;
      }
    }
  }

  throw lastError || new Error("No API endpoint configured for this resource.");
}

export const adminApi = {
  getOverview() {
    return getFirstAvailable([
      "/admin/overview",
      "/admin/dashboard",
    ]);
  },

  getResource(resource) {
    const paths = {
      patients: ["/admin/patients", "/patients"],
      doctors: ["/admin/doctors", "/doctors", "/physiotherapists"],
      appointments: ["/admin/appointments", "/appointments"],
      treatments: ["/admin/treatments", "/treatments"],
      reports: ["/admin/reports", "/reports"],
      settings: ["/admin/settings"],
    };

    return getFirstAvailable(paths[resource] || [`/admin/${resource}`]);
  },

  updateAppointmentStatus(id, status) {
    return client
      .patch(`/admin/appointments/${id}`, { status })
      .then((response) => response.data?.data ?? response.data);
  },
};
