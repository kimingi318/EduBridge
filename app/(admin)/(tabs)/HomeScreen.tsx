import AddCourses from '@/components/AddCourses';
import AddDepartment from '@/components/AddDepartment';
import AddUnits from '@/components/AddUnits';
import ProfileAvatar from '@/components/ProfileAvatar';
import SearchBar from '@/components/searchBar';
import { useAuth } from '@/context/authContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
const HomeScreen = () => {
  const { profile } = useAuth();
  const [isCourseModalVisible, setIsCourseModalVisible] = useState<boolean>(false);
  const [isDepartmentModalVisible, setIsDepartmentModalVisible] = useState<boolean>(false);
  const [isUnitModalVisible, setIsUnitModalVisible] = useState<boolean>(false);

  const handleAddCourseModal = () => {
    setIsCourseModalVisible(true);
  }
  const handleAddDepartmentModal = () => {
    setIsDepartmentModalVisible(true);
  }
  const handleAddUnitModal = () => {
    setIsUnitModalVisible(true);
  }

  return (
    <View className='flex-1 '>
      <ImageBackground source={require("../../../assets/images/admin-signup-img.jpg")}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: hp(6) }} className='px-5 flex-1 items-center pb-8'>
            <View className='flex-row items-center justify-between'>
              <View style={{ paddingHorizontal: wp(2) }} className='flex-row items-center'>
                <ProfileAvatar
                  imageUri={profile?.profile_image}
                  fallbackImage={require("../../../assets/images/admin-dp.jpg")}
                  dotColor="#FACC15"
                />
                <View>
                  <Text style={{ fontSize: hp(1.5) }} className='text-white font-inter-bold'>
                    Good Morning,{profile?.username || 'Admin'}
                  </Text>
                  <Text style={{ fontSize: hp(1.2) }} className='text-edulightblue font-inter-medium'>
                    {profile?.department_name ? `Admin . ${profile.department_name}` : 'Edit you profile'}
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
                action={handleAddDepartmentModal}
              />
              <ActionCard
                name="users"
                Title="Add Units"
                action={handleAddUnitModal}
              />
              <ActionCard
                name="users"
                Title="Verify Lecturer"
                action={handleAddCourseModal}
              />
            </View>

            <AddCourses
              isVisible={isCourseModalVisible}
              onClose={() => setIsCourseModalVisible(false)}>
            </AddCourses>
            <AddDepartment
              isVisible={isDepartmentModalVisible}
              onClose={() => setIsDepartmentModalVisible(false)}>
            </AddDepartment>
            <AddUnits
              isVisible={isUnitModalVisible}
              onClose={() => setIsUnitModalVisible(false)}>
            </AddUnits>
            <Text style={styles.header} className='text-black font-inter-semibold'>Alert & Approvals</Text>
            <View>
              <AlertCard
                Title="Review student pending approval"
                type="Student Council Approval"
                action={""}
                number="4"
              />
              <AlertCard
                Title="Review and approve pending lecturers"
                type="Lecturer Approval"
                action={""}
                number="3"
              />
              <AlertCard
                Title="Approval new Admin"
                type="Admin Approval"
                action={""}
                number="2"
              />
            </View>
            <Text style={styles.header} className='text-black font-inter-semibold'>Recent Activity</Text>
            <View>
              <ActivityCard
                Title='New Lecturer approved'
                action={""}
              />
              <ActivityCard
                Title='New memo added'
                action={""}
              />
              <ActivityCard
                Title='Student account limited'
                action={""}
              />
              <ActivityCard
                Title='New Lecturer approved'
                action={""}
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    height: hp(10),
    marginBottom: hp(1),
    paddingHorizontal: wp(1)
  },
  header: {
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
          <Text className="text-white" style={{ fontSize: hp(1.5), marginTop: hp(1) }}>{Title}</Text>
        </View>
      </LinearGradient>

    </TouchableOpacity>

  );
}

function AlertCard({
  Title,
  type,
  action,
  number,
}: {
  Title: string;
  type: string;
  action: any;
  number: string;
}) {
  return (
    <TouchableOpacity onPress={action}>
      <View style={{ height: hp(7), padding: hp(1), marginBottom: hp(1) }} className=' bg-white flex-row  rounded-[20px] items-center'>
        <View className='rounded-lg bg-edulightblue p-1.5'>
          <AntDesign name="alert" size={24} color="red" />
        </View>

        <View style={{ marginLeft: hp(2) }} className='flex-1'>
          <Text style={{ fontSize: hp(2) }} className='font-inter-medium'>{type}</Text>
          <Text style={{ fontSize: hp(1.5) }} className='font-inter-light'>{Title}</Text>
        </View>
        <View style={{ width: wp(5), height: hp(3) }} className='rounded-full p-1 bg-[#ff0000]'>
          <Text className='text-white font-inter-bold'>{number}</Text>
        </View>
        <Entypo name="chevron-right" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );
}
function ActivityCard({
  Title,
  // type,
  action,
}: {
  Title: string;
  // type: string;
  action: any;
}) {
  return (
    <TouchableOpacity onPress={action}>
      <View style={{ height: hp(7), padding: hp(1), marginBottom: hp(1) }} className=' bg-white flex-row  rounded-[20px] items-center'>
        <View className='rounded-lg bg-edulightblue p-1.5'>
          <MaterialIcons name="admin-panel-settings" size={24} color="blue" />
        </View>
        {/* <Text style={{ fontSize: hp(2) }} className='font-inter-medium'>{type}</Text> */}
        <Text style={{ fontSize: hp(1.5), marginLeft: hp(2) }} className='font-inter-light'>{Title}</Text>
      </View>
    </TouchableOpacity>
  );
}

