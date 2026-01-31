import { apiFetch } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import React, { PropsWithChildren, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import GradientButton from './GradientButton';
import ImageViewer from './ImageViewer';


type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: () => void;
}>;

export default function Profile({ isVisible, children, onClose }: Props) {
    const [fullName, setFullName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [courseName, setCourseName] = useState<string>('');
    const [level, setLevel] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const placeholder = require('@/assets/images/camera.jpg')

    

      const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
          const uri = result.assets[0].uri;
          setSelectedImage(uri);
    
          await apiFetch("/api/profiles", {
            method: "POST",
            body: JSON.stringify({
              name : fullName,
              username: userName,
              course: courseName,
              level: level,
              phone: phoneNumber,
              profileImage: uri,
            }),
          });
        }
      };

    const handleSaveProfile = () => {

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
            <View style={{
                height: hp(80),
                width: wp(94),
                marginHorizontal: wp(3),
                marginVertical: hp(10),
                padding: hp(1)
            }}
                className='bg-gray-100 rounded-[20px]'>
                {/* Header */}
                <View className="items-center mb-4">
                    <View className="bg-blue-100 p-3 rounded-full mb-2">
                        <Ionicons name="person-circle-outline" size={80} color="#1E40FF" />
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
                        <Text style={{ fontSize: hp(3) ,fontWeight:'bold'}}
                        className="text-black  mt-1">
                            Tap
                        </Text>
                        <Text style={{ fontSize: hp(2) ,fontWeight:'semibold'}}
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
                    placeholder='Course of Study'
                    value={courseName}
                    onChangeText={setCourseName}
                    style={styles.inputs}
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
        height: hp(6)
    }
})