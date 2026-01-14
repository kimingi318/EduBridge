import { Stack } from 'expo-router';

export default function RootLayout(){
  return <Stack>
    <Stack.Screen name='LandingPage' options={{headerShown: false}} />
    <Stack.Screen name='SignIn' options={{headerShown: false}} />
    <Stack.Screen name='SignUp' options={{title: 'SignUp'}} />
  </Stack>;
}