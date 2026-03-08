import { useAuth } from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { darkTheme, lightTheme } from "@/utils/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { deleteDoc, doc } from "firebase/firestore";
import { Alert, Text, TouchableOpacity, useColorScheme, View } from "react-native";

type Announcement = {
  id: string;
  title: string;
  message: string;
  unitName?: string;
  createdBy: string;
  creatorName?: string;
  creatorRole?: string;
  createdAt?: any;
};

type Props = {
  announcement: Announcement;
  onEdit?: (announcement: Announcement) => void;
};

const AnnouncementCard = ({ announcement, onEdit }: Props) => {
  const { profile } = useAuth();
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  const isOwner = profile?.uid === announcement.createdBy;

  const handleDelete = async () => {
    Alert.alert("Delete", "Are you sure you want to delete this announcement?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "announcements", announcement.id));
        },
      },
    ]);
  };

  const formattedTime = announcement.createdAt?.toDate
    ? announcement.createdAt.toDate().toLocaleString()
    : "";

  return (
    <View
      style={{ backgroundColor: theme.card }}
      className="rounded-2xl p-4 mb-3 shadow-sm"
    >
      {/* HEADER */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text
            style={{ color: theme.text }}
            className="font-bold text-base"
          >
            {announcement.title}
          </Text>

          {announcement.unitName && (
            <Text style={{ color: theme.primary }} className="text-sm mt-1">
              {announcement.unitName}
            </Text>
          )}
        </View>

        {/* EDIT & DELETE (Only Owner) */}
        {isOwner && (
          <View className="flex-row">
            <TouchableOpacity onPress={() => onEdit?.(announcement)}>
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

      {/* MESSAGE */}
      <Text
        style={{ color: theme.subText }}
        className="mt-3 text-sm leading-5"
      >
        {announcement.message}
      </Text>

      {/* FOOTER */}
      <View className="flex-row justify-between items-center mt-4">
        <Text style={{ color: theme.subText }} className="text-xs">
          {announcement.creatorRole === "Admin"
            ? "Admin"
            : announcement.creatorName}
        </Text>

        <Text style={{ color: theme.subText }} className="text-xs">
          {formattedTime}
        </Text>
      </View>
    </View>
  );
};

export default AnnouncementCard;