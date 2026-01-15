import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveBackgroundColor: "#0C06B9",
        tabBarInactiveBackgroundColor: "#0A3661",
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#B0C4DE",
        tabBarStyle: { height: 60 },
        tabBarLabelStyle: { fontSize: 14 },

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
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles-outline" color={color} size={25} />
          ),
          title: "Forum",
        }}
      />
      <Tabs.Screen
        name="MessageScreen"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="mail-outline" color={color} size={25} />
          ),
          title: "Messages",
        }}
      />
      <Tabs.Screen
        name="NotificationScreen"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" color={color} size={25} />
          ),
          title: "Notifications",
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" color={color} size={25} />
          ),
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
