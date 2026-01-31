
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Dropdown } from "react-native-element-dropdown";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { apiFetch } from '../utils/api';
import GradientButton from './GradientButton';

type Department = {
    id: string;
    programme: string;
    name: string;

}
const API_BASE_URL = Platform.OS === "web"
    ? "http://localhost:3000"
    : "http://192.168.100.4:3000";

const AddCourses = () => {

    // Courses State and Handlers
    const [departments, setDepartments] = useState<any[]>([]);
    const [departmentValue, setDepartmentValue] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [programme, setProgramme] = useState("");
    const [courseName, setCourseName] = useState("");
    const [dept_Id, setDept_Id] = useState("");

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
                setDept_Id("");
            } else {
                Alert.alert("Error", "Failed to add Course");
            }
        }
        catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to add Course")
        } finally {
            setLoading(false);
        }
    };
    return (
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
    )
}

export default AddCourses;


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F7FB",
        flex: 1,
        paddingTop: hp(1.5),
        paddingLeft: wp(2),
        paddingRight: wp(2),
        paddingHorizontal: 5,
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
        marginTop: hp(2),

    },
    dropdown: {
        height: hp(6),
        borderColor: "#ccc",
        borderWidth: wp(0.3),
        borderRadius: 8,
        paddingHorizontal: wp(2),
        backgroundColor: "#fff",
        marginBottom: hp(2),
    },
    header: {
        fontSize: hp(2.5),
        fontWeight: "bold",
        marginBottom: hp(1.5),
        marginTop: hp(1.5)
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
