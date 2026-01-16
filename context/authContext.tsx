import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

export const AuthContext = createContext<{
  user: any;
  signIn: (email: string, password: string, regNo: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticating: boolean | undefined;
} | null>(null);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // onAuthStateChanged logic here
    setTimeout(() => {
      setIsAuthenticating(false);
    }, 2000);
  }, []);

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      // sign up logic here
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // sign out logic here
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const signIn = async (email: string, password: string, regNo: string): Promise<void> => {
    try {
      // sign up logic here
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isAuthenticating }}>
      {children}
    </AuthContext.Provider>
  );
};

// Use this hook to access the user info.
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be wrapped in an AuthContextProvider');
  }

  return value;
}


