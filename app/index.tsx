import { ActivityIndicator, Text, View } from 'react-native';

export default function Splash() {
    return(
        <View className="flex-1 justify-center items-center bg-white">
            <ActivityIndicator size="large" color="#0C06B9" />
            <Text className="mt-4 text-blue-700 text-lg font-semibold">Loading EduBridge...</Text>
        </View>
    )
}



