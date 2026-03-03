import ClassCarousel from "@/components/ClassCarousel";
import ProfileAvatar from "@/components/ProfileAvatar";
import SearchBar from "@/components/searchBar";
import { useAuth } from '@/context/authContext';
import { API_BASE_URL, apiFetch } from "@/utils/api";
import { getTimeRemaining } from '@/utils/time';
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  View
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { blurhash } from "../../../utils/common";


export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]); // raw sessions from backend

  useEffect(() => {
    if (!profile) return;
    if (!profile.course_id) {
      setSessions([]);
      return;
    }
    const fetchSchedule = async () => {
      try {
        const res = await apiFetch(`${API_BASE_URL}/api/sessions/by-course/${profile.course_id}`, {
          method: 'GET',
        });
        if (res.ok) {
          const data = await res.json();
          setSessions(data || []);
        }
      } catch (err) {
        console.error(err);
        setSessions([]);
      }
    };
    fetchSchedule();
  }, [profile]);

  // Get today's day name (Monday, Tuesday...)
  function getTodayName() {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  }

  // Filter & sort today's sessions
  const todayName = getTodayName();

  const todaysSessions = sessions
    .filter((s) => s.day_of_week === todayName)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));



  return (
    <View className="flex-1">
      <ImageBackground source={require("../../../assets/images/main-bg-img.jpg")}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View
            style={{ marginTop: hp(6) }}
            className="px-5 flex-1 items-center pb-8 ">
            <View className="flex-row items-center justify-between">
              <View style={{ paddingHorizontal: wp(2) }}
                className="flex-row items-center ">
                <ProfileAvatar
                  imageUri={profile?.profile_image}
                  fallbackImage={require("../../../assets/images/student-dp.jpeg")}
                  dotColor="#22C55E"   // green
                />
                <View>
                  <Text style={{ fontSize: hp(1.5) }} className="text-white   font-inter-bold">
                    Good morning, {profile?.username || 'Student'}
                  </Text>
                  <Text style={{ fontSize: hp(1.5) }} className="text-blue-200  font-inter">
                    {profile?.level || ''} {profile?.course_name ? `· ${profile.course_name}` : 'Go to Profile and update profile'}
                  </Text>
                </View>
              </View>
            </View>

            {/* SEARCH */}
            <SearchBar />
          </View>
          
          {/* CONTENT */}
          <View className="bg-gray-100 -mt-6 rounded-t-[30px] px-2 pt-3">
            {/* TODAY'S SCHEDULE */}
            <Text className="text-titles font-bold">Todays Schedule</Text>
            <View>
              {todaysSessions.length > 0 ? (
                <ClassCarousel
                  sessions={todaysSessions.map((s) => ({
                    id: s.id,
                    courseTitle: s.unit_name || '',
                    timePeriod: `${s.start_time} – ${s.end_time}`,
                    lecturerName: s.lecturer_name || '',
                    classLocation: s.venue || '',
                    isOnline: false,
                    status: s.status || 'NEXT',
                    startsIn: getTimeRemaining(s.start_time,s.end_time),
                  }))}
                  role="student"
                />
              ) : (
                <Text className="text-gray-500 mt-2">No schedule Today</Text>
              )}
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
                <Text className="text-edublue font-semibold" onPress={() => router.push("/NotificationScreen")}>See all</Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* Event Card */}
                <View className="bg-white rounded-2xl w-64 mr-4 overflow-hidden shadow">
                  <Image
                    source={require("../../../assets/images/Graduation-event-img.jpg")}
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
                    source={require("../../../assets/images/vote-event-img.jpg")}
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
                <Text className="text-edublue font-semibold" onPress={() => router.push("/NotificationScreen")}>See all</Text>
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
    </View>
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

