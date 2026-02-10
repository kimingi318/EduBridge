import ScreenWrapper from "@/components/ScreenWrapper";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContextProvider, useAuth } from "../context/authContext";

export function RootLayout() {
  const { user } = useAuth()
  const { isAuthenticating } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "InterBold-18": require('../assets/fonts/Inter_18pt-Bold.ttf'),
    "InterBlack-18": require('../assets/fonts/Inter_18pt-Black.ttf'),
    "InterRegular-18": require('../assets/fonts/Inter_18pt-Regular.ttf'),
    "InterSemiBold-18": require('../assets/fonts/Inter_18pt-SemiBold.ttf'),
    "InterMedium-18": require('../assets/fonts/Inter_18pt-Medium.ttf'),
    "InterLight-18": require('../assets/fonts/Inter_18pt-Light.ttf'),
    "InterBold-24": require('../assets/fonts/Inter_24pt-Bold.ttf'),
    "InterBlack-24": require('../assets/fonts/Inter_24pt-Black.ttf'),
    "InterRegular-24": require('../assets/fonts/Inter_24pt-Regular.ttf'),
    "InterSemiBold-24": require('../assets/fonts/Inter_24pt-SemiBold.ttf'),
    "InterMedium-24": require('../assets/fonts/Inter_24pt-Medium.ttf'),
    "InterLight-24": require('../assets/fonts/Inter_24pt-Light.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

  }, [fontsLoaded]);

  // if(!fontsLoaded) return null;


  useEffect(() => {
    if (typeof isAuthenticating === "undefined") return;
    const inApp = segments[0] === "(admin)" || segments[0] === "(lecturer)" || segments[0] === "(student)";
    const publicRoutes = segments[0] === "LandingPage" || segments[0] === "SignIn" || segments[0] === "SignUp"
    if (isAuthenticating) {
      if (!user) return;
      if (!inApp) {
        const role = user?.role
        switch (role) {
          case 'Admin':
            router.replace('/(admin)/(tabs)/HomeScreen');
            return;
          case 'Lecturer':
            router.replace('/(lecturer)/(tabs)/HomeScreen');
            return;

          case 'Student':
            router.replace('/(student)/(tabs)/HomeScreen');
        }
      }
    }
    else if (!isAuthenticating) {
      if (publicRoutes) {
        router.replace("/SignUp");
      }
      else if(inApp){
        router.replace("/SignIn")
      }
    }



  }, [user, isAuthenticating, router, segments]);
  return <Slot />;
}

export default function RootNavigator() {
  return (
    <MenuProvider>
      <AuthContextProvider>
        <ScreenWrapper>
        <SafeAreaProvider>
          <RootLayout />
        </SafeAreaProvider>
        </ScreenWrapper>
      </AuthContextProvider>
    </MenuProvider>

  );
}
