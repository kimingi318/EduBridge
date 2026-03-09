import { useAuth } from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { darkTheme, lightTheme } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { PropsWithChildren, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { API_BASE_URL, apiFetch } from "../utils/api";



type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: () => void;
}>;
type Course = {
    id: string;
    name: string;
    programme?: string;

};
type Unit = {
    id: string;
    name: string
}
const data = [
    { label: 'Year 1', value: 'I' },
    { label: 'Year 2', value: 'II' },
    { label: 'Year 3', value: 'III' },
    { label: 'Year 4', value: 'IV' }
]
const lecturerToStudentTitles = [
    { label: "Sit-In CAT", value: "Sit-In CAT" },
    { label: "Assignment Submission", value: "Assignment Submission" },
    { label: "Make-Up Class", value: "Make-Up Class" },
];
const AdminToStudentTitles = [
    { label: "Exam Results", value: "Exam Results" },
    { label: "Transcripts", value: "Transcripts Ready" },
];

const adminToLecturerTitles = [
    { label: "Student Result Submission", value: "Student Result Submission" },
    { label: "Lecturer Meeting", value: "Lecturer Meeting" },
];

export default function CreateAnnouncement({ isVisible, onClose }: Props) {
    const { profile, user } = useAuth();
    const isAdmin = user?.role === "Admin";
    const isLecturer = user?.role === "Lecturer";
    const scheme = useColorScheme();
    const theme = scheme === "dark" ? darkTheme : lightTheme;
    const [courseValue, setCourseValue] = useState<string | null>(null);
    const [unitValue, setUnitValue] = useState<string | null>(null);
    const [recipientType, setRecipientType] = useState<"Student" | "Lecturer" | null>(null);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [level, setLevel] = useState("");
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const styles = createStyles(theme);
    const [unitName , setUnitName] = useState("");

    const titleOptions =
        recipientType === "Lecturer"
            ? adminToLecturerTitles
            :recipientType === "Student"? AdminToStudentTitles:
             lecturerToStudentTitles;

    useEffect(() => {
        if (isLecturer) {
            setRecipientType("Student");
        }
    }, [isLecturer]);

    const handleCreateAnnouncement = async () => {
        if (!title || !message) {
            Alert.alert("Missing fields");
            return;
        }

        try {
            setLoading(true);

            await addDoc(collection(db, "announcements"), {
                title,
                message,
                targetRole: recipientType,
                courseId: recipientType === "Student" ? courseValue : null,
                classId: recipientType === "Student" ? unitValue : null,
                unitName,
                level: recipientType === "Student" ? level : null,
                createdBy: profile?.id,
                createdByRole: user?.role,
                createdAt: serverTimestamp(),
            });

            Alert.alert("Success", "Announcement posted");
            onClose();
        } catch (error) {
            Alert.alert("Error", "Failed to create announcement");
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!profile?.department_id) return;

        setCourseValue(null);

        const fetchCourses = async () => {
            try {
                const res = await apiFetch(
                    `${API_BASE_URL}/api/courses/by-department/${profile?.department_id}`
                );
                if (!res.ok) return;
                const data: Course[] = await res.json();
                const labeled = data.map(c => ({
                    ...c,
                    label: c.programme ? `${c.programme} - ${c.name}` : c.name,
                } as any));
                setCourses(labeled as any);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, [profile?.department_id]);


    //get units
    useEffect(() => {
        if (!courseValue || !level) return;

        const fetchUnits = async () => {
            try {
                const url = `${API_BASE_URL}/api/units/by-course/level/${courseValue}/${level}`
                const res = await apiFetch(url, { method: 'GET' });
                if (!res.ok) return;
                const data: Unit[] = await res.json();
                const labeledUnits = data.map(u => ({
                    ...u,
                    label: u.name
                }));
                setUnits(labeledUnits as any);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUnits();
    }, [courseValue, level]);

    return (
        <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />

            <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
                <View className="flex-row items-center mb-6">
                    <Ionicons name="megaphone-outline" size={24} color={theme.text} />
                    <Text className="text-xl font-bold ml-2" style={{ color: theme.text }}>
                        Create Announcement
                    </Text>
                </View>

                {isAdmin && (
                    <>
                        <Text style={{ color: theme.text }}>Send To</Text>
                        <Dropdown
                            style={styles.dropdown}
                            data={[
                                { label: "Student", value: "Student" },
                                { label: "Lecturer", value: "Lecturer" },
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Recipient"
                            placeholderStyle={styles.placeholderStyle}
                            containerStyle={styles.dropdownContainer}
                            selectedTextStyle={styles.selectedTextStyle}
                            itemTextStyle={styles.itemTextStyle}
                            value={recipientType}
                            onChange={(item) => {
                                setRecipientType(item.value);
                                setLevel("");
                                setUnitValue(null);
                            }}
                        />
                    </>
                )}

                <Text style={{ color: theme.text }}>Title</Text>
                <Dropdown
                    style={styles.dropdown}
                    data={titleOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Title"
                    placeholderStyle={styles.placeholderStyle}
                    containerStyle={styles.dropdownContainer}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemTextStyle={styles.itemTextStyle}
                    value={title}
                    onChange={(item) => setTitle(item.value)}
                />

                <Text style={{ color: theme.text }}>Message</Text>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={5}
                    className="border rounded-xl px-4 py-3 mb-4"
                    style={{ color: theme.text, borderColor: theme.text }}
                />

                <Text style={{ color: theme.text }}>Course</Text>
                <Dropdown
                    style={styles.dropdown}
                    data={courses}
                    labelField="label"
                    valueField="id"
                    placeholder="Select Course"
                    value={courseValue}
                    placeholderStyle={styles.placeholderStyle}
                    containerStyle={styles.dropdownContainer}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemTextStyle={styles.itemTextStyle}
                    disable={!profile.department_id}
                    onChange={(item) => {
                        setCourseValue(item.id);
                        setUnitValue(null);
                    }}
                />

                {recipientType === "Student" && (
                    <>
                        <Text style={{ color: theme.text }}>Level</Text>
                        <Dropdown
                            style={styles.dropdown}
                            data={data}
                            labelField="label"
                            placeholder="Select Level"
                            value={level}
                            placeholderStyle={styles.placeholderStyle}
                            containerStyle={styles.dropdownContainer}
                            selectedTextStyle={styles.selectedTextStyle}
                            itemTextStyle={styles.itemTextStyle}
                            valueField="value"
                            onChange={(item) => {
                                setLevel(item.value)
                            }}
                        />

                        <Text style={{ color: theme.text }}>Unit Class</Text>
                        <Dropdown
                            style={styles.dropdown}
                            data={units}
                            labelField="label"
                            valueField="id"
                            placeholder="Select Course"
                            value={unitValue}
                            placeholderStyle={styles.placeholderStyle}
                            containerStyle={styles.dropdownContainer}
                            selectedTextStyle={styles.selectedTextStyle}
                            itemTextStyle={styles.itemTextStyle}
                            disable={!courseValue}
                            onChange={(item) => {
                                setUnitValue(item.id);
                                setUnitName(item.name);
                            }}
                        />

                    </>
                )}


                <TouchableOpacity onPress={handleCreateAnnouncement} className="bg-green-600 py-4 rounded-xl items-center">
                    {loading ? <ActivityIndicator color="white" /> : <Text className="text-white">Post Announcement</Text>}
                </TouchableOpacity>
            </ScrollView>
        </Modal>
    );
}
const createStyles = (theme: any) =>
    StyleSheet.create({
        dropdown: {
            height: hp(6),
            backgroundColor: theme.surface,
            borderRadius: 10,
            paddingHorizontal: wp(3),
            marginBottom: hp(1),
            borderWidth: 1,
            borderColor: "#ddd",
        },
        placeholderStyle: {
            color: theme.subText,
            fontSize: hp(1.5)
        },
        dropdownContainer: {
            borderRadius: 8,
            color: theme.text,
            backgroundColor: theme.card,
            elevation: 3, // shadow on Android
        },
        selectedTextStyle: {
            fontSize: 14,
            color: theme.text,
        },
        itemTextStyle: {
            fontSize: 14,
            color: theme.text,
        },
        container: {
            backgroundColor: theme.surface,
            paddingBottom: hp(1),
            paddingHorizontal: wp(1.5),
            borderRadius: 30,
            flex: 1,
            marginTop: hp(10),
            marginHorizontal: wp(2),
            maxHeight: hp(65),
        },
    })