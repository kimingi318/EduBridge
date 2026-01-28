import AddFaculty from '@/components/addFaculty'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function NotificationScreen()  {
  return (
    <SafeAreaView className="flex-1 ">
      <AddFaculty/>
    </SafeAreaView>
  )
}



