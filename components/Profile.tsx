import { useAuth } from '@/context/authContext';
import { apiFetch } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Alert, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import GradientButton from './GradientButton';
import ImageViewer from './ImageViewer';
import CustomKeyBoardView from './customKeyBoardView';



type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: () => void;
}>;
const API_BASE_URL =
    Platform.OS === "web"
        ? "http://localhost:3000"
        : "http://192.168.100.4:3000";

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
    const placeholder = require('@/assets/images/camera.jpg')
    const [regNo ,setRegNo] = useState<string>('')
    const [departments, setDepartments] = useState<Department[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

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
                setCourseName('');
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
            const selectedCourse = courses.find(c => c.id === selectedCourseId);
            const res = await apiFetch(`${API_BASE_URL}/api/profiles`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: fullName,
                    username: userName,
                    course_name: selectedCourse?.name,
                    level: level,
                    reg_no: regNo,
                    phone: phoneNumber,
                    profileImage: uri,
                    course_id: selectedCourseId
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
                Alert.alert("Error", "Unkown Error Occured")
            }
        }
        catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed ! Try Again")
        }

    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}>
            <BlurView
                intensity={70}
                tint="dark"
                style={StyleSheet.absoluteFill} />
            <CustomKeyBoardView>

                <View style={{
                    height: hp(86),
                    width: wp(94),
                    marginHorizontal: wp(3),
                    marginVertical: hp(7),
                    padding: hp(1)
                }}
                    className='bg-gray-100 rounded-[20px]'>
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
                        <TouchableOpacity onPress={pickImageAsync} className="items-center flex-row   gap-4">
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
                        placeholder='reg. No i.e. AB1/12345/26'
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
                </View>
            </CustomKeyBoardView>

        </Modal >
    )
}



const styles = StyleSheet.create({
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