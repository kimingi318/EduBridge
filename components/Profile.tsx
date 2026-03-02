import { useAuth } from '@/context/authContext';
import { API_BASE_URL, apiFetch } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from "@tanstack/react-query";
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import GradientButton from './GradientButton';
import ImageViewer from './ImageViewer';
import CustomKeyBoardView from './customKeyBoardView';



type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: () => void;
}>;

type Department = {
    id: string;
    name: string;
};

type Course = {
    id: string;
    programme: string;
    name: string;
    departmentId: string;
};


export default function Profile({ isVisible, children, onClose }: Props) {
    const [fullName, setFullName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [courseName, setCourseName] = useState<string>('');
    const [level, setLevel] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const placeholder = require('@/assets/images/camera.png')
    const [regNo, setRegNo] = useState<string>('')
    const [departments, setDepartments] = useState<Department[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [role, setRole] = useState<string | null>(null);
    const [aId, setAId] = useState<string>('');
    const [departmentName, setDepartmentName] = useState<string>('');
    const [lId, setLId] = useState<string>('');
    const queryClient = useQueryClient();
    const [showCourses, setShowCourses] = useState(false);


    const { refreshProfile } = useAuth();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await apiFetch(`${API_BASE_URL}/api/departments`, {
                    method: "GET",
                });
                if (res.ok) {
                    const data: Department[] = await res.json();
                    setDepartments(data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!selectedDeptId) {
                setCourses([]);
                setSelectedCourseId(null);
                return;
            }
            try {
                const res = await apiFetch(`${API_BASE_URL}/api/courses/by-department/${selectedDeptId}`, {
                    method: "GET",
                });
                if (res.ok) {
                    const data: Course[] = await res.json();
                    // Add label property that combines programme and name
                    const coursesWithLabel = data.map(c => ({
                        ...c,
                        label: c.programme ? `${c.programme} - ${c.name}` : c.name
                    }));
                    setCourses(coursesWithLabel as any);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, [selectedDeptId]);



    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setSelectedImage(uri);
        }
    };

    const handleSaveProfile = async () => {
        const uri = selectedImage
        try {
            let lecturerCoursesPayload: any[] = [];

            if (role === "Lecturer") {
                if (selectedCourses.length === 0) {
                    Alert.alert("Error", "Select at least one course");
                    return;
                }

                lecturerCoursesPayload = selectedCourses.map((id, index) => ({
                    course_id: id,
                    is_main: index === 0 // first course is main
                }));
            }
            const res = await apiFetch(`${API_BASE_URL}/api/profiles`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: fullName,
                    username: userName,
                    phone: phoneNumber,
                    profileImage: uri,

                    //student
                    course_name: courseName,
                    level: level,
                    reg_no: regNo,
                    course_id: selectedCourseId,

                    //admin
                    A_Id: aId,
                    department_id: selectedDeptId,
                    department_name: departmentName,

                    //lecturer
                    L_Id: lId,
                    courses: lecturerCoursesPayload
                }),
            });
            if (res.ok) {
                Alert.alert("Success", "You've Completed Your Profile")
                // refresh profile in context so other screens can access it
                try {
                    await refreshProfile();
                } catch (err) {
                    console.log(err)
                }
                if (onClose) onClose();
            }
            else {
                const errorData = await res.json();
                console.error('Profile save error:', errorData);
                Alert.alert("Error", errorData?.message || "Unknown Error Occurred")
            }
            queryClient.invalidateQueries({ queryKey: ["departmentStats"] });
        }
        catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed ! Try Again")
        }
    }
    useEffect(() => {
        const getUserRole = async () => {
            try {
                const res = await apiFetch(`${API_BASE_URL}/api/users/me`, {
                    method: "GET",
                });
                if (res.ok) {
                    const userdata = await res.json();
                    setRole(userdata.role);
                }
            }
            catch (err) {
                console.error(err)
                Alert.alert("error", "cannot get your role")
            }
        }
        getUserRole();
    }, []);
    if (!role) return null;
    return (
        <>
            {role === "Student" && (
                <ProfileModalWrapper isVisible={isVisible} onClose={onClose}>
                    {/* Header */}
                    <View className="items-center mb-4">
                        <View className="bg-blue-100 p-3 rounded-full mb-2">
                            <Ionicons name="person-circle-outline" size={40} color="#1E40FF" />
                        </View>
                        <Text style={styles.header} className=" font-bold">Complete Your Profile</Text>
                        <Text className="text-gray-500 text-lg text-center mt-1">
                            Help classmates and lecturers recognize you easily
                        </Text>
                    </View>
                    {/* Profile image */}
                    <View style={{
                        height: hp(20),
                        borderRadius: hp(4),
                        marginBottom: hp(2)
                    }}
                        className="flex-1 bg-blue-100">
                        <TouchableOpacity onPress={pickImageAsync} className="items-center flex-row gap-4">
                            <ImageViewer imgSource={placeholder} selectedImage={selectedImage} />
                            <View className='flex-1'>
                                <Text style={{ fontSize: hp(3), fontWeight: 'bold' }}
                                    className="text-black  mt-1">
                                    Tap
                                </Text>
                                <Text style={{ fontSize: hp(2), fontWeight: 'semibold' }}
                                    className="text-edublue  mt-1">
                                    Add profile image URL
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* inputs */}
                    <TextInput
                        placeholder='Full Name'
                        value={fullName}
                        onChangeText={setFullName}
                        style={styles.inputs}
                    />
                    <TextInput
                        placeholder='UserName'
                        value={userName}
                        onChangeText={setUserName}
                        style={styles.inputs}
                    />
                    <TextInput
                        placeholder='Reg. No i.e. AB1/12345/26'
                        value={regNo}
                        onChangeText={setRegNo}
                        style={styles.inputs}
                    />
                    <Dropdown
                        style={styles.dropdown}
                        data={departments}
                        labelField="name"
                        valueField="id"
                        placeholder="Select a department"
                        value={selectedDeptId}
                        onChange={(item) => setSelectedDeptId(item.id)}
                        search
                        searchPlaceholder="Search department..."
                    />
                    <Dropdown
                        style={styles.dropdown}
                        data={courses}
                        labelField="label"
                        valueField="id"
                        placeholder="Select a course"
                        value={selectedCourseId}
                        onChange={(item) => {
                            setSelectedCourseId(item.id);
                            setCourseName(item.name);
                        }}
                        search
                        searchPlaceholder="Search course..."
                        disable={!selectedDeptId}
                    />
                    <TextInput
                        placeholder='Level i.e. III'
                        value={level}
                        onChangeText={setLevel}
                        style={styles.inputs}
                    />
                    <TextInput
                        placeholder='Phone Number i.e. +254712345678'
                        keyboardType='phone-pad'
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={styles.inputs}
                    />

                    <GradientButton title='Save Profile' onPress={handleSaveProfile} />

                </ProfileModalWrapper>
            )}
            {role === "Admin" && (
                <ProfileModalWrapper isVisible={isVisible} onClose={onClose}>
                    {/* Header */}
                    <View className="items-center mb-4">
                        <View className="bg-blue-100 p-3 rounded-full mb-2">
                            <Ionicons name="person-circle-outline" size={40} color="#1E40FF" />
                        </View>
                        <Text style={styles.header} className=" font-bold">Complete Your Profile</Text>
                        <Text className="text-gray-500 text-md text-center mt-1">
                            Help Students and lecturers recognize you easily
                        </Text>
                    </View>
                    {/* Profile image */}
                    <View style={{
                        height: hp(15),
                        borderRadius: hp(4),
                        marginBottom: hp(2)
                    }}
                        className="bg-blue-100">
                        <TouchableOpacity onPress={pickImageAsync} className="items-center flex-row  gap-4">
                            <ImageViewer imgSource={placeholder} selectedImage={selectedImage} />
                            <View className='flex-1'>
                                <Text style={{ fontSize: hp(3), fontWeight: 'bold' }} className="text-black  mt-1">Tap</Text>
                                <Text style={{ fontSize: hp(2), fontWeight: 'semibold' }} className="text-edublue  mt-1">Add profile image URL</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* inputs */}
                    <Dropdown
                        style={styles.dropdown}
                        data={departments}
                        labelField="name"
                        valueField="id"
                        placeholder="Select a department"
                        value={selectedDeptId}
                        onChange={(item) => {
                            setSelectedDeptId(item.id);
                            setDepartmentName(item.name);
                        }}
                        search
                        searchPlaceholder="Search department..."
                    />
                    <TextInput
                        placeholder='Full Name'
                        value={fullName}
                        onChangeText={setFullName}
                        style={styles.inputs}
                    />
                    <TextInput
                        placeholder='UserName'
                        value={userName}
                        onChangeText={setUserName}
                        style={styles.inputs}
                    />
                    <TextInput
                        placeholder='Admin ID i.e. A/123'
                        value={aId}
                        onChangeText={setAId}
                        style={styles.inputs}
                    />
                    <TextInput
                        placeholder='Phone Number i.e. +254712345678'
                        keyboardType='phone-pad'
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={styles.inputs}
                    />
                    <GradientButton title='Save Profile' onPress={handleSaveProfile} />
                </ProfileModalWrapper>
            )}

            {role === "Lecturer" && (
                <ProfileModalWrapper isVisible={isVisible} onClose={onClose}>
                    {/* Header */}
                    <View className="items-center mb-4">
                        <View className="bg-blue-100 p-3 rounded-full mb-2">
                            <Ionicons name="school-outline" size={40} color="#1E40FF" />
                        </View>
                        <Text style={styles.header} className="font-bold">
                            Complete Lecturer Profile
                        </Text>
                        <Text className="text-gray-500 text-md text-center mt-1">
                            Let students identify and connect with you easily
                        </Text>
                    </View>

                    {/* Profile Image */}
                    <View
                        style={{
                            height: hp(15),
                            borderRadius: hp(4),
                            marginBottom: hp(2),
                        }}
                        className="bg-blue-100"
                    >
                        <TouchableOpacity
                            onPress={pickImageAsync}
                            className="items-center flex-row gap-4"
                        >
                            <ImageViewer
                                imgSource={placeholder}
                                selectedImage={selectedImage}
                            />
                            <View className="flex-1">
                                <Text
                                    style={{ fontSize: hp(3), fontWeight: "bold" }}
                                    className="text-black"
                                >
                                    Tap
                                </Text>
                                <Text
                                    style={{ fontSize: hp(2) }}
                                    className="text-edublue mt-1"
                                >
                                    Add profile image
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Department */}
                    <Dropdown
                        style={styles.dropdown}
                        data={departments}
                        labelField="name"
                        valueField="id"
                        placeholder="Select a department"
                        value={selectedDeptId}
                        onChange={(item) => {
                            setSelectedDeptId(item.id);
                            setDepartmentName(item.name);
                            setSelectedCourses([]);
                        }}
                        search
                        searchPlaceholder="Search department..."
                    />

                    {/* Course Selector */}
                    {selectedDeptId && (
                        <>
                            <Text className="mb-1 font-semibold text-gray-700">
                                Select Courses
                            </Text>

                            {/* Selected Courses Display (Flex Row) */}
                            <TouchableOpacity
                                onPress={() => setShowCourses(!showCourses)}
                                style={{
                                    minHeight: hp(6),
                                    borderWidth: 1,
                                    borderColor: "#6b7280",
                                    borderRadius: hp(2),
                                    padding: hp(1),
                                    justifyContent: "center",
                                    marginBottom: hp(1),
                                }}
                            >
                                {selectedCourses.length === 0 ? (
                                    <Text className="text-gray-400">
                                        Tap to select courses
                                    </Text>
                                ) : (
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                                        {selectedCourses.map((id, index) => {
                                            const course = courses.find(c => c.id === id);
                                            if (!course) return null;

                                            return (
                                                <View
                                                    key={id}
                                                    style={{
                                                        backgroundColor: "#dbeafe",
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 4,
                                                        borderRadius: 20,
                                                        marginBottom: 5,
                                                    }}
                                                >
                                                    <Text style={{ fontSize: hp(1.6) }}>
                                                        {course.name}
                                                        {index === 0 && " (Main)"}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </TouchableOpacity>

                            {/* Expandable Course List */}
                            {showCourses && (
                                <View
                                    style={{
                                        height: hp(25),
                                        borderWidth: 1,
                                        borderColor: "#6b7280",
                                        borderRadius: hp(2),
                                        marginBottom: hp(2),
                                        overflow: "hidden",
                                    }}
                                >
                                    <ScrollView
                                        nestedScrollEnabled
                                        contentContainerStyle={{ padding: hp(1) }}
                                    >
                                        {courses.map((course) => {
                                            const isSelected = selectedCourses.includes(course.id);

                                            return (
                                                <TouchableOpacity
                                                    key={course.id}
                                                    onPress={() => {
                                                        if (isSelected) {
                                                            setSelectedCourses(prev =>
                                                                prev.filter(id => id !== course.id)
                                                            );
                                                        } else {
                                                            setSelectedCourses(prev => [
                                                                ...prev,
                                                                course.id,
                                                            ]);
                                                        }
                                                    }}
                                                    style={{
                                                        padding: hp(1.2),
                                                        borderRadius: hp(1.5),
                                                        marginBottom: hp(1),
                                                        borderWidth: 1,
                                                        borderColor: isSelected
                                                            ? "#3b82f6"
                                                            : "#d1d5db",
                                                        backgroundColor: isSelected
                                                            ? "#dbeafe"
                                                            : "#ffffff",
                                                    }}
                                                >
                                                    <Text>
                                                        {course.programme
                                                            ? `${course.programme} - ${course.name}`
                                                            : course.name}
                                                    </Text>

                                                    {isSelected &&
                                                        selectedCourses[0] === course.id && (
                                                            <Text
                                                                style={{ fontSize: hp(1.6) }}
                                                                className="text-green-600 mt-1"
                                                            >
                                                                Main Course
                                                            </Text>
                                                        )}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>

                                    {/* Done Button */}
                                    <TouchableOpacity
                                        onPress={() => setShowCourses(false)}
                                        style={{
                                            backgroundColor: "#1E40FF",
                                            padding: hp(1.5),
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text style={{ color: "white", fontWeight: "bold" }}>
                                            Done
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    )}

                    {/* Full Name */}
                    <TextInput
                        placeholder="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        style={styles.inputs}
                    />

                    {/* Username */}
                    <TextInput
                        placeholder="Username"
                        value={userName}
                        onChangeText={setUserName}
                        style={styles.inputs}
                    />

                    {/* Staff ID */}
                    <TextInput
                        placeholder="Staff ID i.e. LEC/203"
                        value={lId}
                        onChangeText={setLId}
                        style={styles.inputs}
                    />

                    {/* Phone */}
                    <TextInput
                        placeholder="Phone Number i.e. +254712345678"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={styles.inputs}
                    />

                    <GradientButton
                        title="Save Profile"
                        onPress={handleSaveProfile}
                    />
                </ProfileModalWrapper>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    modals: {
        height: hp(86),
        width: wp(94),
        marginHorizontal: wp(3),
        marginVertical: hp(7),
        padding: hp(1),
        overflow: 'hidden',
    },
    header: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
    },
    inputs: {
        borderWidth: 1,
        borderColor: '#6b7280',
        borderRadius: hp(2),
        paddingVertical: hp(1),
        paddingHorizontal: wp(2),
        marginBottom: hp(1.5),
        color: 'gray-700',
        height: hp(5)
    },
    dropdown: {
        height: hp(5),
        borderColor: "#6b7280",
        borderWidth: wp(0.3),
        borderRadius: hp(2),
        paddingHorizontal: wp(2),
        marginBottom: hp(2),
    },
})

const ProfileModalWrapper = ({
    isVisible,
    onClose,
    children,
}: PropsWithChildren<{ isVisible: boolean; onClose: () => void }>) => (
    <Modal
        animationType="slide"
        transparent
        visible={isVisible}
        onRequestClose={onClose}
    >
        <BlurView
            intensity={70}
            tint="dark"
            style={StyleSheet.absoluteFill}
        />
        <CustomKeyBoardView>
            <View style={styles.modals} className="bg-gray-100 rounded-[20px]">
                    {children}
            </View>
        </CustomKeyBoardView>
    </Modal>
);