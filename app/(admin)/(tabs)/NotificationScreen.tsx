import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type TabType = "alerts" | "requests" | "events" | "memos";

const NotificationsScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>("alerts");

  const alertsData = [
    {
      id: "1",
      title: "Server memory is over limit",
      description: "Available memory limit is below 5%",
      time: "Yesterday",
      type: "error",
    },
    {
      id: "2",
      title: "Reported Account",
      description: "Reported: critics reports",
      time: "Yesterday",
      type: "warning",
    },
    {
      id: "3",
      title: "Reported Account",
      description: "Reported: critics reports",
      time: "2 days ago",
      type: "warning",
    },
  ];

  const renderAlertItem = ({ item }: any) => (
    <View className="bg-white rounded-2xl p-4 mb-2 flex-row items-start shadow-sm">
      
      {/* Icon */}
      <View className="mr-3 mt-1">
        {item.type === "error" ? (
          <MaterialIcons name="error" size={26} color="#EF4444" />
        ) : (
          <Ionicons name="warning" size={24} color="#F59E0B" />
        )}
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="font-semibold text-base text-gray-800">
          {item.title}
        </Text>
        <Text className="text-gray-500 text-sm mt-1">
          {item.description}
        </Text>
      </View>

      {/* Time */}
      <Text className="text-gray-400 text-xs ml-2">
        {item.time}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
            <StatusBar style="dark" />

      {/* HEADER */}
      <View className="bg-white px-5 pt-6 pb-4 rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold text-gray-800">
            Notifications & Events
          </Text>

          <Ionicons name="search" size={22} color="#1F2937" />
        </View>

        {/* Tabs */}
        <View className="flex-row mt-5 bg-blue-900 rounded-full p-1">
          {["alerts", "requests", "events", "memos"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as TabType)}
              className={`flex-1 py-2 rounded-full ${
                activeTab === tab ? "bg-blue-600" : ""
              }`}
            >
              <Text
                className={`text-center capitalize ${
                  activeTab === tab
                    ? "text-white font-semibold"
                    : "text-gray-200"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* CONTENT */}
      <View className="flex-1 px-4 mt-6">
        {activeTab === "alerts" && (
          <FlatList
            data={alertsData}
            keyExtractor={(item) => item.id}
            renderItem={renderAlertItem}
            showsVerticalScrollIndicator={false}
          />
        )}

        {activeTab === "requests" && (
          <View className="items-center mt-10">
            <Text className="text-gray-500">
              No Requests Yet
            </Text>
          </View>
        )}

        {activeTab === "events" && (
          <View className="items-center mt-10">
            <Text className="text-gray-500">
              No Events Yet
            </Text>
          </View>
        )}

        {activeTab === "memos" && (
          <View className="items-center mt-10">
            <Text className="text-gray-500">
              No Memos Yet
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default NotificationsScreen;


