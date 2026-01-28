import React, { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { apiFetch } from "../utils/api";

type Faculty= {
    id: string;
    name: string;
    abbv: string;
}

const API_BASE_URL = Platform.OS === "web"
    ? "http://localhost:3000"
    : "http://192.168.100.4:3000";

const AddFaculty = () => {
    const [name, setName] = useState("");
    const [abbv, setAbbv] = useState("");
    const [DeptName, setDeptName] = useState("");
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [items , setItems] = useState<any[]>([]);
    const [facultyId ,setFacultyId] = useState("");
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    
    useEffect(()=>{
    const handleGetFaculty = async () => {
        try {
            const res = await apiFetch(`${API_BASE_URL}/api/faculties/`, {
                method: "GET",
            });
            if (res.ok) {
                const faculties: Faculty[] = await res.json();
                // faculties.forEach((faculty: any) => { console.log(faculty.name) });

                setFaculties(faculties);
                setItems(
                    faculties.map((faculty) =>({
                        label: faculty.name,
                        value: faculty.id,
                    }))
                )
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    handleGetFaculty();
},[]);


    const handleSubmit = async () => {
        try {
            const res = await apiFetch(`${API_BASE_URL}/api/faculties`, {
                method: "POST",
                body: JSON.stringify({ name, abbv }),
            });
            if (res.ok) {
                Alert.alert("Success", "Faculty added successfully!");
            }
        } catch (err) {
            console.error(err);
        }

    };

    const handleAddDepartment = async ()=>{
        const facultyId = value;
        if(!DeptName || !facultyId){
            Alert.alert("Error", "Please fill all fields");
            return;
        }
        try{
            const res = await apiFetch(`${API_BASE_URL}/api/departments`, {
                method: "POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({ name: DeptName, facultyId }),
            });
            if(res.ok){
                Alert.alert("Success", "Department added successfully!");
                setDeptName("");
                setFacultyId("");
            }else{
                Alert.alert("Error", "Failed to add department");
            }
        }
        catch(err){
            console.error(err);
            Alert.alert("Error", "Failed to add department")
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add Faculty</Text>

            <TextInput
                style={styles.input}
                placeholder="Faculty Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Abbreviation"
                value={abbv}
                onChangeText={setAbbv}
            />
            <TouchableOpacity className="mb-4" onPress={handleSubmit}>
                <Text>Add Faculty</Text>
            </TouchableOpacity>

         <DropDownPicker open={open} 
         value={value}
          items={items} 
          setOpen={setOpen}
           setValue={setValue}
          setItems={setItems}
           placeholder="Select a faculty" 
           style={{ flex: 1 }} />

            <Text style={styles.header}>Add Department</Text>
                <Text>Choose Faculty</Text>
             <TextInput
                style={styles.input}
                placeholder="department name"
                value={DeptName}
                onChangeText={setDeptName}
            />
             <TouchableOpacity onPress={handleAddDepartment} className="mb-4" >
                <Text>Add Faculty</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f9f9f9",
        flex: 1,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
});

export default AddFaculty;
