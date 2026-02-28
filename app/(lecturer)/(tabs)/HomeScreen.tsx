import NextClassCard from '@/components/NextClassCard';
import PaginationDots from '@/components/PaginationDots';
import ProfileAvatar from '@/components/ProfileAvatar';
import SearchBar from '@/components/searchBar';
import { useAuth } from '@/context/authContext';
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
const { width } = Dimensions.get("window");

const classes = [
  {
    id: "1",
    time: "10:00 AM – 1:00 PM",
    title: "Cryptography & Computer Security",
    room: "BSR 303",
    level: "Level IV",
    isNext: true,
  },
  {
    id: "2",
    time: "2:00 PM – 4:00 PM",
    title: "Network Management",
    room: "LAB 2",
    level: "Level IV",
    isNext: false,
    
  },
  {
    id: "3",
    time: "4:00 PM – 6:00 PM",
    title: "Data Structures",
    room: "Room 12",
    level: "Level II",
    isNext: false,

  },
];
const HomeScreen = () => {
  const { profile } = useAuth();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const nextIndex = classes.findIndex((item) => item.isNext);

  useEffect(() => {
    if (nextIndex !== -1) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }, 500);
    }
  }, []);


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
                    {profile?.department_name ? `Admin  · ${profile.department_name}` : 'Edit you profile'}
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
            <View className="mt-4">
              <Animated.FlatList
                ref={flatListRef}
                data={classes}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: false }
                )}
                renderItem={({ item, index }) => {
                  const inputRange = [
                    (index - 1) * width,
                    index * width,
                    (index + 1) * width,
                  ];

                  const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.9, 1, 0.9],
                    extrapolate: "clamp",
                  });

                  return (
                    <Animated.View
                      style={{
                        width,
                        transform: [{ scale }],
                      }}
                    >
                      <NextClassCard {...item} />
                    </Animated.View>
                  );
                }}
              />

              <PaginationDots scrollX={scrollX} length={classes.length} />
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

