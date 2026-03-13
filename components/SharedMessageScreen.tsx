import { useAuth } from "@/context/authContext";
import { usersRef } from "@/firebaseConfig";
import { API_BASE_URL, apiFetch } from "@/utils/api";
import { darkTheme, lightTheme } from "@/utils/colors";
import { getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, View, useColorScheme } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import ChatList from "./ChatList";
import ProfileAvatar from "./ProfileAvatar";
import Loading from "./loading";

const MessageScreen = () => {
    const { profile, user } = useAuth();
    const [users, setUsers] = useState<any[]>([])
    const scheme = useColorScheme();
    const theme = scheme === "dark" ? darkTheme : lightTheme;

    useEffect(() => {
        if (user?.uid)
            getUsers();
    }, [user?.uid])
    const getUsers = async () => {
        //fetsh users
        const q = query(usersRef, where('userId', '!=', user?.uid));
        const querySnapshot = await getDocs(q);
        
        const basicUsers = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // 2. Enrich with MySQL profile data
        const enrichedUsers = await Promise.all(
            basicUsers.map(async (basic: any) => {
                try {
                    const res = await apiFetch(`${API_BASE_URL}/api/profiles/${basic?.userId}`);
                    if (res.ok) {
                        const profiless = await res.json();
                        const profiles = profiless?.[0];
                        return {
                            ...basic,
                            ...profiles,
                             mysqlId: profiles?.id,           
                            fullName: profiles?.name
                        };
                           
                    }
                } catch (err) {
                    console.warn(`Failed to enrich user`, err);
                }
                return basic; 
            })
        );
        setUsers(enrichedUsers);
    }

    return (
        <View style={{ backgroundColor: theme.background, flex: 1 }}>
            <View
                style={{ backgroundColor: theme.surface }}
                className="px-5 pt-6 pb-4 rounded-b-3xl "
            >
                <View className="flex-row justify-between items-center">
                    <Text
                        style={{ fontSize: hp(3), color: theme.text }}
                        className="font-semibold  align-center"
                    >
                        Messages
                    </Text>
                    <ProfileAvatar
                        imageUri={profile?.profile_image}
                        fallbackImage={require("../assets/images/profileimg.jpg")}
                        size={5}
                    />
                </View>
            </View>
            <View className="flex-1 ">
                {users.length > 0 ? (
                    <ChatList currentUser={user} users={users} />
                ) : (
                    <View style={{ top: hp(30) }} className="flex items-center">
                        <Loading size={hp(10)} />
                    </View>
                )}
            </View>
        </View>
    )
}

export default MessageScreen

