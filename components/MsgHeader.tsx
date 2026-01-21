import { Image } from "expo-image";
import React from "react";
import { Platform, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { blurhash } from "../utils/common";

const ios = Platform.OS === "ios";
export default function MsgHeader() {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: ios ? top : top + 10 }}
      className="flex-row justify-between px-5 rounded-2xl bg-white shadow-black "
    >
      <View>
        <Text
          style={{ fontSize: hp(3) }}
          className="font-semibold text-[#0F172A] align-center"
        >
          Messages
        </Text>
      </View>

      <View>
        <Image
          style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
          source={require("../assets/images/student-dp.jpeg")}
          placeholder={{ blurhash }}
          transition={500}
        />
      </View>
    </View>
  );
}
