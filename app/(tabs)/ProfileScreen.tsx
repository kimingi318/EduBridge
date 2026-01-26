import ImageViewer from "@/components/ImageViewer";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/authContext";





export default function ProfileScreen() {


  const { signOut, user } = useAuth();
  const handleSignOut = async () => {
    await signOut();
  };
  // console.log("user info: ", user);
  const [isEditingName, setIsEditingName] = useState(true);
  const [name, setName] = useState("");
  const [Phone, setPhone] = useState("");

  // const saveProfile = async (field: string, value: any) => {
  //   try {
  //     const res = await fetch("http://192.168.100.4:3000/api/users/profiles", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json", },
  //       body: JSON.stringify({ [field]: value }),
  //     });
  //     const data = await res.json();
  //     console.log("Saved:", data);
  //   } catch (err) {
  //     console.error("Error saving profile:", err);
  //   }
  // };
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  };

  const placeholder = require('@/assets/images/student-dp.jpeg')

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
            {isEditingName ? (
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Edit your name"
                onBlur={() => setIsEditingName(false) }

                className="text-white text-lg font-semibold mt-3 text-center"
              />
            ) : (
              <TouchableOpacity onPress={() => setIsEditingName(true)}>
                <Text className="text-white text-titles font-semibold mt-3">
                  {name}
                </Text>
              </TouchableOpacity>
            )}

            <Text className="text-slate-200 text-xs mt-1">
              Empowering Your Digital Future
            </Text>
            <Text className="text-slate-300 text-xs">
              Computer Science · Level IV
            </Text>
          </View>

          {/* ================= CONTACT INFO ================= */}
          <View className="px-4 mt-6 space-y-3">
            {/* Phone */}
            <View className="bg-white rounded-xl p-4 mb-2 flex-row items-center shadow-sm">
              <View className="bg-indigo-100 p-2 rounded-lg">
                <Ionicons name="call" size={18} color="#2563EB" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-slate-500">Phone</Text>
                <TextInput
                  className="text-sm text-slate-900"
                  placeholder="+254712345678"
                  value={Phone}
                  onChangeText={setPhone}
                />
              </View>

              <TouchableOpacity>
                <Feather name="edit-2" size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>

            {/* Email */}
            <View className="bg-white rounded-xl p-4 mb-2 flex-row items-center shadow-sm">
              <View className="bg-indigo-100 p-2 rounded-lg">
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-slate-500">Email</Text>
                <Text className="text-sm text-slate-900">{user?.email ?? ""}</Text>
              </View>

              <TouchableOpacity>
                <Feather name="edit-2" size={16} color="#2563EB" />
              </TouchableOpacity>
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
              {
                title: "Distributed Systems",
                lecturer: "Charles Kinyua",
                students: 150,
              },
              {
                title: "Computer Project II",
                lecturer: "Dr. Osero",
                students: 150,
              },
              {
                title: "Software Project Management",
                lecturer: "Dr. Muthengi",
                students: 150,
              },
              {
                title: "Special Topics in CS",
                lecturer: "Sigor Oulu",
                students: 150,
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
  <View className="bg-white rounded-xl p-3 shadow-sm">
    <Text className="text-sm font-medium">{title}</Text>
    <Text className="text-xs text-slate-500">
      Lecturer · {lecturer} · {students} students
    </Text>
  </View>
);
