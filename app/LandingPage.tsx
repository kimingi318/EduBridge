import { Link } from 'expo-router';
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./globals.css";


export default function LandingPage()  {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center px-6">
        {/*Logo */}
        <View className="mt-10 mb-6">
          <Image
            className="w-16 h-16 "
            source={require("../assets/edubridge-logo.png")}
            resizeMode="contain"
          />
        </View>
        {/*Title */}
        <Text className="text-2xl font-semibold text-black">Welcome to</Text>
        <Text className="text-4xl font-extrabold text-blue-700 mt-1">
          EduBridge.
        </Text>
        <Text className="text-sm text-gray-500 mt-2 mb-8">
          Your Campus Companion
        </Text>

        {/* Features */}
        <View className="w-full mb-10">
          <FeatureItem
            title="Campus Communication"
            description="Stay connected with your peers and lecturers through instant messaging and group chats"
          />
          <FeatureItem
            title="Real-time Updates"
            description="Get instant alerts on assignments, exams, classes and campus events"
          />
          <FeatureItem
            title="Peer Collaboration"
            description="Work together on projects and share resources seamlessly"
          />
        </View>
        {/* CTA */}
        <Link href='/SignIn' className="bg-blue-700 px-10 py-4 rounded-full shadow-md text-white font-bold text-base">
          Get Started
        </Link>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
return (
<View className="flex-row items-start mb-4">
<Text className="text-blue-700 text-base mr-3 mt-0.5">✓</Text>
<Text className="flex-1 text-sm text-gray-700">
<Text className="font-bold text-blue-700">{title}. </Text>
{description}
</Text>
</View>
);
}