import { Platform } from "react-native";
import { auth } from "../firebaseConfig";

// Centralized API Base URL - ONLY change this in one place
export const API_BASE_URL =
  Platform.OS === "web" ? "http://localhost:3000" : "http://192.168.0.108:3000";

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
