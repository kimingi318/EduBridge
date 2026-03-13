import AnnouncementCard from "@/components/AnnouncementCard";
import { useAuth } from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { darkTheme, lightTheme } from "@/utils/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import CreateAnnouncement from "./CreateAnnoucement";
import CreateEvent from "./CreateEvent";
import CreateMemo from "./CreateMemo";
import CreateRequest from "./CreateRequest";
import EventCard from "./EventCard";
import MemoCard from "./MemoCard";

type TabType = "alerts" | "announcements" | "requests" | "events" | "memos";

const NotificationsScreen = () => {
    const scheme = useColorScheme();
    const theme = scheme === "dark" ? darkTheme : lightTheme;
    const [activeTab, setActiveTab] = useState<TabType>("alerts");
    const { user, isAuthenticating } = useAuth();  // NEW: Pull isAuthenticating
    const role = user?.role;
    const adminTabs: TabType[] = ["alerts", "announcements", "requests", "events", "memos"];
    const lecturerTabs: TabType[] = ["announcements", "events","memos", "requests" ];
    const studentTabs: TabType[] = ["announcements", "events","memos", "requests"];
    const [isAddAnnouncementModalVisible, setIsAddAnnouncementModalVisible] = useState(false);
    const [isAddMemoModalVisible, setIsAddMemoModalVisible] = useState(false);
    const [isAddRequestModalVisible, setIsAddRequestModalVisible] = useState(false);
    const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [memos, setMemos] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const tabs =
        role === "Admin"
            ? adminTabs
            : role === "Lecturer"
                ? lecturerTabs
                : studentTabs;

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "events"),
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEvents(data);
            }
        );

        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "memos"),
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMemos(data);
            }
        );

        return unsubscribe;
    }, []);

    const filteredMemos = useMemo(() => {
        if (!user) return [];

        if (role === "Admin") return memos;

        return memos.filter(
            (memo) =>
                memo.targetRole === role || memo.targetRole === "Both"
        );
    }, [memos, role, user]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "announcements"),
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAnnouncements(data);
            }
        );

        return unsubscribe;
    }, []);

    const filteredAnnouncements = useMemo(() => {
        if (!user) return [];

        if (role === "Admin") {
            // Admin sees only what he created
            return announcements.filter(
                (a) => a.createdByRole === "Admin"
            );
        }

        if (role === "Lecturer") {
            return announcements.filter((a) =>
                // From Admin to Lecturer
                (a.createdByRole === "Admin" && a.targetRole === "Lecturer") ||

                // Lecturer created for students
                (a.createdByRole === "Lecturer" && a.targetRole === "Student")
            );
        }

        if (role === "Student") {
            return announcements.filter((a) =>
                // Lecturer to Student
                (a.createdByRole === "Lecturer" && a.targetRole === "Student") ||

                // Admin to Student
                (a.createdByRole === "Admin" && a.targetRole === "Student")
            );
        }

        return [];
    }, [announcements, role, user]);

    const showCreateButton = useMemo(() => {
        if (role === "Student") {
            return activeTab === "requests";
        }
        if (role === "Lecturer") {
            return activeTab === "announcements";
        }
        if (role === "Admin") {
            return activeTab !== "alerts";
        }
        return false;
    }, [role, activeTab]);

    // gate the render after hooks so they always run
    if (isAuthenticating === undefined || isAuthenticating) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
                <Text style={{ color: theme.text }}>Loading notifications...</Text>
            </View>
        );
    }

    const handleCreatePress = () => {
        if (activeTab === "events") setIsAddEventModalVisible(true);
        if (activeTab === "announcements") setIsAddAnnouncementModalVisible(true);
        if (activeTab === "requests") setIsAddRequestModalVisible(true);
        if (activeTab === "memos") setIsAddMemoModalVisible(true);
    };


    const renderAlertItem = ({ item }: any) => (
        <View style={{ backgroundColor: theme.card }} className=" rounded-2xl p-4 mb-2 flex-row items-start shadow-sm">

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
                <Text style={{ color: theme.text }} className="font-semibold text-base ">
                    {item.title}
                </Text>
                <Text style={{ color: theme.subText }} className=" text-sm mt-1">
                    {item.description}
                </Text>
            </View>

            {/* Time */}
            <Text style={{ color: theme.subText }} className=" text-sm mt-2">
                {item.time}
            </Text>
        </View>
    );

    return (
        <View style={{ backgroundColor: theme.background }} className="flex-1">
            {/* HEADER */}
            <View style={{ backgroundColor: theme.surface }} className=" px-5 pt-6 pb-4 rounded-b-3xl">
                <View className="flex-row justify-between items-center">
                    <Text className="text-xl font-bold text-gray-900" style={{ color: theme.text }}>
                        Notifications & Events
                    </Text>

                    <Ionicons name="search" size={22} color={theme.text} />
                </View>

                {/* Tabs */}

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-5"
                >
                    <View className="flex-row bg-blue-900 rounded-full p-1">
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-full mr-1 ${activeTab === tab ? "bg-blue-600" : ""
                                    }`}
                            >
                                <Text
                                    className={`capitalize ${activeTab === tab
                                        ? "text-white font-semibold"
                                        : "text-gray-200"
                                        }`}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* CONTENT */}
            <View className="flex-1 px-4 mt-6">
                {activeTab === "alerts" && (
                    <FlatList
                        data={""}
                        keyExtractor={(item) => item}
                        renderItem={renderAlertItem}
                        showsVerticalScrollIndicator={false}
                    />
                )}
                {activeTab === "announcements" && (
                    <FlatList
                        data={filteredAnnouncements}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <AnnouncementCard
                                announcement={item}
                                onEdit={(announcement) => {
                                    console.log("edit", announcement)
                                }}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                )}
                {activeTab === "events" && (
                    <FlatList
                        data={events}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <EventCard
                                memo={item}
                                onEdit={(event) => console.log("edit", event)}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                )}
                {activeTab === "memos" && (
                    <FlatList
                        data={filteredMemos}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <MemoCard
                                memo={item}
                                onEdit={(memo) => console.log("edit", memo)}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                )}


            </View>
            {showCreateButton && (
                <TouchableOpacity
                    onPress={handleCreatePress}
                    style={{
                        position: "absolute",
                        bottom: hp(4),
                        right: wp(4),
                        width: hp(7),
                        height: hp(7),
                        borderRadius: hp(3.5),
                        alignItems: "center",
                        justifyContent: "center",
                        elevation: 6,
                        shadowColor: theme.primary,
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 3 },
                        backgroundColor: theme.primary,
                    }}
                >
                    <AntDesign name="plus" size={26} color={theme.text} />
                </TouchableOpacity>
            )}


            <CreateEvent
                isVisible={isAddEventModalVisible}
                onClose={() => setIsAddEventModalVisible(false)}
            />

            <CreateAnnouncement
                isVisible={isAddAnnouncementModalVisible}
                onClose={() => setIsAddAnnouncementModalVisible(false)}
            />

            <CreateRequest
                isVisible={isAddRequestModalVisible}
                onClose={() => setIsAddRequestModalVisible(false)}
            />

            <CreateMemo
                isVisible={isAddMemoModalVisible}
                onClose={() => setIsAddMemoModalVisible(false)}
            />
        </View>
    );
};

export default NotificationsScreen;