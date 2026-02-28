
import { FontAwesome } from '@expo/vector-icons';
import { useQueryClient } from "@tanstack/react-query";
import { BlurView } from 'expo-blur';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { Dropdown } from "react-native-element-dropdown";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { API_BASE_URL, apiFetch } from '../utils/api';
import GradientButton from './GradientButton';


type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: () => void;
}>;

type Department = {
    id: string;
    programme: string;
    name: string;

}
export default function AddCourses({ isVisible, children, onClose }: Props) {

    // Courses State and Handlers
    const [departments, setDepartments] = useState<any[]>([]);
    const [departmentValue, setDepartmentValue] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [programme, setProgramme] = useState("");
    const [courseName, setCourseName] = useState("");
    const queryClient = useQueryClient();


    useEffect(() => {
        const handleGetDepartments = async () => {
            try {
                const res = await apiFetch(`${API_BASE_URL}/api/departments`, {
                    method: "GET",
                });
                if (res.ok) {
                    const data: Department[] = await res.json();
                    setDepartments(data)
                }
            }
            catch (err) {
                console.error(err);
            }
        }
        handleGetDepartments();
    }, []);

    const handleAddCourse = async () => {
        const dept_Id = departmentValue;
        if (!courseName || !dept_Id || !programme) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }
        try {
            setLoading(true);
            const res = await apiFetch(`${API_BASE_URL}/api/courses`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ programme: programme, name: courseName, dept_Id }),
            });
            if (res.ok) {
                Alert.alert("Success", "Course added successfully!");
                setCourseName("");
                // setDept_Id("");
            } else {
                Alert.alert("Error", "Failed to add Course");
            }
            queryClient.invalidateQueries({ queryKey: ["departmentStats"] });

        }
        catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to add Course")
        } finally {
            setLoading(false);
        }
    };
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
                {/* Courses Section*/}
                <View className="flex-row items-center " style={{ gap: wp(1) }}>
                    <FontAwesome name="mortar-board" size={24} color="#1E5EFF" />
                    <Text style={styles.header}>Add Courses</Text>
                </View>
                <Dropdown
                    value={departmentValue}
                    data={departments}
                    labelField="name"
                    valueField="id"
                    placeholder="Select a Department"
                    onChange={(item) => setDepartmentValue(item.id)}
                    search
                    style={styles.dropdown}
                    searchPlaceholder="Search faculty..."
                />
                <TextInput
                    style={styles.input}
                    placeholder="Course name"
                    value={courseName}
                    onChangeText={setCourseName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Programme i.e. Undergraduate/ Masters /Ph.D"
                    value={programme}
                    onChangeText={setProgramme}
                />
                <GradientButton title={loading ? "Adding..." : "Add Department"}
                    onPress={handleAddCourse} />
            </View>
        </Modal>
    )
}




const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F8FAFC",
        paddingBottom: hp(1.5),
        paddingHorizontal: wp(1.5),
        borderRadius: 30,
        marginTop: hp(10),
        marginHorizontal:wp(2),
        height: hp(30)

    },
    dropdown: {
        height: hp(4),
        borderColor: "#ccc",
        borderWidth: wp(0.3),
        borderRadius: 8,
        paddingHorizontal: wp(2),
        backgroundColor: "#fff",
        marginBottom: hp(1),
    },
    header: {
        fontSize: hp(2.5),
        fontWeight: "bold",
        marginBottom: hp(1.5),
        marginTop: hp(1)
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
