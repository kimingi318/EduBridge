import { darkTheme, lightTheme } from "@/utils/colors";
import { router } from "expo-router";
import { Text, View, useColorScheme } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EduLogo from "../components/EduLogo";
import GradientButton from "../components/GradientButton";
import "./globals.css";

export default function LandingPage() {
    const scheme = useColorScheme();
    const theme = scheme === "dark" ? darkTheme : lightTheme;

  return (
    <View className="flex-1 h-full p-6">
            {/*Logo */}
      <View style={{marginTop: hp(8), marginBottom: hp(4)}} className=" rounded-sm items-center">
        <EduLogo
          size={60}
        />
      </View>
      {/*Title */}
      <View className="items-center mt-10 mb-10">
        <Text style={{color:theme.text}} className="text-[32px] font-bold">Welcome to</Text>
        <Text className="text-[42px] font-black text-[#0C06B9] mt-1">
          Edu<Text style={{color:theme.text}} >Bridge</Text>.
        </Text>
        <Text style={{color:theme.subText}} className="text-sm  mt-2 mb-8">
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
      <View className="items-center" style={{marginTop: hp(8)}}>
       <GradientButton
       title="Get Started"
       onPress={() => {
        // Navigate to SignIn page
        router.push('/SignIn');
       }}
       />
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
    const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  return (
    <View className="flex-row items-start mb-4">
      <Text style={{color:theme.text}} className=" text-base mr-3 mt-0.5">✓</Text>
      <Text style={{color:theme.subText}} className="flex-1 text-sm text-gray-700">
        <Text className="font-bold text-blue-700">{title}. </Text>
        {description}
      </Text>
    </View>
  );
}
