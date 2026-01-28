import ImageViewer from "@/components/ImageViewer";
import { apiFetch } from "@/utils/api";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/authContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const handleSignOut = async () => {
    await signOut();
  };
  // console.log("user info: ", user);
  const [name, setName] = useState("");
  const [Phone, setPhone] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const placeholder = require('@/assets/images/student-dp.jpeg')

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);

      await apiFetch("/api/profiles", {
        method: "POST",
        body: JSON.stringify({
          name,
          phone: Phone,
          profileImage: uri,
        }),
      });
    }
  };
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await apiFetch("/api/profiles/me");
        if (!res.ok) {
          if (res.status === 404) {
            console.log("No profile found - user is creating one for the first time");
          } else {
            console.warn("Failed to load profile: API returned status", res.status);
          }
          return;
        }
        const data = await res.json();
        if (data) {
          setName(data.name ?? "");
          setPhone(data.phone ?? "");
          setSelectedImage(data.profile_image ?? undefined);
        }
      } catch (apiError) {
        console.warn("Failed to load user profile:", apiError);
      }
    };

    loadProfile();
  }, []);



  return (
    <SafeAreaView>
      <ImageBackground source={require("../../assets/images/main-bg-img.jpg")}>
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
            <TouchableOpacity onPress={pickImageAsync}>
              <ImageViewer imgSource={placeholder} selectedImage={selectedImage} />
            </TouchableOpacity>


            {/* Name */}
            <Text className="text-white"
            >
              { "John Doe"}
            </Text>
            <Text className="text-slate-200 text-xs mt-1">
             {  "Aspiring Software Engineer"}
            </Text>
            <Text className="text-slate-300 text-xs">
              {"Computer science"}· {"IV"}
            </Text>
          </View>

          {/* ================= CONTACT INFO ================= */}
          <View className="px-4 mt-6 space-y-3">


            {/* Email */}
            <View className="bg-white rounded-xl p-4 mb-2 flex-row items-center shadow-sm">
              <View className="bg-indigo-100 p-2 rounded-lg">
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-slate-500">Email</Text>
                <Text className="text-sm text-slate-900">{user?.email ?? ""}</Text>
              </View>

              {/* <TouchableOpacity>
                <Feather name="edit-2" size={16} color="#2563EB" />
              </TouchableOpacity> */}
            </View>
            {/* username */}
            <View className="bg-white rounded-xl p-4 mb-2 flex-row items-center shadow-sm">
              <View className="bg-indigo-100 p-2 rounded-lg">
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-slate-500">username</Text>
                <Text className="text-sm text-slate-900">{""}</Text>
              </View>

              {/* <TouchableOpacity>
                <Feather name="edit-2" size={16} color="#2563EB" />
              </TouchableOpacity> */}
            </View>
            {/* phone */}
            <View className="bg-white rounded-xl p-4 mb-2 flex-row items-center shadow-sm">
              <View className="bg-indigo-100 p-2 rounded-lg">
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-slate-500">Phone</Text>
                <Text className="text-sm text-slate-900">{""}</Text>
              </View>

              {/* <TouchableOpacity>
                <Feather name="edit-2" size={16} color="#2563EB" />
              </TouchableOpacity> */}
            </View>

            {/* Registration */}
            <View className="bg-white rounded-xl p-4 mb-2 flex-row items-center shadow-sm">
              <View className="bg-indigo-100 p-2 rounded-lg">
                <Ionicons name="id-card" size={18} color="#2563EB" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-slate-500">
                  Registration Number
                </Text>
                <Text className="text-sm text-slate-900">{user?.regNo ?? ""}</Text>
              </View>

              <TouchableOpacity>
                <Feather name="edit-2" size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ================= MY FORUMS ================= */}
          <Section title="My Forums">
            <ForumCard />
          </Section>

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
          <TouchableOpacity onPress={()=> router.push("/NotificationScreen")}>
            <Text className="text-indigo-600 text-center my-6">add faculty</Text>
          </TouchableOpacity>

        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const Section = ({ title, children }: any) => (
  <View className="px-4 mt-6">
    <Text className="text-base font-semibold text-slate-900 mb-3">{title}</Text>
    <View className="space-y-3">{children}</View>
  </View>
);
const ForumCard = () => (
  <View className="bg-white rounded-xl p-3 flex-row items-center shadow-sm">
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
);
const ClassCard = ({ title, lecturer, students }: any) => (
  <View style={{ height: hp(8)}} className="bg-white rounded-xl p-3 mb-2 shadow-sm">
    <Text className="text-lg font-medium">{title}</Text>
    <Text className="text-xs text-slate-500">
      Lecturer · {lecturer} · {students} students
    </Text>
  </View>
);
