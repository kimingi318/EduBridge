import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BlurView } from 'expo-blur';
import { PropsWithChildren, useEffect, useState } from "react";
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { API_BASE_URL, apiFetch } from "../utils/api";
import GradientButton from "./GradientButton";

type Faculty = {
    id: string;
    name: string;
};

type Department = {
    id: string;
    name: string;
};

type Course = {
    id: string;
    name: string;
};
type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: () => void;
}>;

export default function AddUnits({ isVisible, children, onClose }: Props) {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    const [facultyValue, setFacultyValue] = useState<string | null>(null);
    const [departmentValue, setDepartmentValue] = useState<string | null>(null);
    const [courseValue, setCourseValue] = useState<string | null>(null);

    const [unitName, setUnitName] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const res = await apiFetch(`${API_BASE_URL}/api/faculties`);
                if (!res.ok) return;
                const data = await res.json();
                setFaculties(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFaculties();
    }, []);

    useEffect(() => {
        if (!facultyValue) return;

        setDepartmentValue(null);
        setCourseValue(null);
        setCourses([]);

        const fetchDepartments = async () => {
            try {
                const res = await apiFetch(
                    `${API_BASE_URL}/api/departments/by-faculty/${facultyValue}`
                );
                if (!res.ok) return;
                const data = await res.json();
                setDepartments(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDepartments();
    }, [facultyValue]);

    useEffect(() => {
        if (!departmentValue) return;

        setCourseValue(null);

        const fetchCourses = async () => {
            try {
                const res = await apiFetch(
                    `${API_BASE_URL}/api/courses/by-department/${departmentValue}`
                );
                if (!res.ok) return;
                const data = await res.json();
                setCourses(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, [departmentValue]);

    const handleAddUnit = async () => {
        if (!unitName || !code || !courseValue) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }
        try {
            setLoading(true);
            const res = await apiFetch(`${API_BASE_URL}/api/units`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: unitName,
                    code,
                    courseId: courseValue,
                })

            });
            if (res.ok) {
                Alert.alert("Success", "Unit added successfully!");
                setUnitName("");
                setCode("");
                setCourseValue(null);
            } else {
                Alert.alert("Error", "Failed to add unit");
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to add unit");
        }
        finally {
            setLoading(false);
        }

    }
    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}>
            <BlurView
                intensity={70}
                tint="dark"
                style={StyleSheet.absoluteFill} />
            <View style={styles.container}>
                <View className="flex-row items-center" style={{ gap: wp(1) }}>
                    <FontAwesome name="puzzle-piece" size={24} color="#1E5EFF" />
                    <Text style={styles.header}>Add Units</Text>
                </View>

                {/* Faculty */}
                <Dropdown
                    style={styles.dropdown}
                    data={faculties}
                    labelField="name"
                    valueField="id"
                    placeholder="Select Faculty"
                    value={facultyValue}
                    onChange={(item) => {
                        setFacultyValue(item.id);
                    }}
                />

                {/* Department */}
                <Dropdown
                    style={styles.dropdown}
                    data={departments}
                    labelField="name"
                    valueField="id"
                    placeholder="Select Department"
                    value={departmentValue}
                    disable={!facultyValue}
                    onChange={(item) => {
                        setDepartmentValue(item.id);
                    }}
                />

                {/* Course */}
                <Dropdown
                    style={styles.dropdown}
                    data={courses}
                    labelField="name"
                    valueField="id"
                    placeholder="Select Course"
                    value={courseValue}
                    disable={!departmentValue}
                    onChange={(item) => {
                        setCourseValue(item.id);
                    }}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Unit name"
                    value={unitName}
                    onChangeText={setUnitName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Unit Code"
                    value={code}
                    onChangeText={setCode}
                />
                <GradientButton title={loading ? "Adding..." : "Add Unit"}
                    onPress={handleAddUnit} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F8FAFC",
        paddingBottom: hp(1),
        paddingHorizontal: wp(1.5),
        borderRadius: 30,
        marginTop: hp(10),
        marginHorizontal: wp(2),
        height: hp(50)
    },
    header: {
        fontSize: hp(2.5),
        fontWeight: "bold",
        marginBottom: hp(2),
        marginTop: hp(1.5),
    },
    dropdown: {
        height: hp(6),
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: wp(3),
        marginBottom: hp(3),
        borderWidth: 1,
        borderColor: "#ddd",
    },
    input: {
        borderWidth: wp(0.3),
        borderColor: "#ccc",
        borderRadius: 8,
        padding: hp(1),
        marginBottom: hp(1),
        backgroundColor: "#fff",
    },
});
