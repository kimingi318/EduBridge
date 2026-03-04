import ClassCarousel from '@/components/ClassCarousel';
import ProfileAvatar from '@/components/ProfileAvatar';
import SearchBar from '@/components/searchBar';
import { useAuth } from '@/context/authContext';
import { db } from "@/firebaseConfig";
import { API_BASE_URL, apiFetch } from "@/utils/api";
import { darkTheme, lightTheme } from "@/utils/colors";
import { getTimeRemaining } from '@/utils/time';
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// placeholder while sessions load
const classesPlaceholder: any[] = [];
const HomeScreen = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const [classes, setClasses] = useState<any[]>(classesPlaceholder);
  const [lateModalVisible, setLateModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [onlineModalVisible, setOnlineModalVisible] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  function getTodayName() {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
  }

  const updateStatus = async (session: any, status: string, eta_min: number = 0, meet_link: string | null = null) => {
    await setDoc(
      doc(db, "Class_Status", session.id),
      {
        sessionId: session.id,
        status,
        meet_link,
        updatedAt: new Date(),
        courseId: session.course_id || session.courseId,
        unitId: session.unit_id || session.unitId,
        lecturerId: session.lecturer_id || session.lecturerId,
        eta_min,
      },
      { merge: true }
    );
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        classes.forEach(session => {
          setDoc(
            doc(db, "Class_Status", session.id),
            {
              status: "NEXT",
              updatedAt: new Date(),
            },
            { merge: true }
          );
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [classes]);


  useEffect(() => {
    if (profile?.id) {
      (async () => {
        try {
          const res = await apiFetch(`${API_BASE_URL}/api/sessions/by-lecturer/${profile.id}`, {
            method: 'GET'
          });
          if (res.ok) {
            const data = await res.json();
            const todayName = getTodayName();
            const todayData = data
              .filter((s: any) => s.day_of_week === todayName)
              .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));
            const mapped = todayData.map((s: any) => ({
              id: s.id,
              courseTitle: s.unit_name || '',
              timePeriod: `${s.start_time} – ${s.end_time}`,
              lecturerName: s.lecturer_name || '',
              classLocation: s.venue || '',
              status: s.status,
              meet_link: s.meet_link || null, // use same key as student side
              startsIn: getTimeRemaining(s.start_time, s.end_time),
              onPresent: () => updateStatus(s, "NEXT"),
              onCancel: () => updateStatus(s, "CANCELLED"),
              onLate: () => {
                setSelectedSession(s);
                setLateModalVisible(true);
              },
              onJoinOnline: () => {
                setSelectedSession(s);
                setOnlineModalVisible(true);
              },
            }));
            setClasses(mapped);
          }
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [profile]);


  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ================= HEADER ================= */}
          <View style={{ marginTop: hp(6) }} className='px-5 flex-1 items-center pb-8'>
            <View className="flex-row items-center justify-between">
              <View style={{ paddingHorizontal: wp(2) }} className='flex-row items-center'>
                <ProfileAvatar
                  imageUri={profile?.profile_image}
                  fallbackImage={require("../../../assets/images/lecturer-dp.jpg")}
                  dotColor="#16a34a"
                />
                <View>
                  <Text style={{color: theme.text}} className=" text-xl font-bold">
                    Good morning,{profile?.username || 'Lecturer'}
                  </Text>
                  <Text style={{color: theme.subText}}>
                    {profile?.department_name ? `Lecturer  · ${profile.department_name}` : 'Edit you profile'}
                  </Text>
                </View>
              </View>
            </View>
            <SearchBar />
          </View>

          <View className=' -mt-6 rounded-t-[30px] px-2 pt-3'>
            {/* ================= QUICK ACTIONS ================= */}
            <View className="flex-row justify-between w-full">
              <QuickCard
                title="Create Announcement"
                icon="campaign"
              />
              <QuickCard
                title="Upload Notes"
                icon="description"
              />
              <QuickCard
                title="Upload Notes"
                icon="description"
              />
              <QuickCard
                title="Create Online Class"
                icon="videocam"
              />
            </View>

            {/* ================= TODAY'S CLASS ================= */}
            <SectionHeader
              title="Today’s Classes" right="TimeTable" />
            <View>{classes.length > 0 ? (
              <ClassCarousel sessions={classes} role="lecturer" />) : (
              <Text className="text-gray-500 mt-2">No classes Today</Text>
            )}
            </View>
            {/* ================= ANNOUNCEMENTS ================= */}
            <SectionHeader title="Announcements" right={<Text className="text-edublue font-semibold"
              onPress={() => router.push("/NotificationScreen")}>See all</Text>} />

            <AnnouncementCard
              title="Exam result Submission"
              subtitle="Due by Friday, 20 February"
              icon="error-outline"
              color={theme.surface}
            />
            <AnnouncementCard
              title="Lecturers Meeting"
              subtitle="Reminder · Tomorrow 10:00 AM"
              icon="notifications"
              color={theme.surface}
            />
            <AnnouncementCard
              title="Sit-in at Cosc 468"
              subtitle="Wednesday 7:00 AM"
              icon="event"
              color={theme.surface}
            />
          </View>
        </ScrollView>
        <Modal visible={lateModalVisible} transparent animationType="slide">
          <View className="flex-1 bg-black/40 justify-end">
            <View className="bg-white p-5 rounded-t-3xl">
              <Text className="text-lg font-bold mb-4">How late will you be?</Text>

              {[30, 60, 90, 120].map((min) => (
                <TouchableOpacity
                  key={min}
                  className="py-3 border-b border-gray-200"
                  onPress={() => {
                    updateStatus(selectedSession, "LATE", min);
                    setLateModalVisible(false);
                  }}
                >
                  <Text className="text-base">
                    {min === 30
                      ? "30 minutes"
                      : min === 60
                        ? "1 hour"
                        : min === 90
                          ? "1 hr 30 min"
                          : "2 hr"}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                className="mt-4"
                onPress={() => setLateModalVisible(false)}
              >
                <Text className="text-red-500 text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={onlineModalVisible} transparent animationType="slide">
          <View className="flex-1 bg-black/40 justify-end">
            <View className="bg-white p-5 rounded-t-3xl">
              <Text className="text-lg font-bold mb-4">
                Paste Google Meet or Zoom Link
              </Text>

              <TextInput
                value={meetLink}
                onChangeText={setMeetLink}
                placeholder="https://meet.google.com/..."
                className="border p-3 rounded-xl mb-4"
              />

              <TouchableOpacity
                className="bg-blue-600 py-3 rounded-xl"
                onPress={() => {
                  let formattedLink = meetLink.trim();

                  if (!formattedLink.startsWith("http://") && !formattedLink.startsWith("https://")) {
                    formattedLink = "https://" + formattedLink;
                  }

                  updateStatus(selectedSession, "ONLINE", 0, formattedLink); setOnlineModalVisible(false);
                  setMeetLink("");
                }}
              >
                <Text style={{color:theme.text}}className=" text-center font-semibold">
                  Start Online Class
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
  );
};

export default HomeScreen;


const QuickCard = ({ title, icon,color }: any) =>{ 
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;


  return(
  <TouchableOpacity style={{backgroundColor: theme.card }} className="w-24 h-24 rounded-2xl justify-center items-center p-2">
    <MaterialIcons name={icon} size={28} color={theme.text} />
    <Text style={{color: theme.text}} className=" text-xs text-center mt-2">{title}</Text>
  </TouchableOpacity>
);};


const SectionHeader = ({ title, right }: any) => {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  return(
  <View className="flex-row justify-between items-center mt-4 mb-4">
    <Text className="text-lg font-bold">{title}</Text>
    <TouchableOpacity>
      <Text style={{color: theme.text, }}>{right}</Text>
    </TouchableOpacity>
  </View>
);};

const AnnouncementCard = ({
  title,
  subtitle,
  icon,
  color,
}: any) => (
  <View className="bg-white p-4 rounded-2xl mb-2 shadow flex-row items-center">
    <View className={`${color} p-3 rounded-xl mr-3`}>
      <MaterialIcons name={icon} size={22} color="white" />
    </View>
    <View>
      <Text className="font-semibold">{title}</Text>
      <Text className="text-gray-500 text-sm">{subtitle}</Text>
    </View>
  </View>
);

