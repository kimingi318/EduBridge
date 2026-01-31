import Profile from "@/components/Profile";
import { apiFetch } from "@/utils/api";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
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
import { useAuth } from "../../context/authContext";

const API_BASE_URL = Platform.OS === "web"
    ? "http://localhost:3000"
    : "http://192.168.100.4:3000";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const handleSignOut = async () => {
    await signOut();
  };
  const [name, setName] = useState("");
  const [Phone, setPhone] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const[isModalVisible,setIsModalVisible]=useState<boolean>(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await apiFetch(`${API_BASE_URL}/api/profiles/me`,{
          method: "GET",
        });
        if (!res.ok) {
          setIsModalVisible(true);
          return;
        }else {
        const data = await res.json();
          if (!data){
            setIsModalVisible(true);
            return;
          }else{
          setIsModalVisible(false);
          setName(data.name ?? "");
          setPhone(data.phone ?? "");
          setSelectedImage(data.profile_image ?? undefined);}
        }
      } catch (apiError) {
        console.warn("Failed to load user profile:", apiError);
      }
    };

    loadProfile();
  }, []);

  const editProfile = ()=>{
    setIsModalVisible(true);
  }

  return (
    <View className="flex-1">
      <ImageBackground source={require("../../assets/images/main-bg-img.jpg")}>
        <StatusBar style="light" />
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* ================= HEADER ================= */}
          <View
            style={{ height: hp("28%") }}
            className=" items-center justify-center rounded-b-3xl"
          >
            {/* Edit Profile Picture */}
            <TouchableOpacity onPress={handleSignOut} className="absolute top-10 right-4 bg-white/20 p-2 rounded-full">
              <Feather name="log-out" size={18} color="white" />
            </TouchableOpacity>

            {/* Avatar */}
            <View>
              <Image source={{uri:selectedImage}}/>
            </View>

            {/* Name */}
            <Text className="text-white"
            >
              {""}
            </Text>
            <Text className="text-slate-200 text-xs mt-1">
              {""}
            </Text>
            <Text className="text-slate-300 text-xs">
              {""}· {""}
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
                <Text className="text-sm text-slate-900">{""}</Text>
              </View>
            </View>

            {/* phone */}
            <View className="bg-white rounded-xl p-4 mb-2 flex-row items-center">
              <View className="bg-indigo-100 p-2 rounded-lg">
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-slate-500">Phone</Text>
                <Text className="text-sm text-slate-900">{""}</Text>
              </View>
            </View>

            {/* Registration */}
            <View className="bg-white rounded-xl p-4 mb-2 flex-row items-center">
              <View className="bg-indigo-100 p-2 rounded-lg">
                <Ionicons name="id-card" size={18} color="#2563EB" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-slate-500">
                  Registration Number
                </Text>
                <Text className="text-sm text-slate-900">{user?.regNo ?? ""}</Text>
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
            onClose={()=>setIsModalVisible(false)}
            ></Profile>

            {/* ================= MY CLASSES ================= */}
            <Section title="My Classes">
              {[
                {
                  title: "Decision Support Systems",
                  lecturer: "Dr. Osero",
                  students: 150,
                },
                {
                  title: "Network Management",
                  lecturer: "Dr. Mwathi",
                  students: 90,
                },
                { title: "Seminars in CS", lecturer: "Dr. Jane", students: 150 },
              ].map((item, index) => (
                <ClassCard key={index} {...item} />
              ))}
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

const ClassCard = ({ title, lecturer, students }: any) => (
  <View style={{ height: hp(6) }} className="bg-white rounded-xl p-3 mb-2 ">
    <Text className="text-lg font-medium">{title}</Text>
    <Text className="text-xs text-slate-500">
      Lecturer · {lecturer} · {students} students
    </Text>
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