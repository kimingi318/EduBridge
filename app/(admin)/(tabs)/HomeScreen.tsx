import AddCourses from '@/components/AddCourses';
import SearchBar from '@/components/searchBar';
import { useAuth } from '@/context/authContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
const HomeScreen = () => {
  const { profile } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleAddCourseModal = () => {
    setIsModalVisible(true);
  }

  return (
    <View className='flex-1 '>
      <ImageBackground source={require("../../../assets/images/admin-signup-img.jpg")}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: hp(6) }} className='px-5 flex-1 items-center pb-8'>
            <View className='flex-row items-center justify-between'>
              <View style={{ paddingHorizontal: wp(2) }} className='flex-row items-center'>
                <View className='relative' style={{ marginRight: hp(2) }}>
                  <Image
                    style={{
                      height: hp(10),
                      aspectRatio: 1,
                      borderRadius: 100
                    }}
                    source={
                      profile?.profile_image ? { uri: profile.profile_image } :
                        require("../../../assets/images/admin-dp.jpg")
                    }
                  />
                  <View style={{ width: wp(3.5), height: hp(1.5) }} className='absolute right-1.5 bottom-1  bg-yellow-400 rounded-full'></View>
                </View>

                <View>
                  <Text style={{ fontSize: hp(1.5) }} className='text-white font-inter-bold'>
                    Good Morning,{profile?.username || 'Admin'}
                  </Text>
                  <Text style={{ fontSize: hp(1.2) }} className='text-edulightblue font-inter-medium'>
                    {profile?.department ? `${profile.department}` : 'Edit you profile'}
                  </Text>
                </View>
              </View>
            </View>
            <SearchBar />
          </View>

          <View className='bg-gray-100 -mt-6 rounded-t-[30px] px-2 pt-3'>
            <Text style={styles.header} className='text-black font-inter-semibold'>Department Overview</Text>
            <View style={styles.container} className=' flex-row gap-1 w-full '>
              <Departmentcard
                title="Total Student"
                name="users"
                number="1042"
              />
              <Departmentcard
                title="Total Lecturer"
                name="mortar-board"
                number="44"
              />
              <Departmentcard
                title="Total Courses"
                name="users"
                number="10"
              />
              <Departmentcard
                title="Requests"
                name="users"
                number="5"
              />
            </View>
            <Text style={styles.header} className='text-black font-inter-semibold'>Management</Text>
            <View style={styles.container} className=' flex-row gap-1 w-full '>
              <ActionCard
                name="users"
                Title="Add Courses"
                action={handleAddCourseModal}
              />
              <ActionCard
                name="users"
                Title="Add Departments"
                action={handleAddCourseModal}
              />
              <ActionCard
                name="users"
                Title="Add Units"
                action={handleAddCourseModal}
              />
              <ActionCard
                name="users"
                Title="Verify Lecturer"
                action={handleAddCourseModal}
              />
              <AddCourses
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}>
              </AddCourses>
            </View>
            <AddCourses
              isVisible={isModalVisible}
              onClose={() => setIsModalVisible(false)}>
            </AddCourses>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container:{
    height: hp(10),
     marginBottom: hp(1),
     paddingHorizontal:wp(1)
  },
  header:{
    fontSize: hp(1.5),
    marginBottom: hp(1)
  }
})

function Departmentcard({
  title,
  name,
  number
}: {
  title: string;
  name: React.ComponentProps<typeof FontAwesome>['name'];
  number: string;
}) {
  return (
    <View style={{ height: hp(10), width: wp(23), paddingHorizontal: wp(1) }} className='bg-white rounded-[20px] flex-1 items-center justify-center'>
      <View className='flex-row gap-1'>
        <FontAwesome name={name} size={24} color="black" />
        <Text >{number}</Text>
      </View>
      <Text style={{ fontSize: hp(1.5) }}>{title}</Text>
    </View>
  );
}

function ActionCard({
  name,
  Title,
  action
}: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  Title: string;
  action: any;
}) {
  return (
    <TouchableOpacity onPress={action}>
      <LinearGradient
        colors={['#174289', '#162C60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: hp(10),
          width: wp(23),
          paddingHorizontal: wp(1),
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View className='rounded-[20px] flex-1 items-center justify-center'>
          <FontAwesome name={name} size={24} color="white" />
          <Text className="text-white" style={{ fontSize: hp(1.5),marginTop:hp(1) }}>{Title}</Text>
        </View>
      </LinearGradient>

    </TouchableOpacity>

  );
}