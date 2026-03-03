import { Ionicons } from "@expo/vector-icons";
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
      case "COMPLETED":
        return "bg-gray-500";
      default:
        return "bg-blue-500"; // NEXT
    }
  };
  return(
    <View className={`px-3 py-1 rounded-b-2xl ${getColor()}`}>
      <Text className="text-white text-xs font-semibold">{classstatus}</Text>
    </View>
  );};

const OnlineBtn = ({ classstatus }: { classstatus?: string }) => {
  const getColor = () => {
    if (classstatus === "ONLINE"){
      return "bg-[#1E5EFF]";
    }
    else{
      return "bg-gray-300";
    }

  };
  return(
      <TouchableOpacity
          className={`flex-row items-center px-4 py-3 rounded-xl justify-center ${getColor()}  flex-1`} >
            <Ionicons name="videocam" size={18} color={'white'} />
            <Text className={`ml-2 font-semibold text-white`}>Join Online</Text>
      </TouchableOpacity>
  );};


const ActionButton = ({ icon, label, color, onPress }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; color: string; onPress?: () => void; }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} className={`${color} flex-row  py-2 px-1 w-20 rounded-xl items-center justify-center`}>
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

      {lecturerName ? (
        <Text className="text-gray-600 mb-3 text-sm">Lecturer: <Text className="font-semibold">{lecturerName}</Text></Text>
      ) : null}

      {role === "lecturer" ? (
        <View  className="flex-row  justify-between">
          <ActionButton icon="checkmark-circle" label="Present" color="bg-green-600" onPress={onPresent} />
          <ActionButton icon="close-circle" label="Cancel" color="bg-red-600" onPress={onCancel} />
          <ActionButton icon="time" label="Late" color="bg-orange-500" onPress={onLate} />
          <ActionButton icon="videocam-outline" label="Online" color="bg-[#1E5EFF]" onPress={onJoinOnline} />
        </View>
      ) : (
        <View className="flex-row gap-3">
          <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl flex-1">
            <Ionicons name="location-outline" size={18} color="#374151" />
            <Text className="ml-2 text-gray-700">{ classLocation}</Text>
          </View>
          <OnlineBtn classstatus={classstatus} />
        </View>
      )}
    </View>
  );
};

export default ClassCard;
