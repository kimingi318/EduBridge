import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { TextInput, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

const SearchBar = () => {
  return (
     <View className="mt-6 bg-white rounded-full flex-row items-center px-4 py-3"
     style={{height: hp(6), width: wp(100)}}>
              <Ionicons name="search" size={20} color="#6B7280" />
              <TextInput
                placeholder="Search classes, lecturers, rooms..."
                className="flex-1 ml-2 text-gray-700"
                onChangeText={()=>{}}
              />
              <Ionicons name="mic-outline" size={20} color="#6B7280" />
    </View>

  )
}

export default SearchBar
