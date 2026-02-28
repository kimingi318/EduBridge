import React from "react";
import { Animated, Dimensions, View } from "react-native";

const { width } = Dimensions.get("window");

interface PaginationDotsProps {
  scrollX: Animated.Value;
  length: number;
}

const PaginationDots: React.FC<PaginationDotsProps> = ({ scrollX, length }) => {
  const dots = Array.from({ length });

  return (
    <View className="flex-row justify-center mt-3">
      {dots.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 16, 8],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={index}
            style={{
              width: dotWidth,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#2563eb",
              marginHorizontal: 4,
              opacity,
            }}
          />
        );
      })}
    </View>
  );
};

export default PaginationDots;
