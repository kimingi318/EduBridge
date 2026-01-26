import ScheduleCard from "@/components/schedule";
import SearchBar from "@/components/searchBar";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  View,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { blurhash } from "../../utils/common";

export default function HomeScreen() {
  const router = useRouter();


  return (
    <SafeAreaView className="flex-1 ">
      <ImageBackground source={require("../../assets/images/main-bg-img.jpg")}>
        <StatusBar style="light" backgroundColor="#000" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View
            style={{ marginTop: hp(4) }}
            className="px-5 flex-1 items-center pb-8 "
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-3">
                <View className="relative" style={{ marginRight: hp(2) }}>
                  <Image
                    style={{
                      height: hp(10),
                      aspectRatio: 1,
                      borderRadius: 100,
                    }}
                    source={require("../../assets/images/student-dp.jpeg")}
                    placeholder={{ blurhash }}
                    transition={500}
                  />
                  <View className="absolute right-0 bottom-0 w-5 h-5 bg-green-500 rounded-full " />
                </View>

                <View>
                  <Text className="text-white text-[32px]  font-inter-bold">
                    Good morning, Peter
                  </Text>
                  <Text className="text-blue-200 text-[22px] font-inter">
                    IV · Semester 1 · BSc IT
                  </Text>
                </View>
              </View>
            </View>

            {/* SEARCH */}
            <SearchBar />
          </View>
          {/* CONTENT */}
          <View className="bg-gray-100 -mt-6 rounded-t-[30px] px-5 pt-6">
            {/* TODAY'S SCHEDULE */}
            <View>
              <ScheduleCard
                courseTitle="Cryptography & Computer Security"
                timePeriod="10:00 – 13:00"
                lecturerName="Dr Mwathi"
                classLocation="BSR 303"
                isOnline={false}
                startsIn="20 mins"
                status="NEXT"
              />
            </View>

            {/* EVENTS */}
            <View className="mt-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-titles font-bold">Events</Text>
                <Text className="bg-edublue text-white px-4 py-1 rounded-full text-xs">
                  Academic
                </Text>
                <Text className="bg-edulightblue text-edublue px-4 py-1 rounded-full text-xs">
                  Social
                </Text>
                <Text className="text-edublue font-semibold" onPress={()=> router.push("/NotificationScreen")}>See all</Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* Event Card */}
                <View className="bg-white rounded-2xl w-64 mr-4 overflow-hidden shadow">
                  <Image
                    source={require("../../assets/images/Graduation-event-img.jpg")}
                    style={{ height: hp(12) }}
                    placeholder={{ blurhash }}
                    transition={500}
                  />
                  <View className="p-3">
                    <Text className="text-green-600 text-xs">FRI 21 NOV</Text>
                    <Text className="font-bold">14th Graduation Ceremony</Text>
                    <Text className="text-gray-500 text-sm">
                      8am – 5pm · Chuka Pavilion
                    </Text>
                  </View>
                </View>
                <View className="bg-white rounded-2xl w-64 mr-4 overflow-hidden shadow">
                  <Image
                    source={require("../../assets/images/vote-event-img.jpg")}
                    style={{ height: hp(12) }}
                    placeholder={{ blurhash }}
                    transition={500}
                  />
                  <View className="p-3">
                    <Text className="text-green-600 text-xs">FRI 21 NOV</Text>
                    <Text className="font-bold">Elections</Text>
                    <Text className="text-gray-500 text-sm">
                      6am – 1pm · Chuka Pavilion
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </View>

            {/* MEMOS */}
            <View className="mt-4 mb-10">
              <View className="flex-row justify-between mb-3">
                <Text className="text-titles font-bold">Memos</Text>
                  <Text className="text-edublue font-semibold" onPress={()=> router.push("/NotificationScreen")}>See all</Text>
              </View>

              <Memo
                color="red"
                title="CUSA Elections Nominee Registration"
                subtitle="Deadline · Tuesday, 13 January, 10:00 AM"
              />

              <Memo
                color="green"
                title="Online Gate-Pass Acquisition"
                subtitle="Thursday, 8 January"
              />

              <Memo
                color="blue"
                title="CAT Sit-in COSC 442 DSS"
                subtitle="Wednesday, 25 February · 3:00 PM S403"
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
/* MEMO COMPONENT */
function Memo({
  title,
  color,
  subtitle,
}: {
  title: string;
  subtitle: string;
  color: string;
}) {
  const colors = {
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <View className="bg-white p-4 rounded-xl mb-3 flex-row items-center shadow">
      <View
        className={`w-10 h-10 rounded-sm items-center justify-center ${colors[color as keyof typeof colors]}`}
      >
        <MaterialIcons name="error-outline" size={22} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-semibold">{title}</Text>
        <Text className="text-gray-500 text-xs">{subtitle}</Text>
      </View>
    </View>
  );
}
