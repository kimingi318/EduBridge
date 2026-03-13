import Profile from '@/components/Profile';
import ProfileAvatar from '@/components/ProfileAvatar';
import { useAuth } from '@/context/authContext';
import { darkTheme, lightTheme } from "@/utils/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';


const ProfileScreen = () => {
  const { signOut, profile, user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = createStyles(theme);

  const handleSignOut = async () => {
    await signOut();
  };
  useEffect(() => {
    // Show profile modal if no profile data yet
    if (!profile) {
      setIsModalVisible(true);
    } else {
      setIsModalVisible(false);
    }
  }, [profile]);

  const editProfile = () => {
    setIsModalVisible(true);
  }
  return (
    <View className='flex-1'>
      <ImageBackground style={{flex: 1}} source={require("../../../assets/images/admin-signup-img.jpg")}>
        <ScrollView>
          <View style={{ height: hp(26) }}
            className=" items-center justify-center rounded-b-3xl">
            <TouchableOpacity onPress={handleSignOut} className="absolute top-10 right-4 bg-white/20 p-2 rounded-full">
              <Feather name="log-out" size={18} color="white" />
            </TouchableOpacity>

            <ProfileAvatar
              imageUri={profile?.profile_image}
              fallbackImage={require("../../../assets/images/profileimg.jpg")}
              dotColor="#FACC15"
            />
            <Text className="text-white"
            >
              {profile?.name || "John Doe"}
            </Text>
            <Text className="text-slate-300 text-xs">
              {"Admin"}· {profile?.department_name || ""}
            </Text>
          </View>

          <View
            style={{ paddingHorizontal: wp(2), paddingTop: hp(1), backgroundColor: theme.background }}
            className=" rounded-t-[30px]"
          >
            <View className="flex-row justify-between items-center">
              <Text style={styles.header}>Personal Details</Text>
              <TouchableOpacity onPress={editProfile}>
                <Feather name="edit-2" size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <View className='bg-indigo-100 p-2 rounded-lg'>
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>
              <View className="ml-3 flex-1">
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{user?.email ?? ""}</Text>
              </View>
            </View>
            <View style={styles.card}>
              <View className='bg-indigo-100 p-2 rounded-lg'>
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>
              <View className="ml-3 flex-1">
                <Text style={styles.label}>Username</Text>
                <Text style={styles.value}>{profile?.username ?? ""}</Text>
              </View>
            </View>
            <View style={styles.card}>
              <View className='bg-indigo-100 p-2 rounded-lg'>
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>
              <View className="ml-3 flex-1">
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>{profile?.phone ?? ""}</Text>
              </View>
            </View>
            <View style={styles.card}>
              <View className='bg-indigo-100 p-2 rounded-lg'>
                <Ionicons name="id-card" size={18} color="#2563EB" />
              </View>
              <View className="ml-3 flex-1">
                <Text style={styles.label}>Admin ID</Text>
                <Text style={styles.value}>{profile?.A_Id ?? ""}</Text>
              </View>
            </View>

            <Text style={styles.header}>My Forum</Text>
            <View style={styles.forumCard}>
              <View className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center">
                <Text className="text-white text-xs">CS</Text>
              </View>
              <View className="ml-3">
                <Text style={[styles.forumText, { fontSize: hp(1.5) }]}>
                  Department of Computer Science
                </Text>
                <Text style={[styles.forumSubText, { fontSize: hp(1) }]}>
                  Forum · Announcement & Discussion
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      <Profile
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      ></Profile>
    </View>
  )
}

export default ProfileScreen

const createStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      fontSize: hp(2.5),
      fontWeight: "bold",
      marginBottom: hp(1),
      marginTop: hp(1),
      color: theme.text,
    },

    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
    },

    label: {
      fontSize: 12,
      color: theme.subText,
    },

    value: {
      fontSize: 12,
      color: theme.text,
    },

    forumCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
    },

    forumText: {
      color: theme.text,
      fontWeight: "500",
    },

    forumSubText: {
      color: theme.subText,
    },
  });