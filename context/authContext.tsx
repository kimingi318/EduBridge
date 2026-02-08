import { API_BASE_URL, apiFetch } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { auth, db } from "../firebaseConfig";

interface CustomUser extends User {
  regNo?: string;
  role?: string;
  userId?: string;
}

export const AuthContext = createContext<{
  user: CustomUser | null;
  profile: any | null;
  refreshProfile: () => Promise<void>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    regNo: string,
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticating: boolean | undefined;
} | null>(null);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean | undefined>(
    undefined,
  );

  // Save profile to AsyncStorage
  const saveProfileToStorage = async (profileData: any) => {
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(profileData));
    } catch (err) {
      console.warn("Failed to save profile to storage:", err);
    }
  };

  // Load profile from AsyncStorage
  const loadProfileFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem("userProfile");
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.warn("Failed to load profile from storage:", err);
      return null;
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticating(true);
        setUser(user as CustomUser);
        
        // Load cached profile immediately
        const cachedProfile = await loadProfileFromStorage();
        if (cachedProfile) {
          setProfile(cachedProfile);
        }

        // Fetch fresh profile when auth state becomes available
        (async () => {
          try {
            const token = await user.getIdToken();
            const res = await fetch(`${API_BASE_URL}/api/profiles/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              setProfile(data || null);
              await saveProfileToStorage(data);
            } else {
              setProfile(null);
            }
          } catch (err) {
            console.warn("Failed to fetch profile:", err);
            setProfile(null);
          }
        })();
      } else {
        setIsAuthenticating(false);
        setUser(null);
        setProfile(null);
        await AsyncStorage.removeItem("userProfile");
      }
    });
    return unsub;
  }, []);

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response?.user) {
        console.log("User signed in:");
      }

      try {
        const res = await apiFetch(
          `${API_BASE_URL}/api/users/me`,
        );
        if (res.ok) {
          const userinfo = await res.json();
          const updatedUser = {...response.user as CustomUser, regNo:userinfo.reg_no, role:userinfo.role};
          setUser(updatedUser);
          // Also fetch and save profile
          await refreshProfile();
        } else {
          console.warn("API returned status:", res.status);
          setUser(response.user as CustomUser);
        }
      } catch (apiError) {
        console.warn("Failed to fetch user info from API:", apiError);
        // Still set the user even if API call fails
        setUser(response.user as CustomUser);
      }

      return { success: true };
    } catch (e) {
      const error = e as Error;
      let msg = error.message;
      if (msg.includes("(auth/invalid-credential)")) {
        msg = "invaid credentials.";
      } else if (msg.includes("(auth/user-not-found)")) {
        msg = "User not found. Please sign up.";
      } else if (msg.includes("(auth/invalid-email)")) {
        msg = "invalid email.";
      }
      return { success: false, error: msg };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      console.log("User signed out");
      setProfile(null);
      await AsyncStorage.removeItem("userProfile");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };


  const signUp = async (
    email: string,
    password: string,
    role: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      // sign up logic here
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("User signed up:");
      await setDoc(doc(db, "users", response?.user?.uid), {
        userId: response?.user?.uid,
      });
      const token = await response?.user?.getIdToken();
      
      try {
        const response2 = await fetch(`${API_BASE_URL}/api/users`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        });
        if (!response2.ok) {
          console.warn("Failed to create user profile on backend:", response2.status);
        }
      } catch (apiError) {
        console.warn("Failed to create user profile:", apiError);
      }


      return { success: true, data: response?.user };
    } catch (e) {
      const error = e as Error;
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) {
        msg = "invalid email address.";
      } else {
        msg.includes("(auth/email-already-in-use)");
        msg = "User already Signed Up.";
      }
      return { success: false, error: msg };
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/api/profiles/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data || null);
        await saveProfileToStorage(data);
      }
    } catch (err) {
      console.warn("refreshProfile error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, refreshProfile, signIn, signUp, signOut, isAuthenticating }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Use this hook to access the user info.
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be wrapped in an AuthContextProvider");
  }

  return value;
}
