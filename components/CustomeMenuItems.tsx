import React from "react";
import { Text, View } from "react-native";
import { MenuOption } from "react-native-popup-menu";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface MenuItemProps {
  text: string;
  action: (value: any) => void;
  value: any;
}

export const MenuItem: React.FC<MenuItemProps> = ({ text, action, value }) => {
  return (
    <MenuOption onSelect={() => action(value)}>
      <View className="px-4 py-1 flex-1 items-center">
        <Text style={{ fontSize: hp(1.7) }} className="text-white">
          {text}
        </Text>
      </View>
    </MenuOption>
  );
};
