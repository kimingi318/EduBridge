import { Link } from "expo-router";
import { Image, Text, View } from "react-native";
import "./globals.css";

export default function LandingPage() {
  return (
    <View className="flex-1 h-full p-6">
      {/*Logo */}
      <View className="mt-10 mb-10 rounded-lg items-center">
        <Image
          className="w-24 h-20 "
          source={require("../assets/images/edubridge-logo.png")}
          resizeMode="contain"
        />
      </View>
      {/*Title */}
      <View className="items-center mt-10 mb-10">
        <Text className="text-[32px] font-bold text-black">Welcome to</Text>
        <Text className="text-[42px] font-black text-[#0C06B9] mt-1">
          Edu<Text className="text-black">Bridge</Text>.
        </Text>
        <Text className="text-sm text-gray-500 mt-2 mb-8">
          Your Campus Companion
        </Text>
      </View>

      {/* Features */}
      <View className="w-full mb-10 px-10">
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
      <View className="items-center mt-[300px]">
        <Link
          href="/SignIn"
          className="bg-blue-700 px-10 py-4 rounded-full shadow-md text-white font-bold text-base"
        >
          Get Started
        </Link>
      </View>
    </View>
  );
}

function FeatureItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
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
