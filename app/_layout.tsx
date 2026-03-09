import { darkTheme, lightTheme } from "@/utils/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContextProvider, useAuth } from "../context/authContext";

export function RootLayout() {
  const { user, isAuthenticating } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "InterBold-18": require("../assets/fonts/Inter_18pt-Bold.ttf"),
    "InterBlack-18": require("../assets/fonts/Inter_18pt-Black.ttf"),
    "InterRegular-18": require("../assets/fonts/Inter_18pt-Regular.ttf"),
    "InterSemiBold-18": require("../assets/fonts/Inter_18pt-SemiBold.ttf"),
    "InterMedium-18": require("../assets/fonts/Inter_18pt-Medium.ttf"),
    "InterLight-18": require("../assets/fonts/Inter_18pt-Light.ttf"),
    "InterBold-24": require("../assets/fonts/Inter_24pt-Bold.ttf"),
    "InterBlack-24": require("../assets/fonts/Inter_24pt-Black.ttf"),
    "InterRegular-24": require("../assets/fonts/Inter_24pt-Regular.ttf"),
    "InterSemiBold-24": require("../assets/fonts/Inter_24pt-SemiBold.ttf"),
    "InterMedium-24": require("../assets/fonts/Inter_24pt-Medium.ttf"),
    "InterLight-24": require("../assets/fonts/Inter_24pt-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded && isAuthenticating !== undefined) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isAuthenticating]);

  useEffect(() => {
    if (isAuthenticating === undefined) return;
    if (isAuthenticating) return;

    const publicRoutes = ["LandingPage", "SignIn", "SignUp"];
    const isPublicRoute = publicRoutes.includes(segments[0]);

    const inApp =
      segments[0] === "(admin)" ||
      segments[0] === "(lecturer)" ||
      segments[0] === "(student)";

    // 🔹 No user → go to SignIn
    if (!user) {
      if (!isPublicRoute) {
        router.replace("/SignIn");
      }
      return;
    }

    // 🔹 Wait until role exists
    if (!user.role) return;

    // 🔹 User exists → redirect to correct app
    if (!inApp) {
      switch (user.role) {
        case "Admin":
          router.replace("/(admin)/(tabs)/HomeScreen");
          break;
        case "Lecturer":
          router.replace("/(lecturer)/(tabs)/HomeScreen");
          break;
        case "Student":
          router.replace("/(student)/(tabs)/HomeScreen");
          break;
      }
    }

  }, [user?.role, isAuthenticating,router,user, segments]);

  return <Slot />;
}

// A wrapper that adapts safe area + status bar to theme
function AdaptiveWrapper({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const barStyle = scheme === "dark" ? "light" : "dark";
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top + hp(1) }}>
      <StatusBar style={barStyle} animated />
      {children}
    </View>
  );
}

export default function RootNavigator() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={new QueryClient()}>
        <MenuProvider>
          <AuthContextProvider>
            <AdaptiveWrapper>
              <RootLayout />
            </AdaptiveWrapper>
          </AuthContextProvider>
        </MenuProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
