import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


// StatusBar.setStatusBarBackgroundColor('#244A9F', true)

const SharedTabLayout: React.FC = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeTint = isDark ? '#fff' : '#000';
  const inactiveTint = isDark ? '#fff' : '#000';

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: activeTint,
          tabBarInactiveTintColor: inactiveTint,
          tabBarStyle: {
             backgroundColor: isDark ? '#000' : '#fff',
            height: hp(7) + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarLabelStyle: { fontSize: hp(1.5) },
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="HomeScreen"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                color={color}
                size={25}
              />
            ),
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="ForumScreen"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
                color={color}
                size={25}
              />
            ),
            title: 'Forum',
          }}
        />
        <Tabs.Screen
          name="MessageScreen"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'mail' : 'mail-outline'}
                color={color}
                size={25}
              />
            ),
            title: 'Chats',
          }}
        />
        <Tabs.Screen
          name="NotificationScreen"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'notifications' : 'notifications-outline'}
                color={color}
                size={25}
              />
            ),
            title: 'Notifications',
          }}
        />
        <Tabs.Screen
          name="ProfileScreen"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                color={color}
                size={25}
              />
            ),
            title: 'Profile',
          }}
        />
      </Tabs>
    </>
  );
};

export default SharedTabLayout;
