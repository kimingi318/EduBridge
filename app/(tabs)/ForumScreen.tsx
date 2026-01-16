import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function ForumScreen() {
  return (
    <View className='pt-10'>
      <Text>ForumScreen</Text>
      <Link href='../LandingPage'>Back</Link>
    </View>
  )
}



