import { useAuth } from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { darkTheme, lightTheme } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from 'expo-blur';
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { PropsWithChildren, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
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

const CLOUDINARY_CLOUD_NAME = "dawsvdfwm";
const CLOUDINARY_UPLOAD_PRESET = "edubridge-memo";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function CreateEvent({ isVisible, onClose }: Props) {
    const { user, profile } = useAuth();
    const scheme = useColorScheme();
    const theme = scheme === "dark" ? darkTheme : lightTheme;

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [eventDate, setEventDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false); const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<any>(null);


    const onChangeDate = (_event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setEventDate(selectedDate);
        }
    };


    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission required", "We need gallery access");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"], 
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };
    const handleCreateEvent = async () => {
        if (!title || !description || !location || !eventDate || !category) {
            Alert.alert("Missing Fields", "Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            let uploadedImageUrl = "";

            if (image) {
                const uriParts = image.uri.split(".");
                const fileExtension = uriParts[uriParts.length - 1] || "jpg";

                const formData = new FormData();

                formData.append("file", {
                    uri: image.uri,
                    type: `image/${fileExtension}`,
                    name: `event-${Date.now()}.${fileExtension}`,
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
                    throw new Error("Image upload failed");
                }

                const data = await response.json();
                uploadedImageUrl = data.secure_url;
            }

            await addDoc(collection(db, "events"), {
                title,
                description,
                location,
                category,
                eventDate,
                imageUrl: uploadedImageUrl,
                createdBy: profile?.id,
                role: user?.role,
                createdAt: serverTimestamp(),
            });

            setTitle("");
            setDescription("");
            setLocation("");
            setEventDate(null);
            setCategory("");
            setImage(null);

            Alert.alert("Success", "Event created successfully");
            onClose();

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
                <View className="flex-row mb-4">
                    {["Academic", "Social"].map((CategoryOption) => (
                        <TouchableOpacity
                            key={CategoryOption}
                            onPress={() => setCategory(CategoryOption as any)}
                            className={`px-4 py-2 rounded-full mr-2 ${category === CategoryOption ? "bg-blue-600" : "bg-gray-300"
                                }`}
                        >
                            <Text className="text-white">{CategoryOption}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
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
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        className="border rounded-xl px-4 py-3"
                        style={{ borderColor: theme.text }}
                    >
                        <Text style={{ color: eventDate ? theme.text : "#9CA3AF" }}>
                            {eventDate
                                ? eventDate.toDateString()
                                : "Select Event Date"}
                        </Text>
                    </TouchableOpacity>
                </View>
                {showDatePicker && (
                    <DateTimePicker
                        value={eventDate || new Date()}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        onChange={onChangeDate}
                    />
                )}

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
                {image && (
                    <Image
                        source={{ uri: image.uri }}
                        style={{ height: 150, borderRadius: 10, marginBottom: 10 }}
                    />
                )}

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
                            {loading ? "Creating Event..." : "Create Event"}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </Modal>
    );
};
