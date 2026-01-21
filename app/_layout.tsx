import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";
import { AuthContextProvider, useAuth } from "../context/authContext";

export function RootLayout() {
  const { isAuthenticating } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticating === "undefined") return;
    const inApp = segments[0] === "(tabs)";
    if (isAuthenticating && !inApp) {
      //redirect to HomeScreen
      router.replace("/(tabs)/HomeScreen");
    } else if (isAuthenticating === false) {
      //redirect to LandingPage
      router.replace("/SignIn");
    } else if (!isAuthenticating && inApp) {
      //redirect to HomeScreen
      router.replace("/SignUp");
    }
  }, [isAuthenticating]);
  {
  }
  return <Slot />;
}

export default function RootNavigator() {
  return (
    <MenuProvider>
      <AuthContextProvider>
        <RootLayout />
      </AuthContextProvider>
    </MenuProvider>
  );
}
