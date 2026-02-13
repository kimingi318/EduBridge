import { useAuth } from '@/context/authContext';
import { Feather } from "@expo/vector-icons";
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ImageViewer from '../../../components/ImageViewer';

const ProfileScreen = () => {
  const { signOut, profile } = useAuth();
  const placeholder = require('@/assets/images/camera.jpg')

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View className='flex-1'>
      <ImageBackground source={require("../../../assets/images/admin-signup-img.jpg")}>
        <ScrollView>
          <View style={{ height: hp(26) }}
            className=" items-center justify-center rounded-b-3xl">
            <TouchableOpacity onPress={handleSignOut} className="absolute top-10 right-4 bg-white/20 p-2 rounded-full">
              <Feather name="log-out" size={18} color="white" />
            </TouchableOpacity>

            <View >
              <ImageViewer imgSource={placeholder} selectedImage={profile?.profile_image} />
            </View>
            <Text className="text-white"
            >
              {profile?.name || "John Doe"}
            </Text>
            <Text className="text-slate-300 text-xs">
              {"Admin"}· {profile?.dept || ""}
            </Text>
          </View>

          <View
            style={{ paddingHorizontal: wp(2), paddingTop: hp(1) }}
            className="bg-gray-100 rounded-t-[30px]"
          ></View>

        </ScrollView>
      </ImageBackground>
    </View>
  )
}

export default ProfileScreen

// const styles = StyleSheet.create({})