import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { API_BASE_URL, apiFetch } from "../utils/api";
import GradientButton from "./GradientButton";


const AddFaculty = () => {
    const [name, setName] = useState("");
    const [abbv, setAbbv] = useState("");




    const handleSubmitFaculty = async () => {
        try {
            if (!name || !abbv) {
                Alert.alert("Error", "Please fill all fields");
            }
            const res = await apiFetch(`${API_BASE_URL}/api/faculties`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, abbv }),
            });
            if (res.ok) {
                Alert.alert("Success", "Faculty added successfully!");
            }
        } catch (err) {
            console.error(err);
        }

    };



    return (
        <View>
            <ImageBackground
                source={require("../assets/images/admin-signup-img.jpg")}
                className=" w-full"
                resizeMode="cover"
                style={{ height: hp(40) }}>
                <StatusBar style="light" />
                <View style={{ height: hp(6), marginTop: hp(10), paddingLeft: wp(2) }} >
                    <Text style={{ fontSize: hp(4), fontWeight: 'bold' }}
                        className="text-white">Manage Academics</Text>
                </View>
                <View style={styles.container}>
                    {/* Faculty Section*/}
                    <View className="flex-row items-center " style={{ gap: wp(1) }}>
                        <FontAwesome name="university" size={24} color="#1E5EFF" />
                        <Text style={styles.header}>Add Faculty</Text>
                    </View>
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
                    <GradientButton onPress={handleSubmitFaculty} title="Add Faculty" />
                </View>
            </ImageBackground>
    </View>
    );
};

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
        marginBottom:hp(1),
        backgroundColor: "#fff",
    },
});

export default AddFaculty;
