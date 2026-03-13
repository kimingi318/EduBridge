import { db } from '@/firebaseConfig';
import { darkTheme, lightTheme } from '@/utils/colors';
import { getRoomId } from '@/utils/common';
import { formatMessageTime } from '@/utils/timestamp';
import { collection, doc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import ProfileAvatar from './ProfileAvatar';

interface Message {
    userId: string;
    text: string;
    profileUrl?: string;
    senderName?: string;
    createdAt?:string;
}

export default function ChatItem({ item, router, noBorder, currentUser }: any) {
    const scheme = useColorScheme();
    const theme = scheme === "dark" ? darkTheme : lightTheme;
    const [lastMessage, setLastMessage] = useState<Message | null>(null)

    useEffect(() => {
        let roomId = getRoomId(currentUser?.uid, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messageRef = collection(docRef, "messages");
        const q = query(messageRef, orderBy('createdAt', 'desc'), limit(1));

        let unsub = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const message = snapshot.docs[0].data() as Message;
                setLastMessage(message);
            } else {
                setLastMessage(null);
            }
        });

        return unsub;

    }, [currentUser?.uid, item?.userId])

    const openChatRoom = () => {
        router.push({ pathname: '/(shared)/chatRoom', params: { userData: JSON.stringify(item) } });
    }

    return (
        <TouchableOpacity onPress={openChatRoom} style={{ padding: hp(1), borderRadius: hp(2), backgroundColor: theme.surface }}
            className={`flex-row justify-between mx-1 items-center gap-3 mb-2`}>
            <ProfileAvatar
                imageUri={item?.profile_image}
                fallbackImage={require("../assets/images/profileimg.jpg")}
                size={5}
            />
            <View className='flex-1 gap-1'>
                <View className='flex-row justify-between'>
                    <Text style={{ fontSize: hp(1.8), color: theme.text }} className='font-semibold'>{item?.name}</Text>
                    <Text style={{ fontSize: hp(1.6), color: theme.subText }} className="text-right mt-1 opacity-70">{formatMessageTime(lastMessage?.createdAt)}</Text>
                </View>
                <Text style={{ fontSize: hp(1.6), color: theme.subText }}
                    className='font-medium'
                    numberOfLines={1}
                >{lastMessage?.text? lastMessage?.userId === currentUser?.uid
                    ? `You: ${lastMessage?.text}`
                    : lastMessage?.text : "Start a Conversation"}</Text>
            </View>
        </TouchableOpacity>
    )
}



