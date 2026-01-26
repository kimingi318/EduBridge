import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveBackgroundColor: "#0A3661",
        tabBarInactiveBackgroundColor: "#0A3661",
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#B0C4DE",
        tabBarStyle: {
           height: hp(7),
         },
        tabBarLabelStyle: { fontSize: hp(1.5) },

      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={25}
            />
          ),
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="ForumScreen"
        options={{
          headerShown: false,
          tabBarIcon: ({ color ,focused}) => (
            <Ionicons name={focused? "chatbubbles": "chatbubbles-outline" }color={color} size={25} />
          ),
          title: "Forum",
        }}
      />
      <Tabs.Screen
        name="MessageScreen"
        options={{
          headerShown: false,
          // header: () => <MsgHeader />,
          tabBarIcon: ({ color,focused }) => (
            <Ionicons name={focused? "mail": "mail-outline" }  color={color} size={25} />
          ),
          title: "Chats",
        }}
      />
      <Tabs.Screen
        name="NotificationScreen"
        options={{
          headerShown: false,
          tabBarIcon: ({ color,focused }) => (
            <Ionicons name={focused? "notifications": "notifications-outline"} color={color} size={25} />
          ),
          title: "Notifications",
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          headerShown: false,
          tabBarIcon: ({ color,focused }) => (
            <Ionicons name={focused? "person": "person-outline"} color={color} size={25} />
          ),
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
