import { Platform } from "react-native";
import { auth } from "../firebaseConfig";

// Centralized API Base URL - ONLY change this in one place
export const API_BASE_URL =
  Platform.OS === "web" ? "http://localhost:3000" : "http://192.168.100.4:3000";

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = await auth.currentUser?.getIdToken();

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
// export const getDepartmentStats = async () => {
//   return apiFetch(`${API_BASE_URL}/department/stats`);
// };
export const getDepartmentStats = async () => {
  const res = await apiFetch(`${API_BASE_URL}/api/departmentStats/stats`, {
    method: "GET",
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Failed to fetch department stats");
  }
};
