import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthContextProvider, useAuth } from "../context/authContext";

export function RootLayout() {
  const {isAuthenticating} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if(typeof isAuthenticating === 'undefined')
      return;
    const inApp = segments[0] === "(tabs)";
    if (isAuthenticating && !inApp) {
      //redirect to HomeScreen
      router.replace("/(tabs)/HomeScreen");
    }
    else if (isAuthenticating === false) {
      //redirect to LandingPage
      router.replace("/LandingPage");
    }
    else if (!isAuthenticating && inApp) {
      //redirect to HomeScreen
      router.replace("/SignIn");
    }
  }, [isAuthenticating]);{

  }
  return <Slot/>

}


export default function RootNavigator() {

  return (
    <AuthContextProvider>
      <RootLayout />
    </AuthContextProvider>
    // <Stack screenOptions={{ headerShown: false }}>
    //   <Stack.Protected guard={!!session}>
    //     <Stack.Screen name="(tabs)" />
    //   </Stack.Protected>

    //   <Stack.Protected guard={!session}>
    //     <Stack.Screen name="SignIn" />
    //   </Stack.Protected>
    // </Stack>
  );
}