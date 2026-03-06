import GradientButton from "@/components/GradientButton";
import icons from "@/constants/icons";
import { darkTheme, lightTheme } from "@/utils/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import CustomKeyBoardView from "../components/customKeyBoardView";
import EduLogo from "../components/EduLogo";
import Loading from "../components/loading";
import { useAuth } from "../context/authContext";

const data = [
  { label: 'Student', value: 'Student' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Lecturer', value: 'Lecturer' }
]

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signUp } = useAuth();
  const [value, setValue] = useState(null);
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = createStyles(theme);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleSignup = async () => {
    if (!email || !role || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    let response = await signUp(email, password, role);
    setLoading(false);

    // console.log('got results: ', response);
    if (response?.error) {
      Alert.alert("Error", response.error);
    }
  };
  return (
    <CustomKeyBoardView>
      {/* Header Image */}
      <ImageBackground
        source={require("../assets/images/student-signin-img.jpg")}
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
            <Text className="text-blue-700 font-bold text-lg">EduBridge.</Text>
          </View>
        </View>
      </ImageBackground>

      {/* White Card */}
      <View style={{ backgroundColor: theme.background }} className="flex-1 rounded-t-3xl -mt-10 px-6 pt-6">
        <Text style={{ color: theme.text }} className="text-xl font-bold  mb-1">
          Join EduBridge
        </Text>

        <Text style={{ color: theme.subText }} className=" mb-6">
          or{" "}
          <Link href="/SignIn">
            <Text className="text-blue-600 font-semibold">Sign In</Text>
          </Link>
        </Text>

        {/* Inputs */}
        <View className="space-y-5">
          <View>
            <Text style={styles.header} className=" text-gray-500 mb-1">Email address*</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="border-b border-gray-300 pb-2 "
              placeholder="example@email.com"
              style={{ color: theme.text }}
              placeholderTextColor={theme.subText}

            />
          </View>

          <View>
            <Text style={styles.header} className=" text-gray-500 mb-1">
              Role.*
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={data}
              labelField="label"
              placeholder="Select Role"
              value={value}
              valueField="value"
              placeholderStyle={styles.placeholderStyle}
              containerStyle={styles.dropdownContainer}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              onChange={(item) => {
                setValue(item.value);
                setRole(item.value)
              }}
            />
          </View>

          <View>
            <Text style={styles.header} className=" text-gray-500 mb-1">Password*</Text>
            <View className="flex-row items-center border-b border-gray-300">
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={{ color: theme.text }}
                className="flex-1 pb-2 "
                placeholder="********"
                placeholderTextColor={theme.subText}
              />
              <View className="flex-row items-center ">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={{ color: theme.text }}
                  className="flex-1 pb-2"
                  placeholder="********"
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

          <View>
            <Text style={styles.header} className=" text-gray-500 mb-1">
              Confirm Password*
            </Text>
            <View className="flex-row items-center border-b border-gray-300">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={{ color: theme.text }}
                className="flex-1 pb-2 "
                placeholder="********"
                placeholderTextColor={theme.subText}
              />
              <View className="flex-row items-center ">
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  style={{ color: theme.text }}
                  className="flex-1 pb-2"
                  placeholder="********"
                  placeholderTextColor={theme.subText}
                />

                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? "eye" : "eye-outline"}
                    size={20}
                    color={theme.text}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Terms */}
        <Text style={styles.header} className=" text-gray-400 mt-6 mb-6 leading-4">
          By clicking agree and join, you agree to the EduBridge{" "}
          <Text className="text-blue-600">
            User Agreement, privacy policy and cookie policy.
          </Text>{" "}
          For Email signup we will send verification code via email
        </Text>

        {/* Primary Button */}
        <View>
          {loading ? (
            <View className="flex-row justify-center">
              <Loading size={hp(8)} />
            </View>
          ) : (
            <GradientButton onPress={handleSignup} title="Agree & Join" />
          )}
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-[1px] bg-gray-200" />
          <Text className="mx-3 text-gray-400 text-sm">Or</Text>
          <View className="flex-1 h-[1px] bg-gray-200" />
        </View>

        {/* Google Button */}
        <TouchableOpacity className="border mb-4 border-gray-300 rounded-full py-3 flex-row justify-center items-center space-x-2">
          <Image style={{ height: hp(3), width: wp(6), marginRight: wp(2) }} source={icons.google} />
          <Text className="text-gray-700 font-medium">
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>
    </CustomKeyBoardView>
  );
}


const createStyles = (theme: any) =>
  StyleSheet.create({
    dropdown: {
      height: hp(5),
      borderColor: "#ccc",
      borderBottomWidth: wp(0.3),
      marginBottom: hp(0.3),
      backgroundColor: theme.background
    },
    header: {
      fontSize: hp(1.5),
      color: theme.subText
    },
    placeholderStyle: {
      color: theme.subText,
      fontSize: hp(1.5)
    },
    dropdownContainer: {
      borderRadius: 8,
      color: theme.text,
      backgroundColor: theme.card,
      elevation: 3, // shadow on Android
    },
    selectedTextStyle: {
      fontSize: 14,
      color: theme.text,
    },
    itemTextStyle: {
      fontSize: 14,
      color: theme.text,
    },
  })