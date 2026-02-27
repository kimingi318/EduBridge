import Octicons from "@expo/vector-icons/Octicons";
import { BlurView } from 'expo-blur';
import { PropsWithChildren, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { API_BASE_URL, apiFetch } from "../utils/api";
import GradientButton from "./GradientButton";


type Faculty = {
  id: string;
  name: string;
  abbv: string;
};
type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function AddDepartment({ isVisible, children, onClose }: Props) {
  const [deptName, setDeptName] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [facultyValue, setFacultyValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await apiFetch(`${API_BASE_URL}/api/faculties`, {
          method: "GET",
        });
        if (res.ok) {
          const data: Faculty[] = await res.json();
          setFaculties(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchFaculties();
  }, []);

  const handleAddDepartment = async () => {
    if (!deptName || !facultyValue) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch(`${API_BASE_URL}/api/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: deptName,
          facultyId: facultyValue,
        }),
      });

      if (res.ok) {
        Alert.alert("Success", "Department added successfully!");
        setDeptName("");
        setFacultyValue(null);
      } else {
        Alert.alert("Error", "Failed to add department");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to add department");
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
        {/* Header */}
        <View className="flex-row items-center" style={{ gap: wp(1) }}>
          <Octicons name="stack" size={24} color="#1E5EFF" />
          <Text style={styles.header}>Add Department</Text>
        </View>

        {/* Faculty Dropdown */}
        <Dropdown
          style={styles.dropdown}
          data={faculties}
          labelField="name"
          valueField="id"
          placeholder="Select a faculty"
          value={facultyValue}
          onChange={(item) => setFacultyValue(item.id)}
          search
          searchPlaceholder="Search faculty..."
        />

        {/* Department Name */}
        <TextInput
          style={styles.input}
          placeholder="Department name"
          value={deptName}
          onChangeText={setDeptName}
        />

        {/* Submit */}
        <GradientButton
          title={loading ? "Adding..." : "Add Department"}
          onPress={handleAddDepartment}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFC",
    paddingBottom: hp(1.5),
    paddingHorizontal: wp(1.5),
    borderRadius: 30,
    marginTop: hp(10),
    marginHorizontal: wp(2),
    height: hp(30)
  },
  header: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    marginBottom: hp(1.5),
    marginTop: hp(1.5),
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
  input: {
    borderWidth: wp(0.3),
    borderColor: "#ccc",
    borderRadius: 8,
    padding: hp(1),
    marginBottom: hp(2),
    backgroundColor: "#fff",
  },
});
