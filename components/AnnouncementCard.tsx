import { useAuth } from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { API_BASE_URL, apiFetch } from "@/utils/api";
import { darkTheme, lightTheme } from "@/utils/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

type Announcement = {
  id: string;
  title: string;
  message: string;
  unitName?: string;
  createdBy: string;
  creatorName?: string;
  createdByRole?: string;
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
  const [creatorName, setCreatorName] = useState("");
  const isOwner = profile?.id === announcement.createdBy;

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
  useEffect(() => {
    const getCreatorName = async () => {
      try {
        const res = await apiFetch(`${API_BASE_URL}/api/profiles/by-id/${announcement.createdBy}`, {
          method: 'GET',
        });
        if (res.ok) {
          const data = await res.json();
          setCreatorName(data.name)
        }
      }
      catch (err) {
        console.error(err)
      }
    }
    getCreatorName();
  }, [announcement.createdBy])

  const getAnnouncementIcon = (title: string) => {
    switch (title) {
      case "Sit-In CAT":
        return "assignment";
      case "Assignment Submission":
        return "upload-file";
      case "Make-Up Class":
        return "event-repeat";
      case "Student Result Submission":
        return "grading";
      case "Lecturer Meeting":
        return "groups";
      default:
        return "campaign"; // fallback icon
    }
  };
  const iconName = getAnnouncementIcon(announcement.title);

  return (
    <View
      style={{ backgroundColor: theme.card, height: hp(10), padding: hp(1), marginBottom: hp(1) }}
      className="rounded-2xl flex-row items-center shadow-sm"
    >
      <View style={{ backgroundColor: theme.surface }} className="p-1.5 rounded-lg">
        <MaterialIcons name={iconName as any} size={24} color={theme.primary} />
      </View>
      {/* HEADER */}
      <View style={{ marginLeft: hp(2) }} className='flex-1'>
        <Text style={{ color: theme.text }} className="font-bold" >{announcement.title}</Text>
        {announcement.unitName && (
          <Text style={{ color: theme.primary }} className="text-sm">
            {announcement.unitName} </Text>)}
        <Text style={{ color: theme.subText }} className=" text-sm leading-5" >
          {announcement.message}
        </Text>
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


      {(announcement.createdBy !== profile?.id) && (
        <View className="flex-row justify-between items-center mt-4">
          <Text style={{ color: theme.subText }} className="text-xs">
            {announcement.createdByRole === "Admin"
              ? "Admin"
              : creatorName}
          </Text>
        </View>
      )}

    </View>
  );
};

export default AnnouncementCard;