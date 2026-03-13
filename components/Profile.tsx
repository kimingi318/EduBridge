import { useAuth } from '@/context/authContext';
import { API_BASE_URL, apiFetch } from '@/utils/api';
import { darkTheme, lightTheme } from "@/utils/colors";
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import GradientButton from './GradientButton';
import ImageViewer from './ImageViewer';
import CustomKeyBoardView from './customKeyBoardView';



type Props = {
    isVisible: boolean;
    onClose: () => void;
};

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

const CLOUDINARY_CLOUD_NAME = "dawsvdfwm";
const CLOUDINARY_UPLOAD_PRESET = "edubridge-memo";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function Profile({ isVisible, onClose }: Props) {
    const [fullName, setFullName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [courseName, setCourseName] = useState<string>('');
    const [level, setLevel] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const placeholder = require('@/assets/images/profileimg.jpg')
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
    const [showCourses, setShowCourses] = useState(false);
    const scheme = useColorScheme();
    const theme = scheme === "dark" ? darkTheme : lightTheme;
    const styles = createStyles(theme);
    const { refreshProfile } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [image, setImage] = useState<string | null>(null);
    const [localImage, setLocalImage] = useState<any>(null);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await apiFetch(`${API_BASE_URL}/api/profiles/me`, {
                    method: "GET",
                });

                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);

                    if (data) {
                        setFullName(data.name || "");
                        setUserName(data.username || "");
                        setPhoneNumber(data.phone || "");
                        setImage(data.profile_image || null);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
    }, []);

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
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission required", "We need gallery access");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setLocalImage(result.assets[0]);
        }
    };
    const uploadImageToCloudinary = async (imageAsset: any) => {
        const uri = imageAsset.uri;
        const fileType = uri.split(".").pop();

        const formData = new FormData();

        formData.append("file", {
            uri,
            type: `image/${fileType}`,
            name: `profile_${Date.now()}.${fileType}`,
        } as any);

        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Image upload failed");
        }

        const data = await response.json();

        return data.secure_url;
    };

    const handleSaveProfile = async () => {
        try {
            let uploadedImageUrl = image;
            if (localImage) {
              uploadedImageUrl = await uploadImageToCloudinary(localImage);
            }

            const payload: any = {};
            if (fullName) payload.name = fullName;
            if (userName) payload.username = userName;
            if (phoneNumber) payload.phone = phoneNumber;
            if (image) payload.profile_image = uploadedImageUrl;

            if (role === "Student") {
                if (courseName) payload.course_name = courseName;
                if (level) payload.level = level;
                if (regNo) payload.reg_no = regNo;
                if (selectedCourseId) payload.course_id = selectedCourseId;
                if (selectedDeptId) payload.department_id = selectedDeptId;
            }

            if (role === "Admin") {
                if (aId) payload.A_Id = aId;
                if (selectedDeptId) payload.department_id = selectedDeptId;
                if (departmentName) payload.department_name = departmentName;
            }

            if (role === "Lecturer") {
                if (lId) payload.L_Id = lId;

                if (selectedCourses.length > 0) {
                    payload.courses = selectedCourses.map((id, index) => ({
                        course_id: id,
                        is_main: index === 0
                    }));
                }
            }

            const method = profile ? "PATCH" : "POST";

            const res = await apiFetch(`${API_BASE_URL}/api/profiles`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                Alert.alert("Success", profile ? "Profile updated" : "Profile created");
                await refreshProfile();
                if (onClose) onClose();
            } else {
                const errorData = await res.json();
                Alert.alert("Error", errorData?.error || "Unknown error");
            }

        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed! Try again");
        }
    }; useEffect(() => {
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
                <ProfileModalWrapper theme={theme} isVisible={isVisible} onClose={onClose}>
                    {/* Header */}
                    <View className="items-center mb-4">
                        <View className="bg-blue-100 p-3 rounded-full mb-2">
                            <Ionicons name="person-circle-outline" size={40} color="#1E40FF" />
                        </View>
                        <Text style={styles.header} className=" font-bold">Complete Your Profile</Text>
                        <Text style={{ color: theme.subText, fontSize: hp(2), textAlign: "center" }}>
                            Help classmates and lecturers recognize you easily
                        </Text>
                    </View>
                    {/* Profile image */}
                    <View style={{
                        height: hp(15),
                        borderRadius: hp(4),
                        marginBottom: hp(2),
                        backgroundColor: theme.surface
                    }}>
                        <TouchableOpacity onPress={pickImageAsync} className="items-center flex-row gap-4">
                            <ImageViewer imgSource={placeholder} selectedImage={image}  localImage={localImage}/>
                            <View className='flex-1'>
                                <Text style={{ fontSize: hp(3), fontWeight: 'bold', color: theme.text }}
                                    className="mt-1">
                                    Tap
                                </Text>
                                <Text style={{ fontSize: hp(2), fontWeight: 'semibold' }}
                                    className="text-edublue  mt-1">
                                    Add profile image
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
                <ProfileModalWrapper theme={theme} isVisible={isVisible} onClose={onClose}>
                    {/* Header */}
                    <View className="items-center mb-4">
                        <View className="bg-blue-100 p-3 rounded-full mb-2">
                            <Ionicons name="person-circle-outline" size={40} color="#1E40FF" />
                        </View>
                        <Text style={[styles.header, { color: theme.text }]}>Complete Your Profile</Text>
                        <Text style={{ color: theme.subText, fontSize: hp(1.8), textAlign: "center" }}>
                            Help Students and lecturers recognize you easily
                        </Text>
                    </View>
                    {/* Profile image */}
                    <View style={{
                        height: hp(15),
                        borderRadius: hp(4),
                        marginBottom: hp(2),
                        backgroundColor: theme.surface
                    }}>
                        <TouchableOpacity onPress={pickImageAsync} className="items-center flex-row  gap-4">
                            <ImageViewer imgSource={placeholder} selectedImage={image}  localImage={localImage} />
                            <View className='flex-1'>
                                <Text style={{ fontSize: hp(3), fontWeight: 'bold', color: theme.text }} className=" mt-1">Tap</Text>
                                <Text style={{ fontSize: hp(2), fontWeight: 'semibold' }} className="text-edublue  mt-1">Add profile image</Text>
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
                        placeholderStyle={{ color: theme.subText }}
                    />
                    <TextInput
                        placeholder='Full Name'
                        value={fullName}
                        onChangeText={setFullName}
                        style={styles.inputs}
                        placeholderTextColor={theme.subText}
                    />
                    <TextInput
                        placeholder='UserName'
                        value={userName}
                        onChangeText={setUserName}
                        style={styles.inputs}
                        placeholderTextColor={theme.subText}
                    />
                    <TextInput
                        placeholder='Admin ID i.e. A/123'
                        value={aId}
                        onChangeText={setAId}
                        style={styles.inputs}
                        placeholderTextColor={theme.subText}
                    />
                    <TextInput
                        placeholder='Phone Number i.e. +254712345678'
                        keyboardType='phone-pad'
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={styles.inputs}
                        placeholderTextColor={theme.subText}
                    />
                    <GradientButton title='Save Profile' onPress={handleSaveProfile} />
                </ProfileModalWrapper>
            )}

            {role === "Lecturer" && (
                <ProfileModalWrapper theme={theme} isVisible={isVisible} onClose={onClose}>
                    {/* Header */}
                    <View className="items-center mb-4">
                        <View className="bg-blue-100 p-3 rounded-full mb-2">
                            <Ionicons name="school-outline" size={40} color="#1E40FF" />
                        </View>
                        <Text style={styles.header} className="font-bold">
                            Complete Lecturer Profile
                        </Text>
                        <Text style={{ color: theme.subText, fontSize: hp(1.8), marginTop: hp(0.5) }}>
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
                                selectedImage={image}
                                 localImage={localImage}
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
                            <Text style={{ marginBottom: hp(0.5), fontWeight: '600', color: theme.text }}>
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
                                    <Text style={{ color: '#9ca3af' }}>
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
                                                                style={{ fontSize: hp(1.6), color: '#16a34a', marginTop: hp(0.5) }}
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

const createStyles = (theme: any) =>
    StyleSheet.create({
        modals: {
            maxHeight: hp(100),
            width: wp(94),
            marginHorizontal: wp(3),
            marginVertical: hp(7),
            padding: hp(1),
            overflow: "hidden",
            backgroundColor: theme.surface,
            borderRadius: 20,
        },

        header: {
            fontSize: hp(2.5),
            fontWeight: "bold",
        },

        inputs: {
            borderWidth: 1,
            borderColor: theme.subText,
            borderRadius: hp(2),
            paddingVertical: hp(1),
            paddingHorizontal: wp(2),
            marginBottom: hp(1.5),
            color: theme.text,
            backgroundColor: theme.card,
            height: hp(5),
        },

        dropdown: {
            height: hp(5),
            borderColor: theme.subText,
            borderWidth: wp(0.3),
            borderRadius: hp(2),
            paddingHorizontal: wp(2),
            marginBottom: hp(2),
            backgroundColor: theme.card,
        },

        imageContainer: {
            backgroundColor: theme.surface,
            justifyContent: "center",
        },
    });

const ProfileModalWrapper = ({
    isVisible,
    onClose,
    children,
    theme
}: PropsWithChildren<{ isVisible: boolean; onClose: () => void; theme: any }>) => (
    <Modal
        animationType="slide"
        transparent
        visible={isVisible}
        onRequestClose={onClose}
    >
        <BlurView
            intensity={70}
            tint={theme.background === "#000000" ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
        />
        <CustomKeyBoardView>
            <View style={[createStyles(theme).modals, { backgroundColor: theme.background, borderRadius: 20 }]}>
                {children}
            </View>
        </CustomKeyBoardView>
    </Modal>
);