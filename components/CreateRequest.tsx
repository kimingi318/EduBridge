import { useAuth } from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { darkTheme, lightTheme } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { PropsWithChildren, useState } from "react";
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

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function CreateRequest({ isVisible, onClose }: Props) {
  const { user } = useAuth();
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateRequest = async () => {
    if (!title || !description) {
      Alert.alert("Missing Fields", "Fill all fields");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "requests"), {
        title,
        description,
        senderId: user?.uid,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");

      Alert.alert("Success", "Request submitted");
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />

      <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: 20 }}>
        <View className="flex-row items-center mb-6">
          <Ionicons name="send-outline" size={24} color={theme.text} />
          <Text className="text-xl font-bold ml-2" style={{ color: theme.text }}>
            Create Request
          </Text>
        </View>

        <Text style={{ color: theme.text }}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          className="border rounded-xl px-4 py-3 mb-4"
          style={{ color: theme.text, borderColor: theme.text }}
        />

        <Text style={{ color: theme.text }}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          className="border rounded-xl px-4 py-3 mb-6"
          style={{ color: theme.text, borderColor: theme.text }}
        />

        <TouchableOpacity onPress={handleCreateRequest} className="bg-blue-600 py-4 rounded-xl items-center">
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white">Submit Request</Text>}
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}