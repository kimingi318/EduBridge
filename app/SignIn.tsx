import { Ionicons } from "@expo/vector-icons";
import {
  ImageBackground,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  return (
    <SafeAreaView className="flex-1 pt-10 bg-white">
      {/* Header Image */}
      <ImageBackground
        source={require("../assets/student-signin-img.jpg")}
        className="h-[42%] w-full"
        resizeMode="cover"
      >
        {/* Top Bar */}
        <View className="flex-row justify-between items-center px-5 pt-4">
          <View className="flex-row items-center space-x-2">
            <View className="bg-blue-600 p-2 rounded-lg">
              <Ionicons name="school-outline" size={18} color="white" />
            </View>
            <Text className="text-blue-700 font-bold text-lg">
              EduBridge.
            </Text>
          </View>

          <Ionicons name="menu-outline" size={28} color="#000" />
        </View>
      </ImageBackground>

      {/* White Card */}
      <View className="flex-1 bg-white rounded-t-3xl -mt-10 px-6 pt-6">
        <Text className="text-xl font-bold text-gray-900 mb-1">
          Join EduBridge
        </Text>

        <Text className="text-gray-500 mb-6">
          or{" "}
          <Text className="text-blue-600 font-semibold">
            Sign in
          </Text>
        </Text>

        {/* Inputs */}
        <View className="space-y-5">
          <View>
            <Text className="text-xs text-gray-500 mb-1">
              Email address*
            </Text>
            <TextInput
              className="border-b border-gray-300 pb-2 text-gray-800"
              placeholder="example@email.com"
            />
          </View>

          <View>
            <Text className="text-xs text-gray-500 mb-1">
              Registration No.*
            </Text>
            <TextInput
              className="border-b border-gray-300 pb-2 text-gray-800"
              placeholder="EB1/61275/22"
            />
          </View>

          <View>
            <Text className="text-xs text-gray-500 mb-1">
              Password*
            </Text>
            <View className="flex-row items-center border-b border-gray-300">
              <TextInput
                secureTextEntry
                className="flex-1 pb-2 text-gray-800"
                placeholder="********"
              />
              <Ionicons
                name="eye-outline"
                size={18}
                color="#6B7280"
              />
            </View>
          </View>

          <View>
            <Text className="text-xs text-gray-500 mb-1">
              Confirm Password*
            </Text>
            <View className="flex-row items-center border-b border-gray-300">
              <TextInput
                secureTextEntry
                className="flex-1 pb-2 text-gray-800"
                placeholder="********"
              />
              <Ionicons
                name="eye-outline"
                size={18}
                color="#6B7280"
              />
            </View>
          </View>
        </View>

        {/* Terms */}
        <Text className="text-xs text-gray-400 mt-6 leading-4">
          By clicking agree and join, you agree to the EduBridge{" "}
          <Text className="text-blue-600">
            User Agreement, privacy policy and cookie policy.
          </Text>{" "}
          For Email signup we will send verification code via email
        </Text>

        {/* Primary Button */}
        <TouchableOpacity className="bg-blue-600 rounded-full py-4 mt-6 shadow-md shadow-blue-500/40">
          <Text className="text-white text-center font-semibold text-base">
            Agree & Join
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-[1px] bg-gray-200" />
          <Text className="mx-3 text-gray-400 text-sm">Or</Text>
          <View className="flex-1 h-[1px] bg-gray-200" />
        </View>

        {/* Google Button */}
        <TouchableOpacity className="border border-gray-300 rounded-full py-3 flex-row justify-center items-center space-x-2">
          <Ionicons name="logo-google" size={18} color="#DB4437" />
          <Text className="text-gray-700 font-medium">
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
