import MsgHeader from "@/components/MsgHeader";
import React from "react";
import { ImageBackground, View } from "react-native";

export default function MessageScreen() {
  return (
    <ImageBackground
      source={require("../../assets/images/main-bg-img.jpg")}
      className="flex-1  pt-10"
    >
      <View className="flex-1 bg-[#F5F7FB] rounded-t-2xl">
        <MsgHeader />
      </View>
    </ImageBackground>
  );
}
