import ClassCarousel from "@/components/ClassCarousel";
import ProfileAvatar from "@/components/ProfileAvatar";
import SearchBar from "@/components/searchBar";
import { useAuth } from '@/context/authContext';
import { db } from "@/firebaseConfig";
import { API_BASE_URL, apiFetch } from "@/utils/api";
import { darkTheme, lightTheme } from "@/utils/colors";
import { getTimeRemaining } from '@/utils/time';
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { blurhash } from "../../../utils/common";




export default function HomeScreen() {
  const router = useRouter();
  const { profile,user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const [events, setEvents] = useState<any[]>([]);
  const [memos, setMemos] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [activeEventTab, setActiveEventTab] = useState<"Academic" | "Social" | "Memos">("Academic");

  const getEventDate = (eventDate: any) => {
    if (!eventDate) return null;

    if (eventDate?.toDate) {
      return eventDate.toDate();
    }

    if (eventDate instanceof Date) {
      return eventDate;
    }

    return new Date(eventDate);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "announcements"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // 🔹 filter by role
      const filtered = data.filter(
        (item: any) =>
           item.targetRole === user?.role
      );

      const sorted = filtered.sort(
        (a: any, b: any) =>
          (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );

      setAnnouncements(sorted);
    });
    return unsubscribe;
  }, [user?.role]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(data);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "memos"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMemos(data);
    });

    return unsubscribe;
  }, []);

  const previewEvents = events
    .filter((event) => activeEventTab === "Memos"
      ? false
      : event.category === activeEventTab).slice(0, 5);
  const previewMemos = memos.slice(0, 5);
  const previewAnnouncements = announcements.slice(0, 3);

  useEffect(() => {
    if (!sessions.length) {
      setClasses([]);
      return;
    }

    const todayName = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    const todayData = sessions
      .filter((s) => s.day_of_week === todayName)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    const mapped = todayData.map((s) => ({
      id: s.id,
      courseTitle: s.unit_name || '',
      timePeriod: `${s.start_time} – ${s.end_time}`,
      lecturerName: s.lecturer_name || '',
      classLocation: s.venue || '',
      status: s.status,
      meet_link: s.meet_link || null,
      startsIn: getTimeRemaining(s.start_time, s.end_time),
    }));

    setClasses(mapped);
  }, [sessions]);

  useEffect(() => {
    if (!profile) return;
    if (!profile.course_id) {
      setSessions([]);
      return;
    }
    const fetchSchedule = async () => {
      try {
        const res = await apiFetch(`${API_BASE_URL}/api/sessions/by-course/${profile.course_id}/${profile.level}`, {
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


  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={{ marginTop: hp(4), backgroundColor: theme.background }} className="px-5 flex-1 items-center pb-8 ">
          <View className="flex-row items-center justify-between">
            <View style={{ paddingHorizontal: wp(2) }}
              className="flex-row items-center ">
              <ProfileAvatar
                imageUri={profile?.profile_image}
                fallbackImage={require("../../../assets/images/profileimg.jpg")}
                dotColor="#22C55E"   // green
              />
              <View>
                <Text style={{ fontSize: hp(1.5), color: theme.text }} className="font-inter-bold">
                  Good morning, {profile?.username || 'Student'}
                </Text>
                <Text style={{ fontSize: hp(1.5), color: theme.subText }} className="font-inter">
                  {profile?.level || ''} {profile?.course_name ? `· ${profile.course_name}` : 'Go to Profile and update profile'}
                </Text>
              </View>
            </View>
          </View>

          {/* SEARCH */}
          <SearchBar />
        </View>

        {/* CONTENT */}
        <View style={{ backgroundColor: theme.surface }} className=" -mt-6 rounded-t-[30px] px-2 pt-3">
          {/* TODAY'S SCHEDULE */}
          <SectionHeader title="Today’s Classes" right="TimeTable" />
          <View>
            {classes.length > 0 ? (
              <ClassCarousel sessions={classes} role="student" />
            ) : (
              <Text style={{ color: theme.subText }} className=" mt-2">No schedule Today</Text>
            )}
          </View>

          {/* EVENTS */}
          <SectionHeader
            title="Events"
            right={<Text style={{ color: theme.text }} className="font-semibold" onPress={() =>
              router.push({
                pathname: "/NotificationScreen",
                params: { tab: activeEventTab === "Memos" ? "memos" : "events" },
              })
            }>
              See all</Text>} />
          <View>
            <View className="flex-row justify-center gap-2 items-center mb-3">
              {["Academic", "Social", "Memos"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveEventTab(tab as any)}
                  className={`px-4 py-1 rounded-full ${activeEventTab === tab
                    ? "bg-edublue"
                    : "bg-edulightblue"
                    }`}
                >
                  <Text
                    className={`text-xs ${activeEventTab === tab
                      ? "text-white"
                      : "text-edublue"
                      }`}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {activeEventTab === "Memos"
                ? previewMemos.map((memo) => (
                  <View
                    key={memo.id}
                    style={{ backgroundColor: theme.card }}
                    className="rounded-2xl w-64 mr-4 overflow-hidden shadow p-3"
                  >
                    <Text className="text-xs text-green-600">
                      {memo.createdAt?.seconds
                        ? new Date(memo.createdAt.seconds * 1000)
                          .toDateString()
                          .toUpperCase()
                        : ""}
                    </Text>

                    <Text
                      style={{ color: theme.text }}
                      className="font-bold"
                    >
                      {memo.title}
                    </Text>

                    <Text
                      style={{ color: theme.subText }}
                      className="text-sm"
                      numberOfLines={2}
                    >
                      {memo.message}
                    </Text>
                  </View>
                ))
                : previewEvents.map((event) => (
                  <View
                    key={event.id}
                    style={{ backgroundColor: theme.card }}
                    className="rounded-2xl w-64 mr-4 overflow-hidden shadow"
                  >
                    {event.imageUrl && (
                      <Image
                        source={{ uri: event.imageUrl }}
                        style={{ height: hp(12) }}
                        placeholder={{ blurhash }}
                        transition={500}
                      />
                    )}

                    <View className="p-3">
                      <Text className="text-green-600 text-xs">
                        {getEventDate(event.eventDate)?.toLocaleDateString("en-US", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                        }).toUpperCase()}
                      </Text>

                      <Text
                        style={{ color: theme.text }}
                        className="font-bold"
                      >
                        {event.title}
                      </Text>

                      <View className="flex-row items-center mt-1">
                        <MaterialIcons name="location-on" size={14} color={theme.subText} />
                        <Text style={{ color: theme.subText }} className="text-sm ml-1">
                          {event.location}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
            </ScrollView>
          </View>

          {/* MEMOS */}
          <SectionHeader
            title="Annoucements"
            right={<Text style={{ color: theme.text }} className=" font-semibold"
              onPress={() => router.push("/NotificationScreen")}>See all</Text>} />
          <View className="mb-10">
            {previewAnnouncements.length > 0 ? (
              previewAnnouncements.map((item) => (
                <Memo
                  key={item.id}
                  color="blue"
                  title={item.title}
                  subtitle={
                    item.createdAt?.seconds
                      ? new Date(item.createdAt.seconds * 1000).toDateString()
                      : ""
                  }
                />
              ))
            ) : (
              <Text style={{ color: theme.subText }}>No announcements yet</Text>
            )}
          </View>
        </View>
      </ScrollView>
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

const SectionHeader = ({ title, right }: any) => {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  return (
    <View className="flex-row justify-between items-center mt-4 mb-4">
      <Text style={{ color: theme.text }} className="text-lg font-bold">{title}</Text>
      <TouchableOpacity>
        <Text style={{ color: theme.text, }}>{right}</Text>
      </TouchableOpacity>
    </View>
  );
};

