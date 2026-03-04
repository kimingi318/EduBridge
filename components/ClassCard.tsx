import { Ionicons } from "@expo/vector-icons";
import * as Linking from 'expo-linking';
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
export type ClassCardRole = "student" | "lecturer";


export interface ClassCardProps {
  id?: string;
  courseTitle: string;
  timePeriod: string;
  lecturerName?: string;
  classLocation?: string;
  startsIn?: string;
  classstatus?: string;
  meetlink?: string;
  role?: ClassCardRole;
  onJoinOnline?: () => void;
  onPresent?: () => void;
  onCancel?: () => void;
  onLate?: () => void;
  isOnline?: () => void;
}


const StatusPill = ({ classstatus }: { classstatus?: string }) => {
  const getColor = () => {
    switch (classstatus) {
      case "ONGOING":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      case "LATE":
        return "bg-orange-500";
      case "ENDED":
        return "bg-gray-400";
      case "ONLINE":
        return "bg-[#1E5EFF]";
    }
  };
  return (
    <View className={`mt-0 `}>
      <View className={`px-3 py-1  rounded-b-2xl ${getColor()}`}>
        <Text className="text-white text-xs font-semibold">{classstatus}</Text>
      </View>
    </View>
  );
};

const OnlineBtn = ({ classstatus, meetlink }:
  { classstatus?: string, meetlink?: string; }) => {
  const getColor = () => {
    if (classstatus === "ONLINE") {
      return "bg-[#1E5EFF]";
    }
    else {
      return "bg-gray-300";
    }
  };
  return (
    <TouchableOpacity
      disabled={!meetlink}
      onPress={() => {
        if (meetlink) Linking.openURL(meetlink);
      }}
      className={`flex-row items-center px-4 py-3 rounded-xl justify-center ${getColor()}  flex-1`} >
      <Ionicons name="videocam" size={18} color={'white'} />
      <Text className={`ml-2 font-semibold text-white`}>Join Online</Text>
    </TouchableOpacity>
  );
};


const ActionButton = ({
  icon,
  label,
  color,
  width,
  onPress }:
  {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
    color: string;
    width: any;
    onPress?: () => void;
  }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={0.7}
    className={`${!onPress ? "bg-gray-400" : color} flex-row py-2 px-1 ${width} rounded-xl items-center justify-center`}  >
    <Ionicons name={icon} size={18} color="white" />
    <Text className="text-white text-sm ml-1">{label}</Text>
  </TouchableOpacity>
);


const ClassCard: React.FC<ClassCardProps> = ({
  courseTitle,
  timePeriod,
  lecturerName,
  classLocation,
  startsIn,
  classstatus,
  meetlink,
  role = "student",
  onJoinOnline,
  onPresent,
  onCancel,
  onLate,
}) => {

  return (
    <View className="bg-white rounded-2xl px-2 pb-4">
      <View className="flex-row justify-between">
        <StatusPill classstatus={classstatus} />
        <Text>{startsIn}</Text>
      </View>
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
      </View>

      {role === "student" ? (
        <Text className="text-gray-600 text-sm">Lecturer: <Text className="font-semibold">{lecturerName || "N/A"}</Text></Text>
      ) : null}

      <View className="flex-row gap-3 mt-3">
        <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl flex-1">
          <Ionicons name="location-outline" size={18} color="#374151" />
          <Text className="ml-2 text-gray-700">{classstatus === "ONLINE" ? "Online Class" : classLocation}</Text>
        </View>
        {role === "student" ? (
          <OnlineBtn classstatus={classstatus} meetlink={meetlink} />) : (
          <ActionButton icon="videocam-outline" width="w-[50%]" label="Online" color="bg-[#1E5EFF]"
            onPress={(classstatus === "ONGOING" || classstatus === "ENDED") ? undefined : onJoinOnline} />
        )}
      </View>

      {role === "lecturer" ? (
        <View className="flex-row justify-between mt-4 w-100">
          <ActionButton icon="checkmark-circle" label="Present" width="w-[30%]" color="bg-green-600"
            onPress={(classstatus === "ONGOING" || classstatus === "ENDED" || classstatus === "ONLINE") ? undefined : onPresent} />
          <ActionButton icon="close-circle" label="Cancel" width="w-[30%]" color="bg-red-600"
            onPress={(classstatus === "ONGOING" || classstatus === "ENDED" || classstatus === "ONLINE") ? undefined : onCancel} />
          <ActionButton icon="time" label="Late" width="w-[30%]" color="bg-orange-500"
            onPress={(classstatus === "ONGOING" || classstatus === "ENDED" || classstatus === "ONLINE") ? undefined : onLate} />
        </View>
      ) : null}
    </View>
  );
};

export default ClassCard;
