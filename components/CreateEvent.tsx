import { useAuth } from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { darkTheme, lightTheme } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import * as ImagePicker from "expo-image-picker";
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
    useColorScheme
} from "react-native";


type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: () => void;
}>;

const CLOUDINARY_CLOUD_NAME = "dawsvdfwm"; // From Cloudinary dashboard
const CLOUDINARY_UPLOAD_PRESET = "edubridge-memo"; // Your unsigned preset name
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function CreateEvent({ isVisible, onClose }: Props) {
    const { user, profile } = useAuth();
    const scheme = useColorScheme();
    const theme = scheme === "dark" ? darkTheme : lightTheme;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [image, setImage] = useState<any>(null);


    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission required", "We need gallery access");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"], // ✅ NEW
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };
    useEffect(() => {
        const uploadImage = async () => {
            if (!image) return;

            try {
                // Derive extension/MIME from uri (robust fallback)
                const uriParts = image.uri.split('.');
                const fileExtension = uriParts[uriParts.length - 1]?.toLowerCase() || 'jpg';
                const mimeType = `image/${fileExtension === 'png' ? 'png' : 'jpeg'}`; // Add more types if needed
                const fileName = image.fileName || `memo-${Date.now()}.${fileExtension}`;

                const formData = new FormData();
                formData.append('file', {
                    uri: image.uri,
                    type: mimeType,
                    name: fileName,
                } as any);
                formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

                const response = await fetch(CLOUDINARY_UPLOAD_URL, {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.log('Cloudinary error:', errorText);
                    throw new Error(`Upload failed: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                setImageUrl(data.secure_url);
                console.log('Image uploaded successfully:', data.secure_url); // Debug
            } catch (err) {
                console.error('Upload error:', err);
                Alert.alert("Upload Failed", "Failed to upload image. Try again or proceed without.");
                setImage(null); // Reset on failure
            }
        };

        uploadImage();
    }, [image]);
    const handleCreateEvent = async () => {
        if (!title || !description || !location || !eventDate) {
            Alert.alert("Missing Fields", "Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            await addDoc(collection(db, "events"), {
                title,
                description,
                location,
                eventDate: new Date(eventDate),
                imageUrl,
                createdBy: profile?.id,
                role: user?.role,
                createdAt: serverTimestamp(),
            });

            setTitle("");
            setDescription("");
            setLocation("");
            setEventDate("");

            Alert.alert("Success", "Event created successfully");
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to create event");
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
            <ScrollView
                style={{ flex: 1, backgroundColor: theme.background }}
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="flex-row items-center mb-6">
                    <Ionicons name="calendar-outline" size={24} color={theme.text} />
                    <Text
                        className="text-xl font-bold ml-2"
                        style={{ color: theme.text }}
                    >
                        Create Event
                    </Text>
                </View>

                {/* Title */}
                <View className="mb-4">
                    <Text style={{ color: theme.text }} className="mb-1">
                        Event Title
                    </Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter event title"
                        placeholderTextColor="#9CA3AF"
                        className="border rounded-xl px-4 py-3"
                        style={{ color: theme.text, borderColor: theme.text }}
                    />
                </View>

                {/* Description */}
                <View className="mb-4">
                    <Text style={{ color: theme.text }} className="mb-1">
                        Description
                    </Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Event description"
                        multiline
                        numberOfLines={4}
                        placeholderTextColor="#9CA3AF"
                        className="border rounded-xl px-4 py-3"
                        style={{ color: theme.text, borderColor: theme.text }}
                    />
                </View>

                {/* Location */}
                <View className="mb-4">
                    <Text style={{ color: theme.text }} className="mb-1">
                        Location
                    </Text>
                    <TextInput
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Event location"
                        placeholderTextColor="#9CA3AF"
                        className="border rounded-xl px-4 py-3"
                        style={{ color: theme.text, borderColor: theme.text }}
                    />
                </View>

                {/* Date */}
                <View className="mb-6">
                    <Text style={{ color: theme.text }} className="mb-1">
                        Event Date
                    </Text>
                    <TextInput
                        value={eventDate}
                        onChangeText={setEventDate}
                        placeholder="e.g 25 March 2026 - 10:00 AM"
                        placeholderTextColor="#9CA3AF"
                        className="border rounded-xl px-4 py-3"
                        style={{ color: theme.text, borderColor: theme.text }}
                    />
                </View>

                <Text style={{ color: theme.text }} className="mb-1">
                    Pick Event Image
                </Text>
                <TouchableOpacity
                    onPress={pickImage}
                    className="bg-gray-500 py-3 rounded-xl items-center mb-4"
                >
                    <Text className="text-white">
                        {image ? "Change Image" : "Upload Event Image"}
                    </Text>
                </TouchableOpacity>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleCreateEvent}
                    className="bg-blue-600 py-4 rounded-xl items-center"
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-semibold text-base">
                            Create Event
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </Modal>
    );
};
