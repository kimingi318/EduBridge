import { auth } from "../firebaseConfig";

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
