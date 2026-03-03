import ClassCarousel from '@/components/ClassCarousel';
import ProfileAvatar from '@/components/ProfileAvatar';
import SearchBar from '@/components/searchBar';
import { useAuth } from '@/context/authContext';
import { db } from "@/firebaseConfig";
import { API_BASE_URL, apiFetch } from "@/utils/api";
import { getTimeRemaining } from '@/utils/time';
import { MaterialIcons } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// placeholder while sessions load
const classesPlaceholder: any[] = [];
const HomeScreen = () => {
  const { profile } = useAuth();
  const [classes, setClasses] = useState<any[]>(classesPlaceholder);

  function getTodayName() {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
  }


  function etaMinutes(startTime: string): string {
    const [h, m] = startTime.split(":").map(Number);
    const now = new Date();
    const then = new Date(now);
    then.setHours(h, m, 0, 0);
    const diff = Math.max(0, Math.floor((then.getTime() - now.getTime()) / 60000));
    return diff.toString();
  }


  const updateStatus = async (session: any,status: string) => {
    await setDoc(
      doc(db, "Class_Status", session.id),   
      {
        sessionId: session.id,
        status,
        updatedAt: new Date(),
        courseId: session.course_id || session.courseId,
        unitId: session.unit_id || session.unitId,
        lecturerId: session.lecturer_id || session.lecturerId,
        eta_min: etaMinutes(session.start_time),   
      },
      { merge: true }
    );
  };


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
              startsIn: getTimeRemaining(s.start_time,s.end_time),
              onPresent: () => updateStatus(s, "ONGOING"),
              onCancel: () => updateStatus(s, "CANCELLED"),
              onLate: () => updateStatus(s, "LATE"),
              onJoinOnline: () => updateStatus(s, "ONLINE"),
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
    <View className="flex-1">
      <ImageBackground source={require("../../../assets/images/lecturer-signup-img.jpg")}>

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
                  <Text className="text-white text-xl font-bold">
                    Good morning,{profile?.username || 'Lecturer'}
                  </Text>
                  <Text className="text-blue-200">
                    {profile?.department_name ? `Lecturer  · ${profile.department_name}` : 'Edit you profile'}
                  </Text>
                </View>
              </View>
            </View>
            <SearchBar />
          </View>

          <View className='bg-gray-100 -mt-6 rounded-t-[30px] px-2 pt-3'>
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
            <SectionHeader title="Today’s Classes" right="TimeTable" />
            <View className="mt-2">{classes.length > 0 ? (
              <ClassCarousel sessions={classes} role="lecturer" />) : (
              <Text className="text-gray-500 mt-2">No classes Today</Text>
            )}
            </View>
            {/* ================= ANNOUNCEMENTS ================= */}
            <SectionHeader title="Announcements" right="See all" />

            <AnnouncementCard
              title="Exam result Submission"
              subtitle="Due by Friday, 20 February"
              icon="error-outline"
              color="bg-red-500"
            />
            <AnnouncementCard
              title="Lecturers Meeting"
              subtitle="Reminder · Tomorrow 10:00 AM"
              icon="notifications"
              color="bg-blue-600"
            />
            <AnnouncementCard
              title="Sit-in at Cosc 468"
              subtitle="Wednesday 7:00 AM"
              icon="event"
              color="bg-indigo-600"
            />
          </View>
        </ScrollView>
      </ImageBackground>

    </View>
  );
};

export default HomeScreen;


const QuickCard = ({ title, icon }: any) => (
  <TouchableOpacity className="bg-blue-600 w-24 h-24 rounded-2xl justify-center items-center p-2">
    <MaterialIcons name={icon} size={28} color="white" />
    <Text className="text-white text-xs text-center mt-2">{title}</Text>
  </TouchableOpacity>
);
const SectionHeader = ({ title, right }: any) => (
  <View className="flex-row justify-between items-center mt-4 mb-4">
    <Text className="text-lg font-bold">{title}</Text>
    <TouchableOpacity>
      <Text className="text-blue-600">{right} ›</Text>
    </TouchableOpacity>
  </View>
);

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

