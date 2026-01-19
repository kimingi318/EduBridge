import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "../../context/authContext";

export default function ProfileScreen() {
  //to use user info add user inside the curly braces
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    await signOut();
  };
  // console.log("user info: ", user);
  return (
    <View className="pt-10">
      <Text>ProfileScreen</Text>
      <Text onPress={handleSignOut}>Sign Out</Text>
    </View>
  );
}
