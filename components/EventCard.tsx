import { useAuth } from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { darkTheme, lightTheme } from "@/utils/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { deleteDoc, doc } from "firebase/firestore";
import { useMemo } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: any;
  imageUrl: string;
  createdBy: string;
  createdAt: any;
};

type Props = {
  memo: Event; // you passed memo={item}, keeping it consistent
  onEdit: (event: Event) => void;
};

const EventCard = ({ memo: event, onEdit }: Props) => {
  const { profile } = useAuth();
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  const isAdmin = profile?.role === "Admin";
  const getEventDate = () => {
    if (!event.eventDate) return null;

    // Firestore Timestamp
    if (event.eventDate?.toDate) {
      return event.eventDate.toDate();
    }

    // Already Date
    if (event.eventDate instanceof Date) {
      return event.eventDate;
    }

    // String
    return new Date(event.eventDate);
  };

  // 🔥 Format Date Display
  const formattedDate = useMemo(() => {
    const date = getEventDate();
    if (!date) return "";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "2-digit",
      month: "short",
    };
    return date.toLocaleDateString("en-US", options).toUpperCase();
  }, [event.eventDate]);

  // 🔥 Check if Event Ended
  const isEnded = useMemo(() => {
    const date = getEventDate();
    if (!date) return false;
    return date < new Date();

  }, [event.eventDate]);

  const handleDelete = async () => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "events", event.id));
        },
      },
    ]);
  };

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: hp(2),
      }}
    >
      {/*  EVENT IMAGE */}
      {event.imageUrl ? (
        <Image
          source={{ uri: event.imageUrl }}
          style={{
            width: "100%",
            height: hp(20),
          }}
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: hp(20),
            backgroundColor: theme.surface,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="image-outline" size={40} color={theme.subText} />
        </View>
      )}

      {/*  CONTENT */}
      <View style={{ padding: hp(2) }}>
        {/* DATE */}
        <Text
          style={{
            color: "#10B981",
            fontWeight: "600",
            marginBottom: 6,
          }}
        >
          {formattedDate}
        </Text>

        {/* TITLE */}
        <Text
          style={{
            color: theme.text,
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 4,
          }}
        >
          {event.title}
        </Text>

        {/* TIME */}
        <View className="flex-row items-center mb-1">
          <Ionicons name="time-outline" size={16} color={theme.subText} />
          <Text
            style={{ color: theme.subText, marginLeft: 6 }}
          >
            {getEventDate()?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {/* LOCATION */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={16} color={theme.subText} />
          <Text
            style={{ color: theme.subText, marginLeft: 6 }}
          >
            {event.location}
          </Text>
        </View>

        {/* STATUS + ADMIN ACTIONS */}
        <View className="flex-row justify-between items-center mt-2">
          {/* Status Pill */}
          <View
            style={{
              backgroundColor: isEnded ? "#E5E7EB" : "#DCFCE7",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: isEnded ? "#6B7280" : "#16A34A",
                fontWeight: "600",
                fontSize: 12,
              }}
            >
              {isEnded ? "Ended" : "Upcoming"}
            </Text>
          </View>

          {/* Admin Buttons */}
          {isAdmin && (
            <View className="flex-row">
              <TouchableOpacity onPress={() => onEdit(event)}>
                <MaterialIcons
                  name="edit"
                  size={22}
                  color={theme.primary}
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete}>
                <MaterialIcons name="delete" size={22} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default EventCard;