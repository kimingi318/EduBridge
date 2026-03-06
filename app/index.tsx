import { darkTheme, lightTheme } from '@/utils/colors';
import { ActivityIndicator, Text, View, useColorScheme } from 'react-native';

export default function Splash() {
    const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  return (
    <View style={{backgroundColor:theme.background}} className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={{color:theme.primary}} className="mt-4 text-lg font-semibold">Loading EduBridge...</Text>
    </View>
  );
}



