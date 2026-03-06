import icons from "@/constants/icons";
import { darkTheme, lightTheme } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomKeyBoardView from "../components/customKeyBoardView";
import EduLogo from "../components/EduLogo";
import GradientButton from "../components/GradientButton";
import Loading from "../components/loading";
import { useAuth } from "../context/authContext";


export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const [showPassword, setShowPassword] = useState(false);


  const handleSignin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    const response = await signIn(email, password);
    setLoading(false);
    // console.log("got results: ", response);
    if (!response.success) {
      Alert.alert("Error", response.error);
    }
  };
  return (
    <CustomKeyBoardView>
      <ImageBackground
        source={require("../assets/images/student-signup-img.jpg")}
        className=" w-full"
        style={{ height: hp(40) }}
        resizeMode="cover"
      >
        {/* Top Bar */}
        <View
          className="flex-row justify-between items-center px-5 "
          style={{ paddingTop: hp(6) }}
        >
          <View className="flex-row items-center space-x-2">
            <View className="bg-blue-600 p-2 rounded-lg">
              <EduLogo size={35} onPress={() => router.push("/LandingPage")} />
            </View>
            <Text className="text-blue-700 font-bold text-lg">
              Edu <Text style={{ color: "#fff" }}>Bridge</Text>.
            </Text>
          </View>
        </View>
      </ImageBackground>

      <View style={{ backgroundColor: theme.background }} className="flex-1 rounded-t-3xl -mt-10 px-3 pt-6">
        <Text style={{ color: theme.text }} className="text-xl font-bold  mb-1">Sign In</Text>

        <Text style={{ color: theme.subText }} className=" mb-6">
          or{" "}
          <Link href="/SignUp">
            <Text className="text-blue-600 font-semibold">Join EduBridge</Text>
          </Link>
        </Text>

        {/* Inputs */}
        <View className="space-y-5">
          <View>
            <Text style={{ color: theme.subText }} className="text-xs  mb-1">Email address *</Text>
            <View style={{ borderBottomColor: theme.subText }} className="border-b ">
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={{ color: theme.text }}
                className="pb-2"
                placeholder="example@email.com"
              />
            </View>
          </View>

          <View>
            <Text style={{ color: theme.subText }} className="text-xs  mb-1">Password *</Text>
            <View style={{ borderBottomColor: theme.subText }} className="flex-row items-center border-b ">
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={{ color: theme.text }}
                className="flex-1 "
              />
              <View className="flex-row items-center">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={{ color: theme.text }}
                  className="flex-1 pb-2"
                  placeholderTextColor={theme.subText}
                />

                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye" : "eye-outline"}
                    size={20}
                    color={theme.text}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Primary Button */}
        <View className="mt-6">
          {loading ? (
            <View className="flex-row justify-center">
              <Loading size={hp(8)} />
            </View>
          ) : (
            <GradientButton onPress={handleSignin} title="Continue" />
          )}
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View style={{ backgroundColor: theme.subText }} className="flex-1 h-[1px]" />
          <Text style={{ color: theme.text }} className="mx-3  text-sm">Or</Text>
          <View style={{ backgroundColor: theme.subText }} className="flex-1 h-[1px]" />
        </View>

        {/* Google Button */}
        <TouchableOpacity style={{ borderBlockColor: theme.text }} className="border rounded-full py-3 flex-row justify-center items-center space-x-2">
          <Image style={{ height: hp(3), width: wp(6), marginRight: wp(2) }} source={icons.google} />
          <Text style={{ fontSize: hp(2), color: theme.subText }} className=" font-medium">
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>
    </CustomKeyBoardView>
  );
}
