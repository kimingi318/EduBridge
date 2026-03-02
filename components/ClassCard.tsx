import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
export type ClassCardRole = "student" | "lecturer";
export type ScheduleStatus = "NEXT" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface ClassCardProps {
  id?: string;
  courseTitle: string;
  timePeriod: string;
  lecturerName?: string;
  classLocation?: string;
  isOnline?: boolean;
  startsIn?: string;
  status?: ScheduleStatus | string;
  role?: ClassCardRole;
  onJoinOnline?: () => void;
  onPresent?: () => void;
  onCancel?: () => void;
  onLate?: () => void;
}

const StatusPill = ({ status }: { status?: string }) => (
  <View
    className={`px-3 py-1 rounded-b-2xl ${status === "CANCELLED" ? "bg-red-100" : "bg-[#22C55E]"}`}>
    <Text className={`${status === "CANCELLED" ? "text-red-600" : "text-white"} text-xs font-semibold`}>
      {status || "NEXT"}
    </Text>
  </View>
);

const ActionButton = ({ icon, label, color, onPress }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; color: string; onPress?: () => void; }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} className={`${color} flex-row mx-2 py-2 px-3 rounded-xl items-center justify-center`}>
    <Ionicons name={icon} size={18} color="white" />
    <Text className="text-white text-sm ml-2">{label}</Text>
  </TouchableOpacity>
);

const ClassCard: React.FC<ClassCardProps> = ({
  courseTitle,
  timePeriod,
  lecturerName,
  classLocation,
  isOnline = false,
  startsIn,
  status = "NEXT",
  role = "student",
  onJoinOnline,
  onPresent,
  onCancel,
  onLate,
}) => {
  const isJoinDisabled = !isOnline || status === "CANCELLED";

  return (
    <View className="bg-white rounded-2xl px-4 pb-4 shadow-md">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          <View className="bg-blue-100 p-2 rounded-xl">
            <Ionicons name="calendar-outline" size={20} color="#1158D8" />
          </View>
          <View>
            <Text className="font-bold text-lg">{courseTitle}</Text>
            <Text className="text-gray-500 text-sm">{timePeriod}</Text>
          </View>
        </View>
        <StatusPill status={String(status)} />
      </View>

      {lecturerName ? (
        <Text className="text-gray-600 mb-3 text-sm">Lecturer: <Text className="font-semibold">{lecturerName}</Text></Text>
      ) : null}

      {role === "lecturer" ? (
        <View className="flex-row justify-between">
          <ActionButton icon="checkmark-circle" label="Present" color="bg-green-600" onPress={onPresent} />
          <ActionButton icon="close-circle" label="Cancel" color="bg-red-600" onPress={onCancel} />
          <ActionButton icon="time" label="Late" color="bg-orange-500" onPress={onLate} />
        </View>
      ) : (
        <View className="flex-row gap-3">
          <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl flex-1">
            <Ionicons name="location-outline" size={18} color="#374151" />
            <Text className="ml-2 text-gray-700">{isOnline ? "Online Class" : classLocation}</Text>
          </View>
          <TouchableOpacity
            disabled={isJoinDisabled}
            onPress={onJoinOnline}
            className={`flex-row items-center px-4 py-3 rounded-xl justify-center ${isJoinDisabled ? "bg-gray-300" : "bg-[#1E5EFF]"} flex-1`}
          >
            <Ionicons name="videocam-outline" size={18} color={isJoinDisabled ? "#9CA3AF" : "white"} />
            <Text className={`ml-2 font-semibold ${isJoinDisabled ? "text-gray-500" : "text-white"}`}>Join Online</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ClassCard;
