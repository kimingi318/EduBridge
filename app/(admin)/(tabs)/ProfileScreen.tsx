import Profile from '@/components/Profile';
import ProfileAvatar from '@/components/ProfileAvatar';
import { useAuth } from '@/context/authContext';
import { Feather, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
const ProfileScreen = () => {
  const { signOut, profile, user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

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
      <ImageBackground source={require("../../../assets/images/admin-signup-img.jpg")}>
        <ScrollView>
          <View style={{ height: hp(26) }}
            className=" items-center justify-center rounded-b-3xl">
            <TouchableOpacity onPress={handleSignOut} className="absolute top-10 right-4 bg-white/20 p-2 rounded-full">
              <Feather name="log-out" size={18} color="white" />
            </TouchableOpacity>

            <ProfileAvatar
              imageUri={profile?.profile_image}
              fallbackImage={require("../../../assets/images/admin-dp.jpg")}
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
            style={{ paddingHorizontal: wp(2), paddingTop: hp(1) }}
            className="bg-gray-100 rounded-t-[30px]"
          >
            <View className="flex-row justify-between items-center">
              <Text style={styles.header}>Personal Details</Text>
              <TouchableOpacity onPress={editProfile}>
                <Feather name="edit-2" size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
            <View className='bg-white rounded-xl p-4 mb-2 flex-row items-center'>
              <View className='bg-indigo-100 p-2 rounded-lg'>
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>
              <View className="ml-3 flex-1">
                <Text className='text-xs text-slate-500'>Email</Text>
                <Text className='text-xs text-slate-500'>{user?.email ?? ""}</Text>
              </View>
            </View>
            <View className='bg-white rounded-xl p-4 mb-2 flex-row items-center'>
              <View className='bg-indigo-100 p-2 rounded-lg'>
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>
              <View className="ml-3 flex-1">
                <Text className='text-xs text-slate-500'>Username</Text>
                <Text className='text-xs text-slate-500'>{profile?.username ?? ""}</Text>
              </View>
            </View>
            <View className='bg-white rounded-xl p-4 mb-2 flex-row items-center'>
              <View className='bg-indigo-100 p-2 rounded-lg'>
                <Ionicons name="mail" size={18} color="#2563EB" />
              </View>
              <View className="ml-3 flex-1">
                <Text className='text-xs text-slate-500'>Phone</Text>
                <Text className='text-xs text-slate-500'>{profile?.phone ?? ""}</Text>
              </View>
            </View>
            <View className='bg-white rounded-xl p-4 mb-2 flex-row items-center'>
              <View className='bg-indigo-100 p-2 rounded-lg'>
                <Ionicons name="id-card" size={18} color="#2563EB" />
              </View>
              <View className="ml-3 flex-1">
                <Text className='text-xs text-slate-500'>Admin ID</Text>
                <Text className='text-xs text-slate-500'>{profile?.A_Id ?? ""}</Text>
              </View>
            </View>

            <Text style={styles.header}>My Forum</Text>
            <View className="bg-white rounded-xl p-3 flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center">
                <Text className="text-white text-xs">CS</Text>
              </View>
              <View className="ml-3">
                <Text style={{ fontSize: hp(1.5) }} className=" font-medium">
                  Department of Computer Science
                </Text>
                <Text style={{ fontSize: hp(1) }} className=" text-slate-500">
                  Forum · Announcement & Discussion
                </Text>
              </View>
            </View>
            <Profile
              isVisible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
            ></Profile>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  header: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    marginBottom: hp(1),
    marginTop: hp(1),
  },
});