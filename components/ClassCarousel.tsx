import React, { useRef } from "react";
import { Animated, Dimensions, FlatList, View } from "react-native";
import ClassCard, { ClassCardRole } from "./ClassCard";
import PaginationDots from "./PaginationDots";

const { width } = Dimensions.get("window");

export interface Session {
  id: string;
  courseTitle: string;
  timePeriod: string;
  lecturerName?: string;
  classLocation?: string;
  isOnline?: boolean;
  startsIn?: string;
  status?: string;
  // optional callback props when passed through
  onJoinOnline?: () => void;
  onPresent?: () => void;
  onCancel?: () => void;
  onLate?: () => void;
}

interface ClassCarouselProps {
  sessions: Session[];
  role?: ClassCardRole;
}

const ClassCarousel: React.FC<ClassCarouselProps> = ({
  sessions,
  role = "student",
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  // auto-scroll to first "NEXT" item
  React.useEffect(() => {
    const idx = sessions.findIndex((s) => s.status === "NEXT");
    if (idx !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: idx, animated: true });
      }, 300);
    }
  }, [sessions]);

  return (
    <View>
      <FlatList
        data={sessions}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        ref={flatListRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <Animated.View
            style={{ width, paddingHorizontal: 10 }}
          >
            <ClassCard {...item} role={role as ClassCardRole} />
          </Animated.View>
        )}
      />
      <PaginationDots scrollX={scrollX} length={sessions.length} />
    </View>
  );
};

export default ClassCarousel;
