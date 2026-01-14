import { Tabs } from 'expo-router';

export default function tabsLayout(){
  return <Tabs>
    <Tabs.Screen name='HomeScreen' options={{headerShown: false}}/>
    <Tabs.Screen name='ForumScreen' options={{headerShown: false}}/>
    <Tabs.Screen name='MessageScreen' options={{headerShown: false}}/>
    <Tabs.Screen name='NotificationScreen' options={{headerShown: false}}/>
    <Tabs.Screen name='ProfileScreen' options={{headerShown: false}}/>
  </Tabs>;
}