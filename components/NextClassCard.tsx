import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface NextClassCardProps {
  title: string;
  time: string;
  room: string;
  level: string;
  isNext?: boolean;
  onPresent?: () => void;
  onCancel?: () => void;
  onLate?: () => void;
}

const StatusButton = ({ icon, label, color, onPress }: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  color: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      className={`${color} flex-row mx-2 py-1 px-1 w-[30%] rounded-xl items-center justify-center`}
    >
      <Ionicons name={icon} size={20} color="white" />
      <Text className="text-white text-xs mt-1">{label}</Text>
    </TouchableOpacity>
  );
};

const NextClassCard: React.FC<NextClassCardProps> = ({
  title,
  time,
  room,
  level,
  isNext = true,
  onPresent,
  onCancel,
  onLate,
}) => {
  return (
    <View className="bg-white p-4 rounded-2xl   shadow">
      {/* Header Row */}
      <View className="flex-row gap-2 mb-2 ">
        {isNext && (
          <Text className="bg-blue-600 text-white px-3 py-1 rounded-b-2xl text-xs">
            NEXT
          </Text>
        )}
        <Ionicons name="videocam" size={20} color="#2563eb" />
      </View>

      {/* Class Info */}
      <View className="flex-row items-center space-x-3 mb-3">
        <View className="bg-blue-100 p-2 mr-2 rounded-xl">
          <Ionicons name="calendar-outline" size={22} color="#1158D8" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold">{title}</Text>
          <Text className="mt-3 font-semibold text-base">{time}</Text>
        </View>
      </View>
      {/* Room and Level */}
      <Text className="text-gray-600 mb-3 text-[14px]">
        Room: {room} · <Text className="font-semibold"> {level}</Text>
      </Text>

      {/* Action Buttons */}
      <View className="flex-row justify-between">
        <StatusButton
          icon="checkmark-circle"
          label="Present"
          color="bg-green-600"
          onPress={onPresent}
        />

        <StatusButton
          icon="close-circle"
          label="Cancel"
          color="bg-red-600"
          onPress={onCancel}
        />

        <StatusButton
          icon="time"
          label="Late"
          color="bg-orange-500"
          onPress={onLate}
        />
      </View>
    </View>
  );
};

export default NextClassCard;
