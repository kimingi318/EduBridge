import MsgHeader from "@/components/MsgHeader";
import { ImageBackground, View } from "react-native";

export default function MessageScreen() {
  return (
    <ImageBackground
      source={require("../../../assets/images/main-bg-img.jpg")}
      className="flex-1"
    >
      <View className="flex-1 bg-[#F5F7FB] ">
        <MsgHeader />
      </View>
    </ImageBackground>
  );
}
