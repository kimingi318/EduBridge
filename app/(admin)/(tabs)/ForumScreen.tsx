import { darkTheme, lightTheme } from "@/utils/colors";
import { Text, View, useColorScheme } from "react-native";


export default function ForumScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  return (
    <View style={{backgroundColor: theme.background}} className="flex-1 items-center justify-center">
      <Text>ForumScreen</Text>
    </View>
  );
}
