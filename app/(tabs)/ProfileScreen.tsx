import { Feather, Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useAuth } from "../../context/authContext";

export default function ProfileScreen() {
  //to use user info add user inside the curly braces
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    await signOut();
  };
  // console.log("user info: ", user);
  const [isEditingName, setIsEditingName] = useState(true);
  const [name, setName] = useState("Peter Kamau Kimingi");
  return (
    <ImageBackground source={require("../../assets/images/main-bg-img.jpg")}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= HEADER ================= */}
        <View
          style={{ height: hp("28%") }}
          className=" items-center justify-center rounded-b-3xl"
        >
          {/* Edit Profile Picture */}
          <TouchableOpacity className="absolute top-4 right-4 bg-white/20 p-2 rounded-full">
            <Feather name="edit-2" size={18} color="white" />
          </TouchableOpacity>

          {/* Avatar */}
          <Image
            source={require("../../assets/images/student-dp.jpeg")}
            style={{ width: wp("26%"), height: wp("26%") }}
            className="rounded-full"
          />

          {/* Name */}
          {isEditingName ? (
            <TextInput
              value={name}
              onChangeText={setName}
              onBlur={() => setIsEditingName(false)}
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
          <InfoCard icon="call" label="Phone" value="+254705168033" />

          {/* Email */}
          <InfoCard
            icon="mail"
            label="Email"
            value="kimingipeter318@gmail.com"
          />

          {/* Registration */}
          <InfoCard icon="id-card" label="Registration" value="EB1/61275/22" />
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

        <View style={{ height: hp("5%") }} />
        <Text onPress={handleSignOut}>Sign Out</Text>
      </ScrollView>
    </ImageBackground>
  );
}
const InfoCard = ({ icon, label, value }: any) => (
  <View className="bg-white rounded-xl p-4 flex-row items-center shadow-sm">
    <View className="bg-indigo-100 p-2 rounded-lg">
      <Ionicons name={icon} size={18} color="#2563EB" />
    </View>

    <View className="ml-3 flex-1">
      <Text className="text-xs text-slate-500">{label}</Text>
      <Text className="text-sm text-slate-900">{value}</Text>
    </View>

    <TouchableOpacity>
      <Feather name="edit-2" size={16} color="#2563EB" />
    </TouchableOpacity>
  </View>
);
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
