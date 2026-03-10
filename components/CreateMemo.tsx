import { useAuth } from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { darkTheme, lightTheme } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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
  useColorScheme,
} from "react-native";


// Cloudinary config constants (replace with your actual values)
const CLOUDINARY_CLOUD_NAME = "dawsvdfwm"; // From Cloudinary dashboard
const CLOUDINARY_UPLOAD_PRESET = "edubridge-memo"; // Your unsigned preset name
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function CreateMemo({ isVisible, onClose }: Props) {
  const { profile } = useAuth();
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [targetRole, setTargetRole] = useState<"Lecturer" | "Student" | "Both">("Student")
  const [imageUrl, setImageUrl] = useState("");


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

  const handleCreateMemo = async () => {
    if (!title || !message) {
      Alert.alert("Missing Fields", "Please fill all fields");
      return;
    }
    try {
      setLoading(true);

      await addDoc(collection(db, "memos"), {
        title,
        message,
        imageUrl,
        targetRole,
        createdBy: profile?.id,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setMessage("");
      setImage(null);

      Alert.alert("Success", "Memo created successfully");
      onClose();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to create memo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />

      <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: 20 }}>
        <View className="flex-row items-center mb-6">
          <Ionicons name="document-text-outline" size={24} color={theme.text} />
          <Text className="text-xl font-bold ml-2" style={{ color: theme.text }}>
            Create Memo
          </Text>
        </View>

        <Text style={{ color: theme.text }}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          className="border rounded-xl px-4 py-3 mb-4"
          style={{ color: theme.text, borderColor: theme.text }}
        />

        <Text style={{ color: theme.text }}>Message</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
          className="border rounded-xl px-4 py-3 mb-6"
          style={{ color: theme.text, borderColor: theme.text }}
        />
        <Text style={{ color: theme.text }}>Send To</Text>
        <View className="flex-row mb-4">
          {["Lecturer", "Student", "Both"].map((roleOption) => (
            <TouchableOpacity
              key={roleOption}
              onPress={() => setTargetRole(roleOption as any)}
              className={`px-4 py-2 rounded-full mr-2 ${targetRole === roleOption ? "bg-blue-600" : "bg-gray-300"
                }`}
            >
              <Text className="text-white">{roleOption}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={pickImage}
          className="bg-gray-500 py-3 rounded-xl items-center mb-4"
        >
          <Text className="text-white">
            {image ? "Change Image" : "Upload Memo Image"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCreateMemo} className="bg-blue-600 py-4 rounded-xl items-center">
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white">Create Memo</Text>}
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}