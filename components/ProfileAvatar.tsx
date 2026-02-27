import React from "react";
import { View, Image, ImageSourcePropType } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

type Props = {
  imageUri?: string | null;
  fallbackImage: ImageSourcePropType;
  dotColor?: string;
  size?: number; // optional size control
};

export default function ProfileAvatar({
  imageUri,
  fallbackImage,
  dotColor ,
  size = 10, // default hp(10)
}: Props) {
  return (
    <View className="relative" style={{ marginRight: hp(2) }}>
      <Image
        style={{
          height: hp(size),
          aspectRatio: 1,
          borderRadius: 100,
        }}
        source={imageUri ? { uri: imageUri } : fallbackImage}
      />

      {/* Online Dot */}
      <View
        style={{
          width: wp(3.5),
          height: hp(1.5),
          backgroundColor: dotColor,
        }}
        className="absolute right-1.5 bottom-1 rounded-full"
      />
    </View>
  );
}