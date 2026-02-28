import Profile from "@/components/Profile";
import ProfileAvatar from "@/components/ProfileAvatar";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from "react-native-responsive-screen";
import { useAuth } from "../../../context/authContext";


export default function ProfileScreen() {
  const { signOut, user, profile } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    // Show profile modal if no profile data yet
    if (!profile) {
      setIsModalVisible(true);
    } else {
      setIsModalVisible(false);
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
  };

  const editProfile = () => {
    setIsModalVisible(true);
  }

  return (
    <View className="flex-1">
      <ImageBackground source={require("../../../assets/images/main-bg-img.jpg")}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* ================= HEADER ================= */}
          <View
            style={{ height: hp(26) }}
            className=" items-center justify-center rounded-b-3xl"
          >

            <TouchableOpacity onPress={handleSignOut} className="absolute top-10 right-4 bg-white/20 p-2 rounded-full">
              <Feather name="log-out" size={18} color="white" />
            </TouchableOpacity>

            {/*Profile Picture */}
            <ProfileAvatar
              imageUri={profile?.profile_image}
              fallbackImage={require("../../../assets/images/lecturer-dp.jpg")}
              dotColor="#22C55E"   // green
            />

            {/* Name */}
            <Text className="text-white"
            >
              {profile?.name || ""}
            </Text>
            <Text className="text-slate-200 text-xs mt-1">
              {profile?.course_name || ""}
            </Text>
            <Text className="text-slate-300 text-xs">
              {""}· {profile?.level || ""}
            </Text>
          </View>

          {/* ================= CONTACT INFO ================= */}
          <View
            style={{ paddingHorizontal: wp(2), paddingTop: hp(1) }}
            className="bg-gray-100 rounded-t-[30px]">
            {/* Email */}
            <View className="flex-row justify-between items-center">
              <Text style={styles.header}>Personal details</Text>
              <TouchableOpacity onPress={editProfile}>
                <Feather name="edit-2" size={16} color="#2563EB" />
              </TouchableOpacity >
            </View>
            <View className="bg-white rounded-xl p-4 mb-2 flex-row items-center">
              <View className="bg-indigo-100 p-2 rounded-lg">
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-xs text-slate-500">Email</Text>
                <Text className="text-sm text-slate-900">{user?.email ?? ""}</Text>
              </View>
            </View>
            {/* username */}
            <View className="bg-white rounded-xl p-4 mb-2 flex-row items-center">
              <View className="bg-indigo-100 p-2 rounded-lg">
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-xs text-slate-500">username</Text>
                <Text className="text-sm text-slate-900">{profile?.username || ""}</Text>
              </View>
            </View>

            {/* phone */}
            <View className="bg-white rounded-xl p-4 mb-2 flex-row items-center">
              <View className="bg-indigo-100 p-2 rounded-lg">
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-slate-500">Phone</Text>
                <Text className="text-sm text-slate-900">{profile?.phone || ""}</Text>
              </View>
            </View>

            {/* Registration */}
            <View className="bg-white rounded-xl p-4 mb-2 flex-row items-center">
              <View className="bg-indigo-100 p-2 rounded-lg">
                <Ionicons name="id-card" size={18} color="#2563EB" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-slate-500">
                  Lecturer ID
                </Text>
                <Text className="text-sm text-slate-900">{profile?.L_Id ?? ""}</Text>
              </View>
            </View>

            {/* ================= MY FORUMS ================= */}
            <Text style={styles.header}>My Forum</Text>
            <View className="bg-white rounded-xl p-3 flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center">
                <Text className="text-white text-xs">CS</Text>
              </View>
              <View className="ml-3">
                <Text className="text-sm font-medium">
                  Department of Computer Science
                </Text>
                <Text className="text-xs text-slate-500">
                  Forum · Announcement & Discussion
                </Text>
              </View>
            </View>

            <Profile
              isVisible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
            ></Profile>

            {/* ================= MY CLASSES ================= */}
            <Section title="My Classes">
              <ClassCard
                title="Cryptography & Computer Security"
                code="COSC 464"
                level="Level IV"
                students="150"
              />
              <ClassCard
                title="Network Management"
                code="COSC 468"
                level="Level IV"
                students="90"
              />
              <ClassCard
                title="Data Structures"
                code="COSC 264"
                level="Level II"
                students="101"
              />
            </Section>

            {/* ================= TIMETABLE ================= */}
            <Section title="Time Table">
              <View
                style={{ height: hp("14%") }}
                className="bg-black rounded-xl items-center justify-center"
              >
                <Text className="text-white text-xs">4.2 Time Table Preview</Text>
              </View>
            </Section>
          </View>


        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const Section = ({ title, children }: any) => (
  <View >
    <Text style={styles.header}>{title}</Text>
    <View className="space-y-3">{children}</View>
  </View>
);

const ClassCard = ({ title, code, level, students }: any) => (
  <View className="bg-white p-4 mb-4 rounded-2xl shadow">
    <View>
      <Text className="font-semibold">{title}</Text>
      <Text className="text-gray-500 text-sm">
        {level} · {code}
      </Text>
    </View>

    <View className="bg-blue-700 absolute right-0  top-[-10] px-3 py-1 rounded-full">
      <Text className="text-white text-xs">{students} students</Text>
    </View>
  </View>
);
const styles = StyleSheet.create({
  header: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    marginBottom: hp(1),
    marginTop: hp(1),
  },
});