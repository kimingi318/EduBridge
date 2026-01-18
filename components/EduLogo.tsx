import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

interface RoundedImageProps {
  size?: number; // default size if not provided
  onPress?: () => void;
}

const RoundedImage: React.FC<RoundedImageProps> = ({ onPress, size = 100 }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={require("../assets/images/edubridge-logo.png")}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 4 },
        ]}
      />
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
});

export default RoundedImage;
