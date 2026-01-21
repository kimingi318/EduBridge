import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type ScheduleStatus = "NEXT" | "ONGOING" | "COMPLETED" | "CANCELLED";

interface ScheduleCardProps {
  courseTitle: string;
  timePeriod: string;
  lecturerName: string;
  classLocation: string;
  isOnline: boolean;
  startsIn?: string;
  status?: ScheduleStatus;
  onJoinOnline?: () => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  courseTitle,
  timePeriod,
  lecturerName,
  classLocation,
  isOnline,
  startsIn,
  status = "NEXT",
  onJoinOnline,
}) => {
  const isJoinDisabled = !isOnline || status === "CANCELLED";

  return (
    <View className="bg-white rounded-2xl px-4 pb-2 shadow-md">
      {/* STATUS ROW */}
      <View className="flex-row gap-6  mb-2">
        <View
          className={`px-3 py-1 rounded-b-2xl
            ${status === "CANCELLED" ? "bg-red-100" : "bg-[#22C55E]"}
          `}
        >
          <Text
            className={`text-xs font-semibold
              ${status === "CANCELLED" ? "text-red-600" : "text-white"}
            `}
          >
            {status}
          </Text>
        </View>

        {startsIn && status !== "CANCELLED" && (
          <Text className="text-green-600 text-lg">Starts in {startsIn}</Text>
        )}
      </View>

      {/* COURSE INFO */}
      <View className="flex-row items-center space-x-3 mb-3">
        <View className="bg-blue-100 p-2 mr-2 rounded-xl">
          <Ionicons name="calendar-outline" size={22} color="#1158D8" />
        </View>

        <View className="flex-1">
          <Text className="font-bold text-[16px]">{courseTitle}</Text>
          <Text className="text-gray-500 text-[14px]">{timePeriod}</Text>
        </View>
      </View>

      {/* LECTURER */}
      <Text className="text-gray-600 mb-3 text-[14px]">
        Lecturer: <Text className="font-semibold">{lecturerName}</Text>
      </Text>

      {/* ACTIONS */}
      <View className="flex-row gap-2">
        {/* LOCATION / ONLINE */}
        <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl flex-1">
          <Ionicons name="location-outline" size={18} color="#374151" />
          <Text className="ml-2 text-gray-700">
            {isOnline ? "Online Class" : classLocation}
          </Text>
        </View>

        {/* JOIN ONLINE */}
        <TouchableOpacity
          disabled={isJoinDisabled}
          onPress={onJoinOnline}
          className={`flex-row items-center px-4 py-3 rounded-xl flex-1 justify-center
            ${isJoinDisabled ? "bg-gray-300" : "bg-[#1E5EFF]"}
          `}
        >
          <Ionicons
            name="videocam-outline"
            size={18}
            color={isJoinDisabled ? "#9CA3AF" : "white"}
          />
          <Text
            className={`ml-2 font-semibold
              ${isJoinDisabled ? "text-gray-500" : "text-white"}
            `}
          >
            Join Online
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScheduleCard;
