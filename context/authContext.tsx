import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { auth, db } from "../firebaseConfig"; // Adjust the import path as necessary

interface CustomUser extends User {
  regNo?: string;
  userId?: string;
}

export const AuthContext = createContext<{
  user: CustomUser | null;
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
  const [isAuthenticating, setIsAuthenticating] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticating(true);
        setUser(user);
        updateUserData(user.uid);
      } else {
        setIsAuthenticating(false);
        setUser(null);
      }
    });
    return unsub;
  }, []);

  //function to get additional user data from firestore
  const updateUserData = async (userId: string) => {
    const userDoc = doc(db, "users", userId);

    const docSnapshot = await getDoc(userDoc);
    if (docSnapshot.exists()) {
      let userData = docSnapshot.data();
      setUser((prevUser) =>
        prevUser
          ? { ...prevUser, regNo: userData.regNo, userId: userData.userId }
          : null,
      );
    }
  };

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response?.user) {
        console.log("User signed in:");
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
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    regNo: string,
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
        regNo: regNo,
        userId: response?.user?.uid,
      });
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

  return (
    <AuthContext.Provider
      value={{ user, signIn, signUp, signOut, isAuthenticating }}
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
