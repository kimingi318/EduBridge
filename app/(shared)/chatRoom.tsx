import CustomKeyBoardView from "@/components/customKeyBoardView";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useAuth } from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { darkTheme, lightTheme } from "@/utils/colors";
import { getRoomId } from "@/utils/common";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Alert, ImageBackground, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

interface ChatUser {
  userId: string;
  name?: string;
  fullName?: string;
  profile_image?: string;
  role?: string;
}
interface Message {
  userId: string;
  text: string;
  profileUrl?: string;
  senderName?: string;
  createdAt: Timestamp;
}

export default function ChatRoom() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const { userData } = useLocalSearchParams();
  const item: ChatUser = userData ? JSON.parse(userData as string) : {};
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const { user, profile } = useAuth();
  const role = user?.role?.toLowerCase()
  const messagesRoute = `/(${role})/(tabs)/MessageScreen`;
  const goBackToMessages = () => {
    router.replace(messagesRoute as any);
  };
  const textRef = useRef('');
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    updateScrollView();
  }, [messages]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  useEffect(() => {
    const createRoomIfNotExists = async () => {
      let roomId = getRoomId(user?.uid, item?.userId)
      await setDoc(doc(db, "rooms", roomId), {
        roomId,
        createdAt: Timestamp.fromDate(new Date())
      })
    }
    createRoomIfNotExists();

    let roomId = getRoomId(user?.uid, item?.userId)
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy('createdAt', 'asc'))

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages: Message[] = snapshot.docs.map(doc => doc.data() as Message);
      setMessages(allMessages);
    });

    const KeyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow', updateScrollView
    )
    return () => {
      unsub();
      KeyboardDidShowListener.remove();
    }


  }, [user?.uid, item?.userId])

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    try {
      let roomId = getRoomId(user?.uid, item?.userId);
      const docRef = doc(db, 'rooms', roomId);
      const messageRef = collection(docRef, "messages");
      textRef.current = "";
      if (inputRef) inputRef?.current?.clear();
      const newDoc = await addDoc(messageRef, {
        userId: user?.uid,
        text: message,
        profileUrl: profile?.profile_image,
        senderName: profile?.name,
        createdAt: Timestamp.fromDate(new Date())
      });

      textRef.current = "";
      if (inputRef) inputRef?.current?.clear();
      console.log(newDoc.id)
    } catch (err) {
      Alert.alert(`Message not sent`)
      console.error(err)
    }
  }

  return (
    <ImageBackground style={{ flex: 1, }} source={require('../../assets/images/message-wallpaper.jpg')}>
      {/*header */}
      <View
        style={{ backgroundColor: theme.surface }}
        className="px-5 pt-6 pb-4 rounded-b-3xl "
      >
        <View className="flex-row gap-4 items-center">
          <TouchableOpacity onPress={goBackToMessages}>
            <Entypo name="chevron-left" size={hp(4)} color={theme.text} />
          </TouchableOpacity>
          <ProfileAvatar
            imageUri={item?.profile_image}
            fallbackImage={require("../../assets/images/profileimg.jpg")}
            size={5}
          />
          <View className="flex-1">
            <Text
              style={{ fontSize: hp(2), color: theme.text }}
              className="font-semibold  align-center"
            >{item?.name}</Text>
            <Text style={{ color: theme.subText }}>{item?.role}</Text>
          </View>
          <View className="flex-row items-center gap-8">
            <Ionicons name="call" size={hp(2.5)} color={theme.text} />
            <Ionicons name="videocam" size={hp(2.5)} color={theme.text} />
          </View>
        </View>
      </View>
      <CustomKeyBoardView>

        {/*Body */}
        <ScrollView showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onContentSizeChange={updateScrollView}
          contentContainerStyle={{ paddingTop: 10 }}
          className="flex-1">
          {
            messages.map((message, index) => {
              if (user?.uid === message?.userId) {
                //my message
                return (
                  <View className="flex-row justify-end mb-3 mr-3"
                    key={index}>
                    <View
                      style={{ backgroundColor: theme.surface, maxWidth: wp(80), borderColor: theme.subText }}
                      className="rounded-2xl border"
                    >
                      <View className="flex self-end  p-3">
                        <Text style={{ color: theme.text, fontSize: hp(2) }}>{message?.text}</Text>
                      </View>
                    </View>
                  </View>
                )
              }
              return (
                <View className="flex-row justify-start mb-3 ml-3"
                  key={index}>
                  <View
                    style={{ backgroundColor: theme.primary, maxWidth: wp(80), borderColor: theme.subText }}
                    className="rounded-2xl border"
                  >
                    <View className="flex self-start p-3">
                      <Text style={{ color: theme.text, fontSize: hp(2) }}>{message?.text}</Text>
                    </View>
                  </View>
                </View>
              )
            }
            )
          }
        </ScrollView>
      </CustomKeyBoardView>



      {/*footer*/}
      <View style={{ marginBottom: hp(3), backgroundColor: theme.surface }} className="py-2 rounded-t-3xl">
        <View className="flex-row mx-3 justify-between p-2 rounded-full" style={{ backgroundColor: theme.background }}>
          <TextInput
            ref={inputRef}
            onChangeText={value => textRef.current = value}
            placeholder="Type message ...."
            placeholderTextColor={theme.subText}
            className="flex-1 mr-2"
            style={{ fontSize: hp(2), color: theme.text }}
          />
          <TouchableOpacity onPress={handleSendMessage} style={{ backgroundColor: theme.primary }} className="p-2 mr-[1px]  rounded-full">
            <Feather name="send" size={hp(2.5)} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}