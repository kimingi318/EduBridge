import { useAuth } from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { darkTheme, lightTheme } from "@/utils/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import {
    Alert,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

type Memo = {
  id: string;
  title: string;
  message: string;
  createdBy: string;
  createdAt: any;
  targetRole: string;
  imageUrl: string;
};

type Props = {
  memo: Memo;
  onEdit: (memo: Memo) => void;
};

const MemoCard = ({ memo, onEdit }: Props) => {
  const { profile } = useAuth();
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const [modalVisible, setModalVisible] = useState(false);

  const isAdmin = profile?.role === "Admin";

  const handleDelete = async () => {
    Alert.alert("Delete", "Are you sure you want to delete this memo?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "memos", memo.id));
        },
      },
    ]);
  };

  return (
    <>
      <View
        style={{
          backgroundColor: theme.card,
          padding: hp(1.5),
          marginBottom: hp(1),
        }}
        className="rounded-2xl flex-row items-center shadow-sm"
      >
        {/* IMAGE AREA */}
        {memo.imageUrl ? (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{ uri: memo.imageUrl }}
              style={{
                width: hp(8),
                height: hp(8),
                borderRadius: 12,
                marginRight: hp(1.5),
              }}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: hp(8),
              height: hp(8),
              borderRadius: 12,
              backgroundColor: theme.surface,
              justifyContent: "center",
              alignItems: "center",
              marginRight: hp(1.5),
            }}
          >
            <MaterialIcons
              name="image-not-supported"
              size={22}
              color={theme.subText}
            />
          </View>
        )}

        {/* TEXT CONTENT */}
        <View className="flex-1">
          <Text style={{ color: theme.text }} className="font-bold">
            {memo.title}
          </Text>
          <Text
            style={{ color: theme.subText }}
            className="text-sm"
            numberOfLines={2}
          >
            {memo.message}
          </Text>
        </View>

        {/* ADMIN ACTIONS */}
        {isAdmin && (
          <View className="flex-row ml-2">
            <TouchableOpacity onPress={() => onEdit?.(memo)}>
              <MaterialIcons
                name="edit"
                size={22}
                color={theme.primary}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDelete}>
              <MaterialIcons name="delete" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* FULLSCREEN IMAGE MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={{ uri: memo.imageUrl }}
            style={styles.fullImage}
          />
        </Pressable>
      </Modal>
    </>
  );
};

export default MemoCard;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
});